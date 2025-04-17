const fs = require('fs');
const path = require('path');

// Directories
const artifactsDir = path.join(__dirname, 'artifacts/');
const htmlReportDir = path.join(__dirname, 'mydownloads/mocha-reports/');
const jsonReportDir = path.join(__dirname, 'mydownloads/preview-url/');

// Utility function to check and create directory
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Utility function to move file
function moveFile(source, destination) {
  fs.renameSync(source, destination);
  console.log(`Moved file from ${source} to ${destination}`);
}

// Ensure target directories exist
ensureDir(htmlReportDir);
ensureDir(jsonReportDir);

// Process each folder in artifacts directory
const folders = fs.readdirSync(artifactsDir);

folders.forEach(folder => {
  const folderPath = path.join(artifactsDir, folder);
  const stats = fs.statSync(folderPath);

  if (stats.isDirectory()) {
    const htmlFilePath = path.join(folderPath, 'merged.html');
    const jsonFilePath = path.join(folderPath, 'preview-url.json');

    const namePrefix = folder.split('-')[0];

    if (fs.existsSync(htmlFilePath)) {
      const htmlDestination = path.join(htmlReportDir, `${namePrefix}.html`);
      moveFile(htmlFilePath, htmlDestination);
    }

    if (fs.existsSync(jsonFilePath)) {
      const jsonDestination = path.join(jsonReportDir, `${namePrefix}.json`);
      moveFile(jsonFilePath, jsonDestination);
    }
  }
});

console.log('All reports moved successfully.');
