export const getTableDetails = (articleUrl, journal) => {
  const writeUniqueEntriesToFile = (filePath, entries) => {
    cy.writeFile(filePath, "", { flag: "a+" }).then(() => {
      cy.readFile(filePath, "utf8").then((existingContent) => {
        const existingEntries = existingContent
          ? existingContent.split("\n")
          : [];
        const newEntries = entries.filter(
          (entry) => !existingEntries.includes(entry)
        );
        if (newEntries.length > 0) {
          cy.writeFile(filePath, newEntries.join("\n") + "\n", {
            flag: "a+",
          });
        }
      });
    });
  };

  const noTitle = [];
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="table-title"]').length > 0) {
      cy.get('[data-testid="table-title"]').each(($title) => {
        const title = $title.text();
        if (title === "") {
          noTitle.push(`NO Table Title ==> ${articleUrl}`);
        }
      }).then(() => {
        if (noTitle.length > 0) {
          writeUniqueEntriesToFile(
            `cypress/SmokeTest/${journal}/noTitle.csv`,
            noTitle
          );
        }
      });
    }else{
        cy.log("No Table found on this page.");
    }
  });
};

export default getTableDetails;
