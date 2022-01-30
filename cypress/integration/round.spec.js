/// <reference types="Cypress" />

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

describe('Round rules', () => {

    beforeEach(() => {
        cy.visit('/')


        cy.get('[data-start-screen__player1-name]').type(player1.name)
        
        cy.get('[data-start-screen__player2-name]').type(player2.name)

        cy.get('[data-start-screen__form-setup] button').click()

    })

    it('Should show Start Round Screen', () => {
        cy.get('#start-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#round-screen')
            .should('have.class', 'screen--show')
            .and('have.class', 'animating')

        cy.get('#board-screen')
            .should('not.have.class', 'screen--show')

        cy.get('#end-round-screen')
            .should('not.have.class', 'screen--show')
            .should('not.have.class', 'animating')

        cy.get('#end-game-screen')
            .should('not.have.class', 'screen--show')

        
        cy.get('#round-screen').contains('Round 1/')
    })

    it('If the round is not over, players must take turns', ()  => {

        cy.get('#board-screen')
            .should('be.visible')

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

    
    const tests = [
        {
            description: 'Should show End Round Screen if round ends with victory of player 1',
            player1Moves: [ 0, 1, 2 ],
            player2Moves: [ 3, 4 ],
            winnerName: player1.name,
            highlightCombination: [ 0, 1, 2 ],
            score: [
                {
                    name: player1.name,
                    symbol: player1.symbol,
                    points: 1,
                },
                {
                    name: player2.name,
                    symbol: player2.symbol,
                    points: 0,
                },
                {
                    name: 'Draws',
                    points: 0,
                }
            ]
        },
        {
            description: 'Should show End Round Screen if round ends with victory of player 2',
            player1Moves: [ 0, 1, 6 ],
            player2Moves: [ 3, 4, 5 ],
            winnerName: player2.name,
            highlightCombination: [ 3, 4, 5 ],
            score: [
                {
                    name: player1.name,
                    symbol: player1.symbol,
                    points: 0,
                },
                {
                    name: player2.name,
                    symbol: player2.symbol,
                    points: 1,
                },
                {
                    name: 'Draws',
                    points: 0,
                }
            ]
        },
        {
            description: 'Should show End Round Screen if round ends with draw',
            player1Moves: [ 0, 2, 4, 5, 7 ],
            player2Moves: [ 1, 3, 6, 8 ],
            winnerName: 'Draw',
            highlightCombination: null,
            score: [
                {
                    name: player1.name,
                    symbol: player1.symbol,
                    points: 0,
                },
                {
                    name: player2.name,
                    symbol: player2.symbol,
                    points: 0,
                },
                {
                    name: 'Draws',
                    points: 1,
                }
            ]
        },
    ]

    tests.forEach(test => {

        it(test.description, () => {
            cy.get('#board-screen')
                .should('be.visible')
    
            for(let i = 0; i < Math.max(test.player1Moves.length, test.player2Moves.length); i++) {
                if(test.player1Moves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${test.player1Moves[i]}]`).click()
                }
                if(test.player2Moves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${test.player2Moves[i]}]`).click()
                }
            }
    
            // verificar se os highlights estão corretos
            if(test.highlightCombination) {
                cy.get('.board__cell--highlight')
                    .should('have.length', 3)
                    .first()
                    .should('have.attr', 'data-board-screen__cell', test.highlightCombination[0])
                    .next()
                    .should('have.attr', 'data-board-screen__cell', test.highlightCombination[1])
                    .next()
                    .should('have.attr', 'data-board-screen__cell', test.highlightCombination[2])
            } else {
                cy.get('.board__cell--highlight')
                    .should('have.length', 0)
            }
    
            // verificar se scores estão corretos
            cy.get('[data-board-screen__score]')
                .children()
                .first()
                .should('contain.text', 'Round: 1/')
                .next()
                .should('have.text', `${test.score[0].name} (${test.score[0].symbol}): ${test.score[0].points}`)
                .next()
                .should('have.text', `${test.score[1].name} (${test.score[1].symbol}): ${test.score[1].points}`)
                .next()
                .should('have.text', `${test.score[2].name}: ${test.score[2].points}`)
    
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
                .should('contain', test.winnerName)
        })
    });

})