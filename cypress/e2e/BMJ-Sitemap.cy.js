/// <reference types="cypress" />

describe('Sitemap Parsing', () => {
    it('Extracts loc elements from XML sitemap and writes to JSON file', () => {
      // npx cypress run --headless --browser chrome --spec "cypress/e2e/BMJ-Sitemap.cy.js"
      const url = 'https://gh.bmj.com/pages/sitemap.xml';
  
      // Fetch the XML sitemap
      cy.request(url).then((response) => {
        // Parse the XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.body, 'application/xml');
  
        // Get all loc elements
        const locElements = xmlDoc.getElementsByTagName('loc');
  
        // Extract the text content of each loc element
        const locArray = Array.from(locElements).map(locElement => locElement.textContent);
  
        // Define the JSON object to be written
        const pageUrl = {
          Url: locArray
        };
  
        // Write the JSON output to a file
        cy.writeFile('cypress/fixtures/sitemap.json', pageUrl);
  
      });
    });
  });
  