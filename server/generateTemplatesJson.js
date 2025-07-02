
import fs from 'fs';
import path from 'path';
import getTemplates from './getTemplates.js';

// Adjust these paths as needed
const templates = getTemplates();
const outputDir = path.resolve('./apps/homePage/dist');
const outputPath = path.join(outputDir, 'templates.json');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2), 'utf-8');
console.log(`✅ templates.json generated at: ${outputPath}`);
