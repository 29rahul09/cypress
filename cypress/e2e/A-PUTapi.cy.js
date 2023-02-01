describe("Api Automation", () => {
  let randomText = "";
  let testEmail = "";

  it("POST user then PUT that user", () => {
    cy.request({
      method: "POST",
      url: "https://gorest.co.in/public/v2/users/",
      headers: {
        Authorization:
          "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
      },
      body: {
        name: "ABC",
        email: "ABC@cypress.io",
        gender: "female",
        status: "inactive",
      },
    })
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).has.property("name", "ABC");
      })
      .then((res) => {
        cy.log(JSON.stringify(res));
        const userId = res.body.id;
        cy.log(userId);

        cy.request({
          method: "PUT",
          url: "https://gorest.co.in/public/v2/users/" + userId,
          headers: {
            Authorization:
              "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
          },
          body: {
            name: "DEF",
            email: "DEF@cypress.io",
            gender: "male",
            status: "active",
          },
        }).then((res) => {
          cy.log(JSON.stringify(res));
          expect(res.status).to.eq(200);
          expect(res.body).has.property("id", userId);
          expect(res.body).has.property("name", "DEF");
        });
      });
  });
  // 2ND CASE
  it.only("POST user then PUT user then GET user", () => {
    cy.request({
      method: "POST",
      url: "https://gorest.co.in/public/v2/users/",
      headers: {
        Authorization:
          "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
      },
      body: {
        name: "MOHAN",
        email: "MOH@gmail.com",
        gender: "male",
        status: "inactive",
      },
    })
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).has.property("name","MOHAN");
      })
      .then((res) => {
        cy.log(JSON.stringify(res));
        const userId = res.body.id;
        cy.log(userId);

        cy.request({
          method: "PUT",
          url: "https://gorest.co.in/public/v2/users/" + userId,
          headers: {
            Authorization:
              "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
          },
          body: {
            name: "DEF",
            email: "moh@cypress.io",
            gender: "male",
            status: "active",
          },
        })
          .then((res) => {
            cy.log(JSON.stringify(res));
            expect(res.status).to.eq(200);
            expect(res.body).has.property("id", userId);
            expect(res.body).has.property("name", "DEF");
          })
          .then((res) => {
            cy.log(JSON.stringify(res));
            cy.request({
              method: "GET",
              url: "https://gorest.co.in/public/v2/users/" + userId,
              headers: {
                Authorization:
                  "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
              },
            }).then((res) => {
              expect(res.status).to.eq(200);
              expect(res.body).has.property("id", userId);
              expect(res.body).has.property("name", "DEF");
            });
          });
      });
  });
  //
});
