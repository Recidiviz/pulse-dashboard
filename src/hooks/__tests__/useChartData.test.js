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
import { renderHook } from "@testing-library/react-hooks";

import useChartData from "../useChartData";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { useAuth0 } from "../../react-auth0-spa";

jest.mock("../../react-auth0-spa");
jest.mock("../../api/metrics/metricsClient");
describe("useChartData", () => {
  describe("when an error is thrown", () => {
    callMetricsApi.mockImplementation(() => {
      throw new Error();
    });

    useAuth0.mockReturnValue({
      user: {},
      isAuthenticated: true,
      loading: true,
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
    });

    // do not log the expected error - keep tests less verbose
    jest.spyOn(console, "error").mockImplementation(() => {});

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
