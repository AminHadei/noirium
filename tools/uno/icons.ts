import fs from 'node:fs/promises';
import { resolve } from 'node:path';

// Dynamically discover and register all SVG files in the icons directory
const getIconCollections = async (
  iconsDir: string,
): Promise<Record<string, () => Promise<string>>> => {
  const files = await fs.readdir(iconsDir);
  const svgFiles = files.filter((file) => file.endsWith('.svg'));

  const collections: Record<string, () => Promise<string>> = {};

  for (const file of svgFiles) {
    const iconName = file.replace(/\.svg$/, '');
    // oxlint-disable-next-line require-await
    collections[iconName] = async (): Promise<string> =>
      fs.readFile(resolve(iconsDir, file), 'utf-8');
  }

  return collections;
};

export const iconCollections: Record<string, () => Promise<string>> = {
  ...(await getIconCollections(resolve(__dirname, '../../src/assets/icons'))),
};
