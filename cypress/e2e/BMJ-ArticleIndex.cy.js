const journals = [
  "/content/37/2/e101216",
  "/content/37/2/e101434",
  "/content/37/2/e101347",
  "/content/37/2/e101156",
  "/content/37/2/e101288",
  "/content/37/2/e101225",
  "/content/37/2/e101173",
  "/content/37/2/e101371",
  "/content/37/2/e101325",
  "/content/37/2/e101281",
  "/content/37/2/e101338",
  "/content/37/2/e101301",
  "/content/37/2/e101409",
  "/content/37/2/e101394",
  "/content/37/2/e101183",
  "/content/37/2/e101501",
  "/content/37/2/e101233",
  "/content/37/2/e101262",
  "/content/37/2/e101477",
  "/content/37/2/e101332"
]
describe("Article Page Index", () => {
  it.only("Contains correct Heading", () => {
    journals.forEach((journal) => {
      var Visible = [];
      var Hidden = [];
      const visibleHeading = `cypress/downloads/ARTICLE/GPSYCH/${journal}/Visible.csv`;
      const hiddenHeading = `cypress/downloads/ARTICLE/GPSYCH/${journal}/Hidden.csv`;
      cy.visit({
        url: `https://gpsych.bmj.com${journal}`,
        failOnStatusCode: false,
      });
      cy.get("body")
        .find("h2")
        .each(($el) => {
          if ($el.is(":visible")) {
            Visible.push($el.text());
          } else {
            Hidden.push($el.text());
          }
        });
      cy.writeFile(visibleHeading, Visible);
      cy.writeFile(hiddenHeading, Hidden);
    });
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

  it("FIND IF THE ARTICLE HAVE THE MULTIPLE BOXED TEXT", () => {
    journals.forEach((page) => {
      var article = [];
      const boxedFile = `cypress/downloads/ARTICLE/${page}/Boxed.csv`;
      const domain = "http://localhost:4200/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if (
          $body.find(".boxed-text").length > 0 ||
          $body.find("#boxed-text-2").length > 0 ||
          $body.find('[data-testid="article-notes-content"]').length > 0
        ) {
          //element exists do something
          //   cy.log("BOXED TEXT EXISTED");
          article.push(page);
          cy.writeFile(boxedFile, article);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
  });
  it("FIND IF THE ARTICLE HAVE THE OVERVIEW SECTION", () => {
    journals.forEach((page) => {
      var overview = [];
      const overviewFile = `cypress/downloads/ARTICLE/${page}/Overview.csv`;
      const domain = "http://localhost:4200/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="overview-list"]').length > 0) {
          cy.get('[data-testid="overview-list"]')
            .find("li")
            .each(($ele) => {
              overview.push($ele.text());
            });
          cy.writeFile(overviewFile, overview);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
  });

  it("FIND IF THE ARTICLE HAVE THE ALMETRIC SECTION", () => {
    journals.forEach((page) => {
      var almetric = [];
      const almetricFile = `cypress/downloads/ARTICLE/${page}/almetric.csv`;
      const domain = "http://localhost:4200/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="altmetric-link-container"]').length > 0) {
          cy.get('[data-testid="altmetric-link"]');
          almetric.push("Altmetric");
          cy.writeFile(almetricFile, almetric);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
  });
  it("FIND IF THE ARTICLE HAVE THE DIMENSION SECTION", () => {
    journals.forEach((page) => {
      var dimension = [];
      const dimensionFile = `cypress/downloads/ARTICLE/${page}/dimension.csv`;
      const domain = "http://localhost:4200/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if (
          $body.find('[data-testid="dimensions-link-container"]').length > 0
        ) {
          cy.get('[data-testid="dimensions-link"]');
          dimension.push("Dimensions");
          cy.writeFile(dimensionFile, dimension);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
  });

  it("IF THE ARTICLE HAVE THE CORRECT CITATION META TAGS", () => {
    journals.forEach((page) => {
      var metaTags = [];
      const metaTagsFile = `cypress/downloads/ARTICLE/${page}/metaTags.csv`;
      const domain = "http://localhost:4200/content";
      cy.visit(`${domain}${page}`);

      //   cy.get('head meta[name="citation_public_url"]')
      //   .should("have.attr", "content")
      //   .should("include", "https://bmjpublichealth.bmj.com/");

      cy.get("head")
        .find("meta")
        .each(($meta) => {
          const key = $meta.attr("name");
          const content = $meta.attr("content");

          if (
            key?.startsWith("citation") &&
            content?.startsWith("https://bmjpublichealth.bmj.com/")
          ) {
            metaTags.push(key, content);
            cy.writeFile(metaTagsFile, metaTags);
            // cy.log(key, content);
          }
        });
    });
  });

  it("FIND IF THE TABLE HAVE LINK TEXT", () => {
    journals.forEach((page) => {
      var table = [];
      const tableFile = `cypress/downloads/ARTICLE/${page}/Tab&Fig.csv`;
      const domain = "https://egastroenterology.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        // const Text = $body.find('[data-test-id = "related-article"] > h2').text()
        // if (Text.length > 0) {
        //   //element exists do something
        //     // cy.log(Text);
        //   table.push(page);
        //   cy.writeFile(tableFile, table);
        // }
        if (
          $body.find(".table-caption > p > a").length > 0 ||
          $body.find(".fig-caption > p > a").length > 0
        ) {
          cy.log("Table Exist");
          table.push(page);
          cy.writeFile(tableFile, table);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
  });

  it("FIND IF PERMISSION LINK WORKS", () => {
    journals.forEach((page) => {
      //   var table = [];
      //   const tableFile = `cypress/downloads/ARTICLE/${page}/Linked.csv`;
      const domain = "http://sit-stage-next.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("a:contains(Request reuse permission)").each(($ele) => {
        cy.request({
          url: $ele.attr("href"),
          // failOnStatusCode: false,
        }).then((response) => {
          cy.log(response.status);
          expect(response.status).to.eq(200);
        });
      });

      //   cy.get("body").then(($body) => {
      //     const Text = $body.find('[data-test-id = "request-permissions"]').attr("href")
      //     if (Text) {
      //       //element exists do something
      //         // cy.log(Text);
      //       table.push(page);
      //       cy.writeFile(tableFile, table);
      //     }
      //   });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
      //cy.get('*[class^="this-is-always-the-same"]')
    });
  });
});
