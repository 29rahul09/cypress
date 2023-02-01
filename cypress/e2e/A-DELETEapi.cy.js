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
        name: "NEWTON",
        email: "NEWTON@cypress.io",
        gender: "male",
        status: "inactive",
      },
    })
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).has.property("name", "NEWTON");
      })
      .then((res) => {
        cy.log(JSON.stringify(res));
        const userId = res.body.id;
        cy.log(userId);
        cy.request({
          method: "DELETE",
          url: "https://gorest.co.in/public/v2/users/" + userId,
          headers: {
            Authorization:
              "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
          },
        }).then((res) => {
          expect(res.status).to.eq(204);
        });
      });
  });
  // 2ND CASE
});
