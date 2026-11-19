import './commands.js';

// Cypress injects a script into every page it loads. Folio renders the whole document on the
// server, so React sees that script as a hydration mismatch (React error #418), rebuilds the
// page in the browser and reports the error. The page works, so ignore only this error.
// Every other uncaught application error still fails the test.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error #418')) {
    return false;
  }
});

Cypress.on('window:before:load', (win) => {
  delete Object.getPrototypeOf(win.navigator).serviceWorker;
});
