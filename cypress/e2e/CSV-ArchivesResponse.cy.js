// const path = require('path');
// const outputPath = path.join(__dirname, '../../cypress/results/testedUrls.json');

const journal = "OpenQuality";
const domain = "https://bmjopenquality.bmj.com";
const outputPath = `cypress/downloads/${journal}/testedUrls.json`;

function writeToJson(testedUrls) {
  return cy.writeFile(outputPath, { testedUrls }, { log: true });
}

function readFromJson() {
  return cy
    .readFile(outputPath, { log: true })
    .then((data) => data.testedUrls || []);
}

describe(
  `Testing Article URL On ${journal} Journal`,
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

    const inspectArticlePage = (articleUrl) => {
      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
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

              cy.log(JSON.stringify(testedUrls));

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
        cy.visit({
          url: `${domain}/content${url}`,
          failOnStatusCode: false,
        })
          .then(() => {
            inspectArticlePage(url);
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
