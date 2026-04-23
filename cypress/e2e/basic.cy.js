describe('Basic Features', () => {
    beforeEach(() => {
        // Bypass onboarding and enable features
        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.localStorage.clear();
                win.localStorage.setItem('firstRun', 'true');
                win.localStorage.setItem('stats', 'true');
                win.localStorage.setItem('navbarHover', 'false');
                win.localStorage.setItem('notesEnabled', 'true');
                win.localStorage.setItem('searchBar', 'true');
                win.localStorage.setItem('voiceSearch', 'false');
                win.localStorage.setItem('language', 'en_GB');
                win.localStorage.setItem('theme', 'dark');
                win.localStorage.setItem('widgetStyle', 'new');
                win.localStorage.setItem('showWelcome', 'false');
                win.localStorage.setItem('view', 'true'); // Enable Maximise button
                win.localStorage.setItem('background', 'true'); // Enable Background for Maximise button
                win.localStorage.setItem('photoInformation', 'true'); // Enable Photo Information
                win.localStorage.setItem('backgroundType', 'api'); // Required for backgroundLoader

                win.localStorage.setItem('quoteType', 'custom');
                win.localStorage.setItem('customQuote', 'Test Quote');
                win.localStorage.setItem('customQuoteAuthor', 'Test Author');

                // Seed other widgets
                win.localStorage.setItem('greeting', 'true');
                win.localStorage.setItem('time', 'true');
                win.localStorage.setItem('date', 'true');

                // Seed Quick Links with data so it renders with height
                win.localStorage.setItem('quicklinks', JSON.stringify([
                    { name: "Test Link", url: "https://example.com", key: "1" }
                ]));
                win.localStorage.setItem('quicklinksenabled', 'true');

                win.localStorage.setItem('message', 'true');
                win.localStorage.setItem('messages', '["Test Message"]');

                win.localStorage.setItem('order', JSON.stringify(["greeting", "time", "quicklinks", "quote", "date", "message"]));
            }
        });

        // Mock Background API
        cy.intercept('GET', '**/images/random*', { fixture: 'background.json' }).as('getBackground');
    });

    it('should perform search', () => {
        const searchText = 'Cypress Test Search';
        cy.get('#searchtext').should('exist');
        cy.get('#searchtext').type(searchText);
        cy.get('#searchtext').should('have.value', searchText);
    });

    it('should use Notes feature', () => {
        cy.get('.notes .navbarButton').click();
        const noteText = 'This is a test note';
        cy.get('.notesContainer textarea').should('be.visible');
        cy.get('.notesContainer textarea').clear().type(noteText);
        cy.reload();
        cy.get('.notes .navbarButton').click();
        cy.get('.notesContainer textarea').should('have.value', noteText);
    });

    it('should maximise and unmaximise widgets', () => {
        cy.get('#widgets').should('not.have.css', 'display', 'none');
        cy.get('button[aria-label="Maximise"]').click();
        cy.get('#widgets').should('have.css', 'display', 'none');
        cy.get('button[aria-label="Maximise"]').click();
        cy.get('#widgets').should('not.have.css', 'display', 'none');
    });

    it('should display photo information and background actions', () => {
        cy.wait('@getBackground');
        cy.get('.photoInformation', { timeout: 10000 }).should('exist').and('be.visible');
        cy.get('.photoInformation').trigger('mouseover');

        // Check primary content
        cy.get('.photoInformation .primary-content').should('exist');

        // Check Action Buttons
        cy.get('.photoInformation .buttons').should('exist');
        cy.get('.photoInformation .buttons svg').should('have.length.at.least', 3);

        // Test Favourite Interaction
        cy.get('.photoInformation .buttons > .tooltip').eq(1).click({ force: true });
    });

    it('should display quote link', () => {
        // Reload with offlineMode to ensure we get a guaranteed offline quote
        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.localStorage.clear();
                win.localStorage.setItem('firstRun', 'true');
                win.localStorage.setItem('showWelcome', 'false');
                win.localStorage.setItem('widgetStyle', 'new');
                win.localStorage.setItem('offlineMode', 'true');
                win.localStorage.setItem('order', JSON.stringify(["quote"]));
            }
        });

        cy.get('.quotediv').should('exist');
        cy.get('.quotediv .quote').should('not.be.empty');
        cy.get('.quotediv a').should('exist').and('have.attr', 'href').and('include', 'wikipedia');
    });

    it('should have a refresh button', () => {
        cy.get('button[aria-label="Refresh"]').should('exist').and('be.visible');
    });

    it('should display other dashboard widgets', () => {
        // Verify Greeting
        cy.get('.greeting').should('exist').and('be.visible');

        // Verify Time (Clock)
        // Checks for either generic clock class or clock container
        cy.get('.clock-container').should('exist').and('be.visible');

        // Verify Date
        cy.get('.date').should('exist').and('be.visible');

        // Verify Quick Links
        // Checks for the container
        cy.get('.quicklinkscontainer').should('exist').and('be.visible');
        // Ensure it has content (the link we seeded)
        cy.get('.quicklinkscontainer a').should('have.length.at.least', 1);

        // Verify Message
        cy.get('.message').should('exist').and('be.visible').and('contain', 'Test Message');
    });
});
