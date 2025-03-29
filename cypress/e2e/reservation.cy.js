describe("Réservation Section", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display reservation title and image", () => {
    cy.contains("Reservation 2024/25").should("exist");
    cy.get("img.img-arrondie")
      .should("have.attr", "src")
      .and("include", "Emirates_Stadium");
  });
});
