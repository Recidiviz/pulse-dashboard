const request = require("supertest");

const OLD_ENV = process.env;
process.env = Object.assign(process.env, { IS_DEMO: "true" });

const { app } = require("../../../server");

describe("GET api/:stateCode/newRevocations/:file", () => {
  beforeAll(() => {
    // Reduce noise in the test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.env = OLD_ENV;
  });

  it("should respond with a 200 for a valid stateCode", function () {
    return request(app)
      .get("/api/US_DEMO/newRevocations/revocations_matrix_by_month")
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("revocations_matrix_by_month");
      });
  });

  it("should respond with a 400 for an invalid stateCode", function () {
    const expectedErrors = {
      errors: [
        {
          location: "params",
          msg: "Invalid value",
          param: "stateCode",
          value: "HI",
        },
      ],
      status: 400,
    };
    return request(app)
      .get("/api/HI/newRevocations/revocations_matrix_by_month")
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedErrors);
      });
  });

  it("should respond with a 400 for an invalid query param", function () {
    const expectedErrors = {
      errors: [
        {
          location: "query",
          msg: "Invalid value",
          param: "metricPeriodMonths",
          value: "1",
        },
      ],
      status: 400,
    };
    return request(app)
      .get(
        "/api/US_DEMO/newRevocations/revocations_matrix_by_month?metricPeriodMonths=1"
      )
      .then((response) => {
        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedErrors);
      });
  });
});
