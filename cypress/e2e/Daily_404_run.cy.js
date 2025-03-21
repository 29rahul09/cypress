describe("Check all links are reachable", () => {
  const processedPagesFile = "cypress/downloads/Daily/processedPages.json";
  const outputCsvFile = "cypress/downloads/Daily/brokenLinks.json";

  // Function to visit and check for broken links on a page
  const checkArticleLinks = (page) => {
    cy.visit(page);
    cy.url().then((pageUrl) => {
      let currentUrl = pageUrl.includes("content") ? pageUrl.replace("content", "/content") : pageUrl;
      cy.visit(currentUrl);
      cy.get(".issue-toc a").each(($link) => checkLink($link));
    });
  };

  // Function to check if a link is broken
  const checkLink = ($link) => {
    const href = $link.prop("href");
    if (href && href.match(/\/content\/\d+/)) {
      cy.request({ url: href, failOnStatusCode: false }).then((response) => {
        if (response.status < 200 || response.status >= 400) {
          writeBrokenLinkToFile(href);
        }
      });
    }
  };

  // Function to write broken link to the file
  const writeBrokenLinkToFile = (brokenLink) => {
    cy.task("fileExists", outputCsvFile).then((exists) => {
      if (!exists) {
        createFileWithEmptyUrl();
      }

      cy.readFile(outputCsvFile).then((existingData) => {
        const updatedData = existingData?.Url ? { Url: [...existingData.Url, brokenLink] } : { Url: [brokenLink] };
        cy.writeFile(outputCsvFile, JSON.stringify(updatedData, null, 2));
      });
    });
  };

  // Function to create a new file with an empty "Url" array if it doesn't exist
  const createFileWithEmptyUrl = () => {
    cy.writeFile(outputCsvFile, JSON.stringify({ Url: [] }, null, 2));
  };

  // Function to get all processed pages (with null/empty check)
  const getProcessedPages = () => {
    return cy.task("fileExists", processedPagesFile).then((exists) => {
      if (!exists) {
        return initializeProcessedPagesFile();
      }

      // Read the processed pages file
      return cy.readFile(processedPagesFile).then((processedPages) => {
        // If the file content is not an array (for any reason), return an empty array
        return Array.isArray(processedPages) ? processedPages : [];
      });
    });
  };

  // Function to initialize the processed pages file with an empty array
  const initializeProcessedPagesFile = () => {
    return cy.task("writeFile", { filePath: processedPagesFile, content: [] });
  };

  // Function to mark a page as processed
  const markPageAsProcessed = (page) => {
    getProcessedPages().then((processedPages) => {
      processedPages.push(page);
      cy.task("writeFile", { filePath: processedPagesFile, content: processedPages });
    });
  };

  it("should check that all links return a 2xx status code", () => {
    cy.fixture("homePage.json").then((data) => {
      getProcessedPages().then((processedPages) => {
        // Ensure processedPages is always an array
        processedPages = processedPages || [];

        // Get unprocessed pages by filtering out the processed ones
        const unprocessedPages = data.filter((page) => !processedPages.includes(page));

        // If there are no unprocessed pages, finish the test
        if (unprocessedPages.length === 0) {
          cy.log("All pages have already been processed.");
          return;
        }

        // Process each unprocessed page
        unprocessedPages.forEach((page) => {
          checkArticleLinks(`${page}/content/current`);
          markPageAsProcessed(page);
        });
      });
    });
  });
});
