const cheerio = require('cheerio');

describe('Extract Mocha Test Stats from HTML Report', () => {
  it('Parses and logs test summary', () => {
    cy.readFile('mydownloads/mocha-reports/adcsite.html').then((html) => {
      cy.log(html); // Print the entire HTML to Cypress logs for debugging

      const $ = cheerio.load(html);

      const extract = (selector, label) => {
        const li = $(selector);
        if (!li.length) {
          cy.log(`${label}: ❌ NOT FOUND`);
          return 0;
        }

        const text = li.clone().find('i, button').remove().end().text().trim();
        const match = text.match(/\d+/);
        const num = match ? parseInt(match[0], 10) : 0;

        cy.log(`${label}: ${num}`);
        return num;
      };

      const tests = extract('li.quick-summary--tests---2nNut[title="Tests"]', 'Total Tests');
      const passed = extract('li.quick-summary--passes---3IjYH[title="Passed"]', 'Passed');
      const failed = extract('li.quick-summary--failures---14s29[title="Failed"]', 'Failed');
      const skipped = extract('li.quick-summary--pending---261aV[title="Pending"]', 'Skipped');

      cy.log(`📊 Test Summary`);
      cy.log(`✅ Total Tests: ${tests}`);
      cy.log(`✅ Passed: ${passed}`);
      cy.log(`❌ Failed: ${failed}`);
      cy.log(`⏭️ Skipped: ${skipped}`);
    });
  });
});
