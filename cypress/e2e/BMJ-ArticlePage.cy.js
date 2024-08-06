const pages = [
  "/1/1/e000003",
  "/1/1/e000004",
  "/1/1/e000008",
  "/1/1/e000009",
  "/1/1/e000010",
  "/1/1/e000012",
  "/1/1/e000017",
  "/1/1/e000019",
  "/1/1/e000020",
  "/1/1/e000021",
  "/1/1/e000022",
  "/1/1/e000027",
  "/1/1/e000035",
  "/1/1/e000037",
  "/1/1/e000042",
  "/1/1/e000051",
  "/1/1/e000052",
  "/1/1/e000055",
  "/1/1/e000060",
  "/1/1/e000069",
  "/1/1/e000070",
  "/1/1/e000073",
  "/1/1/e000077",
  "/1/1/e000082",
  "/1/1/e000088",
  "/1/1/e000093",
  "/1/1/e000097",
  "/1/1/e000098",
  "/1/1/e000100",
  "/1/1/e000102",
  "/1/1/e000103",
  "/1/1/e000107",
  "/1/1/e000133",
  "/1/1/e000141",
  "/1/1/e000142",
  "/1/1/e000149",
  "/1/1/e000153",
  "/1/1/e000163",
  "/1/1/e000164",
  "/1/1/e000172",
  "/1/1/e000191",
  "/1/1/e000192",
  "/1/1/e000197",
  "/1/1/e000206",
  "/1/1/e000210",
  "/1/1/e000222",
  "/1/1/e000235",
  "/1/1/e000236",
  "/1/1/e000259",
  "/1/1/e000263",
  "/1/1/e000280",
  "/1/1/e000284",
  "/1/1/e000314",
  "/1/1/e000316",
  "/1/1/e000330",
  "/1/1/e000332",
  "/1/1/e000341",
  "/1/1/e000353",
  "/1/1/e000389",
  "/1/1/e000407",
  "/1/1/e000421",
  "/1/1/e000433",
  "/1/1/e000444",
  "/1/1/e000456",
  "/1/1/e000479",
  "/1/1/e000482",
  "/1/1/e000518",
  "/1/1/e000537",
  "/1/1/e000545",
  "/1/1/e000559",
  "/1/1/e000563",
  "/1/1/e000653",
  "/1/1/e000655",
  "/1/1/e100000",
  "/2/1/e000173",
  "/2/1/e000176",
  "/2/1/e000212",
  "/2/1/e000214",
  "/2/1/e000248",
  "/2/1/e000253",
  "/2/1/e000319",
  "/2/1/e000343",
  "/2/1/e000345",
  "/2/1/e000400",
  "/2/1/e000406",
  "/2/1/e000414",
  "/2/1/e000425",
  "/2/1/e000428",
  "/2/1/e000533",
  "/2/1/e000644",
  "/2/1/e000126",
  "/2/1/e000546",
  "/2/1/e000606",
  "/2/1/e000758",
  "/2/1/e000597",
  "/2/1/e000544",
  "/2/1/e000515",
  "/2/1/e000472",
  "/2/1/e000308",
  "/2/1/e000264",
  "/2/1/e000642",
  "/2/1/e000131",
  "/2/1/e000346",
  "/2/1/e000729",
  "/2/1/e000032",
  "/2/1/e000209",
  "/2/1/e000237",
  "/2/1/e000321",
  "/2/1/e000483",
  "/2/1/e000316corr1",
  "/2/1/e000341corr1",
];
describe("Navigate Through The Articles Pages", () => {
  it("CHECK THE ARTICLE PAGE FIELD", () => {
    var abstract = [];
    var notes = [];
    var boxed = [];
    const absFile = "cypress/downloads/abstract.json";
    const notesFile = "cypress/downloads/notesSection.json";
    const boxedFile = "cypress/downloads/boxedText.json";
    pages.forEach((page) => {
      const domain = "http://localhost:4200/content";
      //   "https://bmjpublichealth.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if (
          $body.find(".boxed-text").length > 0 ||
          $body.find("#boxed-text-2").length > 0
        ) {
          boxed.push(page);
        } else if (
          !$body.find('[data-testid="article-notes-header"]').length > 0 &&
          $body.find("#abstract-1").length > 0
        ) {
          abstract.push(page);
        } else if (
          !$body.find("#abstract-1").length > 0 &&
          $body.find('[data-testid="article-notes-header"]').length > 0
        ) {
          notes.push(page);
        } else {
          cy.log("ARTICLE SUCESS");
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
    cy.writeFile(absFile, abstract);
    cy.writeFile(notesFile, notes);
    cy.writeFile(boxedFile, boxed);
  });

  it("FIND IF THE ARTICLE HAVE THE ABSTRACT", () => {
    var abstract = [];
    const absFile = "cypress/downloads/abstract.json";
    pages.forEach((page) => {
      const domain = "http://localhost:4200/content";
      //   "https://bmjpublichealth.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if ($body.find("#abstract-1").length > 0) {
          //element exists do something
          cy.log("ARTICLE HAVE ABSTRACT");
        } else {
          abstract.push(page);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
    cy.writeFile(absFile, abstract);
  });

  it("FIND IF THE ARTICLE HAVE TEXT IN AUTHOR SECTION", () => {
    var links = [];
    const textFile = "cypress/downloads/authorText.json";
    pages.forEach((page) => {
      const domain = "https://bmjpublichealth.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="author-list-text"]').length > 0) {
          //element exists do something
          cy.log("TEXT IN AUTHORS SECTION");
          links.push(page);
        }
      });
    });
    cy.writeFile(textFile, links);
  });
  it("FIND IF THE ARTICLE HAVE THE NOTES SECTION", () => {
    var article = [];
    const boxedFile = "cypress/downloads/notesSection.json";
    pages.forEach((page) => {
      const domain = "http://localhost:4200/content";
      //   "https://bmjpublichealth.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="article-notes-header"]').length > 0) {
          //element exists do something
          cy.log("NOTES SECTION EXISTED");
        } else {
          article.push(page);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
    cy.writeFile(boxedFile, article);
  });
  it("FIND IF THE ARTICLE HAVE THE MULTIPLE BOXED TEXT", () => {
    var article = [];
    const boxedFile = "cypress/downloads/boxedText.json";
    pages.forEach((page) => {
      const domain = "http://localhost:4200/content";
      //   "https://bmjpublichealth.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("body").then(($body) => {
        if (
          $body.find(".boxed-text").length > 0 ||
          $body.find("#boxed-text-2").length > 0
        ) {
          //element exists do something
          cy.log("BOXED TEXT EXISTED");
          article.push(page);
        }
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
    cy.writeFile(boxedFile, article);
  });
  it("FIND IF THE ARTICLE HAVE ANY BROKEN IMAGES", () => {
    var images = [];
    const imageFile = "cypress/downloads/brokenImage.json";
    pages.forEach((page) => {
      const domain = "https://bmjpublichealth.bmj.com/content";
      cy.visit(`${domain}${page}`);
      cy.get("img").each(($ele) => {
        const imgLinks = $ele.attr("src");
        if (
          imgLinks?.indexOf("http://api-bmj.highwire.org/") > -1 ||
          imgLinks?.startsWith("https://bmjjournals-chicken.bmj.com")
        ) {
          images.push(page);
          cy.log("ARTICLE HAVE BROKEN IMAGES");
        }
        // cy.writeFile(imageFile, images);
      });
      // cy.get("footer").scrollIntoView({ duration: 2000 });
    });
    cy.writeFile(imageFile, images);
  });
});
