// npx cypress run --headless --browser chrome --spec "cypress/e2e/BMJ-GetArticleUrls.cy.js"

import { runGetArchivePages } from "../functions/getArchivePage";
import { runGetArticleUrls } from "../functions/getArticleUrls";

const browseByYear = ["https://mentalhealth.bmj.com/content/by/year/2023"];

const journal = "MH";
const domain = "https://mentalhealth.bmj.com/";

runGetArchivePages(journal, browseByYear);
runGetArticleUrls(journal, domain);
