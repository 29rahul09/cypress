// npx cypress run --headless --browser chrome --spec "cypress/e2e/validatePageDetails.cy.js"

import { runFromLastTestedUrl } from "../functions/getLastTestedUrl";


const journal = "LUPUS";
const stageSite = "https://lupus-stage-next.bmj.com";

runFromLastTestedUrl(journal, stageSite);
