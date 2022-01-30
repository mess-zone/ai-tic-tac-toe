/// <reference types="Cypress" />

describe('Game rules', () => {
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


    })

    it('Should start next round if current round ends', () => {
        const test = {
            xMoves: [ 0, 1, 2 ],
            oMoves: [ 3, 4 ],
        }

        // Should show start round 1 alert
        cy.get('#round-screen')
            .should('have.class', 'screen--show')
            .and('have.class', 'animating')

        cy.get('#round-screen').contains('Round 1/')

        cy.get('#board-screen')
            .should('be.visible')



        for(let i = 0; i < Math.max(test.xMoves.length, test.oMoves.length); i++) {
            if(test.xMoves[i] !== undefined) {
                cy.get(`[data-board-screen__cell=${test.xMoves[i]}]`).click()
            }
            if(test.oMoves[i] !== undefined){
                cy.get(`[data-board-screen__cell=${test.oMoves[i]}]`).click()
            }
        }

        cy.get('#end-round-screen')
            .should('be.visible')

            
        cy.wait(5000);
        
        // Should show start round 2 alert
        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('have.class', 'screen--show')
            .and('have.class', 'animating')

        cy.get('#end-round-screen')
            .should('not.have.class', 'screen--show')
            .should('not.have.class', 'animating')
        
        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')
        
        cy.get('#round-screen').contains('Round 2/')

        // Should show reseted board screen

        cy.get('#round-screen')
            .should('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .should('have.class', 'screen--show')
        
    })

})