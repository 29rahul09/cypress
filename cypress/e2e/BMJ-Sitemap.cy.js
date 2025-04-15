/// <reference types="cypress" />
// npx cypress run --headless --browser chrome --spec "cypress/e2e/BMJ-Sitemap.cy.js"
describe("Sitemap Parsing", () => {
  const fetchSitemapPages = (url) => {
    const journal = url.split("/")[2].split(".")[0];
    cy.request({
      url: url,
      auth: {
        username: "BMJStaging",
        password: "bmj2410",
      },
    }).then((response) => {
      // Parse the XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, "application/xml");

      // Get all loc elements
      const locElements = xmlDoc.getElementsByTagName("loc");

      // Extract the text content of each loc element
      const locArray = Array.from(locElements).map(
        (locElement) => locElement.textContent
      );

      // Filter URLs that contain '/content', '/collections', or '/pages'
      const contentUrls = locArray.filter((url) => url.includes("/content"));
      const collectionsUrls = locArray.filter((url) =>
        url.includes("/collections")
      );
      const pagesUrls = locArray.filter((url) => url.includes("/pages"));

      // Define the JSON object to be written for each category
      const contentPageUrl = { Url: contentUrls };
      const collectionsPageUrl = { Url: collectionsUrls };
      const pagesPageUrl = { Url: pagesUrls };

      // Write the filtered URLs to separate JSON files
      cy.writeFile(
        `cypress/downloads/sitemaps/${journal}/sitemapContent.json`,
        contentPageUrl
      );
      cy.writeFile(
        `cypress/downloads/sitemaps/${journal}/sitemapCollections.json`,
        collectionsPageUrl
      );
      cy.writeFile(
        `cypress/downloads/sitemaps/${journal}/sitemap.json`,
        pagesPageUrl
      );
    });
  };
  it.only("Extracts loc elements from XML sitemap and writes to separate JSON files based on URL patterns", () => {
    cy.fixture("sitemap.json").then((data) => {
      data.Url.forEach((url) => {
        fetchSitemapPages(url);
      });
    });
  });
  it("Writes loc elements in sitemaps to separate JSON files based on URL patterns", () => {
    // Fetch the XML sitemap and write to JSON files
    const url = "https://jmepb-stage-next.bmj.com/pages/sitemap.xml";
    fetchSitemapPages(url);
  });
});
