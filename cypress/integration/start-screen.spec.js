/// <reference types="Cypress" />

describe('Start Game', () => {
    it('Set player\'s names and starts new game', () => {
        cy.visit('/')

        cy.get('#start-screen')
            .and('have.class', 'screen--show')

        cy.get('#round-screen')
            .and('not.have.class', 'screen--show')

        cy.get('#player1-name')
            .type('gilmar')
            .should('have.value', 'gilmar')

        cy.get('#player2-name')
            .type('jorge')
            .should('have.value', 'jorge')


        cy.get('#start-button').click()

        cy.get('#start-screen')
            .and('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('have.class', 'screen--show')
            .and('have.class', 'animating')

        cy.get('#round-screen').contains('Round 1/3')
            
        cy.get('#board-screen')
        .and('have.class', 'screen--show')
        
        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        // verificar se o nome do player atual está correto no hint 
        cy.get('#board-screen .hint')
            .should('have.text', 'gilmar: your turn!')

        // verificar se scores estão corretos
        cy.get('#board-screen .score')
            .children()
            .first()
            .should('have.text', 'Round: 1/3')
            .next()
            .should('have.text', 'gilmar (X): 0')
            .next()
            .should('have.text', 'jorge (O): 0')
            .next()
            .should('have.text', 'Draws: 0')

        // verificar se a board está vazia e se é a vez do player 1
        cy.get('#board')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--X')

        cy.get('.board__cell')
            .should('have.class', 'board__cell--empty')
            .should('have.length', 9)
            .first()
            .should('have.attr', 'data-i', 0)
            .next()
            .should('have.attr', 'data-i', 1)
            .next()
            .should('have.attr', 'data-i', 2)
            .next()
            .should('have.attr', 'data-i', 3)
            .next()
            .should('have.attr', 'data-i', 4)
            .next()
            .should('have.attr', 'data-i', 5)
            .next()
            .should('have.attr', 'data-i', 6)
            .next()
            .should('have.attr', 'data-i', 7)
            .next()
            .should('have.attr', 'data-i', 8)

    })
})