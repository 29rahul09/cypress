const journals = [
  "/content/2/1/e000786",
  "/content/2/1/e000547",
  "/content/2/1/e000512",
  "/content/2/1/e000470",

]
describe("Article Page Sections", () => {
  it.skip("FIND DIFFERENT SECTIONS HEADING ON ARTICLE PAGE", () => {
    var Abstract = [];
    var Almetrics = [];
    var Acknowledgments = [];
    var Introduction = [];
    var Permisson = [];
    var Footnotes = [];
    var Refrences = [];
    var Result = [];
    var Methods = [];
    var Material = [];
    var Patients = [];
    var Discussion = [];
    var Conclusion = [];
    var Appendix = [];
    var Ethics = [];
    var DataAvailable = [];
    var Funding = [];
    var Authors = [];
    var Conflicts = [];
    var Highlights = [];

    const FundingId = "cypress/downloads/medicine/Funding.csv";
    const AuthorsId = "cypress/downloads/medicine/Authors.csv";
    const ConflictId = "cypress/downloads/medicine/Conflicts.csv";
    const HighlightId = "cypress/downloads/medicine/Highlights.csv";
    const AbstractId = "cypress/downloads/medicine/Abstract.csv";
    const AlmetricsId = "cypress/downloads/medicine/Almetrics.csv";
    const AcknowledgmentsId = "cypress/downloads/medicine/Acknowledgments.csv";
    const IntroductionId = "cypress/downloads/medicine/Introduction.csv";
    const PermissonId = "cypress/downloads/medicine/Permisson.csv";
    const FootnotesId = "cypress/downloads/medicine/Footnotes.csv";
    const RefrencesId = "cypress/downloads/medicine/Refrences.csv";
    const ResultId = "cypress/downloads/medicine/Result.csv";
    const MethodsId = "cypress/downloads/medicine/Methods.csv";
    const MaterialId = "cypress/downloads/medicine/Material.csv";
    const PatientId = "cypress/downloads/medicine/Patients.csv";
    const DiscussionId = "cypress/downloads/medicine/Discussion.csv";
    const ConclusionId = "cypress/downloads/medicine/Conclusion.csv";
    const AppendixId = "cypress/downloads/medicine/Appendix.csv";
    const EthicsId = `cypress/downloads/medicine/Ethics.csv`;
    const DataAvailableId = `cypress/downloads/medicine/DataAvailability.csv`;

    journals.forEach((page) => {
      cy.visit({
        url: `https://medicine.bmj.com${page}`,
        failOnStatusCode: false,
      });

      cy.get("body")
        .find("h2")
        .each(($el) => {
          if ($el.is(":visible") && $el.text() == "Abstract") {
            Abstract.push(page);
          }
          if (
            $el.is(":visible") &&
            $el.text() == "Statistics from Altmetric.com"
          ) {
            Almetrics.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Acknowledgments") {
            Acknowledgments.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Introduction") ||
            $el.text() == "INTRODUCTION"
          ) {
            Introduction.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Request Permissions") {
            Permisson.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Method") ||
            $el.text() == "METHODS" ||
            $el.text() == "Methods" ||
            $el.text() == "Methodology"
          ) {
            Methods.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Materials and methods") ||
            $el.text() == "MATERIALS & METHODS"
          ) {
            Material.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Patients and methods") {
            Material.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Result") ||
            $el.text() == "Results" ||
            $el.text() == "RESULTS"
          ) {
            Result.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Discussion") ||
            $el.text() == "DISCUSSION"
          ) {
            Discussion.push(page);
          }
          if (
            ($el.is(":visible") &&
              $el.text() == "Data availability statement") ||
            $el.text() == "Availability of data and materials"
          ) {
            DataAvailable.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Ethics statements") ||
            $el.text() == "Ethical approval" ||
            $el.text() == "Ethics approval and consent"
          ) {
            Ethics.push(page);
          }
          if ($el.is(":visible") && $el.text() == "References") {
            Refrences.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Footnotes") {
            Footnotes.push(page);
          }
          if (
            ($el.is(":visible") && $el.text() == "Conclusion") ||
            $el.text() == "Conclusions" ||
            $el.text() == "CONCLUSION" ||
            $el.text() == "CONCLUSIONS"
          ) {
            Conclusion.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Appendix") {
            Appendix.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Funding") {
            Funding.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Author contributions") {
            Authors.push(page);
          }
          if (
            ($el.is(":visible") &&
              $el.text() == "Declaration of competing interest") ||
            $el.text() == "Conflicts of interest"
          ) {
            Conflicts.push(page);
          }
          if ($el.is(":visible") && $el.text() == "Highlights") {
            Highlights.push(page);
          }
        });
    });
    cy.writeFile(AbstractId, Abstract);
    cy.writeFile(AlmetricsId, Almetrics);
    cy.writeFile(AcknowledgmentsId, Acknowledgments);
    cy.writeFile(IntroductionId, Introduction);
    cy.writeFile(PermissonId, Permisson);
    cy.writeFile(MethodsId, Methods);
    cy.writeFile(MaterialId, Material);
    cy.writeFile(PatientId, Patients);
    cy.writeFile(ResultId, Result);
    cy.writeFile(DiscussionId, Discussion);
    cy.writeFile(DataAvailableId, DataAvailable);
    cy.writeFile(EthicsId, Ethics);
    cy.writeFile(RefrencesId, Refrences);
    cy.writeFile(FootnotesId, Footnotes);
    cy.writeFile(ConclusionId, Conclusion);
    cy.writeFile(AppendixId, Appendix);
    cy.writeFile(FundingId, Funding);
    cy.writeFile(AuthorsId, Authors);
    cy.writeFile(ConflictId, Conflicts);
    cy.writeFile(HighlightId, Highlights);
  });
  it("FIND IF THE ARTICLE HAVE BOXED TEXT AND SUPPLEMENTRY FILE", () => {
    var KeyTextBox = [];
    var SupplementryFile = [];
    var BodyTextBox = [];
    var FigTabLink = [];
    const KeyTextBoxId = `cypress/downloads/medicine/NoteBox.csv`;
    const BodyTextBoxId = `cypress/downloads/medicine/BodyBox.csv`;
    const SupplemettryId = `cypress/downloads/medicine/SupplementryFile.csv`;
    const FigTabLinkId = `cypress/downloads/medicine/FigureTableLink.csv`;
    journals.forEach((page) => {
      cy.visit({
        url: `https://bmjmedicine.bmj.com${page}`,
        failOnStatusCode: false,
      });
      cy.get("body").then(($body) => {
        if (
          $body.find("#boxed-text-1").length > 0 ||
          $body.find(".boxed-text").length > 0
        ) {
          KeyTextBox.push(page);
        }
        if ($body.find("#boxed-text-2").length > 0) {
          BodyTextBox.push(page);
        }
        if (
          $body.find("#supplementary-materials").length > 0 ||
          $body.find(".supplementary-material").length > 0
        ) {
          SupplementryFile.push(page);
        }
        if (
          $body.find(".table-caption > p > a").length > 0 ||
          $body.find(".fig-caption > p > a").length > 0
        ) {
          FigTabLink.push(page);
        }
      });
    });
    cy.writeFile(KeyTextBoxId, KeyTextBox);
    cy.writeFile(SupplemettryId, SupplementryFile);
    cy.writeFile(BodyTextBoxId, BodyTextBox);
    cy.writeFile(FigTabLinkId, FigTabLink);
  });
});
