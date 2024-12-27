/* eslint-disable no-undef */
describe('modal loads', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeContent').should('be.visible')
  })
})

describe('discord link works', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeNotice a').eq(0).invoke('removeAttr', 'target').click()
    cy.url().then((url) => {
      expect(url).to.include('discord.com')
    })
  })
})

describe('contribute link works', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeNotice a').eq(1).invoke('removeAttr', 'target').click()
    cy.url().then(url  => {
      expect(url).to.include('github.com')
    })
  })
})

describe('preview function works', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    // does the preview button exist?
    cy.get('.welcomeButtons button').eq(0).click()

    // did preview load correctly?
    cy.get('.preview-mode').should('be.visible')

    // go back
    cy.get('.preview-mode button').click()

    // are we back?
    cy.get('.welcomeContent').should('be.visible')
  })
})