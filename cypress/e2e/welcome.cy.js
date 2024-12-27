/* eslint-disable no-undef */
describe('initial modal open', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeContent').should('be.visible')
  })
})

describe('discord link', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeNotice a').eq(0).invoke('removeAttr', 'target').click()
    cy.url().then((url) => {
      expect(url).to.include('discord.com')
    })
  })
})

describe('contribute link', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeNotice a').eq(1).invoke('removeAttr', 'target').click()
    cy.url().then(url  => {
      expect(url).to.include('github.com')
    })
  })
})

describe('preview function enable/disable', () => {
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

describe('second tab navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()

    // are we on the second tab?
    cy.get('.languageSettings').should('be.visible')
  })
})

describe('change to each language setting and back', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()

    // change to each language setting
    cy.get('.languageSettings span').each(($el, index, $list) => {
      // press the next one
      cy.get('.languageSettings span').eq(index).click()
      // is it checked? state=checked
      cy.get('.languageSettings span').eq(index).should('have.attr', 'state', 'checked')
    })
  })
})

describe('third tab navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    // go to second
    cy.get('.welcomeButtons button').eq(1).click()

    // go to third
    cy.get('.welcomeButtons button').eq(1).click()
  })
})

describe('import settings', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
  })
})

describe('fourth tab navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
  })
})

describe('theme change', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()

  })
})

describe('fifth tab navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
  })
})

describe('style choice', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()

  })
})

describe('sixth tab navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
  })
})

describe('offline mode check', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')

  })
})

describe('privacy policy link', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeNotice a').eq(2).invoke('removeAttr', 'target').click()
    cy.url().then(url  => {
      expect(url).to.include('github.com')
    })
  })
})

describe('source code link', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeNotice a').eq(2).invoke('removeAttr', 'target').click()
    cy.url().then(url  => {
      expect(url).to.include('github.com')
    })
  })
})

describe('final tab navigation', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
  })
})

// describe the changes list

describe('finish button', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(1).click()
    cy.get('.welcomeButtons button').eq(2).click()
  })
})