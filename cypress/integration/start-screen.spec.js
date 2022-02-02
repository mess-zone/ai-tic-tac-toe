/// <reference types="Cypress" />

describe('Start Screen', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Should show Start Screen', () => {
        cy.get('#start-screen')
            .should('have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('not.have.class', 'screen--show')
            .should('not.have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')
    })

    it('Should create 2 players with user input names', () => {
        const player1 = {
            name: 'gilmar',
            type: 'HUMAN',
            symbol: 'X',
        }
        const player2 = {
            name: 'jorge',
            type: 'HUMAN',
            symbol: 'O',
        }

        cy.get('[data-start-screen__game-mode]').select('HUMAN,HUMAN')

        cy.get('[data-start-screen__player1-name]')
            .type(player1.name)
            .should('have.value', player1.name)
        
        cy.get('[data-start-screen__player2-name]')
            .type(player2.name)
            .should('have.value', player2.name)

        cy.get('[data-start-screen__form-setup] button').click()

        // cy.get('[data-board-screen__score]')
        //     .children()
        //     .first()
        //     .next()
        //     .should('contain.text', `${player1.name} (${player1.symbol})`)
        //     .next()
        //     .should('contain.text', `${player2.name} (${player2.symbol})`)
    })

    it('Should create 2 players with default type', () => {
        const player1 = {
            name: 'gilmar',
            type: 'HUMAN',
            symbol: 'X',
        }
        const player2 = {
            name: 'jorge',
            type: 'HUMAN',
            symbol: 'O',
        }

        cy.get('[data-start-screen__player1] :checked').should('be.checked').and('have.value', player1.type)
        cy.get('[data-start-screen__player2] :checked').should('be.checked').and('have.value', player2.type)

        cy.get('[data-start-screen__form-setup] button').click()
    })

    it('Should create 2 players with type human', () => {
        const player1 = {
            name: 'gilmar',
            type: 'HUMAN',
            symbol: 'X',
        }
        const player2 = {
            name: 'jorge',
            type: 'HUMAN',
            symbol: 'O',
        }

        cy.get('[data-start-screen__game-mode]').select('HUMAN,HUMAN')

        cy.get('[data-start-screen__player1] :checked').should('be.checked').and('have.value', player1.type)
        cy.get('[data-start-screen__player2] :checked').should('be.checked').and('have.value', player2.type)

        cy.get('[data-start-screen__form-setup] button').click()
    })



    it('Should create 1 computer and 1 human player', () => {
        const player1 = {
            name: 'robot',
            type: 'COMPUTER',
            symbol: 'X',
        }
        const player2 = {
            name: 'gilmar',
            type: 'HUMAN',
            symbol: 'O',
        }

        cy.get('[data-start-screen__player1-name]')
            .type(player1.name)
            .should('have.value', player1.name)
        
        cy.get('[data-start-screen__player2-name]')
            .type(player2.name)
            .should('have.value', player2.name)


        cy.get('[data-start-screen__game-mode]').select('COMPUTER,HUMAN')

        cy.get('[data-start-screen__player1] :checked').should('be.checked').and('have.value', player1.type)
        cy.get('[data-start-screen__player2] :checked').should('be.checked').and('have.value', player2.type)
        

        cy.get('[data-start-screen__form-setup] button').click()


    })

    it('Should create 1 human and 1 computer player', () => {
        const player1 = {
            name: 'gilmar',
            type: 'HUMAN',
            symbol: 'X',
        }

        const player2 = {
            name: 'robot',
            type: 'COMPUTER',
            symbol: 'O',
        }


        cy.get('[data-start-screen__player1-name]')
            .type(player1.name)
            .should('have.value', player1.name)
        
        cy.get('[data-start-screen__player2-name]')
            .type(player2.name)
            .should('have.value', player2.name)


        cy.get('[data-start-screen__game-mode]').select('HUMAN,COMPUTER')

        cy.get('[data-start-screen__player1] :checked').should('be.checked').and('have.value', player1.type)
        cy.get('[data-start-screen__player2] :checked').should('be.checked').and('have.value', player2.type)
        

        cy.get('[data-start-screen__form-setup] button').click()


    })

    // it('Should create 2 computer players')

})