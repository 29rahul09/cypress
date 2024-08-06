const journals = ["https://wjps.bmj.com/content/7/2"];

describe("Archive Page Inspect", () => {
  it("Have ArticleId URL", () => {
    var Analysis = [];
    var Editorial = [];
    var Originalarticle = [];
    var Originalresearch = [];
    var Regulatoryandpolicycorner = [];
    var Review = [];
    var Correction = [];
    var Perspectives = [];
    var Protocol = [];
    const AnalysisId = "cypress/downloads/ARCHIVE/Analysis.csv";
    const EditorialId = "cypress/downloads/ARCHIVE/Editorial.csv";
    const OriginalarticleId = "cypress/downloads/ARCHIVE/Originalarticle.csv";
    const OriginalresearchId = "cypress/downloads/ARCHIVE/Originalresearch.csv";
    const RegulatoryandpolicycornerId =
      "cypress/downloads/ARCHIVE/Regulatoryandpolicycorner.csv";
    const ReviewId = "cypress/downloads/ARCHIVE/Review.csv";
    const CorrectionId = "cypress/downloads/ARCHIVE/Correction.csv";
    const PerspectivesId = "cypress/downloads/ARCHIVE/Perspectives.csv";
    const ProtocolId = "cypress/downloads/ARCHIVE/Protocol.csv";
    journals.forEach((journal) => {
      cy.visit({
        url: `${journal}`,
        failOnStatusCode: false,
      });
      cy.get("body").then(($body) => {
        if ($body.find("#Analysis").length > 0) {
          cy.get(".issue-toc-section-analysis > ul > li")
            .find("a")
            .each(($ele) => {
              Analysis.push($ele.attr("href"));
              cy.writeFile(AnalysisId, Analysis);
            });
        } else {
          cy.log("NO ANALYSIS");
        }
        if ($body.find("#Editorial").length > 0) {
          cy.get(".issue-toc-section-editorial > ul > li")
            .find("a")
            .each(($ele) => {
              Editorial.push($ele.attr("href"));
              cy.writeFile(EditorialId, Editorial);
            });
        } else {
          cy.log("NO Editorial");
        }
        if ($body.find("#Originalarticle").length > 0) {
          cy.get(".issue-toc-section-original-article > ul > li")
            .find("a")
            .each(($ele) => {
              Originalarticle.push($ele.attr("href"));
              cy.writeFile(OriginalarticleId, Originalarticle);
              
            });
        } else {
          cy.log("NO Originalarticle");
        }
        if ($body.find("#Originalresearch").length > 0) {
          cy.get(".issue-toc-section-original-research > ul > li")
            .find("a")
            .each(($ele) => {
              Originalresearch.push($ele.attr("href"));
              cy.writeFile(OriginalresearchId, Originalresearch);
            });
        } else {
          cy.log("NO Originalresearch");
        }
        if ($body.find("#Regulatoryandpolicycorner").length > 0) {
          cy.get(".issue-toc-section-regulatory-and-policy-corner > ul > li")
            .find("a")
            .each(($ele) => {
              Regulatoryandpolicycorner.push($ele.attr("href"));
              cy.writeFile(RegulatoryandpolicycornerId, Regulatoryandpolicycorner);
            });
        } else {
          cy.log("NO Regulatoryandpolicycorner");
        }
        if ($body.find("#Review").length > 0) {
          cy.get(".issue-toc-section-review > ul > li")
            .find("a")
            .each(($ele) => {
              Review.push($ele.attr("href"));
              cy.writeFile(ReviewId, Review);
            });
        } else {
          cy.log("NO Review");
        }
        if ($body.find("#Correction").length > 0) {
          cy.get(".issue-toc-section-correction > ul > li")
            .find("a")
            .each(($ele) => {
              Correction.push($ele.attr("href"));
              cy.writeFile(CorrectionId, Correction);
              
            });
        } else {
          cy.log("NO Correction");
        }
        if ($body.find("#Perspective").length > 0) {
          cy.get(".issue-toc-section-perspective > ul > li")
            .find("a")
            .each(($ele) => {
              Perspectives.push($ele.attr("href"));
              cy.writeFile(PerspectivesId, Perspectives);
            });
        } else {
          cy.log("NO Perspectives");
        }
        if ($body.find("#Protocol").length > 0) {
          cy.get(".issue-toc-section-protocol > ul > li")
            .find("a")
            .each(($ele) => {
              Protocol.push($ele.attr("href"));
              cy.writeFile(ProtocolId, Protocol);
            });
        } else {
          cy.log("NO Protocol");
        }
      });
    });
   
  });
});
