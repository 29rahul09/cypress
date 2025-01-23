// const path = require('path');
// const outputPath = path.join(__dirname, '../../cypress/results/testedUrls.json');

const { title } = require("process");

const journal = "test";
const domain = "https://bmjopensem.bmj.com";
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

    const checkPageImages = (articleUrl) => {
      const brokenImages = [];
      cy.get("main")
        .find("img")
        .each(($img) => {
          const src = $img.attr("src");
          const alt = $img.attr("alt");
          const width = $img.prop("naturalWidth");

          if (width === 0) {
            brokenImages.push(`${articleUrl} ==> ${src} ==> ${alt}`);
          }
        })
        .then(() => {
          if (brokenImages.length > 0) {
            writeUniqueEntriesToFile(
              `cypress/downloads/${journal}/BrokenImage.csv`,
              brokenImages
            );
          } else {
            cy.log("No broken images found on this page.");
          }
        });
    };

    const checkTopBox = (url) => {
      const topBoxLinks = [{ url: "URL", title: "TITLE", publicationDate: "DATE", requestPermissions: "PERMISSIONS", citation: "CITATION", share: "SHARE", pdfLink: "PDF LINK" }];
      cy.get("body")
        .then(($body) => {
          const result = {
        url,
        title: $body.find("h1#article-title-1").length > 0,
        publicationDate: $body.find('[data-testid="publication-icon"]').length > 0,
        requestPermissions: $body.find('[data-testid="rights-and-permissions"] a').length > 0,
        citation: $body.find('[data-testid="citation"]').length > 0,
        share: $body.find('[data-testid="share"]').length > 0,
        pdfLink: $body.find('[data-testid="pdf"] a').length > 0,
          };
          topBoxLinks.push(result);
        })
        .then(() => {
          if (topBoxLinks.length > 0) {
        const csvContent = topBoxLinks.map(link => 
          `${link.url},${link.title},${link.publicationDate},${link.requestPermissions},${link.citation},${link.share},${link.pdfLink}`
        ).join("\n");
        writeUniqueEntriesToFile(
          `cypress/downloads/${journal}/topBoxLinks.csv`,
          csvContent.split("\n")
        );
          }
        });
        };

    const inspectArticlePage = (articleUrl) => {
      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
      checkPageImages(articleUrl);
      checkTopBox(articleUrl);
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
            return cy.fixture(`${journal}.json`).then((data) => {
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
        cy.visit({
          url: `${domain}${url}`,
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
