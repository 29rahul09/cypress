export const validateRapidResponsesTest = (articleUrl, journal) => {
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
  const missingResponses = [];
  const noRapidResponses = [];

  cy.get("body").then(($body) => {
    const bodyResponses = $body.find("#rapid-responses").length > 0;
    if ($body.find('[data-testid="overview"]').length > 0) {
      cy.get('[data-testid="overview-list"] a').then(($anchor) => {
        const urls = [];
        $anchor.each((index, element) => {
          urls.push(element.href);
        });
        const overviewResponses = urls.some((url) =>
          url.includes("rapid-responses")
        );
        if (overviewResponses && bodyResponses) {
          cy.get("#rapid-responses").click();
          cy.get('[data-testid="compose-rapid-response"] > .flex').should(
            "be.visible"
          );
          // cy.get('[data-testid="compose-rapid-response"] a').each(($anchor) => {
          //   const url = $anchor.prop("href");
          //   cy.request({
          //     url: url,
          //     failOnStatusCode: false,
          //     timeout: 6000,
          //   })
          //     .then((response) => {
          //       if (response.status !== 200) {
          //         missingResponses.push(
          //           `Error in Responses Files ==> /content${articleUrl} ==> ${url}`
          //         );
          //       }
          //     })
          //     .then(() => {
          //       if (missingResponses.length > 0) {
          //         writeUniqueEntriesToFile(
          //           `cypress/SmokeTest/${journal}/missingResponses.csv`,
          //           missingResponses
          //         );
          //       }
          //     });
          // });
        } else if (overviewResponses && !bodyResponses) {
          missingResponses.push(`NO Responses in Body ==> /content${articleUrl}`);

          writeUniqueEntriesToFile(
            `cypress/SmokeTest/${journal}/missingResponses.csv`,
            missingResponses
          );
        } else if (!overviewResponses && bodyResponses) {
          missingResponses.push(`NO Responses in Overview ==> /content${articleUrl}`);

          writeUniqueEntriesToFile(
            `cypress/SmokeTest/${journal}/missingResponses.csv`,
            missingResponses
          );
        } else {
          nonResponses.push(`NO Responses Files ==> /content${articleUrl}`);

          writeUniqueEntriesToFile(
            `cypress/SmokeTest/${journal}/NoResponses.csv`,
            noRapidResponses
          );
        }
      });
    }
  });
};

export default validateRapidResponsesTest;
