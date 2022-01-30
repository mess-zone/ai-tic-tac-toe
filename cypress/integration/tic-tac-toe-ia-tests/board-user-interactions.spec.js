/// <reference types="Cypress" />

describe('Board user interactions', () => {
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


    it('An empty cell must be clickable if the current player is human', () => {

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('not.have.class', 'board__cell--empty')
    })

    it('An empty cell must not be clickable if the current player is computer')

    it('Every empty cell must be clickable if the current player is human', () => {

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')

        cy.get('[data-board-screen__cell=0]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=1]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=2]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=3]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=4]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=6]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=5]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=8]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

        cy.get('[data-board-screen__cell=7]')
            .should('have.class', 'board__cell--empty')
            .click()
            .should('not.have.class', 'board__cell--empty')

    })

    it('If the current player is human, an empty clicked cell must change to the current player symbol', () => {

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--X')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('have.class', 'board__cell--X')

        cy.get('[data-board-screen__board]')
            .should('have.class', 'board--human-turn')
            .should('have.class', 'turn--O')

        cy.get('.board__cell--empty')
            .first()
            .click()
            .should('have.class', 'board__cell--O')
    })

    it('A filled cell must never be clickable')

    // TODO move to game rules spec
    it('if the round is not over, players must take turns', ()  => {

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
    
    it('Should adapt board responsiveness if user resizes window', () => {

        /**
         * 
         se largura container menor igual que altura container
            board side = largura container
         senão
            board side = altura container
         * 
         */

        // se largura container menor igual que altura container
        cy.viewport(720, 1280)

        cy.get('[data-board-screen__board-container]').invoke('width').then((containerWidth) => {
            cy.get('[data-board-screen__board-container]').invoke('height').then((containerHeight) => {
                const boardSize = (containerWidth <= containerHeight) ? containerWidth : containerHeight;

                cy.get('[data-board-screen__board]')
                    .should('have.css', 'width', boardSize + 'px')
                    .should('have.css', 'height', boardSize + 'px')
            });

        });

        // se largura container igual que altura container
        cy.viewport(490, 700)

        cy.get('[data-board-screen__board-container]').invoke('width').then((containerWidth) => {
            cy.get('[data-board-screen__board-container]').invoke('height').then((containerHeight) => {
                const boardSize = (containerWidth <= containerHeight) ? containerWidth : containerHeight;

                cy.get('[data-board-screen__board]')
                    .should('have.css', 'width', boardSize + 'px')
                    .should('have.css', 'height', boardSize + 'px')
            });

        });

        // se largura container maior que altura container
        cy.viewport(1280, 720)

        cy.get('[data-board-screen__board-container]').invoke('width').then((containerWidth) => {
            cy.get('[data-board-screen__board-container]').invoke('height').then((containerHeight) => {
                const boardSize = (containerWidth <= containerHeight) ? containerWidth : containerHeight;

                cy.get('[data-board-screen__board]')
                    .should('have.css', 'width', boardSize + 'px')
                    .should('have.css', 'height', boardSize + 'px')
            });

        });
    })

})