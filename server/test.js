import fs from 'fs';
import path from 'path';

const appsDir = path.resolve('./apps');

// --- Configuration for GitHub details ---
// THESE ARE ALREADY CORRECT BASED ON YOUR PROVIDED URL
const GITHUB_REPO_OWNER = 'Hardik-Ashra'; // Make sure this matches your GitHub username
const GITHUB_REPO_NAME = 'web-templates';
const GITHUB_REPO_BASE_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;

// THIS IS THE CRITICAL SETTING:
// If your template folders (like 'aiden-brooks') appear directly under 'master/' in your GitHub repo,
// and NOT inside another folder like 'apps/' on GitHub, then this should be an empty string.
const GITHUB_TEMPLATES_BASE_PATH_IN_REPO = ''; // Correct for your given URL example

const GITHUB_REPO_BRANCH = 'master'; // Correct based on your URL
// ----------------------------------------

function getTemplates() {
    return fs.readdirSync(appsDir).map(name => {
        const appPath = path.join(appsDir, name);

        if (!fs.statSync(appPath).isDirectory()) return null;
        if (name === 'homePage') return null; // Exclude homePage

        const hasDist = fs.existsSync(path.join(appPath, 'dist/index.html'));
        const hasHtml = fs.existsSync(path.join(appPath, 'index.html'));

        if (!hasDist && !hasHtml) return null;

        const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        // --- CORRECTED LOGIC FOR GITHUB FOLDER PATH ---
        let githubFolderPath;
        if (GITHUB_TEMPLATES_BASE_PATH_IN_REPO === '') {
            // If the base path is empty, the folder name is directly relative to the branch root
            githubFolderPath = name; // e.g., "aiden-brooks"
        } else {
            // If there is a base path (e.g., 'apps'), combine them
            githubFolderPath = `${GITHUB_TEMPLATES_BASE_PATH_IN_REPO}/${name}`; // e.g., "apps/aiden-brooks"
        }
        // ------------------------------------------------

        // This constructs the full GitHub URL for the folder view
        const githubTreeUrl = `${GITHUB_REPO_BASE_URL}/tree/${GITHUB_REPO_BRANCH}/${githubFolderPath}`;

        // This is the URL for DownGit to process the GitHub folder URL
        const downloadLink = `https://downgit.com/#/home?url=${encodeURIComponent(githubTreeUrl)}`;

        console.log({
            id: name,
            name: displayName,
            url: `/${name}/`, // Local URL for live demo
            folder: name,
            serveFrom: hasDist ? 'dist' : '',
            githubRepoUrl: GITHUB_REPO_BASE_URL,      // Base URL of the repository
            githubFolderPath: githubFolderPath,       // Path to the specific folder within the repo on GitHub
            downloadLink: downloadLink                // The pre-generated DownGit link
        });
        return {
            id: name,
            name: displayName,
            url: `/${name}/`,
            folder: name,
            serveFrom: hasDist ? 'dist' : '',
            githubRepoUrl: GITHUB_REPO_BASE_URL,
            githubFolderPath: githubFolderPath,
            downloadLink: downloadLink
        };
    }).filter(Boolean);
}

// Remove this standalone call to getTemplates() if this file is only meant for export
getTemplates();

export default getTemplates;