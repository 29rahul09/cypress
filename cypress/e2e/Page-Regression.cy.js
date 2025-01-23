/// <reference types="cypress" />
// npx cypress run --headless --browser chrome --spec "cypress/e2e/Page-Regression.cy.js"
describe("Page Regression Test", () => {
  const journal = "https://bmjpublichealth.bmj.com";
  const getSitemapPages = () => {
    const sitemap = `${journal}/pages/sitemap.xml`;
    // Fetch the XML sitemap
    cy.request(sitemap).then((response) => {
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

  const getPageHrefLinks = () => {
    const brokenLinks = [{ page: "URL", href:"LINK", status: "STATUS" }];
    cy.fixture("sitemap.json").then((sitemap) => {
      sitemap.Url.forEach((page) => {
        cy.visit(page, { failOnStatusCode: false });
        cy.get("a").each((link) => {
          const href = link.prop("href");
          if (href) {
            cy.request({ url: href, failOnStatusCode: false })
              .then((response) => {
                if (response.status >= 200 && response.status < 400) {
                  console.log(`${response.status}`);
                } else {
                  brokenLinks.push({ page: page, href: href, status: response.status });
                }
              })
              .then(() => {
                if (brokenLinks.length > 0) {
                  const csvContent = brokenLinks.map((result) => `${result.page},${result.href},${result.status}`).join("\n");
                  cy.writeFile(
                    `cypress/downloads/Regression/brokenLinks.csv`,
                    csvContent
                  );
                }
              });
          }
        });
      });
    });
  };

  const checkPageMigrationToAppRouter = () => {
    cy.fixture("sitemap.json").then((sitemap) => {
      sitemap.Url.forEach((page) => {
        const pageUrl = page.replace(`${journal}`, "http://localhost:4200");
        cy.visit(pageUrl, { failOnStatusCode: false });
        cy.get("footer").scrollIntoView({ duration: 2000 });
        cy.wait(5000);

 
      });
    });
  };

  

  it("Extracts Pages from XML Sitemap And Perform Rgression Test", () => {
    getSitemapPages();
    getPageHrefLinks();
    // checkPageMigrationToAppRouter();
  });
});
