// npx cypress run --headless --browser chrome --spec "cypress/e2e/pageReValidation.cy.js"

import { runGetArchivePages } from "../reValidationArticles/getArchivePage";
import { runGetArticleUrls } from "../reValidationArticles/getArticleUrls";
import { runPageNotFoundTest } from "../reValidationArticles/find404articles";
import { runArticlePageReValidation } from "../reValidationArticles/reValidateArticlePages";

const domain = "https://lupus.bmj.com";
const journal = domain.split("/")[2].split(".")[0];
const browseByYear = [`${domain}/content/by/year/2025`];

runGetArchivePages(journal, browseByYear);
runGetArticleUrls(journal, domain);
runPageNotFoundTest(journal, domain);
runArticlePageReValidation(journal, domain);