const journal = "neurologyopen";
const domain = "https://neurologyopen.bmj.com";

describe("Investigate Article Page on Stage-site", () => {
  // Function to check the response of a URL
  const results = [{ url: "URL", status: "STATUS" }]; // Array to store URL and response status
  const responseCheck = (url) => {
    cy.request(`${domain}${url}`, { failOnStatusCode: false }).then(
      (response) => {
        results.push({ url: url, status: response.status });
        const csvContent = results
          .map((result) => `${result.url},${result.status}`)
          .join("\n");
        cy.writeFile(
          `cypress/inspection/${journal}/RESPONSE/ArticleResponse.csv`,
          csvContent
        );
      }
    );
  };

  // Function to check Broken and Non-Broken images on a given page
  const brokenImages = []; // Array to store URLs of broken images
  const nonBrokenImages = []; // Array to store URLs of non-broken images

  const checkImage = (url) => {
    cy.visit(`${domain}${url}`, { failOnStatusCode: false });
    cy.get("main")
      .find("img")
      .each(($img) => {
        cy.wrap($img).should("have.attr", "src");

        cy.wrap($img).then(($imgElement) => {
          const imgSrc = $imgElement.attr("src");

          const img = new Image();
          img.src = imgSrc;

          img.onload = () => {
            if (img.naturalWidth === 0) {
              brokenImages.push(`${url} ==> ${imgSrc}`);
            } else {
              nonBrokenImages.push(`${url}`);
            }
          };

          img.onerror = () => {
            brokenImages.push(`${url} ==> ${imgSrc}`);
          };
        });
      })
      .then(() => {
        // Write broken images to a CSV file
        if (brokenImages.length > 0) {
          const brokenCsvContent =
            "Broken Image URL\n" + brokenImages.join("\n");
          cy.writeFile(
            `cypress/inspection/${journal}/BROKENIMAGE/brokenImage.csv`,
            brokenCsvContent
          );
        }

        // Write non-broken images to a CSV file
        if (nonBrokenImages.length > 0) {
          const nonBrokenCsvContent =
            "Non-Broken Image URL\n" + nonBrokenImages.join("\n");
          cy.writeFile(
            `cypress/inspection/${journal}/BROKENIMAGE/nonBrokenImage.csv`,
            nonBrokenCsvContent
          );
        }
      });
  };

  it.skip(`Should check the Article Page response`, () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url) => {
        responseCheck(url);
      });
    });
  });

  it(`Should not have any broken images on the page`, () => {
    cy.fixture(`${journal}.json`).then((urls) => {
      urls.forEach((url) => {
        checkImage(url);
      });
    });
  });
});
