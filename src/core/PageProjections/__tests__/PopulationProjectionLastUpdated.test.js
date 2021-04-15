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
import PopulationProjectionLastUpdated from "../PopulationProjectionLastUpdated";

describe("Tests PopulationProjectionLastUpdated component", () => {
  const createTimeSeries = (historicalDates, projectedDates) =>
    historicalDates
      .map(([year, month]) => ({ year, month, simulationTag: "HISTORICAL" }))
      .concat(
        projectedDates.map(([year, month]) => ({
          year,
          month,
          simulationTag: "BASELINE",
        }))
      );

  const render = (timeSeries) =>
    mount(
      <PopulationProjectionLastUpdated projectionTimeSeries={timeSeries} />
    );

  it("displays the latest date", () => {
    const timeSeries = createTimeSeries(
      [
        [2020, 4],
        [2020, 5],
      ],
      [
        [2020, 6],
        [2020, 7],
      ]
    );
    const lastUpdated = render(timeSeries);
    expect(
      lastUpdated.find(".PopulationProjectionLastUpdated").text()
    ).toContain("May 2020");
  });

  it("displays the latest date when data is out of order", () => {
    const timeSeries = createTimeSeries(
      [
        [2021, 7],
        [2021, 6],
      ],
      [
        [2021, 8],
        [2021, 9],
      ]
    );
    const lastUpdated = render(timeSeries);
    expect(
      lastUpdated.find(".PopulationProjectionLastUpdated").text()
    ).toContain("July 2021");
  });
});
