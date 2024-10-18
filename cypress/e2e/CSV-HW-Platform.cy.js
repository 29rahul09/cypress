const journal = "bmjopensem";
const domain = "https://bmjopensem.bmj.com";

describe(
  "Investigate Article URL on Live-site",
  {
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  () => {
    const inspectArticlePage = (articleUrl) => {
      cy.visit({
        url: `${domain}${articleUrl}`,
        failOnStatusCode: false,
      });
      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
      validateImages(articleUrl);
      visitUrlAndCollectHeadings(articleUrl);
      processUrls(articleUrl);
    };

    const validateImages = (articleUrl) => {
      const brokenImages = [];

      cy.get("#article-top").find("img").each(($img) => {
        const src = $img.attr("src");
        const alt = $img.attr("alt");
        const width = $img.prop("naturalWidth");

        if (width === 0) {
          brokenImages.push(`${articleUrl} ==> ${src} ==> ${alt}`);
        }
      }).then(() => {
        if (brokenImages.length > 0) {
          cy.writeFile(
            `cypress/inspection/${journal}/HW/BrokenImage.csv`,
            "Broken Image URL\n" + brokenImages.join("\n")
          );
        } else {
          cy.log("No broken images found on this page.");
        }
      });
    };

    const visitUrlAndCollectHeadings = (url) => {
      cy.get("body h2:visible").then(($headings) => {
        const headingsText = Array.from($headings).map(($el) => Cypress.$($el).text())
          .filter(text => text !== "Cookies and privacy" && text !== "You are here")
          .sort()
          .join(" | ");

        const csvContent = `${url},${headingsText}\n`;
        cy.writeFile(
          `cypress/inspection/${journal}/HW/ArticleHeadings.csv`,
          csvContent,
          { flag: "a+" }
        );
      });
    };

    const processUrls = (url) => {
      cy.get("body").then(($body) => {
        const result = {
          url,
          CTLinks: $body.find('*[class^="external-ref"]').length > 0,
          keyMessageBox: $body.find("#boxed-text-1, .boxed-text").length > 0,
          bodyTextBox: $body.find("#boxed-text-2").length > 0,
          figNTabWithRef: $body.find(".table-caption > p > a, .fig-caption > p > a").length > 0,
        };

        const csvContent = `${result.url},${result.CTLinks},${result.keyMessageBox},${result.bodyTextBox},${result.figNTabWithRef}\n`;
        cy.writeFile(
          `cypress/inspection/${journal}/HW/externalLinks.csv`,
          csvContent,
          { flag: "a+" }
        );
      });
    };

    it("Inspect article pages", () => {
      cy.fixture(`${journal}.json`).then((data) => {
        data.forEach((articleUrl) => {
          inspectArticlePage(articleUrl);
          cy.writeFile(
            `cypress/inspection/${journal}/HW/lastVisitedUrl.csv`,
            articleUrl
          );
        });
      });
    });
  }
);
