import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { S3Client } from 'bun';

const SCALE = '4x3';
const DIR = `node_modules/flag-icons/flags/${SCALE}`;
const S3_PREFIX = `noirium/flags/v1/${SCALE}`;

const files = await readdir(DIR);
const svgFiles = files.filter((f) => f.endsWith('.svg'));

const s3 = new S3Client({
  region: Bun.env['S3_REGION']!,
  endpoint: Bun.env['S3_ENDPOINT']!,
  bucket: Bun.env['S3_BUCKET']!,
  accessKeyId: Bun.env['S3_ACCESS_KEY_ID']!,
  secretAccessKey: Bun.env['S3_SECRET_ACCESS_KEY']!,
  acl: 'public-read',
});

console.log(`Found ${svgFiles.length} SVG files. Checking existing...`);

const results = await Promise.allSettled(
  svgFiles.toReversed().map(async (file) => {
    const key = `${S3_PREFIX}/${file}`;

    const content = Bun.file(resolve(DIR, file));
    await s3.write(key, content, {
      type: 'image/svg+xml',
    });

    console.log(`✓ ${key}`);
    return key;
  }),
);

const uploaded = results.filter((r) => r.status === 'fulfilled' && r.value);
const failed = results.filter((r) => r.status === 'rejected');

console.log(
  `\nDone: ${uploaded.length} uploaded, ${svgFiles.length - uploaded.length - failed.length} skipped, ${failed.length} failed`,
);
for (const r of [failed[0]]) {
  console.error(r?.reason);
}
