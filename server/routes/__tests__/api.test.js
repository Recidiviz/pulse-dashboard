// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================
const mockMetricFiles = {
  file_1: "content_1",
  file_2: "content_2",
  supervision_location_restricted_access_emails: [
    {
      restricted_user_email: "thirteen@state.gov",
      allowed_level_1_supervision_location_ids: "13",
    },
    {
      restricted_user_email: "one@state.gov",
      allowed_level_1_supervision_location_ids: "1",
    },
  ],
};

const mockSubsetFilters = {
  violation_type: [
    "absconded",
    "all",
    "elec_monitoring",
    "escaped",
    "high_tech",
    "low_tech",
    "med_tech",
    "municipal",
    "substance_abuse",
    "technical",
  ],
  charge_category: [
    "all",
    "domestic_violence",
    "general",
    "serious_mental_illness",
  ],
};

const mockUserRestrictionsFilters = {
  level_1_supervision_location: ["08n"],
};

jest.mock("../../core/fetchMetrics", () => {
  return {
    default: jest.fn(() => Promise.resolve(mockMetricFiles)),
  };
});

jest.mock("../../core/fetchAndFilterNewRevocationFile", () => {
  return {
    default: jest.fn(() => Promise.resolve(mockMetricFiles)),
  };
});

jest.mock("../../filters/filterHelpers", () => {
  return {
    createSubsetFilters: jest.fn().mockReturnValue(mockSubsetFilters),
    createUserRestrictionsFilters: jest
      .fn()
      .mockReturnValue(mockUserRestrictionsFilters),
    getNewRevocationsFiltersByMetricName: jest.fn().mockReturnValue({
      ...mockSubsetFilters,
      ...mockUserRestrictionsFilters,
    }),
  };
});

jest.mock("../../utils/cacheKeys");

const { default: fetchMetrics } = require("../../core/fetchMetrics");
const {
  default: fetchAndFilterNewRevocationFile,
} = require("../../core/fetchAndFilterNewRevocationFile");

const {
  newRevocations,
  newRevocationFile,
  communityGoals,
  communityExplore,
  facilitiesGoals,
  facilitiesExplore,
  programmingExplore,
  refreshCache,
  restrictedAccess,
  responder,
} = require("../api");

const { clearMemoryCache } = require("../../core/cacheManager");
const {
  createUserRestrictionsFilters,
  createSubsetFilters,
  getNewRevocationsFiltersByMetricName,
} = require("../../filters");
const { getCacheKey } = require("../../utils/cacheKeys");

