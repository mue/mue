/* eslint-disable no-undef */
import React from 'react'
import { Checkbox } from './Checkbox'

describe('<Checkbox />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Checkbox />)
  })

  // checked prop works
  it('can init checked', () => {
    cy.mount(<Checkbox checked={true} />)
    cy.get('span').should('have.attr', 'aria-checked', 'true')
  })
  
  it('can init unchecked', () => {
    cy.mount(<Checkbox checked={false} />)
    cy.get('span').should('have.attr', 'aria-checked', 'false')
  })

  // can init with setting
  it('can init with setting', () => {
    localStorage.setItem('test', 'true')
    cy.mount(<Checkbox name="test" />)
    cy.get('span').should('have.attr', 'aria-checked', 'true')
  })

  // can be changed
  it('can be changed', () => {
    cy.mount(<Checkbox checked={true} />)
    cy.get('span').click().should('have.attr', 'aria-checked', 'false')
    cy.get('span').click().should('have.attr', 'aria-checked', 'true')
  })

  // onChange callback works
  it('calls onChange when clicked', () => {
    const onChange = cy.stub()
    cy.mount(<Checkbox onChange={onChange} />)
    cy.get('span').click().then(() => {
      expect(onChange).to.be.called()
    })
  })

  // disabled prop works


  // text prop works
  it('displays text', () => {
    cy.mount(<Checkbox text="Hello, world!" />)
    cy.contains('Hello, world!').should('be.visible')
  })

  // reminder works (needs stub)

  // reminder works (needs stub)

  // category prop works (needs stub)

  // name prop works
  it('saves to localStorage with name', () => {
    cy.mount(<Checkbox name="test" />)
    cy.get('span').click()
    expect(localStorage.getItem('test')).to.eq('true')
  })

  // stats tracking works (needs stub)
})