import fs from 'fs';
import path from 'path';

const appsDir = path.resolve('./apps');

// --- Configuration for GitHub details ---
const GITHUB_REPO_OWNER = 'Hardik-Ashra';
const GITHUB_REPO_NAME = 'web-templates';
const GITHUB_REPO_BASE_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
const GITHUB_TEMPLATES_BASE_PATH_IN_REPO = '';
const GITHUB_REPO_BRANCH = 'master';
// ----------------------------------------

// --- NEW CRITICAL CONFIGURATION FOR DOWNGIT BASE URL ---
const DOWNGIT_BASE_URL = 'https://downgit.github.io'; // <--- CHANGE THIS LINE!
// -------------------------------------------------------

function getTemplates() {
    console.log(`Scanning for templates in: ${appsDir}`);
    return fs.readdirSync(appsDir).map(name => {
        const appPath = path.join(appsDir, name);

        if (!fs.statSync(appPath).isDirectory()) {
            console.log(`Skipping non-directory: ${name}`);
            return null;
        }
        if (name === 'homePage') {
            console.log(`Skipping homePage directory.`);
            return null;
        }

        const hasDist = fs.existsSync(path.join(appPath, 'dist/index.html'));
        const hasHtml = fs.existsSync(path.join(appPath, 'index.html'));

        if (!hasDist && !hasHtml) {
            console.log(`Skipping ${name}: No dist/index.html or index.html found.`);
            return null;
        }

        const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        let githubFolderPath;
        if (GITHUB_TEMPLATES_BASE_PATH_IN_REPO === '') {
            githubFolderPath = name;
        } else {
            githubFolderPath = `${GITHUB_TEMPLATES_BASE_PATH_IN_REPO}/${name}`;
        }

        const githubTreeUrl = `${GITHUB_REPO_BASE_URL}/tree/${GITHUB_REPO_BRANCH}/${githubFolderPath}`;

        // --- Use the corrected DOWNGIT_BASE_URL here ---
        const downloadLink = `${DOWNGIT_BASE_URL}/#/home?url=${encodeURIComponent(githubTreeUrl)}`;
        // -----------------------------------------------

        return {
            id: name,
            name: displayName,
            url: `/${name}/`,
            folder: name,
            serveFrom: hasDist ? 'dist' : '',
            githubRepoUrl: GITHUB_REPO_BASE_URL,
            githubTreeUrl: githubTreeUrl,
            downloadLink: downloadLink
        };
    }).filter(Boolean);
}

export default getTemplates;