describe("Api Automation", () => {
  it("get name of all users", () => {
    cy.request({
      method: "GET",
      url: "https://gorest.co.in/public/v2/users/",
      headers: {
        Authorization:
          "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
      },
    })
      .then((res) => {
        let userInfo = res.body;
        return userInfo;
      })
      .then((userInfo) => {
        for (let i = 0; i < userInfo.length; i++) {
          cy.request({
            method: "GET",
            url: "https://gorest.co.in/public/v2/users/" + userInfo[i].id,
            headers: {
              Authorization:
                "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
            },
          }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property("id", userInfo[i].id);
            expect(res.body).to.have.property("name", userInfo[i].name);
          });
        }
      });
  });
});
