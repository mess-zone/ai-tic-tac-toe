/// <reference types="Cypress" />

describe('Start Game', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Should show start screen', () => {
        cy.get('#start-screen')
        .and('have.class', 'screen--show')

        cy.get('#round-screen')
            .and('not.have.class', 'screen--show')
            .and('not.have.class', 'animating')

        cy.get('#board-screen')
            .and('not.have.class', 'screen--show')

        cy.get('#end-round-screen')
            .and('not.have.class', 'screen--show')

        cy.get('#end-game-screen')
            .and('not.have.class', 'screen--show')
    })

    context('Set players', () => {
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

            cy.get('#player1-name')
                .type(player1.name)
                .should('have.value', player1.name)
            
            cy.get('#player2-name')
                .type(player2.name)
                .should('have.value', player2.name)
    
            cy.get('#start-button').click()

            cy.get('#board-screen .score')
                .children()
                .first()
                .next()
                .should('contain.text', `${player1.name} (${player1.symbol})`)
                .next()
                .should('contain.text', `${player2.name} (${player2.symbol})`)
        })

        it('Should create 2 players with default names', () => {
            const player1 = {
                name: 'player 1',
                type: 'HUMAN',
                symbol: 'X',
            }
            const player2 = {
                name: 'player 2',
                type: 'HUMAN',
                symbol: 'O',
            }
    
            cy.get('#start-button').click()

            cy.get('#board-screen .score')
                .children()
                .first()
                .next()
                .should('contain.text', `${player1.name} (${player1.symbol})`)
                .next()
                .should('contain.text', `${player2.name} (${player2.symbol})`)
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
            
            cy.get('.player1-container input[type=radio][value=' + player1.type + ']').check()
            
            cy.get('.player2-container input[type=radio][value=' + player2.type + ']').check()

            cy.get('.player1-container :checked').should('be.checked').and('have.value', player1.type)
            cy.get('.player2-container :checked').should('be.checked').and('have.value', player2.type)
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

            cy.get('.player1-container :checked').should('be.checked').and('have.value', player1.type)
            cy.get('.player2-container :checked').should('be.checked').and('have.value', player2.type)
        })

    });

    context('Start game (human x human)', () => {

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


            cy.get('#player1-name').type(player1.name)
            
            cy.get('#player2-name').type(player2.name)
    
            cy.get('#start-button').click()
        })

        it('Should show start round alert', () => {
            cy.get('#start-screen')
                .and('not.have.class', 'screen--show')
    
            cy.get('#round-screen')
                .and('have.class', 'screen--show')
                .and('have.class', 'animating')
    
            cy.get('#board-screen')
                .and('not.have.class', 'screen--show')
    
            cy.get('#end-round-screen')
                .and('not.have.class', 'screen--show')
    
            cy.get('#end-game-screen')
                .and('not.have.class', 'screen--show')

            
            cy.get('#round-screen').contains('Round 1/')
        })

        it('Should show board screen', () => {
            cy.get('#start-screen')
                .and('not.have.class', 'screen--show')
    
            cy.get('#round-screen')
                .and('not.have.class', 'screen--show')
                .and('not.have.class', 'animating')
    
            cy.get('#board-screen')
                .and('have.class', 'screen--show')
    
            cy.get('#end-round-screen')
                .and('not.have.class', 'screen--show')
    
            cy.get('#end-game-screen')
                .and('not.have.class', 'screen--show')

        })

        it('Should show board info', () => {
 
            cy.get('#board-screen')
                .and('have.class', 'screen--show')

            // verificar se o nome do player atual está correto no hint 
            cy.get('#board-screen .hint')
                .should('contain.text', player1.name + ':')
    
            // verificar se scores estão corretos
            cy.get('#board-screen .score')
                .children()
                .first()
                .should('contain.text', 'Round: 1/')
                .next()
                .should('have.text', `${player1.name} (${player1.symbol}): 0`)
                .next()
                .should('have.text', `${player2.name} (${player2.symbol}): 0`)
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

})