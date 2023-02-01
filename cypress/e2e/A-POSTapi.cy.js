describe("Api Automation", () => {
  let randomText = "";
  let testEmail = "";

  it("POST new user", () => {
    var pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 10; i++) {
      randomText += pattern.charAt(Math.floor(Math.random() * pattern.length));
      testEmail = randomText + "@gmail.com";
    }

    cy.fixture("users").then((data) => {
      cy.request({
        method: "POST",
        url: "https://gorest.co.in/public/v2/users/",
        headers: {
          Authorization:
            "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
        },
        body: {
          name: data.name,
          email: testEmail,
          gender: data.gender,
          status: data.status,
        },
      }).then((res) => {
        cy.log(JSON.stringify(res));
        const userId = res.body.id;
        cy.log(userId);
        expect(res.status).to.eq(201);
        expect(res.body).has.property("name", data.name);
        expect(res.body).has.property("email", testEmail);
        expect(res.body).has.property("gender", data.gender);
        expect(res.body).has.property("status", data.status);
      });
    });
  });

  it.skip("POST user & GET that user", () => {
    var pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 10; i++) {
      randomText += pattern.charAt(Math.floor(Math.random() * pattern.length));
      testEmail = randomText + "@gmail.com";
    }

    cy.fixture("users").then((data) => {
      cy.request({
        method: "POST",
        url: "https://gorest.co.in/public/v2/users/",
        headers: {
          Authorization:
            "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
        },
        body: {
          name: data.name,
          email: testEmail,
          gender: data.gender,
          status: data.status,
        },
      })
        .then((res) => {
          expect(res.status).to.eq(201);
          expect(res.body).has.property("name", data.name);
          expect(res.body).has.property("email", testEmail);
          expect(res.body).has.property("gender", data.gender);
          expect(res.body).has.property("status", data.status);
        })
        .then((res) => {
          cy.log(JSON.stringify(res));
          const userId = res.body.id;
          cy.log(userId);

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
            expect(res.body).has.property("name", data.name);
            expect(res.body).has.property("email", testEmail);
            expect(res.body).has.property("gender", data.gender);
            expect(res.body).has.property("status", data.status);
          });
        });
    });
  });
});
