// const path = require('path');
// const outputPath = path.join(__dirname, '../../cypress/results/testedUrls.json');

const journal = "LUPUS";
const domain = "https://lupus.bmj.com";
const outputPath = `cypress/downloads/RESPONSE/testedUrls.json`;

function writeToJson(testedUrls) {
  return cy.writeFile(outputPath, { testedUrls }, { log: true });
}

function readFromJson() {
  return cy
    .readFile(outputPath, { log: true })
    .then((data) => data.testedUrls || []);
}

describe(
  "Test Article URL on Live-site",
  {
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  () => {
    let testedUrls = [];
    let lastTestedIndex = -1;

    const writeUniqueEntriesToFile = (filePath, entries) => {
      cy.writeFile(filePath, "", { flag: "a+" }).then(() => {
        cy.readFile(filePath, "utf8").then((existingContent) => {
          const existingEntries = existingContent
            ? existingContent.split("\n")
            : [];
          const newEntries = entries.filter(
            (entry) => !existingEntries.includes(entry)
          );
          if (newEntries.length > 0) {
            cy.writeFile(filePath, newEntries.join("\n") + "\n", {
              flag: "a+",
            });
          }
        });
      });
    };

    before(() => {
      // Ensure output file exists and is empty at the start if not already present
      return cy
        .task("fileExists", outputPath)
        .then((exists) => {
          if (!exists) {
            return writeToJson([]);
          }
        })
        .then(() => {
          // Read the last tested URLs and load fixture data
          return readFromJson().then((previousTestedUrls) => {
            return cy.fixture(`${journal}_AricleUrls.json`).then((data) => {
              testedUrls = data || []; // Ensure testedUrls is an array

              if (previousTestedUrls.length > 0) {
                lastTestedIndex = testedUrls.indexOf(
                  previousTestedUrls[previousTestedUrls.length - 1]
                );
              }

              // If last tested index is found, slice the array to start from there
              if (lastTestedIndex >= 0) {
                testedUrls = testedUrls.slice(lastTestedIndex + 1);
              }
            });
          });
        });
    });

    it("tests all URLs", () => {
      // Ensure testedUrls is defined and has values before proceeding
      cy.wrap(testedUrls).should("not.be.empty"); // This is a valid Cypress assertion

      testedUrls.forEach((url) => {
        // Wrap the visit and request in a Cypress command queue
        const results = [];
        // Check the response of a URL and write to a CSV file
        cy.request(`${domain}/content${url}`, { failOnStatusCode: false })
          .then((response) => {
            results.push(`${response.status} =====> ${url}`);
            writeUniqueEntriesToFile(
              `cypress/downloads/RESPONSE/ArticleResponse.csv`,
              results
            );
          })
          .then(() => {
            console.log(`Tested URL: ${url}`);
            // Read and write back to the JSON file after each test
            return readFromJson().then((currentTestedUrls) => {
              currentTestedUrls.push(url);
              return writeToJson(currentTestedUrls);
            });
          });
      });
    });
  }
);
