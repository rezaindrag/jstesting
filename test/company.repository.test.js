const expect = require("chai").expect;
const nock = require("nock");

const companyRepository = require("../src/repositories/company.repository");
const usersMock = require("./mocks/users");
const employeesMock = require("./mocks/employees");

describe("test company repository", function () {
  after(function() {
    nock.restore();
  });

  afterEach(function() {
    nock.cleanAll();
  });

  // Test repository in the wrong way.
  /*describe("test fetch users", function () {
    it("should succeed", async function () {
      const users = await companyRepository.fetchUsers();

      expect(users).to.not.be.empty;
    });
  });*/

  // Test repository in the correct way.
  describe("test fetch users", function () {
    it("should succeed", async function () {
      const usersScope = nock("https://api.github.com")
        .get("/users")
        .reply(200, usersMock, { 'Content-Type': 'application/json' });

      const users = await companyRepository.fetchUsers();

      expect(users).to.have.lengthOf(2);
      expect(users).to.deep.equal(usersMock);
      expect(users[0].login).to.equal("mojombo");

      // Will throw an assertion error if meanwhile a "https://api.github.com" was
      // not performed. (https://github.com/nock/nock#expectations)
      usersScope.done();
    });

    it("should be error", async function () {
      const usersScope = nock("https://api.github.com")
        .get("/users")
        .reply(500, { message: "internal server error" }, { 'Content-Type': 'application/json' });

      try {
        await companyRepository.fetchUsers();
      } catch (e) {
        expect(e.response.status).to.equal(500);
        expect(e.response.data.message).to.equal("internal server error");
      }

      usersScope.done();
    });
  });

  describe("test fetch employees", function () {
    it("should succeed", async function () {
      const employeesScope = nock("http://dummy.restapiexample.com/api/v1")
        .get("/employees")
        .reply(200, employeesMock, { 'Content-Type': 'application/json' });

      const employees = await companyRepository.fetchEmployees();

      expect(employees).to.have.lengthOf(2);
      expect(employees).to.deep.equal(employeesMock.data);
      expect(employees[0].employee_name).to.equal("Tiger Nixon");

      employeesScope.done();
    });

    it("should be error", async function () {
      const employeesScope = nock("http://dummy.restapiexample.com/api/v1")
        .get("/employees")
        .reply(500, { message: "internal server error" }, { 'Content-Type': 'application/json' });

      try {
        await companyRepository.fetchEmployees();
      } catch (e) {
        expect(e.response.status).to.equal(500);
        expect(e.response.data.message).to.equal("internal server error");
      }

      employeesScope.done();
    });
  });
});
