// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-mochawesome-reporter/register";
// Alternatively you can use CommonJS syntax:
// require('./commands')
require("cypress-xpath");

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// beforeEach( function() {
//   window.logCalls = 1;
//   window.testFlow = [];
// });

// Cypress.Commands.overwrite('log', (...args) => {

//   const msg = args[1];

//   Cypress.log({
//     displayName: `--- ${window.logCalls}. ${msg.toUpperCase()} ---`,
//     message: '\n'
//   });

//   window.testFlow.push(`${window.logCalls}. ${msg}`);
//   window.logCalls++;

// });

// Cypress.on('fail', (err) => {
//   err.message += `${'\n\n' + 'Test flow was:\n\n'}${window.testFlow.join('\n')}`;
//   throw err;
// });

import './customCommands/Custom.actions.cy'