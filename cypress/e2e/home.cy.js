describe("Page d'accueil ASCFR", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Vérifie le header", () => {
    cy.get("header.header").should("exist");
    cy.get(".menu-button").should("be.visible");
  });

  it("Vérifie le bloc Prochain Match", () => {
    cy.get("#prochain-match img").should("have.length", 2);
    cy.get('img[alt="Logo Arsenal"]').should("exist");
    cy.get('img[alt="Logo Tottenham"]').should("exist");
    cy.get("#prochain-match").contains("vs");
    cy.contains("voir calendrier").should("have.attr", "href");
  });

  it("Vérifie les titres des sections", () => {
    cy.contains("Actualités").should("exist");
    cy.get("#carousel-title").should("contain.text", "Tirage au sort");
    cy.contains("Reservation 2024/25").should("exist");
    cy.contains("Inscription 2024/25").should("exist");
  });

  it("Vérifie le carrousel", () => {
    cy.get("#carousel").should("exist");
    cy.get("#carousel img").should("have.length.at.least", 1);
    cy.get("[data-carousel-prev]").should("exist");
    cy.get("[data-carousel-next]").should("exist");
  });

  it("Vérifie la section Réservation", () => {
    cy.get("img.img-arrondie")
      .should("have.attr", "src")
      .and("include", "Emirates_Stadium");
  });

  it("Vérifie la section Inscription", () => {
    cy.contains("Rejoins l'équipe ici").should("have.attr", "href");
  });

  it("Vérifie l'image dans le footer", () => {
    cy.get(".img-top-footer img")
      .should("have.attr", "alt", "Arsenal")
      .and("be.visible");
  });

  it("Vérifie que le footer existe", () => {
    cy.get("footer.footer").should("exist");
  });
});
