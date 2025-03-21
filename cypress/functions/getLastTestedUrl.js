import { validateImagesTest } from "./validation/checkImages";
import { getTableDetails } from "./validation/checkTableTitle";
import { validateRapidResponsesTest } from "./validation/checkRapidResponse";
import { validateSupplementaryMaterialsTest } from "./validation/checkSupplimentryFiles";
import { validateTopBoxSectionTest } from "./validation/CheckTopBox";
export const runFromLastTestedUrl = (journal, domain) => {
  // const path = require('path');
  // const outputPath = path.join(__dirname, '../../cypress/results/testedUrls.json');

  const outputPath = `cypress/fixtures/${journal}_TestedUrls.json`;

  function writeToJson(testedUrls) {
    return cy.writeFile(outputPath, { testedUrls }, { log: true });
  }

  function readFromJson() {
    return cy
      .readFile(outputPath, { log: true })
      .then((data) => data.testedUrls || []);
  }

  describe("Validate Page Details", {
    viewportHeight: 800,
    viewportWidth: 1280,
  }, () => {
    let testedUrls = [];
    let lastTestedIndex = -1;

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

              // cy.log(JSON.stringify(testedUrls));

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
          url: `${domain}${url}`,
          failOnStatusCode: false,
          auth: {
            username: "BMJStaging",
            password: "bmj2410",
          },
        })
          .then(() => {
            // Run the tests
            validateTopBoxSectionTest(url, journal);
            validateImagesTest(url, journal);
            getTableDetails(url, journal);
            validateSupplementaryMaterialsTest(url, journal);
            validateRapidResponsesTest(url, journal);
            cy.writeFile(`cypress/SmokeTest/${journal}/lastVisitedUrl.csv`, url);
          })
          .then(() => {
            //   console.log(`Tested URL: ${url}`);
            // Read and write back to the JSON file after each test
            return readFromJson().then((currentTestedUrls) => {
              currentTestedUrls.push(url);
              return writeToJson(currentTestedUrls);
            });
          });
      });
    });
  });
};

export default runFromLastTestedUrl;
