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


const computer1 = {
    name: 'robot',
    type: 'COMPUTER',
    symbol: 'X',
}

const human1 = {
    name: 'gilmar',
    type: 'HUMAN',
    symbol: 'O',
}

const human2 = {
    name: 'beto',
    type: 'HUMAN',
    symbol: 'X',
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

    // TODO esse teste ainda é necessário? (acho que sim)
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

            // verifica se a board resetou as classes
            cy.get('[data-board-screen__board]')
                .should('not.have.class', 'board--human-turn')
                .should('not.have.class', 'turn--X')
                .should('not.have.class', 'turn--O')
    
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


// computers
context('computer x human', () => {
    beforeEach(() => {
        cy.visit('/')


        cy.get('[data-start-screen__player1-name]').type(computer1.name)
        cy.get('[data-start-screen__player1] input[type=radio][value=' + computer1.type + ']').check()
        // cy.get('[data-start-screen__player1-name]').type(human2.name)
        
        cy.get('[data-start-screen__player2-name]').type(human1.name)

        cy.get('[data-start-screen__form-setup] button').click()

    })

    it('If the player 1 is type computer, his move should have a delay', ()  => {

        cy.get('#board-screen')
            .should('be.visible')

        cy.get('[data-board-screen__board]')
            .should('not.have.class', 'board--human-turn')
            .should('have.class', 'turn--X')

        // verificar se o nome do player atual está correto no hint 
        cy.get('[data-board-screen__hint]')
            .should('contain.text', computer1.name + ':')

        // wait computer move 
        // cy.get('[data-board-screen__board]')
        //     .should('have.class', 'board--human-turn')
        //     .should('have.class', 'turn--O')
        // cy.get('.board__cell--X')
        //     .should('have.length', 1)

        // cy.get('.board__cell--empty')
        //     .first()
        //     .click()
        //     .should('not.have.class', 'board__cell--empty')
        //     .should('have.class', 'board__cell--X')

        // cy.get('[data-board-screen__board]')
        //     .should('have.class', 'board--human-turn')
        //     .should('have.class', 'turn--O')

        // // verificar se o nome do player atual está correto no hint 
        // cy.get('[data-board-screen__hint]')
        //     .should('contain.text', player2.name + ':')

        // cy.get('.board__cell--empty')
        //     .first()
        //     .click()
        //     .should('not.have.class', 'board__cell--empty')
        //     .should('have.class', 'board__cell--O')

        // cy.get('[data-board-screen__board]')
        //     .should('have.class', 'board--human-turn')
        //     .should('have.class', 'turn--X')

        // // verificar se o nome do player atual está correto no hint 
        // cy.get('[data-board-screen__hint]')
        //     .should('contain.text', player1.name + ':')
    
    })


    function movePlayer(xCount, oCount) {
        cy.log(xCount, oCount)

        cy.get('[data-board-screen__board]').invoke('attr', 'class').then($boarClasses => {
            const currentPlayerType = $boarClasses.includes('board--human-turn') ? 'HUMAN' : 'COMPUTER';
            const currentPlayerSymbol = $boarClasses.includes('turn--X') ? 'X' : 'O'
            const isRoundEnded = !$boarClasses.includes('turn--X') && !$boarClasses.includes('turn--O')
            cy.log('isRoundEnded?', isRoundEnded )
            cy.log('currentPlayerSymbol?', currentPlayerSymbol )
            cy.log('currentPlayerType?', currentPlayerType )
            if(!isRoundEnded) {
                if(currentPlayerType === 'HUMAN') {
                    // human move
                    cy.get('.board__cell--empty')
                        .first()
                        .click()
                        .should('not.have.class', 'board__cell--empty')
                        .should('have.class', 'board__cell--' + currentPlayerSymbol).then(function() {
                            if(currentPlayerSymbol === 'X') {
                                ++xCount;
                            } else {
                                ++oCount;
                            }
                            movePlayer(xCount, oCount)
                        })
                        
                } else {
                    // computer  move

                    // const nextPlayerSymbol = currentPlayerSymbol === 'X' ? 'O' : 'X';
                    // wait computer move, checks if a X cell pops up
                    cy.get('[data-board-screen__board]')
                        // .should('have.class', 'board--human-turn')
                        .should('not.have.class', 'turn--'+ currentPlayerSymbol).then(function() {
                            if(currentPlayerSymbol === 'X') {
                                ++xCount;
                            } else {
                                ++oCount;
                            } 
                        })

                    cy.get('.board__cell--' + currentPlayerSymbol)
                        .should('have.length', currentPlayerSymbol === 'X' ? xCount : oCount).then(function() {
                            movePlayer(xCount, oCount)
                        })
                }
            }
        })

    }

    it.skip('If the round is not over, players must take turns', () => {
        cy.get('#board-screen')
            .should('be.visible')

        movePlayer(0,0);
    })

    // TODO o teste tem um coportamento inconsistente
    it.skip('If the round is not over, players must take turns', ()  => {

        cy.get('#board-screen')
            .should('be.visible')

        // verifica se o round acabou
        cy.get('[data-board-screen__board]').invoke('attr', 'class').as('boardClasses')
        // cy.get('[data-board-screen__board]').then(function ($board) {
        //     isRoundEnded = !$board.hasClass('turn--X') && !$board.hasClass('turn--O')
        //     cy.log('isRoundEnded? ', isRoundEnded)
        //     if(isRoundEnded) count = 10;
        //     cy.log('count?', count)
        // })

        cy.log(this.boardClasses)
        let isRoundEnded = false;

        let count = 0;
        let xCount = 0;
        let oCount = 0;

        while(count < 9) {

            if(!isRoundEnded) {
                // computer turn
                cy.get('[data-board-screen__board]')
                    .should('not.have.class', 'board--human-turn')
                    .should('have.class', 'turn--X')
    
                // verificar se o nome do player atual está correto no hint 
                cy.get('[data-board-screen__hint]')
                    .should('contain.text', computer1.name + ':')
    
                // wait computer move, checks if a X cell pops up
                cy.get('[data-board-screen__board]')
                    .should('have.class', 'board--human-turn')
                    // .should('have.class', 'turn--X')
                cy.get('.board__cell--X')
                    .should('have.length', ++xCount)

    
    
                // verifica se o round acabou
                cy.get('[data-board-screen__board]').then(function ($board) {
                    isRoundEnded = !$board.hasClass('turn--X') && !$board.hasClass('turn--O')
                    cy.log('isRoundEnded? ', isRoundEnded)
                    if(isRoundEnded) count = 10;
                    cy.log('count?', count)
                })
            }
            count++;
            cy.log('count', count)

            // cy.pause()

            if(!isRoundEnded) {
                // human turn
                cy.get('[data-board-screen__board]')
                    // .should('have.class', 'board--human-turn')
                    .should('have.class', 'turn--O')
    
                // verificar se o nome do player atual está correto no hint 
                cy.get('[data-board-screen__hint]')
                    .should('contain.text', human1.name + ':')
    
                // human move
                cy.get('.board__cell--empty')
                    .first()
                    .click()
    
                cy.get('.board__cell--O')
                    .should('have.length', ++oCount)

    
    
    
    
                // verifica se o round acabou
                cy.get('[data-board-screen__board]').then(function($board) {
                    isRoundEnded = !$board.hasClass('turn--X') && !$board.hasClass('turn--O')
                    if(isRoundEnded) count = 10;
                    cy.log('count?', count)
                })

            }
            count++;
            cy.log('count', count)
            // cy.pause()

        }


        // cy.get('[data-board-screen__board]')
        //     .should('have.class', 'board--human-turn')
        //     .should('have.class', 'turn--O')

        // // verificar se o nome do player atual está correto no hint 
        // cy.get('[data-board-screen__hint]')
        //     .should('contain.text', player2.name + ':')

        // cy.get('.board__cell--empty')
        //     .first()
        //     .click()
        //     .should('not.have.class', 'board__cell--empty')
        //     .should('have.class', 'board__cell--O')

        // cy.get('[data-board-screen__board]')
        //     .should('have.class', 'board--human-turn')
        //     .should('have.class', 'turn--X')

        // // verificar se o nome do player atual está correto no hint 
        // cy.get('[data-board-screen__hint]')
        //     .should('contain.text', player1.name + ':')
    
    })

    it('In the next round the game does not work!!')
    it('What if a human x computer')
    it('What if a computer x computer')
})