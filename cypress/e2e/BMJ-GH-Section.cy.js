describe("global health journals Homepage", () => {
  it("Highlighted Collections Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-1"] > .css-1xghqcx > [data-testid="highlighted_data"] > .css-fgpl1d'
    ).should("have.text", "Highlighted Collections");
    cy.get(
      '[data-testid="homepage-section-1"] > .css-1xghqcx > [data-testid="highlighted_data"] > .css-ba4gqy > .css-1nepntq > .css-s6qgda > .css-aiktfy'
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        cy.get(".highwire-issue-title-wrapper").should("have.text", title);
      });
  });

  it("Press Releases Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-2"] > .css-1xghqcx > [data-testid="collection1_data"] > .css-fgpl1d'
    ).should("have.text", "Press Releases");
    cy.get(
      '[data-testid="homepage-section-2"] > .css-1xghqcx > [data-testid="collection1_data"] > .css-ba4gqy > .css-bgl0b > .css-jrw0ym'
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        cy.get(".highwire-cite-title").should("have.text", title);
      });
  });

  it("Latest Articles Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-2"] > .css-1xghqcx > [data-testid="latestarticles_data"] > .css-fgpl1d'
    ).should("have.text", "Latest Articles");
    cy.get(
      '[data-testid="homepage-section-2"] > .css-1xghqcx > [data-testid="latestarticles_data"] > .css-ba4gqy > .css-bgl0b > .css-jrw0ym'
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        cy.get(".highwire-cite-title").should("have.text", title);
      });
  });

  it("Most Read Articles Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-3"] > .css-1xghqcx > [data-testid="mostread_data"] > .css-3ee0le'
    ).should("have.text", "Most Read Articles");
    cy.get(
      '[data-testid="homepage-section-3"] > .css-1xghqcx > [data-testid="mostread_data"] > .css-16svyhc > .css-jrw0ym '
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        cy.get(".highwire-cite-title").first().should("have.text", title);
      });
  });

  it("COVID-19 Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-3"] > .css-1xghqcx >[data-testid="collection2_data"] > .css-3ee0le'
    ).should("have.text", "COVID-19");
    cy.get(
      '[data-testid="homepage-section-3"] > .css-1xghqcx >[data-testid="collection2_data"] > [data-testid="article-listing"] '
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        cy.get(".highwire-cite-title").first().should("have.text", title);
      });
  });

  it("Blog Posts Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-3"] > .css-1xghqcx >[data-testid="blogs_data"] > .css-3ee0le'
    ).should("have.text", "Blog Posts");
    cy.get(
      '[data-testid="homepage-section-3"] > .css-1xghqcx >[data-testid="blogs_data"] > .css-1appdvk '
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        if (href.startsWith("https://blogs.bmj.com/bmjgh/category")) {
          cy.visit(href);
          cy.get(".page-title > span").should("have.text", title);
        } else {
          cy.visit(href);
          cy.get(".entry-title").should("have.text", title);
        }
      });
  });

  it("Altmetrics Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-4"] > .css-1xghqcx >[data-testid="altmetrics_data"] > .css-fgpl1d'
    ).should("have.text", "Altmetrics");
    cy.get(
      '[data-testid="homepage-section-4"] > .css-1xghqcx >[data-testid="altmetrics_data"] > .css-ba4gqy > .css-17hiyk7 '
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        if (href.startsWith("https://doi.org/")) {
          cy.visit(href);
          cy.get(".highwire-cite-title").first().should("have.text", title);
        } else {
          cy.request(href);
        }
      });
  });

  it("Related Journals Section", () => {
    cy.visit("https://gh.bmj.com/");
    cy.get(
      '[data-testid="homepage-section-5"] > .css-1xghqcx >[data-testid="relatedjournals_data"] > .css-fgpl1d'
    ).should("have.text", "Related Journals");
    cy.get(
      '[data-testid="homepage-section-5"] > .css-1xghqcx >[data-testid="relatedjournals_data"] > .css-ba4gqy > .css-o2wzkl > .css-1r4ev0 '
    )
      .find("a")
      .each((page) => {
        const href = page.prop("href");
        const title = page.text();
        cy.log(title);
        cy.visit(href);
        // if (href.startsWith("https://doi.org/")) {
        //   cy.visit(href);
        //   cy.get(".highwire-cite-title").first().should("have.text", title);
        // } else {
        //   cy.request(href);
        // }
      });
  });

});
