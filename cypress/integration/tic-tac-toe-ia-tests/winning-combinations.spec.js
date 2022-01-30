/// <reference types="Cypress" />

// TODO refactor create dinamic tests from winningCombinations constant
describe('Winning combinations', () => {
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