const fs = require('fs');
const path = require('path');

// Path to your folder with JSON files
const folderPath = path.join(__dirname, 'mydownloads/preview-url/'); // <-- Replace with your folder name
const outputFilePath = path.join(__dirname, 'output.json');

const result = {};

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Failed to read directory:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    // Only process .json files
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const data = JSON.parse(content);
        const previewUrl = data['preview-url'];

        if (previewUrl) {
          const fileName = path.basename(file, '.json');
          result[fileName] = previewUrl;
        }
      } catch (err) {
        console.error(`Failed to parse ${file}:`, err);
      }
    }
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf8');
  console.log('✅ Preview URLs written to:', outputFilePath);
});
