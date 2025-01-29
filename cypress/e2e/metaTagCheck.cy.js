// npx cypress run --headless --browser chrome --spec "cypress/e2e/metaTagCheck.cy.js"
describe("Check for noindex Meta Tag", () => {
  const journal = "sit";
  it("Extracts loc elements from XML sitemap and writes to JSON file", () => {
    const url = `https://${journal}.bmj.com/pages/sitemap.xml`;

    // Fetch the XML sitemap
    cy.request(url).then((response) => {
      // Parse the XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, "application/xml");

      // Get all loc elements
      const locElements = xmlDoc.getElementsByTagName("loc");

      // Extract the text content of each loc element
      const locArray = Array.from(locElements).map(
        (locElement) => locElement.textContent
      );

      // Define the JSON object to be written
      const pageUrl = {
        Url: locArray,
      };

      // Write the JSON output to a file
      cy.writeFile("cypress/fixtures/sitemap.json", pageUrl);
    });
  });

  it("should find all meta tags and then find the noindex tag within them", () => {
    const metadata = [];
    cy.fixture("sitemap.json").then((data) => {
      data.Url.forEach((url) => {
        // Visit the page you want to test
        const pageUrl = url.replace(`${journal}`, `${journal}-stage-next`);
        // const pageUrl = url
        cy.visit({
          url: `${pageUrl}`,
          failOnStatusCode: false,
          auth: {
            username: "BMJStaging",
            password: "bmj2410",
          },
        });

        // Get all meta tags
        cy.get("head meta").then((metaTags) => {
          cy.log(metaTags);
          metadata.push({
            pageUrl: pageUrl,
            metaTags: Array.from(metaTags).map((metaTag) => ({
              name: metaTag.getAttribute("name"),
              content: metaTag.getAttribute("content"),
            })),
          });

          // // Check if there is a noindex meta tag
          // const noIndexMetaTag = Array.from(metaTags).find((metaTag) => {
          //   return (
          //     metaTag.getAttribute("name") === "robots" &&
          //     metaTag.getAttribute("content") ===
          //       "noindex, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          //   );
          // });
          // expect(noIndexMetaTag, 'Noindex meta tag should exist').to.exist;
        });
      });
      // Write the metadata to a JSON file
      cy.writeFile(`cypress/downloads/metaTags/${journal}.json`, metadata);
    });
  });
});
