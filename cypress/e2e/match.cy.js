describe("Prochain Match", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display logos for Arsenal and Tottenham", () => {
    cy.get("#prochain-match img").should("have.length", 2);
    cy.get('img[alt="Logo Arsenal"]')
      .should("have.attr", "src")
      .and("include", "42.png");
    cy.get('img[alt="Logo Tottenham"]')
      .should("have.attr", "src")
      .and("include", "47.png");
  });

  it("should contain vs text between logos", () => {
    cy.get("#prochain-match").contains("vs");
  });

  it("should have calendar link visible", () => {
    cy.contains("voir calendrier").should("have.attr", "href");
  });
});
