const expect = require("chai").expect;
const { stub } = require("sinon");

const companyRepository = require("../src/repositories/company.repository");
const companyService = require("../src/services/company.service");
const usersMock = require("./mocks/users");
const employeesMock = require("./mocks/employees");

describe("test company service", function () {
  afterEach(() => {
    companyRepository.fetchUsers.restore();
    companyRepository.fetchEmployees.restore();
  });

  describe("test fetch company profile", function () {
    it("should succeed", async function () {
      const fetchUsersFn = stub(companyRepository, "fetchUsers").returns(usersMock);
      const fetchEmployeesFn = stub(companyRepository, "fetchEmployees").returns(employeesMock.data);

      const companyProfile = await companyService.fetchCompanyProfile();

      expect(fetchUsersFn.calledOnce).to.be.true;
      expect(fetchEmployeesFn.calledOnce).to.be.true;

      const expectedData = {
        companyName: 'Facebook Inc',
        companyUsers: [
          { id: 1, name: 'mojombo' },
          { id: 2, name: 'defunkt' },
        ],
        companyEmployees: [
          { id: 1, name: 'Tiger Nixon' },
          { id: 2, name: 'Garrett Winters' },
        ],
      };

      expect(companyProfile).to.deep.equal(expectedData);
    });

    it("should be error when fetching users", async function () {
      const fetchUsersFn = stub(companyRepository, "fetchUsers").throws(new Error("internal server error"));
      const fetchEmployeesFn = stub(companyRepository, "fetchEmployees").returns(employeesMock.data);

      try {
        await companyService.fetchCompanyProfile();
      } catch (e) {
        expect(fetchUsersFn.calledOnce).to.be.true;
        expect(fetchEmployeesFn.calledOnce).to.be.false;
        expect(e.message).to.equal("internal server error");
      }
    });

    it("should be error when fetching employees", async function () {
      const fetchUsersFn = stub(companyRepository, "fetchUsers").returns(usersMock);
      const fetchEmployeesFn = stub(companyRepository, "fetchEmployees").throws(new Error("internal server error"));

      try {
        await companyService.fetchCompanyProfile();
      } catch (e) {
        expect(fetchUsersFn.calledOnce).to.be.true;
        expect(fetchEmployeesFn.calledOnce).to.be.true;
        expect(e.message).to.equal("internal server error");
      }
    });
  });
});
