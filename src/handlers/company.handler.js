const companyService = require("../services/company.service");

async function fetchCompanyProfile(req, res) {
  try {
    const companyProfile = await companyService.fetchCompanyProfile();

    res.json(companyProfile);
  } catch (e) {
    errorResponse(e, res);
  }
}

function errorResponse(e, res) {
  res.status(e.response.statusCode).json({ message: e.response.body.message });
}

module.exports = {
  fetchCompanyProfile,
};
