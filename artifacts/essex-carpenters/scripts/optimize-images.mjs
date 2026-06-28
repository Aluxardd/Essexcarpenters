import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = path.resolve("./public/images");
const widths = [640, 960, 1280];
const quality = 75;
const sourceExtensions = new Set([".jpg", ".jpeg", ".png"]);

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dir, entry.name))
    .filter((filePath) => sourceExtensions.has(path.extname(filePath).toLowerCase()));
}

async function processImage(inputPath) {
  const info = await stat(inputPath);
  if (!info.isFile()) return;

  const { dir, name } = path.parse(inputPath);

  for (const width of widths) {
    const outputPath = path.join(dir, `${name}.w${width}.webp`);
    await sharp(inputPath)
      .rotate()
      .resize({ width, withoutEnlargement: true, fit: "inside" })
      .webp({ quality, effort: 4 })
      .toFile(outputPath);
  }
}

async function main() {
  const files = await listImages(IMAGES_DIR);
  if (files.length === 0) {
    console.log("No source images found.");
    return;
  }

  for (const filePath of files) {
    await processImage(filePath);
  }

  console.log(`Generated responsive webp variants for ${files.length} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
