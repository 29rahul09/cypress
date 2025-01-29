const exp = require("constants");

describe("Check JSON-LD Schema", () => {
  it("should contain the correct JSON-LD schema for the article", () => {
    cy.fixture("schema.json").then((data) => {
      data.forEach((url) => {
        // Visit the page you want to test
        cy.visit({
          url: `${url}`,
          failOnStatusCode: false,
          auth: {
            username: "BMJStaging",
            password: "bmj2410",
          },
        });
        // Extract the JSON-LD schema from the script tag
        cy.get('script[type="application/ld+json"]').then(($script) => {
          const schema = JSON.parse($script.html());

          // Check that @context and @type are correct
          expect(schema["@context"]).to.equal("https://schema.org");
          expect(schema["@type"]).to.equal("MedicalScholarlyArticle");

          // Check that headline exists and matches expected value
          expect(schema["headline"]).to.be.a("string").that.is.not.empty;

          // Check the article section
          expect(schema["articleSection"]).to.be.not.empty;
          //   expect(schema["articleSection"]).to.be.an("object").that.is.not.empty;
          //   expect(schema["articleSection"])
          //     .to.have.property("articleSeriesTitle")
          //     .that.is.a("string").that.is.not.empty;
          // expect(schema['articleSection']).to.have.property('articleHeading').that.is.a('string').that.is.not.empty;

          // Validate author details (can loop over the authors to check)
          expect(schema["author"]).to.have.length.greaterThan(0);
          schema["author"].forEach((author) => {
            expect(author).to.have.property("name");
            expect(author).to.have.property("affiliation");
            expect(author["affiliation"]).to.be.an("array").that.is.not.empty;
          });

          // Validate abstract content (ensure it's not empty)
          expect(schema["abstract"]).to.be.a("string").that.is.not.empty;

          // Check the published date is in the correct format
          const datePublished = new Date(schema["datePublished"]);
          expect(datePublished.toString()).to.not.equal("Invalid Date");

          // Check the URL is correct
          //   expect(schema["url"]).to.equal(`${url}`);
        });
      });
    });
  });
});
