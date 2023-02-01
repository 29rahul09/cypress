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

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter", // for html reports
  e2e: {
    watchForFileChanges: false,
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      screenshotOnRunFailure = true;
      require("cypress-mochawesome-reporter/plugin")(on); // for html reports
      on("task", { readPdf, downloadFile });
    },
  },
});
