export const validateRapidResponsesTest = (articleUrl,journal) => {
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
    const missingRR = [];
    const noOverview = [];
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="overview-list"]').length > 0) {
        cy.get('[data-testid="overview-list"] a')
          .last()
          .then(($anchor) => {
            const url = $anchor.prop("href");
            const text = $anchor.text();
            if (
              text === "Rapid Responses" &&
              url.includes("rapid-responses")
            ) {
              cy.get("#rapid-responses").click();
              cy.get('[data-testid="compose-rapid-response"] a').each(
                ($anchor) => {
                  const url = $anchor.prop("href");
                  cy.request({
                    url: url,
                    failOnStatusCode: false,
                    timeout: 6000,
                  })
                    .then((response) => {
                      if (response.status !== 200 && response.status !== 401) {
                        missingRR.push(
                          `No Submission Page ==> ${articleUrl} ==> ${url}`
                        );
                      }
                    })
                    .then(() => {
                      if (missingRR.length > 0) {
                        writeUniqueEntriesToFile(
                          `cypress/SmokeTest/${journal}/missingRR.csv`,
                          missingRR
                        );
                      }
                    });
                }
              );
            } else {
              missingRR.push(
                `NO Rapid response in Overview ==> ${articleUrl}`
              );

              writeUniqueEntriesToFile(
                `cypress/SmokeTest/${journal}/missingRR.csv`,
                missingRR
              );
            }
          });
      } else {
        noOverview.push(`NO Overview ==> ${articleUrl}`);

        writeUniqueEntriesToFile(
          `cypress/SmokeTest/${journal}/noOverview.csv`,
          noOverview
        );
      }
    });
  };

  export default validateRapidResponsesTest;