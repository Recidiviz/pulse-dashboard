/* eslint-disable prettier/prettier */
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

import { getCounts } from "../getCounts";

describe("getCounts", () => {
  const transformedData = {
    DAISY: {
      POPPY: [5, 50],
      SUPERVISION_POPULATION: [5, 500],
    },
    PURPLE: {
      POPPY: [10, 100],
      SUPERVISION_POPULATION: [100, 1000],
    }
  }
  const labels = ["POPPY", "SUPERVISION_POPULATION", "STATE_POPULATION"];
  const dimensions = ["DAISY", "PURPLE"];
  const populationData = [
    { race_or_ethnicity: "DAISY", population_count: "60", total_state_population_count: "6000" },
    { race_or_ethnicity: "PURPLE", population_count: "70", total_state_population_count: "6000" },
  ];

  it("calculate avarage rate from filtered datasets", () => {
    const expected = {
      dataPoints: [
        ["10.00", "1.00", "1.00"],
        ["10.00", "10.00", "1.17"]
      ],
      denominators: [
        [ 50, 500, 6000 ],
        [ 100, 1000, 6000 ],
      ],
      numerators: [
        [ 5, 5, 60 ],
        [ 10, 100, 70 ],
      ],
    }
    expect(
      getCounts(transformedData, labels, dimensions, populationData)
    ).toEqual(expected);
  });
});
