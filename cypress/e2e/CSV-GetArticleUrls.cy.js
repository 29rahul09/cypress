// npx cypress run --headless --browser chrome --spec "cypress/e2e/CSV-GetArticleUrls.cy.js"
const issueAandVol = [
  "https://bmjopenquality.bmj.com/content/13/4",
  "https://bmjopenquality.bmj.com/content/13/3",
  "https://bmjopenquality.bmj.com/content/13/2",
];
const journal = "bmjopenquality";
const domain = "https://bmjopenquality.bmj.com";

describe("Article Urls Collection", () => {
  before(() => {
    cy.visit(domain);
  });

  it("Visit Issue And Volume Page", () => {
    const articleUrls = [];
    issueAandVol.forEach((page) => {
      cy.request(page)
        .then((response) => {
          if (response.status === 200) {
            cy.log("Page found: ", page);
            const $html = Cypress.$(response.body);
            $html.find(".issue-toc a").each((_, link) => {
              const href = link.href;
              if (href.includes("content")) {
                articleUrls.push(href);
              }
            });
          }
        })
        .then(() => {
          if (articleUrls.length > 0) {
            cy.writeFile(`cypress/fixtures/${journal}.json`, articleUrls);
          }
        });
    });
  });
});
