// const path = require('path');
// const outputPath = path.join(__dirname, '../../cypress/results/testedUrls.json');

const journal = "JITC";
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
      validateImages(articleUrl);
      visitUrlAndCollectHeadings(articleUrl);
      processUrls(articleUrl);
      validateSupplementaryMaterials(articleUrl);
    };

    const validateImages = (articleUrl) => {
      const brokenImages = [];

      cy.get("#article-top")
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
              `cypress/downloads/${journal}/HW/BrokenImage.csv`,
              brokenImages
            );
          } else {
            cy.log("No broken images found on this page.");
          }
        });
    };

    const visitUrlAndCollectHeadings = (url) => {
      const heading = [];
      cy.get("body h2:visible")
        .then(($headings) => {
          const headingsText = Array.from($headings)
            .map(($el) => Cypress.$($el).text())
            .filter(
              (text) =>
                text !== "Cookies and privacy" && text !== "You are here"
            )
            .sort()
            .join(" | ");
          heading.push(`${url}, ${headingsText}\n`);
        })
        .then(() => {
          if (heading.length > 0) {
            writeUniqueEntriesToFile(
              `cypress/downloads/${journal}/HW/ArticleHeadings.csv`,
              heading
            );
          }
        });
    };

    const processUrls = (url) => {
      const externalLinks = [
        {
          url: "URL",
          videoInAbstract: "VIDEO",
          tableInAbstract: "TABLE",
          figureInAbstract: "FIGURE",
          CTLinks: "CTLINKS",
          keyMessageBox: "KEYMESSAGEBOX",
          bodyTextBox: "BODYTEXTBOX",
          figNTabWithRef: "FIGNTABWITHREF",
        },
      ];
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

          externalLinks.push(result);
        })
        .then(() => {
          if (externalLinks.length > 0) {
            const csvContent = externalLinks
              .map(
                (link) =>
                  `${link.url},${link.videoInAbstract},${link.tableInAbstract},${link.figureInAbstract},${link.CTLinks},${link.keyMessageBox},${link.bodyTextBox},${link.figNTabWithRef}`
              )
              .join("\n");
            writeUniqueEntriesToFile(
              `cypress/downloads/${journal}/HW/externalLinks.csv`,
              csvContent.split("\n")
            );
          }
        });
    };

    const validateSupplementaryMaterials = (articleUrl) => {
      const supplementary = [];
      const supplemental = [];

      const processLinks = (selector, list) => {
        cy.get(selector)
          .find("a")
          .each(($anchor) => {
            const href = $anchor.prop("href");
            const text = $anchor.text();
            list.push(`${articleUrl} ==> ${text} ==> ${href}`);
          });
      };

      cy.get("body").then(($body) => {
        if ($body.find("#supplementary-materials").length > 0) {
          processLinks("#supplementary-materials", supplementary);
          writeUniqueEntriesToFile(
            `cypress/downloads/${journal}/HW/Supplementry.csv`,
            supplementary
          );
        }
        if ($body.find(".supplementary-material").length > 0) {
          processLinks(".supplementary-material", supplemental);
          writeUniqueEntriesToFile(
            `cypress/downloads/${journal}/HW/Supplemental.csv`,
            supplemental
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
