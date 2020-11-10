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

import { renderHook, cleanup } from "@testing-library/react-hooks";

import useChartData from "../useChartData";
import {
  callMetricsApi,
  awaitingResults,
} from "../../api/metrics/metricsClient";
import { useAuth0 } from "../../react-auth0-spa";
import { useCachedChartData } from "../../contexts/ChartDataContext";
import parseResponseByFileFormat from "../../api/metrics/parseResponseByFileFormat";

jest.mock("../../react-auth0-spa");
jest.mock("../../api/metrics/metricsClient");
jest.mock("../../contexts/ChartDataContext");
jest.mock("../../api/metrics/parseResponseByFileFormat");
describe("useChartData", () => {
  const mockTenant = "us_mo";
  const mockFile = "some_file";
  const mockResponse = "some response file";
  const mockGetCachedFile = jest.fn();
  const mockSetCachedFile = jest.fn();

  useCachedChartData.mockReturnValue({
    getCachedFile: mockGetCachedFile,
    setCachedFile: mockSetCachedFile,
  });

  useAuth0.mockReturnValue({
    user: {},
    isAuthenticated: true,
    loading: true,
    loginWithRedirect: jest.fn(),
    getTokenSilently: jest.fn(),
  });

  awaitingResults.mockImplementation(
    (loading, user, awaitingApi) => awaitingApi
  );

  describe("successful responses", () => {
    beforeAll(() => {
      parseResponseByFileFormat.mockImplementation((response, fileName) => {
        if (fileName) {
          return {
            [fileName]: response,
          };
        }
        return {
          some_file_name: response,
          extra_file_name: response,
        };
      });
      callMetricsApi.mockResolvedValue(mockResponse);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should load data if no cached files found", async () => {
      mockGetCachedFile.mockReturnValue(null);

      const { result, waitForNextUpdate } = renderHook(() =>
        useChartData(mockTenant, mockFile)
      );
      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(callMetricsApi.mock.calls[0][0]).toBe(`${mockTenant}/${mockFile}`);
      await waitForNextUpdate();

      expect(mockSetCachedFile).toHaveBeenCalledTimes(1);
      expect(result.current.apiData).toBe(mockResponse);
      expect(result.current.isLoading).toBeFalse();
      expect(result.current.isError).toBeFalse();

      await cleanup();
    });

    it("should do only one request if 2 components request same file", async () => {
      const { result: firstResult, waitForNextUpdate } = renderHook(() =>
        useChartData(mockTenant, mockFile)
      );
      const { result: secondResult } = renderHook(() =>
        useChartData(mockTenant, mockFile)
      );

      await waitForNextUpdate();

      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(firstResult.current.apiData).toEqual(mockResponse);
      expect(firstResult.current.apiData).toEqual(secondResult.current.apiData);

      await cleanup();
    });

    it("should get cached file if exists", async () => {
      const mockCachedFile = "some cached file";
      const { waitForNextUpdate } = renderHook(() =>
        useChartData(mockTenant, mockFile)
      );

      await waitForNextUpdate();
      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(mockSetCachedFile).toHaveBeenCalledTimes(1);

      mockGetCachedFile.mockReturnValue(mockCachedFile);

      const {
        result: secondResult,
        waitForNextUpdate: waitForSecondNextUpdate,
      } = renderHook(() => useChartData(mockTenant, mockFile));

      await waitForSecondNextUpdate();
      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(secondResult.current.apiData).toBe(mockCachedFile);

      mockGetCachedFile.mockReturnValue(null);
      await cleanup();
    });

    it("should return object with files if file is not specified", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChartData(mockTenant)
      );

      await waitForNextUpdate();
      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(callMetricsApi.mock.calls[0][0]).toBe(mockTenant);
      expect(result.current.apiData).toEqual({
        some_file_name: mockResponse,
        extra_file_name: mockResponse,
      });
    });

    it("should abort promise is component is unmounted (no console warning)", async () => {
      const { unmount } = renderHook(() => useChartData(mockTenant, mockFile));

      unmount();
    });
  });

  describe("error responses", () => {
    beforeAll(() => {
      // do not log the expected error - keep tests less verbose
      jest.spyOn(console, "error").mockImplementation(() => {});
      callMetricsApi.mockImplementation(() => {
        throw new Error();
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("returns isError = true", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChartData("anyURL", "anyFile")
      );

      await waitForNextUpdate();

      expect(result.current.isError).toBe(true);
      expect(result.current.apiData).toEqual([]);
    });
  });
});
