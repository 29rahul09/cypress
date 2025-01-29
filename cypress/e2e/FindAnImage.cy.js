describe("Check for ORCID image across multiple pages", () => {
  const orcidPages = [];
  const siteMapPages = (journal) => {
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
  };
  const imageFinder = (page) => {
    // Visit the page
    cy.visit(page, { failOnStatusCode: false });
    // Try to find the image using the 'src' attribute
    cy.get("body").then(($body) => {
      const imageFound =
        $body.find(
          'img[src="https://orcid.org/sites/default/files/images/orcid_16x16.png"]'
        ).length > 0 || $body.find('img[alt="ORCID logo"]').length > 0;

      if (imageFound) {
        orcidPages.push(page);
        // Write the pages with the ORCID image to a file
        cy.writeFile(
          "cypress/downloads/ORCID/orcidPages.csv",
          orcidPages.join("\n") + "\n",
          { flag: "a+" }
        );
      }
    });
  };
  // Iterate through each page and check for the image
  it(`should check for ORCID image`, () => {
    siteMapPages("wjps");
    cy.fixture("sitemap.json").then((data) => {
      data.Url.forEach((page) => {
        imageFinder(page);
      });
    });
  });
});
