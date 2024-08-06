const issueAandVol = [
  "https://fmch.bmj.com/content/12/1",
  "https://fmch.bmj.com/content/12/2",
  "https://fmch.bmj.com/content/12/3",
  "https://fmch.bmj.com/content/12/Suppl_1",
  "https://fmch.bmj.com/content/12/Suppl_2",
  "https://fmch.bmj.com/content/12/Suppl_3",
];

const journal = "FMCH";
const domain = "https://fmch.bmj.com";
const articleUrlId = `cypress/fixtures/${journal}.json`;

describe("Article Page Sections", () => {
  // Test to fetch article URLs
  it("Find Article URL", () => {
    const articleUrls = [];

    issueAandVol.forEach((page) => {
      cy.visit(page, { failOnStatusCode: false });

      cy.get(".issue-toc")
        .find("a")
        .each(($ele) => {
          articleUrls.push($ele.attr("href"));
        })
        .then(() => {
          cy.writeFile(articleUrlId, articleUrls);
        });
    });
  });

  // Test to find if the article has boxed text and supplementary files
  it("Find if the article has boxed text and supplementary files", () => {
    const features = {
      pdfImage: [],
      abstract: [],
      acknowledge: [],
      almetric: [],
      ctLinks: [],
      keyMessageBox: [],
      bodyTextBox: [],
      supplementaryFile: [],
      figNTabWithRef: [],
      authorBio: [],
      permission: [],
    };
    // Define paths for various CSV files
    const paths = {
      pdfImageId: `cypress/downloads/${journal}/pdfImage.csv`,
      abstractId: `cypress/downloads/${journal}/MissingAbstract.csv`,
      acknowledgetId: `cypress/downloads/${journal}/Acknowledgements.csv`,
      almetricId: `cypress/downloads/${journal}/MissingAlmetrics.csv`,
      ctLinksId: `cypress/downloads/${journal}/CTlinks.csv`,
      keyMessageBoxId: `cypress/downloads/${journal}/KeyBox.csv`,
      bodyTextBoxId: `cypress/downloads/${journal}/BodyBox.csv`,
      supplementaryId: `cypress/downloads/${journal}/SupplementryFile.csv`,
      figNTabWithRefId: `cypress/downloads/${journal}/FigAndTabWithRef.csv`,
      authorBioId: `cypress/downloads/${journal}/AuthorBio.csv`,
      permissionId: `cypress/downloads/${journal}/MissingPermission.csv`,
    };
    // Helper function to check for various article features
    const checkArticleFeatures = (page, features) => {
      cy.visit(`${domain}${page}`, { failOnStatusCode: false });
      cy.get("body").then(($body) => {
        if ($body.find("#cboxLoadedContent").length > 0)
          features.pdfImage.push(page);
        if (!$body.find("#abstract-1").length > 0) features.abstract.push(page);
        if ($body.find("#ack-1").length > 0) features.acknowledge.push(page);
        if (!$body.find(".altmetric-normal-legend").length > 0)
          features.almetric.push(page);
        if ($body.find('*[class^="external-ref"]').length > 0)
          features.ctLinks.push(page);
        if (
          $body.find("#boxed-text-1").length > 0 ||
          $body.find(".boxed-text").length > 0
        )
          features.keyMessageBox.push(page);
        if ($body.find("#boxed-text-2").length > 0)
          features.bodyTextBox.push(page);
        if (
          $body.find("#supplementary-materials").length > 0 ||
          $body.find(".supplementary-material").length > 0
        )
          features.supplementaryFile.push(page);
        if (
          $body.find(".table-caption > p > a").length > 0 ||
          $body.find(".fig-caption > p > a").length > 0
        )
          features.figNTabWithRef.push(page);
        if ($body.find(".bio").length > 0) features.authorBio.push(page);
        if (!$body.find("#request-permissions").length > 0)
          features.permission.push(page);
      });
    };

    cy.fixture(`${journal}.json`).then((data) => {
      data.forEach((page) => {
        checkArticleFeatures(page, features);
      });

      // Write results to respective CSV files
      cy.writeFile(paths.pdfImageId, features.pdfImage);
      cy.writeFile(paths.abstractId, features.abstract);
      cy.writeFile(paths.acknowledgetId, features.acknowledge);
      cy.writeFile(paths.almetricId, features.almetric);
      cy.writeFile(paths.ctLinksId, features.ctLinks);
      cy.writeFile(paths.keyMessageBoxId, features.keyMessageBox);
      cy.writeFile(paths.bodyTextBoxId, features.bodyTextBox);
      cy.writeFile(paths.supplementaryId, features.supplementaryFile);
      cy.writeFile(paths.figNTabWithRefId, features.figNTabWithRef);
      cy.writeFile(paths.authorBioId, features.authorBio);
      cy.writeFile(paths.permissionId, features.permission);
    });
  });
});
