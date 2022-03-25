/// <reference types="cypress" />

describe("An Adminly user", () => {
	const username = "testsson";
	const password = "test";

	// beforeAll(function () {
	//
	// })

	it("displays a login page", () => {
		// We use the `cy.get()` command to get all elements that match the selector.
		// Then, we use `should` to assert that there are two matched items,
		// which are the two default items.
		// likely want to do this in a support file

		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test on uncaught exception
			console.log("Exception!");
			return false;
		});

		cy.visit("http://localhost/login");
		cy.get("#user").should("have.value", "");
		cy.get("#password").should("have.value", "");
		cy.get("#submit-form").should("have.value", "Log in");
	});

	it("can log in with correct credentials", () => {
		// We use the `cy.get()` command to get all elements that match the selector.
		// Then, we use `should` to assert that there are two matched items,
		// which are the two default items.
		// likely want to do this in a support file

		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test on uncaught exception
			console.log("Exception!");
			return false;
		});

		cy.visit("http://localhost/login");
		cy.get("#user").type(username);
		cy.get("#password").type(password);
		cy.get("#submit-form").click();

		cy.url().should("include", "/apps/");
	});

	it("Logged in user can navigate to Adminly Dashboard", () => {
		// We use the `cy.get()` command to get all elements that match the selector.
		// Then, we use `should` to assert that there are two matched items,
		// which are the two default items.
		// likely want to do this in a support file

		Cypress.on("uncaught:exception", (err, runnable) => {
			// returning false here prevents Cypress from
			// failing the test on uncaught exception
			console.log("Exception!");
			return false;
		});
		cy.visit("http://localhost/login");
		cy.get("#user").type(username);
		cy.get("#password").type(password);
		cy.get("#submit-form").click();

		cy.visit("http://localhost/apps/adminly_dashboard/");
		cy.contains("Hello");
	});
});
