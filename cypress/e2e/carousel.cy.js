describe("Carousel Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display carousel title", () => {
    cy.get("#carousel-title").should("contain.text", "Tirage au sort");
  });

  it("should have two images in the carousel", () => {
    cy.get("#carousel img").should("have.length", 2);
  });

  it("should have previous and next buttons", () => {
    cy.get("[data-carousel-prev]").should("exist");
    cy.get("[data-carousel-next]").should("exist");
  });
});
