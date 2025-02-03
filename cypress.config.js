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

const csvToJson= (data)=> {
  var lines=data.split("\n");
  var result = [];
  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }
      result.push(obj);
  }
  // console.log(result)
  return result
}

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter", // for html reports
  e2e: {
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
    numTestsKeptInMemory: 0,
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: false,
    failOnStatusCode: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      screenshotOnRunFailure = true;
      require("cypress-mochawesome-reporter/plugin")(on); // for html reports
      on("task", { readPdf, downloadFile,csvToJson });
      on('task', {
        fileExists(filePath) {
          return fs.existsSync(filePath); // Check if file exists
        },
        writeFile({ filePath, content }) {
          fs.writeFileSync(filePath, JSON.stringify(content)); // Write content to file
          return null;
        },
        readFile({ filePath }) {
          return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : []; // Read file content or return empty array
        }
      });
    },
  },
});
