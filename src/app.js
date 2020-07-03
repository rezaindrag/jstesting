const app = require("express")();

const companyHandler = require("./handlers/company.handler");

app.get("/company", companyHandler.fetchCompanyProfile);

app.listen(7723, function () {
  console.log("Server is running");
});
