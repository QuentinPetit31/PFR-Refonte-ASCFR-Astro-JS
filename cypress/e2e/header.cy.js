describe("Header Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the header and menu button", () => {
    cy.get("header.header").should("exist");
    cy.get(".menu-button").should("be.visible");
  });
});
