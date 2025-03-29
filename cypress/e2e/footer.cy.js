describe("Footer Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display Arsenal image in footer section", () => {
    cy.get(".img-top-footer img").should("have.attr", "alt", "Arsenal");
  });

  it("should have a footer element", () => {
    cy.get("footer.footer").should("exist");
  });
});
