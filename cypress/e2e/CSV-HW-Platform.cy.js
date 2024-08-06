const journal = "neurologyopen";
const domain = "https://neurologyopen.bmj.com";

describe("Visit and Investigate URLs", () => {
  it(`should visit url and check the response`, () => {
    const results = [{ url: "URL", status: "STATUS" }];
    cy.fixture(`${journal}.json`).then((urls) => {
      // Visit each article page and check for specific sections
      urls.forEach((url) => {
        // cy.visit(`${domain}${url}`, { failOnStatusCode: false });
        cy.request(`${domain}${url}`, { failOnStatusCode: false }).then(
          (response) => {
            // Push URL and status to results array
            results.push({ url: url, status: response.status });

            // Write to CSV file after last URL is processed
            if (results.length === urls.length + 1) {
              const csvContent = results
                .map((result) => `${result.url},${result.status}`)
                .join("\n");
              cy.writeFile(
                `cypress/inspection/${journal}/HW/ArticleResponse.csv`,
                csvContent
              );
            }
          }
        );
      });
    });
  });

  it.only('should visit url and find the Article Headings', () => {
    const results = [];
    
    cy.fixture(`${journal}.json`).then((urls) => {
      const visitUrlAndCollectHeadings = (url, index) => {
        cy.visit(`${domain}${url}`, { failOnStatusCode: false });
        cy.get('body').find('h2').then(($headings) => {
          const headingsText = [];
          
          $headings.each((index, $el) => {
            const headingText = Cypress.$($el).text();
            if (Cypress.$($el).is(':visible') && headingText !== 'Cookies and privacy' && headingText !== 'You are here') {
              headingsText.push(headingText);
            }
          });
  // && (headingText === 'Abstract' || headingText === 'Supplementary Data' || headingText === 'Supplementary materials' || headingText === 'Statistics from Altmetric.com')
          // Sort headings alphabetically
          headingsText.sort();
  
          results.push({ url: url, headings: headingsText.join(' | ') });
  
          // Check if all URLs have been processed
            const csvContent = results
              .map((result) => `${result.url},${result.headings}`)
              .join('\n');
            cy.writeFile(`cypress/inspection/${journal}/HW/ArticleHeadings.csv`, csvContent);
          
        });
      };
  
      urls.forEach((url, index) => {
        visitUrlAndCollectHeadings(url, index);
      });
    });
  });
  
  
  
});
