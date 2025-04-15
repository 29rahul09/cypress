const path = require('path');

describe('Move HTML and JSON reports from multiple folders', () => {
  const artifactsDir = path.join(__dirname, '../../artifacts'); // Path to artifacts folder
  const htmlReportDir = path.join(__dirname, '../../mydownloads/mocha-reports'); // Path to html-report folder
  const jsonReportDir = path.join(__dirname, '../../mydownloads/preview-url'); // Path to json-report folder

  // Ensure that the target directories exist before the test
  before(() => {
    // Check if the directories exist, if not create them
    cy.task("fileExists", htmlReportDir).then((exists) => {
      if (!exists) {
        cy.task('createFolder', htmlReportDir);
      }
    });

    cy.task("fileExists", jsonReportDir).then((exists) => {
      if (!exists) {
        cy.task('createFolder', jsonReportDir);
      }
    });

    // Iterate through all the folders inside the 'artifacts' directory
    cy.task('readDir', artifactsDir).then((folders) => {
      folders.forEach((folder) => {
        const folderPath = path.join(artifactsDir, folder);

        // Check if it's a directory and process the files inside
        cy.task('isDirectory', folderPath).then((isDir) => {
          if (isDir) {
            const htmlFilePath = path.join(folderPath, 'merged.html');
            const jsonFilePath = path.join(folderPath, 'preview-url.json');

            // Only move files if they exist in the folder
            cy.task('fileExists', htmlFilePath).then((exists) => {
              if (exists) {
                const htmlDestination = path.join(htmlReportDir, `${folder.split('-')[0]}.html`);
                cy.task('moveFile', { source: htmlFilePath, destination: htmlDestination });
              }
            });

            cy.task('fileExists', jsonFilePath).then((exists) => {
              if (exists) {
                const jsonDestination = path.join(jsonReportDir, `${folder.split('-')[0]}.json`);
                cy.task('moveFile', { source: jsonFilePath, destination: jsonDestination });
              }
            });
          }
        });
      });
    });
  });

  it('Should move HTML and JSON files from all folders to respective locations', () => {
    // After moving, assert that each file exists in its respective directory
    cy.task('readDir', htmlReportDir).then((files) => {
      files.forEach((file) => {
        if (file.endsWith('.html')) {
          cy.readFile(path.join(htmlReportDir, file)).should('exist');
        }
      });
    });

    cy.task('readDir', jsonReportDir).then((files) => {
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          cy.readFile(path.join(jsonReportDir, file)).should('exist');
        }
      });
    });
  });
});
