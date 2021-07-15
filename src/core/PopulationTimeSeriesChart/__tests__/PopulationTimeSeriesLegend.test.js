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

import { mount } from "enzyme";
import React from "react";

import PopulationTimeSeriesTooltip from "../PopulationTimeSeriesTooltip";

describe("Tests for PopulationTimeseries Tooltip", () => {
  const baseProps = {
    date: new Date("2021-02-22"),
    value: 7000,
  };

  const renderTooltip = (props) => {
    return mount(<PopulationTimeSeriesTooltip d={props} />);
  };

  it("displays year and month", () => {
    const tooltip = renderTooltip(baseProps);
    expect(tooltip.find(".PopulationTimeseriesTooltip__Date").text()).toEqual(
      "February 2021"
    );
  });

  it("displays value with commas", () => {
    const tooltip = renderTooltip(baseProps);
    expect(tooltip.find(".PopulationTimeseriesTooltip__Value").text()).toEqual(
      "7,000"
    );
  });

  it("displays uncertainties", () => {
    const tooltip = renderTooltip({
      lowerBound: 6000,
      upperBound: 8000,
      ...baseProps,
    });
    expect(tooltip.find(".PopulationTimeseriesTooltip__Range").text()).toEqual(
      "(6000, 8000)"
    );
  });

  it("does not display when hovering over edges of summary box", () => {
    const tooltip = renderTooltip({ parentSummary: {}, ...baseProps });
    expect(tooltip.html()).toBeNull();
  });
});
