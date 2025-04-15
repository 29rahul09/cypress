const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const inputPath = path.join(__dirname, 'output.json');
const specPattern = '**/E2E/**.page.cy.ts';
const skipServe = '--skipServe';

// Read the JSON file with preview URLs
const journalSites = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const entries = Object.entries(journalSites);

const runTests = async () => {
  for (const [site, url] of entries) {
    const e2eProject = `${site}-e2e`;
    const command = `npx nx run ${e2eProject}:e2e --spec=${specPattern} --base-url=${url} ${skipServe}`;

    console.log(`\n🚀 Running tests for: ${site}`);
    console.log(`🔗 Base URL: ${url}`);

    await new Promise((resolve, reject) => {
      const child = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error running tests for ${site}:`, error.message);
        } else {
          console.log(`✅ Finished tests for ${site}`);
        }
        console.log(stdout);
        console.error(stderr);
        resolve(); // Move to the next test
      });

      // Pipe output live to console
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    });
  }

  console.log('\n🎉 All tests finished.');
};

runTests();
