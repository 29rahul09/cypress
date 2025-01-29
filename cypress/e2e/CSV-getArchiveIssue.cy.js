const issueAandVol = [
  "https://gh.bmj.com/content/by/year/2024",
  "https://gh.bmj.com/content/by/year/2023",
  "https://gh.bmj.com/content/by/year/2022",
  "https://gh.bmj.com/content/by/year/2021",
  "https://gh.bmj.com/content/by/year/2020",
  "https://gh.bmj.com/content/by/year/2019",
  "https://gh.bmj.com/content/by/year/2018",
  "https://gh.bmj.com/content/by/year/2017",
  "https://gh.bmj.com/content/by/year/2016",
];

const journal = "Global Health";
const domain = "https://gh.bmj.com";

describe("Article Urls Collection", () => {
  before(() => {
    cy.visit(domain, { failOnStatusCode: false });
  });

  const articleUrls = [];

  it("Visit Issue And Volume Page", () => {
    issueAandVol.forEach((page) => {
      cy.request(page)
        .then((response) => {
          const $html = Cypress.$(response.body);
          $html.find(".archive-issue-list a").each((_, link) => {
            const href = link.href;
            if (href.includes("content")) {
              articleUrls.push(href);
            }
          });
        })
        .then(() => {
          if (articleUrls.length > 0) {
            cy.writeFile(
              `cypress/inspection/${journal}/HW/archiveIssue.csv`,
              articleUrls
            );
          }
        });
    });
  });
});
