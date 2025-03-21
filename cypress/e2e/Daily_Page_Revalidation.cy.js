describe("Re Validate all article links with 404 Error", () => {
  const filePath = `cypress/downloads/Daily/brokenLinks.json`;
  const outputFilePath = `cypress/downloads/Daily/revalidationResults.json`; // Path for the output file
  const secret = "14iuV6t0mq";

  // Convert URL to new format with the secret
  const convertUrl = (url) => {
    const contentIndex = url.indexOf("/content/");
    if (contentIndex !== -1) {
      const baseUrl = url.substring(0, contentIndex);
      const contentPath = url.slice(contentIndex);
      return `${baseUrl}/api/purge-cache${contentPath}?secret=${secret}`;
    }
    return null; // Invalid URL
  };

  it("should revalidate all the article links and check revalidation", () => {
    cy.readFile(filePath, "utf8").then((data) => {
      const urls = data.Url || []; // Safely access the URLs list
      const results = []; // Store the results

      // Step 1: Revalidate all URLs by passing the secret information
      urls.forEach((pageUrl) => {
        const revalidatedUrl = convertUrl(pageUrl);
        if (revalidatedUrl) {
          cy.request({
            url: revalidatedUrl, // Revalidated URL with secret
            failOnStatusCode: false, // Don't fail on non-2xx responses
          });
        }
      });

      // Step 2: Recheck the response of the original URLs and store the results
      cy.wrap(urls).each((pageUrl) => {
        cy.request({
          url: pageUrl, // Original URL
          failOnStatusCode: false, // Don't fail on non-2xx responses
        }).then((response) => {
          // Store the URL and its response status code
          results.push({
            url: pageUrl,
            statusCode: response.status,
          });

          // After all URLs have been processed, write the results to a new file
          if (results.length === urls.length) {
            cy.writeFile(outputFilePath, results);
          }
        });
      });
    });
  });
});
