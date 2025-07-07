import fs from 'fs';
import path from 'path';

const appsDir = path.resolve('./apps');
const nextAppsDir = path.join(appsDir, 'next');

// --- GitHub Configuration ---
const GITHUB_REPO_OWNER = 'Hardik-Ashra';
const GITHUB_REPO_NAME = 'web-templates';
const GITHUB_REPO_BRANCH = 'master';
const GITHUB_REPO_BASE_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
const GITHUB_TEMPLATES_BASE_PATH_IN_REPO = '';
const DOWNGIT_BASE_URL = 'https://downgit.github.io';
// ----------------------------

function getGithubFolderPath(baseFolder, name) {
    if (GITHUB_TEMPLATES_BASE_PATH_IN_REPO === '') {
        return path.join(baseFolder, name).replace(/\\/g, '/');
    }
    return `${GITHUB_TEMPLATES_BASE_PATH_IN_REPO}/${baseFolder}/${name}`.replace(/\\/g, '/');
}

function getDisplayName(name) {
    return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function isValidAppFolder(appPath, options) {
    if (!fs.statSync(appPath).isDirectory()) return false;
    if (path.basename(appPath) === 'homePage') return false;

    if (options.nextServe) {
        return fs.existsSync(path.join(appPath, 'out/index.html'));
    }
    return fs.existsSync(path.join(appPath, 'dist/index.html')) ||
           fs.existsSync(path.join(appPath, 'index.html'));
}

function scanAppsFolder(baseDir, baseFolderInRepo = '', options = { nextServe: false }) {
    console.log(`Scanning for templates in: ${baseDir}`);
    if (!fs.existsSync(baseDir)) return [];

    return fs.readdirSync(baseDir)
        .map(name => {
            const appPath = path.join(baseDir, name);
            console.log(appPath)
            if (!isValidAppFolder(appPath, options)) {
                console.log(`Skipping ${name}: invalid or missing output.`);
                return null;
            }

            const githubFolderPath = getGithubFolderPath(baseFolderInRepo, name);
            const githubTreeUrl = `${GITHUB_REPO_BASE_URL}/tree/${GITHUB_REPO_BRANCH}/${githubFolderPath}`;
            const downloadLink = `${DOWNGIT_BASE_URL}/#/home?url=${encodeURIComponent(githubTreeUrl)}`;

            return {
                id: `${baseFolderInRepo ? baseFolderInRepo + '/' : ''}${name}`,
                name: getDisplayName(name),
                url: `/${baseFolderInRepo ? baseFolderInRepo + '/' : ''}${name}/`,
                folder: `${baseFolderInRepo ? baseFolderInRepo + '/' : ''}${name}`,
                serveFrom: options.nextServe ? 'out' :
                            (fs.existsSync(path.join(appPath, 'dist/index.html')) ? 'dist' : ''),
                githubRepoUrl: githubTreeUrl,
                githubTreeUrl,
                downloadLink
            };
        })
        .filter(Boolean);
}

function getTemplates() {
    const normalApps = scanAppsFolder(appsDir, '', { nextServe: false });
    const nextApps = scanAppsFolder(nextAppsDir, 'next', { nextServe: true });
    console.log(nextApps)
    return [...normalApps, ...nextApps];
}

export default getTemplates;
