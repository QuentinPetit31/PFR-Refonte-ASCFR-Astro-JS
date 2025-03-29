Cypress.on("uncaught:exception", (err, runnable) => {
  // ignore les erreurs de script tierce (Firebase, CDN, etc.)
  return false;
});
