describe("Authentication", () => {
  it("connecte un administrateur avec des identifiants valides", () => {
    cy.visit("/login");;

    cy.get('input[type="email"]')
      .clear()
      .type("admin@examhub.local");

    cy.get('input[type="password"]')
      .clear()
      .type("Admin123!");

    cy.contains("button", "Se connecter").click();

    cy.url().should("include", "/admin");
    cy.contains("Tableau de bord").should("be.visible");
  });
  it("connecte un étudiant avec des identifiants valides", () => {
  cy.visit("http://localhost:5173/login");

  cy.get('input[type="email"]')
    .clear()
    .type("alice@examhub.local");

  cy.get('input[type="password"]')
    .clear()
    .type("Student123!");

  cy.contains("button", "Se connecter").click();

  cy.url().should("include", "/student");
  cy.contains("Examens disponibles").should("be.visible");
});

});