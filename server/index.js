import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import getTemplates from './getTemplates.js';
import fs from 'fs';

const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const appsDir = path.resolve(__dirname, '../apps');

let cachedTemplates = null;

function initializeTemplates() {
  if (cachedTemplates === null) {
    cachedTemplates = getTemplates();
  }
  console.log(cachedTemplates)
  return cachedTemplates;
}

initializeTemplates().forEach(t => {
  const staticPath = path.join(appsDir, t.folder, t.serveFrom);
  app.use(`/${t.folder}`, express.static(staticPath));
});
console.log(initializeTemplates())
app.use('/', express.static(path.join(__dirname, '../apps/homePage/dist')));

app.get('/api/templates', (req, res) => {
  
  const allTemplates = initializeTemplates();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedTemplates = allTemplates.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allTemplates.length / limit);

  res.json({
    templates: paginatedTemplates,
    currentPage: page,
    limit: limit,
    totalTemplates: allTemplates.length,
    totalPages: totalPages,
    hasMore: page < totalPages
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});