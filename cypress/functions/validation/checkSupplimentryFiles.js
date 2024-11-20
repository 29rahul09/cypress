export const validateSupplementaryMaterialsTest = (articleUrl,journal) => {
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
    const missingSupplementary = [];
    const nonSupplementary = [];
    cy.get("body").then(($body) => {
      if ($body.find("#supplementary-materials").length > 0) {
        cy.get('[data-testid="overview-list"] a').then(($anchor) => {
          const urls = [];
          $anchor.each((index, element) => {
            urls.push(element.href);
          });
          if (urls.some((url) => url.includes("supplementary-materials"))) {
            cy.get("#supplementary-materials").click();
            cy.get('[data-testid="supplementary-link-container"] a').each(
              ($anchor) => {
                const url = $anchor.prop("href");
                cy.request({
                  url: url,
                  failOnStatusCode: false,
                  timeout: 6000,
                })
                  .then((response) => {
                    if (response.status !== 200) {
                      missingSupplementary.push(
                        `Error in Supplementary Files ==> ${articleUrl} ==> ${url}`
                      );
                    }
                  })
                  .then(() => {
                    if (missingSupplementary.length > 0) {
                      writeUniqueEntriesToFile(
                        `cypress/SmokeTest/${journal}/missingSupply.csv`,
                        missingSupplementary
                      );
                    }
                  });
              }
            );
          } else {
            missingSupplementary.push(
              `NO Supplementary in Overview ==> ${articleUrl}`
            );

            writeUniqueEntriesToFile(
              `cypress/SmokeTest/${journal}/missingSupply.csv`,
              missingSupplementary
            );
          }
        });
      } else {
        nonSupplementary.push(`NO Supplementary Files ==> ${articleUrl}`);

        writeUniqueEntriesToFile(
          `cypress/SmokeTest/${journal}/NonSupplymentary.csv`,
          nonSupplementary
        );
      }
    });
  };

  export default validateSupplementaryMaterialsTest;