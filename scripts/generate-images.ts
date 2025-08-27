import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SIZES = [480, 800, 1200]
const INPUT_DIR = path.join(process.cwd(), 'public', 'img')

async function generate() {
  const files = fs.readdirSync(INPUT_DIR)
  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file)
    if (!fs.statSync(filePath).isFile()) continue
    const ext = path.extname(file)
    const name = path.basename(file, ext)
    for (const size of SIZES) {
      const output = path.join(INPUT_DIR, `${name}-${size}${ext}`)
      await sharp(filePath)
        .resize({ width: size, withoutEnlargement: true })
        .toFile(output)
    }
  }
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
