describe('Compare and Filter Routes from JSON Files', () => {
    it('should remove routes from the first JSON file based on patterns in the second JSON file', () => {
      // Load both JSON files from Cypress fixtures
      cy.fixture('routes.json').then((routes) => {
        cy.fixture('routes_to_delete.json').then((routesToDelete) => {
          
          // Extract the patterns from routes_to_delete.json
          const patternsToDelete = routesToDelete.map(route => route.pattern);
          
          // Filter the routes to remove the ones whose pattern exists in 'patternsToDelete'
          const filteredRoutes = routes.filter(route => {
            return !patternsToDelete.includes(route.pattern);
          });
  
          // Output the filtered routes in the console (you can save or return it as needed)
          cy.writeFile('cypress/fixtures/filteredRoutes.json', filteredRoutes);
  
          // Optional: Verify that the filtered routes are correct
          cy.wrap(filteredRoutes).should('not.be.empty');
          
          // Optionally, assert that routes to delete are not in the filteredRoutes
          patternsToDelete.forEach(pattern => {
            cy.wrap(filteredRoutes).should('not.deep.include', { pattern: pattern });
          });
        });
      });
    });
  });
  