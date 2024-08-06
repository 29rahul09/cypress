const journals = ["/content/3/1/e000748"];
describe("Article Page Headings Sections Details", () => {
  it("FIND THE SUPPLEMENTRY FILE SECTION DETAILS", () => {
    var SupplementryFile = [];
    const SupplemettryId = `cypress/downloads/SECTION/SupplementryFile.csv`;
    journals.forEach((page) => {
      cy.visit({
        url: `https://bmjmedicine.bmj.com${page}`,
        failOnStatusCode: false,
      });
      cy.get("body").then(($body) => {
        if ($body.find("#supplementary-materials").length > 0) {
          cy.get("#supplementary-materials").scrollIntoView({
            offset: { top: 50, left: 0 },
          });
          SupplementryFile.push(page);
        }
      });
    });
    cy.writeFile(SupplemettryId, SupplementryFile);
  });

  it("FIND THE REQUEST PERMISSION SECTION DETAILS", () => {
    var RequestPermission = [];
    const RequestPermissionId = `cypress/downloads/SECTION/RequestPermission.csv`;
    journals.forEach((page) => {
      cy.visit({
        url: `https://bmjmedicine.bmj.com${page}`,
        failOnStatusCode: false,
      });
      cy.get("body").then(($body) => {
        if ($body.find("#request-permissions").length > 0) {
          cy.get("#request-permissions")
            .scrollIntoView({ offset: { top: -50, left: 0 } })
            .should("be.visible");
        } else {
          RequestPermission.push(page);
        }
      });
    });
    cy.writeFile(RequestPermissionId, RequestPermission);
  });
  it("FIND IF CLINICAL TRAILS LINK WORKS", () => {
    var links = [];
    const ctLinks = `cypress/downloads/CTL/CTLINKS.csv`;
    journals.forEach((page) => {
      const domain = "https://bmjoncology.bmj.com";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if ($body.find('*[class^="external-ref"]').length > 0) {
          links.push(`${domain}${page}`);
        }
      }); 
    });
    cy.writeFile(ctLinks, links);
  });
  it.only("FIND THE NEXT ELEMENT AFTER REQUEST PERMISSION SECTION", () => {
    var RequestPermission = [];
    const RequestPermissionId = `cypress/downloads/SECTION/RequestPermission.csv`;
    journals.forEach((page) => {
      cy.visit({
        url: `https://bmjmedicine.bmj.com${page}`,
        failOnStatusCode: false,
      });
      cy.get("body").then(($body) => {
        if ($body.find("#request-permissions").length > 0) {
          //   cy.get("#request-permissions")
          cy.log($body.find("#request-permissions ~ div").text());
        } else {
          RequestPermission.push(page);
        }
      });
    });
    cy.writeFile(RequestPermissionId, RequestPermission);
  });
});
