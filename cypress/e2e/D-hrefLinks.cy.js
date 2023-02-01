describe("Testing-links-with-cypress", () => {
  //
  it("click all links with loop", () => {
    const pages = ["blog", "about", "contact"];

    cy.visit("/");

    pages.forEach((page) => {
      cy.contains(page).click();
      cy.location("pathname").should("eq", `/${page}`);
      cy.go("back");
    });
  });

  it("use requests to navigation bar links", () => {
    const pages = ["blog", "about", "contact"];

    cy.visit("/");

    pages.forEach((page) => {
      cy.contains(page).then((link) => {
        cy.request(link.prop("href"));
      });
    });
  });

  it("check all links on page", () => {
    cy.visit("/");
    cy.get("a").each((page) => {
      cy.request(page.prop("href"));
    });
  });

  it("check all links to sites", () => {
    cy.visit("/");
    cy.get("a:not([href*='mailto:'])").each((page) => {
      cy.request(page.prop("href"));
    });
  });

  it("get all hrefs and visit them", () => {
    cy.visit("https://www.rydeu.com/");
    var links = [];
    cy.get("a")
      .each(($ele) => {
        links.push($ele.attr("href"));
      })
      .then(() => {
        links.forEach((link) => {
          cy.visit({
            url: `https://www.rydeu.com${link}`,
            failOnStatusCode: false,
          });
          //Add some test here
          // cy.get('selector').should('be.visible').and('have.text', text)
        });
      });

    // var links = [];
    // cy.get("a")
    //   .each(($ele) => {
    //     links.push($ele.attr("href"));
    //   })
    //   .then(() => {
    //     links.forEach((link) => {
    //       cy.request(link, { failOnStatusCode: false }).then((response) => {
    //         expect(response.status).to.eq(200);
    //       });
    //     });
    //   });


    // cy.get("a").each(($a) => {
    //   const message = $a.text();
    //   expect($a, message).to.have.attr("href").not.contain("undefined");
    // });

    // cy.get("a").each((a) => {
    //   cy.get(a).then((page) => {
    //     let link = page.prop("href");
    //     cy.request({ url: link, failOnStatusCode: false }).then((response) => {
    //       cy.log("name:" + link, response.status);
    //       // if (response.statusCode !== 200) {
    //       //   // do what you want with bad link
    //       // }
    //     });
    //   });
    // });

    //     cy.get(".HomeCarouselStyles__topHeader-bcUNXV")
    //   .each(($el,index,$list) => {
    //     const href = $el.find('a').attr('href')
    //     cy.log(href.length)
    // for(var i=0;i<href.length;i++){
    //     cy.visit(`https://www.doubtnut.com${href[i]}`);
    // }
    //})

    // .each(($el, index, $list) => {
    //   cy.wrap($el)
    //     .find("a")
    //     .invoke("attr", "href")
    //     .then((href) => {
    //          cy.request(href)
    //   .its('status')
    //   .should('eq', 200)
    //     });
    // });

    // cy.contains('div', 'Item 2').next().find('a').click()
  });
  //
});
