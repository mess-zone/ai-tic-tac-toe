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

    it('Should show end round screen if round ends with victory', () => {
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

    it('Should highlight winning combination', () => {
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

        cy.get(`[data-board-screen__cell=${xMoves[0]}]`)
            .should('have.class', 'board__cell--highlight')
        cy.get(`[data-board-screen__cell=${xMoves[1]}]`)
            .should('have.class', 'board__cell--highlight')
        cy.get(`[data-board-screen__cell=${xMoves[2]}]`)
            .should('have.class', 'board__cell--highlight')

    })

    it('Should start next round if current round ends')
    it('Should update scores every time the round ends')
    it('Should not start next round (show end game) if current round exceds maxRouds config, and show scores')
    it('Should restart game if user clicks restart')

    // refactor create dinamic tests from winningCombinations constant
    context('Winning combinations', () => {
        it('[ 0, 1, 2 ]', () => {
    
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
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player1.name)
        })
    
        it('[ 3, 4, 5 ]', () => {
    
            const xMoves = [ 0, 6, 1 ]
            const oMoves = [ 3, 4, 5 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player2.name)
        })
    
        it('[ 6, 7, 8 ]', () => {
    
            const xMoves = [ 6, 7, 8 ]
            const oMoves = [ 3, 4 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player1.name)
        })
    
        it('[ 0, 3, 6 ]', () => {
    
            const xMoves = [ 1, 2, 8 ]
            const oMoves = [ 0, 3, 6 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player2.name)
        })
    
        it('[ 1, 4, 7 ]', () => {
    
            const xMoves = [ 1, 4, 7 ]
            const oMoves = [ 0, 3 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player1.name)
        })
    
        it('[ 2, 5, 8 ]', () => {
    
            const xMoves = [ 0, 4, 7 ]
            const oMoves = [ 2, 5, 8 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player2.name)
        })
    
        it('[ 0, 4, 8 ]', () => {
    
            const xMoves = [ 0, 4, 8 ]
            const oMoves = [ 1, 7 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player1.name)
        })
    
        it('[ 2, 4, 6 ]', () => {
    
            const xMoves = [ 0, 5, 8 ]
            const oMoves = [ 2, 4, 6 ]
    
            for(let i = 0; i < Math.max(xMoves.length, oMoves.length); i++) {
                if(xMoves[i] !== undefined) {
                    cy.get(`[data-board-screen__cell=${xMoves[i]}]`).click()
                }
                if(oMoves[i] !== undefined){
                    cy.get(`[data-board-screen__cell=${oMoves[i]}]`).click()
                }
            }
    
            cy.get('#end-round-screen')
                .should('be.visible')
    
            cy.get('[data-end-round-screen__text]')
                .should('contain', player2.name)
        })
    })

})