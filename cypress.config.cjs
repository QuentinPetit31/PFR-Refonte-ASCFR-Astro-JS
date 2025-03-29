const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:3000/public",
    supportFile: "cypress/support/e2e.js",
  },
});
