// npx cypress run --headless --browser chrome --spec "cypress/e2e/GetArticleUrls.cy.js"

import { runGetArchivePages } from "../functions/getArchivePage";
import { runGetArticleUrls } from "../functions/getArticleUrls";

const browseByYear = ["https://bmjpublichealth.bmj.com/content/by/year/2025"];

const journal = "BMJPH";
const domain = "https://bmjpublichealth.bmj.com/";

runGetArchivePages(journal, browseByYear);
runGetArticleUrls(journal, domain);
