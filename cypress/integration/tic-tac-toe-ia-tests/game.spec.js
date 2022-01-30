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

    const tests = [
        {
            name: 'X wins: [ 0, 1, 2 ]',
            xMoves: [ 0, 1, 2 ],
            oMoves: [ 3, 4 ],
            winner: player1.name
        },
        {
            name: 'O wins: [ 3, 4, 5 ]',
            xMoves: [ 0, 6, 1 ],
            oMoves: [ 3, 4, 5 ],
            winner: player2.name
        },
        {
            name: 'X wins: [ 6, 7, 8 ]',
            xMoves: [ 6, 7, 8 ],
            oMoves: [ 3, 4 ],
            winner: player1.name
        },
        {
            name: 'O wins: [ 0, 3, 6 ]',
            xMoves: [ 1, 2, 8 ],
            oMoves: [ 0, 3, 6 ],
            winner: player2.name
        },
        {
            name: 'X wins: [ 1, 4, 7 ]',
            xMoves: [ 1, 4, 7 ],
            oMoves: [ 0, 3 ],
            winner: player1.name
        },
        {
            name: 'O wins: [ 2, 5, 8 ]',
            xMoves: [ 0, 4, 7 ],
            oMoves: [ 2, 5, 8 ],
            winner: player2.name
        },
        {
            name: 'X wins: [ 0, 4, 8 ]',
            xMoves: [ 0, 4, 8 ],
            oMoves: [ 1, 7 ],
            winner: player1.name
        },
        {
            name: 'O wins: [ 2, 4, 6 ]',
            xMoves: [ 0, 5, 8 ],
            oMoves: [ 2, 4, 6 ],
            winner: player2.name
        },
    ]

    beforeEach(() => {
        cy.visit('/')


        cy.get('[data-start-screen__player1-name]').type(player1.name)
        
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()


    })

    it.only('Should start next round if current round ends', () => {
        const test = {
            name: 'X wins: [ 0, 1, 2 ]',
            xMoves: [ 0, 1, 2 ],
            oMoves: [ 3, 4 ],
            winner: player1.name
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

    it('Should show end game screen if current round exceds maxRouds config, and show scores right', () => {
        const rounds = [
            {
                name: 'X wins: [ 0, 1, 2 ]',
                xMoves: [ 0, 1, 2 ],
                oMoves: [ 3, 4 ],
                winner: player1.name
            },
            {
                name: 'X wins: [ 0, 1, 2 ]',
                xMoves: [ 0, 1, 2 ],
                oMoves: [ 3, 4 ],
                winner: player1.name
            }
        ]

        rounds.forEach((round, index) => {
            for(let i = 0; i < Math.max(round.xMoves.length, round.oMoves.length); i++) {
                if(round.xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${round.xMoves[i]}]`).click()
                }
                if(round.oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${round.oMoves[i]}]`).click()
                }
            }
    
            cy.wait(5000);
            
            cy.get('#round-screen').contains(`Round ${index + 2}/`)
        });


    })

    it('Should restart game if user clicks restart')
})