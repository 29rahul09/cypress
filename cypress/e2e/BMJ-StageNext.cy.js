const sites = [
  "https://adc-stage-next.bmj.com/pages/",
  "https://ard-stage-next.bmj.com/pages/",
  "https://bjo-stage-next.bmj.com/pages/",
  "https://bjsm-stage-next.bmj.com/pages/",
  "https://bmjoncology-stage-next.bmj.com/pages/",
  "https://bmjopen-stage-next.bmj.com/pages/",
  "https://bmjopensem-stage-next.bmj.com/pages/",
  "https://bmjophth-stage-next.bmj.com/pages/",
  "https://drc-stage-next.bmj.com/pages/",
  "https://ebm-stage-next.bmj.com/pages/",
  "https://ebn-stage-next.bmj.com/pages/",
  "https://ejhp-stage-next.bmj.com/pages/",
  "https://emj-stage-next.bmj.com/pages/",
  "https://ep-stage-next.bmj.com/pages/",
  "https://fg-stage-next.bmj.com/pages/",
  "https://fn-stage-next.bmj.com/pages/",
  "https://gh-stage-next.bmj.com/pages/",
  "https://gut-stage-next.bmj.com/pages/",
  "https://heart-stage-next.bmj.com/pages/",
  "https://ijgc-stage-next.bmj.com/pages/",
  "https://injuryprevention-stage-next.bmj.com/pages/",
  "https://jcp-stage-next.bmj.com/pages/",
  "https://jech-stage-next.bmj.com/pages/",
  "https://jitc-stage-next.bmj.com/pages/",
  "https://jme-stage-next.bmj.com/pages/",
  "https://jmg-stage-next.bmj.com/pages/",
  "https://jnis-stage-next.bmj.com/pages/",
  "https://bmjleader-stage-next.bmj.com/pages/",
  "https://mh-stage-next.bmj.com/pages/",
  "https://nutrition-stage-next.bmj.com/pages/",
  "https://oem-stage-next.bmj.com/pages/",
  "https://openheart-stage-next.bmj.com/pages/",
  "https://bmjopenquality-stage-next.bmj.com/pages/",
  "https://pn-stage-next.bmj.com/pages/",
  "https://bmjpaedsopen-stage-next.bmj.com/pages/",
  "https://qualitysafety-stage-next.bmj.com/pages/",
  "https://rapm-stage-next.bmj.com/pages/",
  "https://spcare-stage-next.bmj.com/pages/",
  "https://srh-stage-next.bmj.com/pages/",
  "https://sti-stage-next.bmj.com/pages/",
  "https://thorax-stage-next.bmj.com/pages/",
  "https://tobaccocontrol-stage-next.bmj.com/pages/",
  "https://tsaco-stage-next.bmj.com/pages/",
];

describe("Navigate Through Journals StageNext Sites And Check 404 Page", () => {
  var notFound = [];
  const wFile = "cypress/downloads/Special/stagenextpages.json";
  it("SHOULD Redirect To Homepage", () => {
    sites.forEach((site) => {
      cy.visit({
        url: `${site}`,
        failOnStatusCode: false,
      });
      cy.get('[data-testid="link-number-0"] > li > .decoration-none')
        .click()
        .wait(2000);
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="page-contain-link"]').length > 0) {
          notFound.push(site);
        } else {
          cy.get("footer").scrollIntoView({ duration: 2000 });
        }
      });
    });
    cy.writeFile(wFile, notFound);
  });

  it("SHOULD Redirect To Authors", () => {
    sites.forEach((site) => {
        cy.visit({
          url: `${site}`,
          failOnStatusCode: false,
        });
        cy.get('[data-testid="link-number-2"] > li > .decoration-none')
          .click()
          .wait(2000);
        cy.get("body").then(($body) => {
          if ($body.find('[data-testid="page-contain-link"]').length > 0) {
            notFound.push(site);
          } else {
            cy.get("footer").scrollIntoView({ duration: 2000 });
          }
        });
      });
      cy.writeFile(wFile, notFound);
  });

  it("SHOULD Redirect To About", () => {
    sites.forEach((site) => {
        cy.visit({
          url: `${site}`,
          failOnStatusCode: false,
        });
        cy.get('[data-testid="link-number-3"] > li > .decoration-none')
          .click()
          .wait(2000);
        cy.get("body").then(($body) => {
          if ($body.find('[data-testid="page-contain-link"]').length > 0) {
            notFound.push(site);
          } else {
            cy.get("footer").scrollIntoView({ duration: 2000 });
          }
        });
      });
      cy.writeFile(wFile, notFound);
  });

  it.only("SHOULD Redirect To Help", () => {
    sites.forEach((site) => {
        cy.visit({
          url: `${site}`,
          failOnStatusCode: false,
        });
        cy.get('[data-testid="link-number-4"] > li > .decoration-none')
          .click()
          .wait(2000);
        cy.get("body").then(($body) => {
          if ($body.find('[data-testid="page-contain-link"]').length > 0) {
            notFound.push(site);
          } else {
            cy.get("footer").scrollIntoView({ duration: 2000 });
          }
        });
      });
      cy.writeFile(wFile, notFound);
  });
});
