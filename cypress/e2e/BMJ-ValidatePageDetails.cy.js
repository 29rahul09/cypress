// npx cypress run --headless --browser chrome --spec "cypress/e2e/BMJ-ValidatePageDetails.cy.js"

import { runFromLastTestedUrl } from "../functions/getLastTestedUrl";

const journal = "MH";
const stageSite = "https://mentalhealth-stage-next.bmj.com";

runFromLastTestedUrl(journal, stageSite);
