describe('Assertions Demo', () => {

    it('Implicit Assertions Demo', () => {

        //   cy.visit('https://www.doubtnut.com')
        //   cy.get('.HeaderHomeStyled__SearchBar-IsDmE').click()
        //   cy.get('textarea').type('force')
        //   cy.get('.HeaderHomeStyled__QTypePaneBottom-icWTAd > :nth-child(4) > .HeaderHomeStyled__QTypeBottomImg-ivuiOD').click()

        cy.visit('https://www.doubtnut.com')
        cy.get(".HomeCarouselStyles__topHeader-bcUNXV")
            .find('a')
            .eq(0)
            .should('have.attr', 'href')
            .should('not.be.empty')
            .and('contain', '/')
            .then(href => {
                cy.visit(`https://www.doubtnut.com${href}`);
            });

        // cy.get("div")
        //     .find('a')
        //     .eq(0)
        //     .invoke("attr", "href")
        //     .then(href => {
        //         cy.visit(`https://www.doubtnut.com${href}`);
        //     });

        // cy.contains('div', 'Item 2').next().find('a').click()

        // cy.get('Selector for the anchor tag')      // sets <a> as the subject
        //     .should('have.attr', 'href')             // changes subject to href attribute
        //     .should('not.be.empty')                  // now test the href
        //     .and('contain', 'foo');                  // also test another criteria here

    });

    it('Explicit Assertions Demo', () => {

        cy.visit('https://www.doubtnut.com')
        cy.get(".HomeCarouselStyles__topHeader-bcUNXV")
        .find('.HomeCarouselStyles__Title-fEDioy')
        .eq(0)
        .invoke('text')
        .then((text) => {
            expect(text.trim()).equal('NCERT')
        })
    });


})