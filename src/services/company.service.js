const companyRepository = require("../repositories/company.repository");

async function fetchCompanyProfile() {
  const users = await companyRepository.fetchUsers();
  const employees = await companyRepository.fetchEmployees();

  const companyUsers = [];
  for (let user of users) {
    companyUsers.push({
      id: user.id,
      name: user.login,
    });
  }

  const companyEmployees = [];
  for (let employee of employees) {
    companyEmployees.push({
      id: parseInt(employee.id),
      name: employee.employee_name,
    });
  }

  return {
    companyName: "Facebook Inc",
    companyUsers,
    companyEmployees,
  };
}

module.exports = {
  fetchCompanyProfile,
};
