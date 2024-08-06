const issueAandVol = ["https://gocm.bmj.com/content/4/3","https://gocm.bmj.com/content/4/2","https://gocm.bmj.com/content/4/1"];
const journal = "GOCM";
const domain = "https://gocm.bmj.com";
const articleUrlId = `cypress/fixtures/${journal}.json`;

describe("Article Page Sections", () => {
  it("Find Article URL", () => {
    const articleUrls = [];

    issueAandVol.forEach((page) => {
      cy.visit({
        url: `${page}`,
        failOnStatusCode: false,
      });

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
  it("Find the article have image with source info", () => {
    const attribute = [];
    const attributeId = `cypress/downloads/${journal}/Attribute.csv`;
    cy.fixture(`${journal}.json`).then((data) => {
      data.forEach((page) => {
        cy.visit({
          url: `${domain}${page}`,
          failOnStatusCode: false,
        });

        cy.get("body").then(($body) => {
          if ($body.find("#attrib-1").length > 0) {
            attribute.push(page);
          }
        });
      });
      cy.writeFile(attributeId, attribute);
    });
  });
  it("Find the article have Highlights section", () => {
    const highlight = [];
    const highlightId = `cypress/downloads/${journal}/Highlight.csv`;
    cy.fixture(`${journal}.json`).then((data) => {
      data.forEach((page) => {
        cy.visit({
          url: `${domain}${page}`,
          failOnStatusCode: false,
        });

        cy.get("body").then(($body) => {
          if ($body.find("#abstract-2").length > 0) {
            highlight.push(page);
          }
        });
      });
      cy.writeFile(highlightId, highlight);
    });
  });
  it("Find the article have appendix section", () => {
    const appendix = [];
    const appendixId = `cypress/downloads/${journal}/Appendix.csv`;
    cy.fixture(`${journal}.json`).then((data) => {
      data.forEach((page) => {
        cy.visit({
          url: `${domain}${page}`,
          failOnStatusCode: false,
        });

        cy.get("body").then(($body) => {
          if ($body.find("#app-1").length > 0) {
            appendix.push(page);
          }
        });
      });
      cy.writeFile(appendixId, appendix);
    });
  });
  it("Find if the article has boxed text and supplementary files", () => {
    const abstract = [];
    const acknowledge = [];
    const almetric = [];
    const ctLinks = [];
    const keyMessageBox = [];
    const bodyTextBox = [];
    const supplementaryFile = [];
    const figNTabWithRef = [];
    const authorBio = [];
    const permission = [];

    const abstractId = `cypress/downloads/${journal}/MissingAbstract.csv`;
    const acknowledgetId = `cypress/downloads/${journal}/Acknowledgements.csv`;
    const almetricId = `cypress/downloads/${journal}/MissingAlmetrics.csv`;
    const ctLinksId = `cypress/downloads/${journal}/CTlinks.csv`;
    const keyMessageBoxId = `cypress/downloads/${journal}/KeyBox.csv`;
    const bodyTextBoxId = `cypress/downloads/${journal}/BodyBox.csv`;
    const supplementaryId = `cypress/downloads/${journal}/SupplementryFile.csv`;
    const figNTabWithRefId = `cypress/downloads/${journal}/FigAndTabWithRef.csv`;
    const authorBioId = `cypress/downloads/${journal}/AuthorBio.csv`;
    const permissionId = `cypress/downloads/${journal}/MissingPermission.csv`;

    cy.fixture(`${journal}.json`).then((data) => {
      data.forEach((page) => {
        cy.visit({
          url: `${domain}${page}`,
          failOnStatusCode: false,
        });

        cy.get("body").then(($body) => {
          if (!$body.find("#abstract-1").length > 0) {
            abstract.push(page);
          }
          if ($body.find("#ack-1").length > 0) {
            acknowledge.push(page);
          }
          if (!$body.find(".altmetric-normal-legend").length > 0) {
            almetric.push(page);
          }
          if ($body.find('*[class^="external-ref"]').length > 0) {
            ctLinks.push(page);
          }
          if (
            $body.find("#boxed-text-1").length > 0 ||
            $body.find(".boxed-text").length > 0
          ) {
            keyMessageBox.push(page);
          }
          if ($body.find("#boxed-text-2").length > 0) {
            bodyTextBox.push(page);
          }
          if (
            $body.find("#supplementary-materials").length > 0 ||
            $body.find(".supplementary-material").length > 0
          ) {
            supplementaryFile.push(page);
          }
          if (
            $body.find(".table-caption > p > a").length > 0 ||
            $body.find(".fig-caption > p > a").length > 0
          ) {
            figNTabWithRef.push(page);
          }
          if ($body.find(".bio").length > 0) {
            authorBio.push(page);
          }
          if ($body.find("#request-permissions").length > 0) {
            cy.get("#request-permissions")
              .scrollIntoView({ offset: { top: -50, left: 0 } })
              .should("be.visible");
          } else {
            permission.push(page);
          }
        });
      });
      cy.writeFile(abstractId, abstract);
      cy.writeFile(acknowledgetId, acknowledge);
      cy.writeFile(almetricId, almetric);
      cy.writeFile(ctLinksId, ctLinks);
      cy.writeFile(keyMessageBoxId, keyMessageBox);
      cy.writeFile(bodyTextBoxId, bodyTextBox);
      cy.writeFile(supplementaryId, supplementaryFile);
      cy.writeFile(figNTabWithRefId, figNTabWithRef);
      cy.writeFile(authorBioId, authorBio);
      cy.writeFile(permissionId, permission);
    });
  });
});
