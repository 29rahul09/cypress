/// <reference types="cypress" />
// npx cypress run --headless --browser chrome --spec "cypress/e2e/Page-Regression.cy.js"

describe(
  "Page Regression Test",
  {
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  () => {
    const journal = "https://migrated.bmj.com";
    const domain = journal.split("/")[2].split(".")[0];

    // Helper function to write broken links to a CSV file
    const writeBrokenLinkToCSV = (fileName, page, href, status) => {
      const csvContent = `${page}, ==> ${href}, ==> ${status}\n`;
      cy.writeFile(
        `cypress/downloads/Regression/${domain}/${fileName}`,
        csvContent,
        { flag: "a" }
      );
    };

    // Helper function to check and report broken links
    const checkLink = (url, pageName, fileName) => {
      cy.request({ url, failOnStatusCode: false }).then((response) => {
        if (response.status < 200 || response.status >= 400) {
          writeBrokenLinkToCSV(fileName, pageName, url, response.status);
        }
      });
    };

    // Function to check links in a specific section (Navbar, Main, or Footer)
    const checkSectionLinks = (sectionSelector, sectionName, fileName) => {
      cy.get(sectionSelector)
        .find("a")
        .each(($link) => {
          const href = $link.prop("href");

          // Skip mailto links
          if (href && !href.startsWith("mailto:")) {
            checkLink(href, sectionName, fileName);
          }
        });
    };

    // Test case: Check Links in the Navigation Bar
    it("Check Links in the Navigation Bar", () => {
      cy.visit(journal);
      checkSectionLinks(
        '[data-testid="top-menu-container"]',
        "Navigation Bar",
        "navBarLinks.csv"
      );
    });

    // Test case: Check Links in the Footer
    it("Check Links in the Footer", () => {
      cy.visit(journal);
      checkSectionLinks("footer", "Footer", "footerLinks.csv");
    });

    // Test case: Perform Regression Test on Pages Common in All Journals
    it("Perform Regression Test on Pages Common in All Journals", () => {
      cy.fixture("commonPages.json").then((data) => {
        data.Url.forEach((page) => {
          cy.visit(`${journal}${page}`, { failOnStatusCode: false }).then(
            () => {
              checkSectionLinks("main", `${journal}${page}`, "brokenLinks.csv");
            }
          );
        });
      });
    });

    // Test case: Perform Regression Test on Homepage of All Journals
    it.only("Perform Regression Test on Pages Common in All Journals", () => {
      cy.fixture("homePage.json").then((data) => {
        data.forEach((page) => {
          cy.visit(`${page}`, { failOnStatusCode: false }).then(() => {
            checkSectionLinks(
              '[data-testid="top-menu-container"]',
              `${page}`,
              "navBarLinks.csv"
            );
            checkSectionLinks("main", `${page}`, "brokenLinks.csv");
            checkSectionLinks("footer", `${page}`, "footerLinks.csv");
          });
        });
      });
    });
  }
);
