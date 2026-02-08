describe('Welcome Modal Flow', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('should complete the full onboarding flow', () => {
        // Step 1: Intro
        cy.contains('Welcome to Mue Tab', { timeout: 10000 }).should('be.visible');
        cy.contains('Next').click();

        // Step 2: Language
        cy.contains('Choose your language').should('be.visible');
        cy.contains('Next').click();

        // Step 3: Import Settings
        cy.get('.upload').should('be.visible');
        cy.contains('Next').click();

        // Step 4: Theme
        cy.contains('Select a theme').should('be.visible');
        cy.contains('Dark').click();
        cy.get('body').should('have.class', 'dark');

        cy.contains('Light').click();
        cy.get('body').should('not.have.class', 'dark');

        cy.contains('Auto').click();
        cy.contains('Dark').click();
        cy.contains('Next').click();

        // Step 5: Style
        cy.contains('Choose a style').should('be.visible');
        cy.contains('Modern').click();
        cy.contains('Next').click();

        // Step 6: Privacy
        cy.contains('Privacy Options').should('be.visible');
        cy.contains('Next').click();

        // Step 7: Final
        cy.contains('Final step').should('be.visible');
        cy.contains('Finish').click();

        // Verify Dashboard
        cy.get('.greeting').should('be.visible');
    });
});
