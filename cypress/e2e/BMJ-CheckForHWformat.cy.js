// npx cypress run --headless --browser chrome --spec "cypress/e2e/pageReValidation.cy.js"

import { runGetArchivePages } from "../reValidationArticles/getArchivePage";
import { runGetArticleUrls } from "../reValidationArticles/getArticleUrls";
import {runHighWireDesignFinder} from "../HelperFunction/findHighWireFormatPages";

const domain = "https://gh.bmj.com/";
const journal = domain.split("/")[2].split(".")[0];
const browseByYear = [`${domain}/content/by/year/2025`];

runGetArchivePages(journal, browseByYear);
runGetArticleUrls(journal, domain);
runHighWireDesignFinder(journal, domain);
