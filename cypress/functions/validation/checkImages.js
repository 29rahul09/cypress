export const validateImagesTest = (articleUrl,journal) => {
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
    const brokenImages = [];
    cy.get("main")
      .find("img")
      .each(($img) => {
        const src = $img.attr("src");
        const alt = $img.attr("alt");
        const width = $img.prop("naturalWidth");

        if (width === 0) {
          brokenImages.push(`${articleUrl} ==> ${src} ==> ${alt}`);
        }
      })
      .then(() => {
        if (brokenImages.length > 0) {
          writeUniqueEntriesToFile(
            `cypress/SmokeTest/${journal}/BrokenImage.csv`,
            brokenImages
          );
        }
      });
  };

  export default validateImagesTest;