const expect = require("chai").expect;
const { spy, stub } = require("sinon");

const companyService = require("../src/services/company.service");
const companyHandler = require("../src/handlers/company.handler");

const companyProfileMock = {
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

function CustomException(statusCode, message) {
  const error = new Error(message);
  error.response = {
    statusCode,
    body: {
      message,
    },
  };
  return error;
}
CustomException.prototype = Object.create(Error.prototype);

describe("test company handler", function () {
  afterEach(() => {
    companyService.fetchCompanyProfile.restore();
  });

  it("should succeed", async function () {
    const fetchCompanyProfileFn = stub(companyService, "fetchCompanyProfile").returns(companyProfileMock);

    const req = {};
    const res = {
      json: spy(),
    };

    await companyHandler.fetchCompanyProfile(req, res);

    expect(fetchCompanyProfileFn.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal(companyProfileMock);
  });

  it("should be error", async function () {
    const fetchCompanyProfileFn = stub(companyService, "fetchCompanyProfile").throws(
      new CustomException(500, "internal server error"),
    );

    const req = {};
    const status = stub();
    const res = {
      json: spy(),
      status,
    };
    status.returns(res);

    await companyHandler.fetchCompanyProfile(req, res);

    expect(fetchCompanyProfileFn.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ message: "internal server error" });
    expect(res.status.calledWith(500)).to.be.true;
  });
});
