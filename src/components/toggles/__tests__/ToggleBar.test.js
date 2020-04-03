// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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
import { getAllByTestId } from "@testing-library/dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ToggleBar from "../ToggleBar";

describe("test for component ToggleBar", () => {
  const props = {
    stateCode: undefined,
    replaceLa: undefined,
  };
  it("display component MetricTypeToggle", () => {
    const nextProps = {
      ...props,
      setChartMetricType: jest.fn(),
    };
    const { container } = render(<ToggleBar {...nextProps} />);
    expect(getAllByTestId(container, "metricTypeToggle")).toHaveLength(1);
  });

  it("display component MetricPeriodToggle", () => {
    const nextProps = {
      ...props,
      setChartMetricPeriodMonths: jest.fn(),
    };
    const { container } = render(<ToggleBar {...nextProps} />);
    expect(getAllByTestId(container, "metricPeriodToggle")).toHaveLength(1);
  });

  it("display component SupervisionTypeToggle", () => {
    const nextProps = {
      ...props,
      setChartSupervisionType: jest.fn(),
    };
    const { container } = render(<ToggleBar {...nextProps} />);
    expect(getAllByTestId(container, "supervisionTypeToggle")).toHaveLength(1);
  });

  it("display component DistrictToggle", () => {
    const nextProps = {
      ...props,
      setChartDistrict: jest.fn(),
      replaceLa: true,
      availableDistricts: ["beulah", "bismarck", "bottineau"],
      districtOffices: [
        {
          state_code: "US_DEMO",
          district: 16,
          site_name: "Beulah",
          long: -101.78521,
          lat: 47.260616,
        },
      ],
    };
    const { container } = render(<ToggleBar {...nextProps} />);
    expect(getAllByTestId(container, "districtToggle")).toHaveLength(1);
  });
});
