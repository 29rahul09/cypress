const { defineConfig } = require("cypress");
const { downloadFile } = require("cypress-downloadfile/lib/addPlugin");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const readPdf = (pathToPdf) => {
  return new Promise((resolve) => {
    const pdfPath = path.resolve(pathToPdf);
    let dataBuffer = fs.readFileSync(pdfPath);
    pdf(dataBuffer).then(function ({ text }) {
      const arr = text.split("\n");
      resolve(arr);
    });
  });
};

const csvToJson = (data) => {
  var lines = data.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  // console.log(result)
  return result;
};

module.exports = defineConfig({
  reporter: require.resolve("cypress-mochawesome-reporter"),
  e2e: {
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
    numTestsKeptInMemory: 0,
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: false,
    failOnStatusCode: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const screenshotOnRunFailure = true;
      require("cypress-mochawesome-reporter/plugin")(on); // for html reports
      // for generating aggrigate e2e results from artifacts
      on('task', {
        getHtmlReportFiles(folderPath) {
          const absolutePath = path.resolve(folderPath);
          const files = fs.readdirSync(absolutePath)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(absolutePath, file));
          return files;
        }
      });
      // Register a task to move files
      on('task', {
        // Check if a file or folder exists
        fileExists(filePath) {
          try {
            return fs.existsSync(filePath); // Returns true if file/folder exists, else false
          } catch (err) {
            console.error(`Error checking existence of ${filePath}:`, err);
            return false;
          }
        },
    
        // Read the content of a directory (returns files/folders in that directory)
        readDir(dirPath) {
          try {
            return fs.readdirSync(dirPath); // Reads all files/folders in the directory
          } catch (err) {
            console.error(`Error reading directory ${dirPath}:`, err);
            return [];
          }
        },
    
        // Check if the path is a directory (using lstatSync to distinguish between files and folders)
        isDirectory(dirPath) {
          try {
            return fs.lstatSync(dirPath).isDirectory(); // Returns true if it's a directory
          } catch (err) {
            console.error(`Error checking if path is a directory: ${dirPath}`, err);
            return false;
          }
        },
    
        // Create a folder if it doesn't exist
        createFolder(folderPath) {
          try {
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath, { recursive: true }); // Create folder and parent folders if needed
            }
            return null; // Success
          } catch (err) {
            console.error(`Error creating folder: ${folderPath}`, err);
            return `Error creating folder: ${folderPath}`;
          }
        },
    
        // Move a file from one location to another
        moveFile({ source, destination }) {
          try {
            if (fs.existsSync(source)) {
              fs.renameSync(source, destination); // Moves the file
            }
            return null; // Success
          } catch (err) {
            console.error(`Error moving file from ${source} to ${destination}:`, err);
            return `Error moving file: ${err.message}`;
          }
        }
      });
      on("task", { readPdf, downloadFile, csvToJson });
      on("task", {
        createFolder(folderPath) {
          if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // Create folder if it doesn't exist
          } 
          return null;
        },
      });
      on("task", {
        fileExists(filePath) {
          return fs.existsSync(filePath); // Check if file exists
        },
        writeFile({ filePath, content }) {
          fs.writeFileSync(filePath, JSON.stringify(content)); // Write content to file
          return null;
        },
        readFile({ filePath }) {
          return fs.existsSync(filePath)
            ? JSON.parse(fs.readFileSync(filePath))
            : []; // Read file content or return empty array
        },
      });
    },
  },
});
