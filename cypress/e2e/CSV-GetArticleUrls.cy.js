const issueAandVol = [
  "https://bmjopenquality.bmj.com/content/6/1",
  "https://bmjopenquality.bmj.com/content/6/2",
  
];

const journal = "bmjopenquality";

describe("Article Urls Collection", () => {
  // Fumction to fetch article URLs
  const collectArticleURls = (page) => {
    const articleUrls = [];

    cy.visit(page, { failOnStatusCode: false });

    cy.get(".issue-toc")
      .find("a")
      .each(($ele) => {
        articleUrls.push($ele.attr("href"));
      })
      .then(() => {
        if (articleUrls.length > 0) {
          cy.writeFile(
            `cypress/inspection/${journal}/HW/articleUrls.csv`,
            articleUrls,
            {
              flag: "a+",
            }
          );
        }
      });
  };
  it("Visit Issue And Volume Page", () => {
    issueAandVol.forEach((issueAndVolume) => {
      collectArticleURls(issueAndVolume);
    });
  });
});
