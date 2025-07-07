import fs from 'fs'
import path from 'path'


const appsDir = path.resolve('./apps')

const apps = fs.readdirSync(appsDir).filter(name => {
  const fullPath = path.join(appsDir, name)
  return fs.statSync(fullPath).isDirectory()
})

apps.forEach(appName => {
  const viteConfigPath = path.join(appsDir, appName, 'vite.config.js')
  if (!fs.existsSync(viteConfigPath)) return

  let configContent = fs.readFileSync(viteConfigPath, 'utf-8')

  const baseLine = `base: '/${appName}/'`

  // 1. If base already exists → update it
  if (configContent.includes('base:')) {
    configContent = configContent.replace(/base:\s*['"`][^'"`]*['"`]/, baseLine)
  } else {
    // 2. If base doesn't exist → insert it inside defineConfig
    configContent = configContent.replace(
      /defineConfig\(\{\s*/,
      `defineConfig({\n  ${baseLine},\n`
    )
  }

  // Format with Prettier (optional but clean)
  const formatted = configContent;

  fs.writeFileSync(viteConfigPath, formatted)

  console.log(`✅ Updated base in ${viteConfigPath}`)
})
