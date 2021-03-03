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
import { useRootStore } from "../../components/StoreProvider";

jest.mock("../../api/metrics/metricsClient");
jest.mock("../../components/StoreProvider");

const mockUrl = "us_nd/community/goals";
const mockFile = "admissions_by_type_by_month";

describe("useChartData", () => {
  beforeAll(() => {
    useRootStore.mockReturnValue({ userStore: {} });

    awaitingResults.mockImplementation(
      (loading, user, awaitingApi) => awaitingApi
    );
  });

  describe("success responses", () => {
    const mockMetadata = {
      total_data_points: 1,
      dimension_manifest: [["age_bucket", ["25-29", "30-34"]]],
      value_keys: ["count"],
    };
    const mockResponse = {
      [mockFile]: {
        flattenedValueMatrix: "1,1,1",
        metadata: mockMetadata,
      },
    };

    const expectedApiData = {
      [mockFile]: {
        data: [{ age_bucket: "30-34", count: "1" }],
        metadata: mockMetadata,
      },
    };

    beforeAll(() => {
      callMetricsApi.mockResolvedValue(mockResponse);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should load data", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChartData(mockUrl)
      );

      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(callMetricsApi.mock.calls[0][0]).toBe(`${mockUrl}`);

      await waitForNextUpdate();

      expect(result.current.apiData).toEqual(expectedApiData);
      expect(result.current.isLoading).toBeFalse();
      expect(result.current.isError).toBeFalse();

      await cleanup();
    });

    it("only fire one request if 2 components request same file", async () => {
      const { result: firstResult, waitForNextUpdate } = renderHook(() =>
        useChartData(mockUrl)
      );
      const { result: secondResult } = renderHook(() => useChartData(mockUrl));

      await waitForNextUpdate();

      expect(callMetricsApi).toHaveBeenCalledTimes(1);
      expect(firstResult.current.apiData).toEqual(expectedApiData);
      expect(firstResult.current.apiData).toEqual(secondResult.current.apiData);

      await cleanup();
    });
  });

  describe("error responses", () => {
    beforeAll(() => {
      callMetricsApi.mockImplementation(() => {
        throw new Error();
      });

      // do not log the expected error - keep tests less verbose
      jest.spyOn(console, "error").mockImplementation(() => {});
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
