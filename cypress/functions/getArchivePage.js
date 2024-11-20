export const runGetArchivePages = (journal, archivePageUrls) => {
  describe(`Get All Issue and Volume Urls`, () => {
    const articleUrls = [];
    it("Visit Issue And Volume Page", () => {
      archivePageUrls.forEach((archivePageUrl) => {
        cy.visit({
          url: `${archivePageUrl}`,
          failOnStatusCode: false,
          auth: {
            username: "BMJStaging",
            password: "bmj2410",
          },
        });
        cy.get("body")
          .then(($body) => {
            if ($body.find(".archive-issue-list".length > 0)) {
              cy.get(".archive-issue-list a").each(($el) => {
                const href = $el.attr("href");
                if (href.includes("content")) {
                  articleUrls.push(href);
                }
              });
            }
          })
          .then(() => {
            if (articleUrls.length > 0) {
              cy.writeFile(`cypress/fixtures/${journal}_Vol&Issue.json`, articleUrls);
            }
          });
      });
    });
  });
};

export default runGetArchivePages;
