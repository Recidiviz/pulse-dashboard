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

import React from "react";
import { mount } from "enzyme";
import CoreFilterBar from "../CoreFilterBar";

describe("test for component FiltersBar", () => {
  const props = {
    replaceLa: undefined,
  };

  const renderFilterBar = (barProps) => {
    return mount(<CoreFilterBar {...barProps} />);
  };

  it("display metric type toggle", () => {
    const nextProps = {
      ...props,
      setChartMetricType: jest.fn(),
      metricType: "counts",
    };

    const filterBar = renderFilterBar(nextProps);
    expect(filterBar.find("TogglePill")).toHaveLength(1);
  });

  it("display metric period toggle", () => {
    const nextProps = {
      ...props,
      setChartMetricPeriodMonths: jest.fn(),
      metricPeriodMonths: "36",
    };

    const filterBar = renderFilterBar(nextProps);
    expect(filterBar.find(".Filter__title").text()).toEqual("Time Period");
  });

  it("display supervision type toggle", () => {
    const nextProps = {
      ...props,
      setChartSupervisionType: jest.fn(),
      supervisionType: "all",
    };

    const filterBar = renderFilterBar(nextProps);
    expect(filterBar.find(".Filter__title").text()).toEqual("Supervision Type");
  });

  it("display district toggle", () => {
    const nextProps = {
      ...props,
      setChartDistrict: jest.fn(),
      replaceLa: true,
      district: ["16"],
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

    const filterBar = renderFilterBar(nextProps);
    expect(filterBar.find(".Filter__title").text()).toEqual("Office");

    const officeProps = {
      ...nextProps,
      stateCode: "US_DEMO",
    };

    const filterBarOffice = renderFilterBar(officeProps);
    expect(filterBarOffice.find(".Filter__title").text()).toEqual(
      "County of Residence"
    );
  });
});