describe("API GET tests", () => {
  const stateCode = "test_id";

  beforeAll(() => {
    // Reduce noise in the test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    clearMemoryCache();
  });

  function fakeRequest(routeHandler, req = { params: { stateCode } }) {
    return new Promise((resolve) => {
      const send = resolve;
      const status = jest.fn().mockImplementation(() => {
        return { send };
      });
      const res = { send, status };
      routeHandler(req, res);
    });
  }

  async function requestAndExpectFetchMetricsCalled(
    controllerFn,
    numCalls,
    request,
    mockFetch = fetchMetrics
  ) {
    await fakeRequest(controllerFn, request);
    expect(mockFetch.mock.calls.length).toBe(numCalls);
    mockFetch.mockClear();
  }

  describe("API fetching and caching for GET requests", () => {
    const metricControllers = [
      [newRevocations],
      [communityGoals],
      [communityExplore],
      [facilitiesGoals],
      [facilitiesExplore],
      [programmingExplore],
    ];

    afterEach(async () => {
      await clearMemoryCache();
      fetchMetrics.mockClear();
      jest.resetModules();
    });

    test.each(metricControllers)(
      "%p fetches metrics only if data is not cached in store",
      async (controllerFn, done) => {
        await requestAndExpectFetchMetricsCalled(controllerFn, 1);
        await requestAndExpectFetchMetricsCalled(controllerFn, 0);

        await clearMemoryCache();

        await requestAndExpectFetchMetricsCalled(controllerFn, 1);
        await requestAndExpectFetchMetricsCalled(controllerFn, 0);

        done();
      }
    );

    it("newRevocations - calls fetchMetrics with the correct args", async () => {
      await fakeRequest(newRevocations);
      expect(fetchMetrics).toHaveBeenCalledWith(
        stateCode,
        "newRevocation",
        null,
        false
      );
    });

    it("refreshCache - calls fetchMetrics with the correct args", async () => {
      await fakeRequest(refreshCache);

      expect(fetchMetrics).toHaveBeenCalledWith(
        stateCode,
        "newRevocation",
        null,
        false
      );
    });
  });

  describe("newRevocationFile endpoint", () => {
    const file = "file_1";
    const queryParams = { violationType: "ALL" };
    const request = {
      user: {
        [`${process.env.METADATA_NAMESPACE}app_metadata`]: {
          allowed_supervision_location_ids: ["8N"],
          allowed_supervision_location_level: "level_1_supervision_location",
        },
      },
      params: { stateCode, file },
      query: queryParams,
    };
    const expectedFilters = {
      ...mockSubsetFilters,
      ...mockUserRestrictionsFilters,
    };

    it("newRevocationFile - does not throw when there are no user restrictions", async () => {
      const requestWithoutRestrictions = {
        ...request,
        user: {
          [`${process.env.METADATA_NAMESPACE}app_metadata`]: {},
        },
      };

      expect(async () =>
        fakeRequest(newRevocationFile, requestWithoutRestrictions)
      ).not.toThrow();
    });

    it("newRevocationFile - calls createUserRestrictionsFilters with correct args", async () => {
      await fakeRequest(newRevocationFile, request);
      expect(createUserRestrictionsFilters).toHaveBeenCalledWith({
        allowed_supervision_location_ids: ["8N"],
        allowed_supervision_location_level: "level_1_supervision_location",
      });
    });

    it("newRevocationFile - calls createSubsetFilters with correct args", async () => {
      await fakeRequest(newRevocationFile, request);
      expect(createSubsetFilters).toHaveBeenCalledWith({
        filters: request.query,
      });
    });

    it("newRevocationFile - calls getNewRevocationsFiltersByMetricName with correct args", async () => {
      await fakeRequest(newRevocationFile, request);
      expect(getNewRevocationsFiltersByMetricName).toHaveBeenCalledWith({
        metricName: file,
        subsetFilters: mockSubsetFilters,
        userRestrictionsFilters: mockUserRestrictionsFilters,
      });
    });

    it("newRevocationFile - calls getCacheKey with correct args", async () => {
      await fakeRequest(newRevocationFile, request);
      expect(getCacheKey).toHaveBeenCalledWith({
        stateCode,
        metricType: "newRevocation",
        metricName: file,
        cacheKeySubset: expectedFilters,
      });
    });

    it("newRevocationFile - calls fetchAndFilterNewRevocationFile with correct args", async () => {
      await fakeRequest(newRevocationFile, request);
      expect(fetchAndFilterNewRevocationFile).toHaveBeenCalledWith({
        stateCode,
        metricType: "newRevocation",
        metricName: file,
        filters: expectedFilters,
        isDemoMode: false,
      });
    });

    it("newRevocationFile - calls fetchAndFilterNewRevocationFile if data is not cached", async () => {
      await requestAndExpectFetchMetricsCalled(
        newRevocationFile,
        1,
        request,
        fetchAndFilterNewRevocationFile
      );

      await requestAndExpectFetchMetricsCalled(
        newRevocationFile,
        0,
        request,
        fetchAndFilterNewRevocationFile
      );

      await clearMemoryCache();

      await requestAndExpectFetchMetricsCalled(
        newRevocationFile,
        1,
        request,
        fetchAndFilterNewRevocationFile
      );

      await requestAndExpectFetchMetricsCalled(
        newRevocationFile,
        0,
        request,
        fetchAndFilterNewRevocationFile
      );
    });
  });

  describe("API fetching and caching for POST requests", () => {
    const userEmail = "thirteen@state.gov";
    const userDistrict = "13";
    let postRequest = { params: { stateCode }, body: { userEmail } };
    const file = "supervision_location_restricted_access_emails";

    afterEach(async () => {
      await clearMemoryCache();
      fetchMetrics.mockClear();
      jest.resetModules();
    });

    it("restrictedAccess fetches file only if data is not cached in store", async () => {
      await requestAndExpectFetchMetricsCalled(
        restrictedAccess,
        1,
        postRequest
      );

      await requestAndExpectFetchMetricsCalled(
        restrictedAccess,
        0,
        postRequest
      );

      await clearMemoryCache();

      await requestAndExpectFetchMetricsCalled(
        restrictedAccess,
        1,
        postRequest
      );
      await requestAndExpectFetchMetricsCalled(
        restrictedAccess,
        0,
        postRequest
      );
    });

    it("restrictedAccess correctly responds to subsequent requests from different users from cached file ", async () => {
      let result = await fakeRequest(restrictedAccess, postRequest);
      expect(result[file].restricted_user_email).toEqual(userEmail);
      expect(result[file].allowed_level_1_supervision_location_ids).toEqual(
        userDistrict
      );
      expect(fetchMetrics.mock.calls.length).toBe(1);
      fetchMetrics.mockClear();

      const newUserEmail = "one@state.gov";
      const newUserDistrict = "1";
      postRequest = {
        params: { stateCode },
        body: { userEmail: newUserEmail },
      };

      result = await fakeRequest(restrictedAccess, postRequest);
      expect(result[file].restricted_user_email).toEqual(newUserEmail);
      expect(result[file].allowed_level_1_supervision_location_ids).toEqual(
        newUserDistrict
      );
      expect(fetchMetrics.mock.calls.length).toBe(0);
      fetchMetrics.mockClear();
    });

    it("restrictedAccess - calls fetchMetrics with the correct args", async () => {
      await fakeRequest(restrictedAccess, postRequest);
      expect(fetchMetrics).toHaveBeenCalledWith(
        stateCode,
        "newRevocation",
        file,
        false
      );
    });
  });

  describe("responder test", () => {
    const send = jest.fn();
    const status = jest.fn().mockImplementation(() => {
      return { send };
    });
    const res = { send, status };

    it("should send error status code 500 when no status is on error", () => {
      const error = "some error";
      const callback = responder(res);
      callback(error, null);

      expect(status).toHaveBeenCalledWith(500);
    });

    it("should send the error's status code when the status is on the error", () => {
      const error = { status: 400, errors: ["some error"] };
      const callback = responder(res);
      callback(error, null);

      expect(status).toHaveBeenCalledWith(error.status);
    });

    it("should send the error's status code when the error has a code property", () => {
      const error = { code: 404, error: "File not found" };
      const callback = responder(res);
      callback(error, null);

      expect(status).toHaveBeenCalledWith(error.code);
    });

    it("should send data", () => {
      const data = "some data";
      const callback = responder(res);
      callback(null, data);

      expect(send).toHaveBeenCalledWith(data);
    });

    it("should send the status and error message in the response body", () => {
      const error = new Error("API error");
      const callback = responder(res);
      callback(error, null);
      expect(send).toHaveBeenCalledWith({
        status: 500,
        errors: [error.message],
      });
    });

    it("should send the validation errors in the response body", () => {
      const error = { status: 400, errors: ["Validation errors"] };
      const callback = responder(res);
      callback(error, null);
      expect(send).toHaveBeenCalledWith(error);
    });
  });
});
