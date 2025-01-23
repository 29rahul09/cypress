// npx cypress run --headless --browser chrome --spec "cypress/e2e/migratedTocPages.cy.js"

const journalUrl = "https://bmjpublichealth.bmj.com";
const journalName = "BMJPH";
const filePath = `cypress/downloads/${journalName}/articleHrefs.csv`;

describe("Article Urls Collection", () => {
  const writeUniqueEntriesToFile = (filePath, entries) => {
    cy.task("fileExists", filePath).then((fileExists) => {
      if (fileExists) {
        cy.readFile(filePath, "utf8", { timeout: 5000 }).then(
          (existingContent = "") => {
            const existingEntries = existingContent.split("\n").filter(Boolean);
            const newEntries = entries.filter(
              (entry) => !existingEntries.includes(entry.href)
            );

            if (newEntries.length > 0) {
              const formattedEntries = newEntries
                .map((entry) => entry.href)
                .join("\n");

              cy.writeFile(filePath, formattedEntries + "\n", { flag: "a+" });
            }
          }
        );
      } else {
        const formattedEntries = entries.map((entry) => entry.href).join("\n");
        cy.writeFile(filePath, formattedEntries + "\n");
      }
    });
  };

  const getAllCategoryHrefs = () => {
    const categoryHrefs = [];

    cy.get('[data-testid="category-list-container"] li')
      .each((categoryItem, index) => {
        let categoryName = categoryItem.text().trim();
        categoryName = categoryName.replace(
          /(\w+)\s(\w+)/,
          (match, p1, p2) => `${p1} ${p2.charAt(0).toLowerCase() + p2.slice(1)}`
        );

        cy.get(`[data-testid="${categoryName}-item-${index}"] a`).each(
          (link) => {
            const href = link.prop("href");
            if (href) {
              categoryHrefs.push({ href: href });
            }
          }
        );
      })
      .then(() => {
        if (categoryHrefs.length > 0) {
          writeUniqueEntriesToFile(filePath, categoryHrefs);
        }
      });
  };

  const checkPreviousIssues = () => {
    cy.reload();
    cy.url().then((url) => {
      // Check if the URL contains /content/1/1
      if (url.includes("/content/1/1")) {
        getAllCategoryHrefs();
      } else {
        // Wait for the link to appear directly
        cy.contains("a", "Prev issue", { timeout: 15000 }).then(($link) => {
          if ($link.length > 0) {
            const href = $link.attr("href");
            cy.visit(`${journalUrl}${href}`);
            getAllCategoryHrefs();
            checkPreviousIssues(); // Recursive call
          } else {
            cy.log("Prev issue link not found in the DOM");
          }
        });
      }
    });
  };

  it("Visit Issue And Volume Page", () => {
    cy.visit(`${journalUrl}/content/current`);
    getAllCategoryHrefs();
    checkPreviousIssues();
  });
});
