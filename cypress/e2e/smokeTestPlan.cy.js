const journal = "GlobalHealth";
const domain = "https://gh-stage-next.bmj.com";

describe(
  "Run Smoke Test on Stage-site",
  {
    viewportHeight: 800,
    viewportWidth: 1280,
  },
  () => {
    const validateArticlePage = (articleUrl) => {
      cy.visit({
        url: `${domain}${articleUrl}`,
        failOnStatusCode: false,
        auth: {
          username: "BMJStaging",
          password: "bmj2410",
        },
      });
      cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
      validateTopBoxSection(articleUrl);
    };

    const validateTopBoxSection = (articleUrl) => {
      cy.get("body").then(($body) => {
        const selectors = {
          title: "h1#article-title-1",
          publicationDate: '[data-testid="publication-icon"]',
          openAccess: '[data-testid="open-access-icon-img"]',
          requestPermissions: '[data-testid="request-permissions"]',
          citation: '[data-testid="citation"]',
          share: '[data-testid="share"]',
          pdfLink: '[data-testid="pdf"] a',
        };

        const promises = Object.entries(selectors).map(([key, selector]) => {
          if ($body.find(selector).length > 0) {
            switch (key) {
              case "title":
              case "publicationDate":
              case "openAccess":
                return cy.get(selector).should("be.visible");
              case "requestPermissions":
              case "pdfLink":
                return cy
                  .get(selector)
                  .should("have.attr", "href")
                  .then((href) =>
                    cy.request(href).its("status").should("eq", 200)
                  );
              case "citation":
                return cy
                  .get(selector)
                  .should("exist")
                  .contains("Cite this article");
              case "share":
                return cy.get(selector).should("exist").contains("Share");
              default:
                return Promise.resolve();
            }
          }
          return Promise.resolve();
        });

        return Promise.allSettled(promises).then((results) => {
          const rejected = results.filter(
            (result) => result.status === "rejected"
          );
          if (rejected.length > 0) {
            throw new Error(`Validation failed for article: ${articleUrl}`);
          }
        });
      });
    };

    it("Validate article pages", () => {
      cy.fixture(`GH.json`).then((data) => {
        data.forEach((articleUrl) => {
          validateArticlePage(articleUrl);
          cy.writeFile(
            `cypress/inspection/SmokeTest/${journal}/lastVisitedUrl.csv`,
            articleUrl
          );
        });
      });
    });
  }
);
