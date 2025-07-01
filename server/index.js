// import express from 'express'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const app = express()

// app.use('/aiden-brooks', express.static(path.join(__dirname, '../apps/aiden-brooks/dist')))
// app.use('/elevate', express.static(path.join(__dirname, '../apps/elevate')))
// app.use('/brutalist-portfolio', express.static(path.join(__dirname, '../apps/brutalist-portfolio')))
//  app.use('/soren', express.static(path.join(__dirname, '../apps/soren/dist')));
//   app.use('/velasco-solari', express.static(path.join(__dirname, '../apps/velasco-solari/dist')));
//   app.use('/damien-tsarantos', express.static(path.join(__dirname, '../apps/damien-tsarantos')));
//   app.use('/byteforge', express.static(path.join(__dirname, '../apps/byteforge')));
// app.use('/', express.static(path.join(__dirname, '../apps/homePage/dist')))

// app.listen(3000, () => {
//   console.log('Gallery running on http://localhost:3000')
// })

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import generateTemplates from './getTemplates.js'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const appsDir = path.resolve(__dirname, '../apps')

// dynamically add routes
generateTemplates().forEach(t => {
  const staticPath = path.join(appsDir, t.folder, t.serveFrom)
  app.use(`/${t.folder}`, express.static(staticPath))
})

// homePage still served at /
app.use('/', express.static(path.join(__dirname, '../apps/homePage/dist')))

// API for listing
app.get('/api/templates', (req, res) => {
  res.json(generateTemplates())
})

app.listen(3000, () => {
  console.log('Gallery running on http://localhost:3000')
})
