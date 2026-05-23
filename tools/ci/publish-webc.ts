import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { S3Client } from 'bun';

import { version } from '../../package.json';

const requiredEnvVars = [
  'S3_REGION',
  'S3_ENDPOINT',
  'S3_BUCKET',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'VITE_S3_CDN_URL',
];

for (const varName of requiredEnvVars) {
  // eslint-disable-next-line security/detect-object-injection
  if (!Bun.env[varName]) {
    throw new Error(`Environment variable ${varName} is not set.`);
  }
}

const s3 = new S3Client({
  region: Bun.env['S3_REGION']!,
  endpoint: Bun.env['S3_ENDPOINT']!,
  bucket: Bun.env['S3_BUCKET']!,
  accessKeyId: Bun.env['S3_ACCESS_KEY_ID']!,
  secretAccessKey: Bun.env['S3_SECRET_ACCESS_KEY']!,
  acl: 'public-read',
});

const folderPath = join(__dirname, '../../dist/webc');
const urlPrefix = 'noirium/webc';
const MAX_CONCURRENT_UPLOADS = 20;
const pathVersion = `v${version}`;

/**
 * Recursively scan a directory and collect all file paths
 */
async function scanDirectory(
  dir: string,
  baseDir: string,
  fileList: string[] = [],
): Promise<string[]> {
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      await scanDirectory(fullPath, baseDir, fileList);
    } else if (stats.isFile()) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Get MIME type based on file extension
 */
function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    js: 'application/javascript',
    mjs: 'application/javascript',
    css: 'text/css',
    html: 'text/html',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',
    txt: 'text/plain',
    xml: 'application/xml',
    pdf: 'application/pdf',
    zip: 'application/zip',
  };

  return mimeTypes[ext ?? ''] ?? 'application/octet-stream';
}

/**
 * List all files in R2 with a specific prefix
 */
async function listFiles(prefix: string): Promise<string[]> {
  try {
    const files: string[] = [];
    const response = await s3.list({
      prefix,
    });

    if (response && Array.isArray(response.contents)) {
      for (const item of response.contents) {
        if (item && typeof item === 'object' && 'key' in item) {
          files.push(item.key);
        }
      }
    }

    return files;
  } catch (error) {
    console.error(`Failed to list files with prefix ${prefix}:`, error);
    return [];
  }
}

/**
 * Delete a single file from R2
 */
async function deleteFile(s3Key: string): Promise<void> {
  try {
    await s3.delete(s3Key);
    console.log(`✗ Deleted: ${s3Key}`);
  } catch (error) {
    console.error(`Failed to delete ${s3Key}:`, error);
    throw error;
  }
}

/**
 * Upload a single file to S3
 * Uses Bun's optimized file handling - passes BunFile directly to avoid loading entire file into memory
 */
async function uploadFile(filePath: string, s3Key: string): Promise<void> {
  try {
    const file = Bun.file(filePath);
    const mimeType = getMimeType(filePath);

    await s3.write(s3Key, file, {
      type: mimeType,
    });

    console.log(`✓ Uploaded: ${Bun.env['VITE_S3_CDN_URL']!}/${s3Key}`);
  } catch (error) {
    console.error(`✗ Failed to upload ${s3Key}:`, error);
    throw error;
  }
}

/**
 * Process uploads with controlled concurrency
 */
async function uploadWithConcurrency<T>(
  items: T[],
  processor: (item: T) => Promise<void>,
  concurrency: number,
): Promise<void> {
  const queue: Promise<void>[] = [];

  for (const item of items) {
    const promise = processor(item).then(() => {
      const index = queue.indexOf(promise);
      if (index > -1) {
        queue.splice(index, 1);
      }
    });

    queue.push(promise);
    void promise;

    if (queue.length >= concurrency) {
      await Promise.race(queue);
    }
  }

  await Promise.all(queue);
}

const main = async (): Promise<void> => {
  console.log(`Starting deployment for version ${pathVersion}\n`);
  const startTime = Date.now();

  // Check for existing files
  const versionPrefix = `${urlPrefix}/${pathVersion}/`;
  console.log(`Checking for existing files with prefix: ${versionPrefix}`);
  const existingFiles = await listFiles(versionPrefix);

  if (existingFiles.length > 0) {
    console.log(`\nFound ${String(existingFiles.length)} existing files for ${pathVersion}`);
    console.log('Deleting old files...\n');

    let deleteCount = 0;
    let deleteErrorCount = 0;

    await uploadWithConcurrency(
      existingFiles,
      async (s3Key) => {
        try {
          await deleteFile(s3Key);
          deleteCount++;
        } catch {
          deleteErrorCount++;
          console.error(`Failed to delete ${s3Key}`);
        }
      },
      MAX_CONCURRENT_UPLOADS,
    );

    console.log(
      `\nDeletion complete: ${String(deleteCount)} deleted, ${String(deleteErrorCount)} errors\n`,
    );
  } else {
    console.log(`No existing files found for ${pathVersion}\n`);
  }

  // Scan local files
  console.log(`Scanning directory: ${folderPath}`);
  const allFiles = await scanDirectory(folderPath, folderPath);

  console.log(`Found ${String(allFiles.length)} files to upload\n`);

  if (allFiles.length === 0) {
    console.log('No files found to upload.');
    return;
  }

  const uploadTasks = allFiles.map((filePath) => {
    const relativePath = relative(folderPath, filePath);
    const s3Key = `${urlPrefix}/${pathVersion}/${relativePath.replaceAll('\\', '/')}`;
    return {
      filePath,
      s3Key,
    };
  });

  console.log(
    `Uploading ${String(allFiles.length)} files with ${String(MAX_CONCURRENT_UPLOADS)} concurrent uploads...\n`,
  );

  let successCount = 0;
  let errorCount = 0;

  await uploadWithConcurrency(
    uploadTasks,
    async ({ filePath, s3Key }) => {
      try {
        await uploadFile(filePath, s3Key);
        successCount++;
      } catch (error) {
        errorCount++;
        throw error;
      }
    },
    MAX_CONCURRENT_UPLOADS,
  );

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Upload completed in ${duration}s`);
  console.log(`Success: ${String(successCount)}`);
  console.log(`Errors: ${String(errorCount)}`);
  console.log(`Total: ${String(allFiles.length)}`);
};

void main();
