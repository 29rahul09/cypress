// npx cypress run --headless --browser chrome --spec "cypress/e2e/validatePageDetails.cy.js"

import { runFromLastTestedUrl } from "../functions/getLastTestedUrl";

const journal = "RMD";
const stageSite = "https://rmdopen-stage-next.bmj.com";

runFromLastTestedUrl(journal, stageSite);
