import fs from 'fs'
import path from 'path'

const appsDir = path.resolve('./apps')

function getTemplates() {
  return fs.readdirSync(appsDir).map(name => {
    const appPath = path.join(appsDir, name)

    if (!fs.statSync(appPath).isDirectory()) return null
    if (name === 'homePage') return null // 🚀 skip homePage

    // detect where to serve from
    const hasDist = fs.existsSync(path.join(appPath, 'dist/index.html'))
    const hasHtml = fs.existsSync(path.join(appPath, 'index.html'))

    if (!hasDist && !hasHtml) return null

    // turn `aiden-brooks` -> `Aiden Brooks`
    const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    return {
      name: displayName,
      url: `/${name}/`,
      folder: name,
      serveFrom: hasDist ? 'dist' : ''
    }
  }).filter(Boolean)
}

export default getTemplates
