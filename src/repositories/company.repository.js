const axios = require("axios");

async function fetchUsers() {
  const { data } = await axios.get("https://api.github.com/users");
  return data;
}

async function fetchEmployees() {
  const { data: { data } } = await axios.get("http://dummy.restapiexample.com/api/v1/employees");
  return data;
}

module.exports = {
  fetchUsers,
  fetchEmployees,
};
