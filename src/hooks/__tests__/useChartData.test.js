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
import React from "react";
import { render } from "@testing-library/react";

import useChartData from "../useChartData";
import Error from "../../components/Error";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { useAuth0 } from "../../react-auth0-spa";
import logger from "../../utils/logger";

jest.mock("../../react-auth0-spa");
jest.mock("../../api/metrics/metricsClient");

const TestComponent = () => {
  const { apiData, isError } = useChartData("anyURL", "anyFile");

  return (
    <>
      <div data-testid="apiData">{apiData}</div>
      {isError && <div>Error</div>}
    </>
  );
};

describe("useChartData", () => {
  describe("when an error is thrown", () => {
    beforeEach(() => {
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
      jest.spyOn(logger, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("returns an empty array for apiData", () => {
      const { getByTestId } = render(<TestComponent />);

      expect(getByTestId("apiData")).toHaveTextContent([]);
    });

    it("returns isError = true", () => {
      const { getByText } = render(<TestComponent />);

      expect(getByText("Error")).toBeTruthy();
    });
  });
});
