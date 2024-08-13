const journal = "neurologyopen"; // Journal identifier
const domain = "https://neurologyopen-stage-next.bmj.com"; // Base domain for the URLs

describe("Check for broken images", () => {
  const brokenImages = []; // Array to store URLs of broken images

  it("Should not have any broken images on the page", () => {
    // Function to check each image on a given page
    const checkImage = (url) => {
      cy.visit(`${domain}${url}`, { failOnStatusCode: false }); // Visit the page, ignoring status code failures

      // Find all images in the main content area and check their attributes
      cy.get("main")
        .find("img")
        .each(($img) => {
          cy.wrap($img).should("have.attr", "src"); // Ensure the image has a 'src' attribute

          // Check if the image is visible and process it
          cy.wrap($img)
            .should("be.visible")
            .then(($imgElement) => {
              const imgSrc = $imgElement.attr("src"); // Get the image source URL

              // Create a new Image object to check if it loads correctly
              const img = new Image();
              img.src = imgSrc;

              // If the image loads but has no width, consider it broken
              img.onload = () => {
                if (img.naturalWidth === 0) {
                  brokenImages.push(`${url} ==> ${imgSrc}`); // Add broken image to the list
                }
              };

              // If there's an error loading the image, consider it broken
              img.onerror = () => {
                brokenImages.push(`${url} ==> ${imgSrc}`); // Add broken image to the list
              };
            });

          // If any broken images are found, save them to a CSV file
          if (brokenImages.length > 0) {
            const csvContent = "Broken Image URL\n" + brokenImages.join("\n");

            cy.writeFile(
              `cypress/inspection/${journal}/BROKENIMAGE/brokenImage.csv`,
              csvContent
            );
          } else {
            cy.log("No broken images found."); // Log if no broken images are found
          }
        });
    };

    // Load the list of URLs from a fixture file and check each one
    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url) => {
        checkImage(url);
      });
    });
  });
});
