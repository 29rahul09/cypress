// const path = require('path');
// const outputPath = path.join(__dirname, '../../cypress/results/testedUrls.json');

const journal = "test";
const domain = "https://jitc.bmj.com";
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

    const inspectArticlePage = (articleUrl) => {
      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
      processUrls(articleUrl);
    };

    const processUrls = (url) => {
      const externalLinks = [];
      cy.get("body")
        .then(($body) => {
          const result = {
            url,
            videoInAbstract: $body.find("#brightcove-video").length > 0,
            tableInAbstract:
              $body.find("#abstract-1 > .subsection > #T1").length > 0,
            figureInAbstract:
              $body.find("#abstract-1> .subsection > #F1").length > 0,
            CTLinks: $body.find('*[class^="external-ref"]').length > 0,
            keyMessageBox: $body.find("#boxed-text-1, .boxed-text").length > 0,
            bodyTextBox: $body.find("#boxed-text-2").length > 0,
            figNTabWithRef:
              $body.find(".table-caption > p > a, .fig-caption > p > a")
                .length > 0,
          };

          externalLinks.push(
            `${result.url}, videoInAbstract ==> ${result.videoInAbstract}, tableInAbstract ==> ${result.tableInAbstract}, figureInAbstract ==> ${result.figureInAbstract},  CTlinks ==> ${result.CTLinks}, keyMessageBox ==> ${result.keyMessageBox}, bodyTextBox ==> ${result.bodyTextBox}, TableFigure ==> ${result.figNTabWithRef}\n`
          );
        })
        .then(() => {
          if (externalLinks.length > 0) {
            writeUniqueEntriesToFile(
              `cypress/downloads/${journal}/externalLinks.csv`,
              externalLinks
            );
          }
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

// npx cypress run --headless --browser chrome --spec "cypress/e2e/daily_404_test_run.cy.js"
describe("Check all links are reachable", () => {
  const brokenLinks = [];
  const batchSize = 1; // Define the batch size for incremental writes

  // Helper function to process links on a page
  const processLinksOnPage = (page, url) => {
    cy.visit(url);
    cy.get("a").each(($link) => {
      const href = $link.prop("href");

      // Ensure the href is not empty or a javascript link
      if (href && href.match(/\/content\/\d+/)) {
        // Use cy.request to check if the link is valid
        cy.request({
          url: href,
          failOnStatusCode: false, // Don't fail the test on non-2xx responses
        }).then((response) => {
          if (response.status >= 200 && response.status < 400) {
            console.log(`${response.status} OK`);
          } else {
            brokenLinks.push({
              page: page,
              href: href,
              status: response.status,
            });

            // Write to file in batches
            if (brokenLinks.length >= batchSize) {
              writeBrokenLinksToFile();
            }
          }
        });
      }
    });
  };

  // Helper function to process a list of pages
  const processPages = (pages) => {
    pages.forEach((page) => {
      // Check home page links
      processLinksOnPage(page, page);

      // Check TOC page links
      processLinksOnPage(page, `${page}/content/current`);
    });
  };

  // Write broken links to a CSV file in batches
  const writeBrokenLinksToFile = () => {
    if (brokenLinks.length > 0) {
      const csvContent = brokenLinks
        .map((result) => `${result.href}`)
        .join("\n");
      cy.writeFile(`cypress/downloads/Daily_404/brokenLinks.csv`, csvContent);

      // Clear the brokenLinks array after writing to the file
      brokenLinks.length = 0; // Clear array to prevent memory overload
    }
  };

  it("should check that all links return a 2xx status code", () => {
    cy.fixture("homePage.json").then((data) => {
      processPages(data); // Process all pages in the fixture
    });
  });

  // Write any remaining broken links after the test run is complete
  after(() => {
    writeBrokenLinksToFile();
  });
});
