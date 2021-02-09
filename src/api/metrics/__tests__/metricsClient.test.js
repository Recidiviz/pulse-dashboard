// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import { callMetricsApi, callRestrictedAccessApi } from "../metricsClient";

const OLD_ENV = process.env;

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ data: [] }),
});

describe("metricsClient", () => {
  let output;
  const mockToken = "auth0-token";
  const userEmail = "test@email.com";
  const endpoint =
    "newRevocations/revocations_matrix_by_month?violationType=All";
  const getTokenSilently = jest.fn().mockResolvedValue(mockToken);
  const expectedUrl = `test-url/api/${endpoint}`;

  beforeAll(() => {
    // do not log the expected error - keep tests less verbose
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();
    process.env = OLD_ENV;
  });

  describe("when callMetricsApi succeeds", () => {
    beforeEach(async () => {
      process.env = Object.assign(process.env, {
        REACT_APP_API_URL: "test-url",
      });
      output = await callMetricsApi(endpoint, getTokenSilently);
    });

    it("calls fetch with the correct url and headers", () => {
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });

    it("returns the resolved data response", () => {
      expect(output).toEqual({ data: [] });
    });
  });

  describe("when callRestrictedAccessApi succeeds", () => {
    beforeEach(async () => {
      process.env = Object.assign(process.env, {
        REACT_APP_API_URL: "test-url",
      });
      output = await callRestrictedAccessApi(
        endpoint,
        userEmail,
        getTokenSilently
      );
    });

    it("calls fetch with the correct url and headers", () => {
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        body: JSON.stringify({ userEmail }),
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    });

    it("returns the resolved data response", () => {
      expect(output).toEqual({ data: [] });
    });
  });

  describe("when callMetricsApi fails", () => {
    beforeEach(async () => {
      process.env = Object.assign(process.env, {
        REACT_APP_API_URL: "test-url",
      });
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: jest
          .fn()
          .mockResolvedValue({ status: 400, errors: ["API error"] }),
      });
    });

    it("throws an error", async () => {
      expect.assertions(1);
      try {
        await callMetricsApi(endpoint, getTokenSilently);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            `Fetching data from API failed.\nStatus: 400 - Bad Request\nErrors: ["API error"]`
          )
        );
      }
    });
  });

  describe("when callRestrictedAccessApi fails", () => {
    beforeEach(async () => {
      process.env = Object.assign(process.env, {
        REACT_APP_API_URL: "test-url",
      });
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: jest
          .fn()
          .mockResolvedValue({ status: 400, errors: ["API error"] }),
      });
    });

    it("throws an error", async () => {
      expect.assertions(1);
      try {
        await callRestrictedAccessApi(endpoint, userEmail, getTokenSilently);
      } catch (error) {
        expect(error).toEqual(
          new Error(
            `Fetching data from API failed.\nStatus: 400 - Bad Request\nErrors: ["API error"]`
          )
        );
      }
    });
  });
});
