// npx cypress run --headless --browser chrome --spec "cypress/e2e/GetArticleUrls.cy.js"

import { runGetArchivePages } from "../functions/getArchivePage";
import { runGetArticleUrls } from "../functions/getArticleUrls";

const browseByYear = ["https://bmjopenquality.bmj.com/content/by/year/2024"];

const journal = "OpenQuality";
const domain = "https://bmjopenquality.bmj.com";

runGetArchivePages(journal, browseByYear);
runGetArticleUrls(journal, domain);
