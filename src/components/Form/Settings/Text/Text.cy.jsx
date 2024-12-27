/* eslint-disable no-undef */
import React from 'react'
import { Text } from './Text'

describe('<Text />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Text />)
  })

  // can init with setting
  it('can init with setting', () => {
    localStorage.setItem('test', 'true')
    cy.mount(<Text name="test" />)
    cy.get('input').should('have.value', 'true')
  })

  // can be changed
  it('can be changed', () => {
    cy.mount(<Text />)
    cy.get('input').type('hello, world!').should('have.value', 'hello, world!')
  })

  // onChange callback works
  it('calls onChange when changed', () => {
    const onChange = cy.stub()
    cy.mount(<Text onChange={onChange} />)
    cy.get('input').type('hello, world!').then(() => {
      expect(onChange).to.be.called()
    })
  })

  // title prop works
  it('displays title', () => {
    cy.mount(<Text title="Hello, world!" />)
    cy.contains('Hello, world!').should('be.visible')
  })

    // textarea prop works
  it('displays textarea', () => {
    cy.mount(<Text textarea={true} />)
    cy.get('textarea').should('be.visible')
  })

  // textarea can be changed
  it('textarea can be changed', () => {
    cy.mount(<Text textarea={true} />)
    cy.get('textarea').type('hello, world!').should('have.value', 'hello, world!')
  })
})