import fs from 'fs'
import path from 'path'

const nextAppsDir = path.resolve('./apps/next')

if (fs.existsSync(nextAppsDir)) {
  const nextApps = fs.readdirSync(nextAppsDir).filter(name =>
    fs.statSync(path.join(nextAppsDir, name)).isDirectory()
  )

  nextApps.forEach(appName => {
    const appDir = path.join(nextAppsDir, appName)
    const jsConfigPath = path.join(appDir, 'next.config.js')
    const tsConfigPath = path.join(appDir, 'next.config.ts')
    const mjsConfigPath = path.join(appDir, 'next.config.mjs')

    // Rename .ts or .mjs to .js if exists
    if (fs.existsSync(tsConfigPath)) {
      fs.renameSync(tsConfigPath, jsConfigPath)
      console.log(`🔀 Renamed ${tsConfigPath} ➔ ${jsConfigPath}`)
    } else if (fs.existsSync(mjsConfigPath)) {
      fs.renameSync(mjsConfigPath, jsConfigPath)
      console.log(`🔀 Renamed ${mjsConfigPath} ➔ ${jsConfigPath}`)
    }

    // Write the standard config file
    const configContent = `module.exports = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/next/${appName}'
};`

    fs.writeFileSync(jsConfigPath, configContent)
    console.log(`✅ Written new next.config.js for ${appName}`)
  })
}
