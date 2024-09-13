/// <reference types='cypress' />
describe("Sinsay", () => {
  beforeEach(() => {
    cy.visit("https://www.sinsay.com/pl/pl/");
  });

  it("Should successfully log to the website", () => {
    cy.get("#cookiebotDialogOkButton").click();
    cy.get(".ds-icon.outline-account.ds-icon-size__m").click();
    cy.get('input[name="login[username]"]').type("janurban505@gmail.com");
    cy.get('input[name="login[password]"]').type("Abcd123");
    cy.get('[data-selen="login-submit"]').click();
    cy.url().should("include", "/account");
    cy.get(".ds-dropdown-button.account-module__icon > a").should(
      "contain.text",
      "Jan"
    );
  });

  it("Incorrect Login", () => {
    cy.get("#cookiebotDialogOkButton").click();
    cy.get(".ds-icon.outline-account.ds-icon-size__m").click();
    cy.get('input[name="login[username]"]').type("aarjtjsrjotrjoi@gmail.com");
    cy.get('input[name="login[password]"]').type("Abcd12553");
    cy.get('[data-selen="login-submit"]').click();
  });

  it("Incorrect Email address", () => {
    cy.get("#cookiebotDialogOkButton").click();
    cy.get(".ds-icon.outline-account.ds-icon-size__m").click();
    cy.get('input[name="login[username]"]').type("aarjtjsrjotrjoi");
    cy.get('input[name="login[password]"]').type("Abcd12553");
    cy.get('[data-selen="login-submit"]').click();
  });
  it("Product search, adding and removing", () => {
    const product = {
      name: "Koszulka",
      sku: "8470j-00x",
      size: "S",
    };
    cy.request({
      method: "POST",
      url: "https://www.sinsay.com/pl/pl/customer/account/loginPost/",
      form: true,
      body: {
        login: "janurban505@gmail.com",
        password: "Abcd123",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
    cy.get("#cookiebotDialogOkButton").click();
    cy.get(".ds-icon.outline-account.ds-icon-size__m").click();
    cy.get('input[name="login[username]"]').type("janurban505@gmail.com");
    cy.get('input[name="login[password]"]').type("Abcd123");
    cy.get('[data-selen="login-submit"]').click();
    cy.url().should("include", "/account");

    cy.get(".ds-dropdown-button.account-module__icon > a").should(
      "contain.text",
      "Jan"
    );
    it("Ensures the cart is empty", () => {
      cy.visit("https://www.sinsay.com/pl/pl/checkout/cart/");
      cy.get("#cartRoot > section > h1").should("be.visible");
    });

    it("Searches for a product and adds it to the cart", () => {
      cy.visit("https://www.sinsay.com/pl/pl/");
      cy.get("#algoliaButton").type(product.sku, "{enter}");
      cy.get(".AlgoliaProducts-module__algolia-products-container", {
        timeout: 10000,
      }).should("contain", "8470j-00x");

      cy.contains("Koszulka").click();
      cy.get(".ds-button__light > .ds-icon").click();
      cy.get('ul[data-testid="product-size-group"]', { timeout: 10000 })
        .contains(product.size)
        .click();

      cy.get('[data-testid="add-to-cart-button"]').click();

      cy.get('[data-testid="cart-confirmation-go-to-cart"]', {
        timeout: 10000,
      }).click();
    });

    it("Navigates to the cart and removes the product", () => {
      cy.visit("https://www.sinsay.com/pl/pl/");
      cy.get("#algoliaButton").type(product.sku, "{enter}");
      cy.get(".AlgoliaProducts-module__algolia-products-container", {
        timeout: 10000,
      }).should("contain", "8470j-00x");

      cy.contains("Koszulka").click();
      cy.get(".ds-button__light > .ds-icon").click();
      cy.get('ul[data-testid="product-size-group"]', { timeout: 10000 })
        .contains(product.size)
        .click();

      cy.get('[data-testid="add-to-cart-button"]').click();

      cy.get('[data-testid="cart-confirmation-go-to-cart"]', {
        timeout: 10000,
      }).click();
      cy.visit("https://www.sinsay.com/pl/pl/checkout/cart/");

      cy.get(".product-list__RemoveButton-mh8fks-8", {
        timeout: 10000,
      }).click();
      cy.get('[data-selen="empty-cart"]', { timeout: 10000 }).should("exist");
    });
  });
});
