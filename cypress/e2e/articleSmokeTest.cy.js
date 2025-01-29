// npx cypress run --headless --browser chrome --spec "cypress/e2e/validatePageDetails.cy.js"

import { runFromLastTestedUrl } from "../articleSmokeTest/testArticlePageContent";

const journal = "OpenQuality";
const stageSite = "https://bmjopenquality-stage-next.bmj.com";

runFromLastTestedUrl(journal, stageSite);
