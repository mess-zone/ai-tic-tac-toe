/// <reference types="Cypress" />

describe('Round rules', () => {
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

    beforeEach(() => {
        cy.visit('/')


        cy.get('[data-start-screen__player1-name]').type(player1.name)
        
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()

        cy.get('#board-screen')
            .should('be.visible')
    })

    it('If the round is not over, players must take turns', ()  => {

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--X')

        // verificar se o nome do player atual está correto no hint 
        cy.get('[data-board-screen__hint]')
            .should('contain.text', player1.name + ':')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('not.have.class', 'board__cell--empty')
            .should('have.class', 'board__cell--X')

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--O')

        // verificar se o nome do player atual está correto no hint 
        cy.get('[data-board-screen__hint]')
            .should('contain.text', player2.name + ':')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('not.have.class', 'board__cell--empty')
            .should('have.class', 'board__cell--O')

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--X')

        // verificar se o nome do player atual está correto no hint 
        cy.get('[data-board-screen__hint]')
            .should('contain.text', player1.name + ':')
    
    })

    it('Should show end round screen if round ends with victory of player 1', () => {
        const xMoves = [ 0, 1, 2 ]
        const oMoves = [ 3, 4 ]

        for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
            if(xMoves[i] !== undefined) {
                cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
            }
            if(oMoves[i] !== undefined){
                cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
            }
        }

        cy.get('.board__cell--highlight')
            .should('have.length', 3)
            .first()
            .should('have.attr', 'data-board-screen__cell', xMoves[0])
            .next()
            .should('have.attr', 'data-board-screen__cell', xMoves[1])
            .next()
            .should('have.attr', 'data-board-screen__cell', xMoves[2])

        // verificar se scores estão corretos
        cy.get('[data-board-screen__score]')
            .children()
            .first()
            .should('contain.text', 'Round: 1/')
            .next()
            .should('have.text', `${player1.name} (${player1.symbol}): 1`)
            .next()
            .should('have.text', `${player2.name} (${player2.symbol}): 0`)
            .next()
            .should('have.text', 'Draws: 0')

        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('have.class', 'screen--show')
            .should('have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')

        cy.get('[data-end-round-screen__text]')
            .should('contain', player1.name)
    })

    it('Should show end round screen if round ends with victory of player 2', () => {
        const xMoves = [ 0, 1, 6 ]
        const oMoves = [ 3, 4, 5 ]

        for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
            if(xMoves[i] !== undefined) {
                cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
            }
            if(oMoves[i] !== undefined){
                cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
            }
        }

        cy.get('.board__cell--highlight')
            .should('have.length', 3)
            .first()
            .should('have.attr', 'data-board-screen__cell', oMoves[0])
            .next()
            .should('have.attr', 'data-board-screen__cell', oMoves[1])
            .next()
            .should('have.attr', 'data-board-screen__cell', oMoves[2])

        // verificar se scores estão corretos
        cy.get('[data-board-screen__score]')
            .children()
            .first()
            .should('contain.text', 'Round: 1/')
            .next()
            .should('have.text', `${player1.name} (${player1.symbol}): 0`)
            .next()
            .should('have.text', `${player2.name} (${player2.symbol}): 1`)
            .next()
            .should('have.text', 'Draws: 0')

        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('have.class', 'screen--show')
            .should('have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')

        cy.get('[data-end-round-screen__text]')
            .should('contain', player2.name)
    })

    it('Should show end round screen if round ends with draw', () => {
        const xMoves = [ 0, 2, 4, 5, 7 ]
        const oMoves = [ 1, 3, 6, 8 ]

        for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
            if(xMoves[i] !== undefined) {
                cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
            }
            if(oMoves[i] !== undefined){
                cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
            }
        }

        cy.get('.board__cell--highlight')
            .should('have.length', 0)

        // verificar se scores estão corretos
        cy.get('[data-board-screen__score]')
            .children()
            .first()
            .should('contain.text', 'Round: 1/')
            .next()
            .should('have.text', `${player1.name} (${player1.symbol}): 0`)
            .next()
            .should('have.text', `${player2.name} (${player2.symbol}): 0`)
            .next()
            .should('have.text', 'Draws: 1')

        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('have.class', 'screen--show')
            .should('have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')

        cy.get('[data-end-round-screen__text]')
            .should('contain', 'Draw')
    })

})