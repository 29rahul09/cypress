describe("Api Automation", () => {
  it("get status code", () => {
    cy.request({
      method: "GET",
      url: "https://gorest.co.in/public/v2/users/",
      headers: {
        Authorization: "Bearer 96b7cdaf93ac84a1ca36074b89c7fceccf9e0b75a22d9402613b45803630c9ab",
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("get message", () => {
    cy.request({
      method: "GET",
      url: "https://api.doubtnut.com/v1/payment/web-checkout-details?variant_id=1656468",
    }).then((res) => {
      expect(res.body.meta.message).to.eq("SUCCESS");
    });
  });

  it("get title", () => {
    cy.request({
      method: "GET",
      url: "https://api.doubtnut.com/v1/payment/web-checkout-details?variant_id=1656468",
    }).then((res) => {
      expect(res.body.data.title).to.eq("PAYMENT DETAILS");
    });
  });

  it("get first cart value", () => {
    cy.request({
      method: "GET",
      url: "https://api.doubtnut.com/v1/payment/web-checkout-details?variant_id=1656468",
    }).then((res) => {
      expect(res.body.data.cart_info[1].value).to.eq(999);
    });
  });
});
