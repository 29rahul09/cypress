// npx cypress run --headless --browser chrome --spec "cypress/e2e/Daily_404_run.cy.js"
describe("Check all links are reachable", () => {
  const brokenLinks = [];
  const batchSize = 1; // Define the batch size for incremental writes
  const processedPagesFile = "cypress/downloads/Daily/processedPages.json";
  const outputCsvFile = "cypress/downloads/Daily/brokenLinks.csv";

  const checkArticleLinks = (page) => {
    cy.visit(page); // Visit the page
    // Find all anchor tags on the page
    cy.get("a").each(($link) => {
      const href = $link.prop("href"); // Get the href attribute of the link

      // Ensure the href is not empty or a javascript link
      if (href && href.match(/\/content\/\d+/)) {
        // Use cy.request to check if the link is valid
        cy.request({
          url: href,
          failOnStatusCode: false, // Don't fail the test on non-2xx responses
        })
          .then((response) => {
            if (response.status >= 200 && response.status < 400) {
              console.log(`${response.status}`);
            } else {
              brokenLinks.push({
                page: page,
                href: href,
                status: response.status,
              });
            }
          })
          .then(() => {
            if (brokenLinks.length >= batchSize) {
              const csvContent = brokenLinks
                .map((result) => `${result.href}`)
                .join("\n");
              cy.writeFile(outputCsvFile, csvContent + "\n", { flag: "a+" });
              brokenLinks.length = 0; // Clear array to prevent memory overload
            }
          });
      }
    });
  };

  const getProcessedPages = () => {
    // Check if the processedPages.json file exists using the custom task
    cy.task('fileExists', processedPagesFile).then((exists) => {
      if (!exists) {
        // If the file doesn't exist, create it with an empty array
        return cy.task('writeFile', { filePath: processedPagesFile, content: [] });
      }
    });

    // Now that we know the file exists (or was created), read its content
    return cy.task('readFile', { filePath: processedPagesFile });
  };

  const markPageAsProcessed = (page) => {
    getProcessedPages().then((processedPages) => {
      processedPages.push(page);
      cy.task('writeFile', { filePath: processedPagesFile, content: processedPages });
    });
  };

  it("should check that all links return a 2xx status code", () => {
    cy.fixture("homePage.json").then((data) => {
      getProcessedPages().then((processedPages) => {
        // If processedPages is empty or doesn't exist, start from the first page
        const unprocessedPages = data.filter((page) => !processedPages.includes(page));

        // If there are no unprocessed pages, finish the test
        if (unprocessedPages.length === 0) {
          cy.log("All pages have already been processed.");
          return;
        }

        // Process each unprocessed page
        unprocessedPages.forEach((page) => {
          // checkArticleLinks(page);
          checkArticleLinks(`${page}/content/current`);
          markPageAsProcessed(page);
        });
      });
    });
  });
});
