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

import createGenerateChartData from "../createGenerateChartData";

describe("createGenerateChartData", () => {
  it("correctly sums the numerators and denominators when there are more than one supervision_location", () => {
    const filteredData = [
      {
        admission_type: "ALL",
        level_2_supervision_location: "03",
        revocation_count: "100",
        risk_level: "HIGH",
        supervision_population_count: "200",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "04",
        revocation_count: "75",
        risk_level: "HIGH",
        supervision_population_count: "250",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "03",
        revocation_count: "2",
        risk_level: "LOW",
        supervision_population_count: "300",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "04",
        revocation_count: "5",
        risk_level: "LOW",
        supervision_population_count: "350",
      },
    ];
    const expected = {
      data: ["1.08", "38.89"],
      denominators: [650, 450],
      numerators: [7, 175],
    };
    const chartData = createGenerateChartData(filteredData)();
    expect(chartData.data.datasets[0].data).toEqual(expected.data);
    expect(chartData.numerators).toEqual(expected.numerators);
    expect(chartData.denominators).toEqual(expected.denominators);
  });

  it("does not sum the denominator when there are more than one admission_type", () => {
    const filteredData = [
      {
        admission_type: "SCI_6",
        level_1_supervision_location: 2,
        revocation_count: "100",
        risk_level: "HIGH",
        supervision_population_count: "200",
      },
      {
        admission_type: "SCI_6",
        level_1_supervision_location: 3,
        revocation_count: "10",
        risk_level: "HIGH",
        supervision_population_count: "500",
      },
      {
        admission_type: "SCI_12",
        level_1_supervision_location: 2,
        revocation_count: "75",
        risk_level: "HIGH",
        supervision_population_count: "200",
      },
      {
        admission_type: "SCI_6",
        level_1_supervision_location: 2,
        revocation_count: "2",
        risk_level: "LOW",
        supervision_population_count: "90",
      },
      {
        admission_type: "SCI_12",
        level_1_supervision_location: 2,
        revocation_count: "5",
        risk_level: "LOW",
        supervision_population_count: "90",
      },
    ];
    const expected = {
      data: ["7.78", "26.43"],
      denominators: [90, 700],
      numerators: [7, 185],
    };
    const chartData = createGenerateChartData(filteredData)();
    expect(chartData.data.datasets[0].data).toEqual(expected.data);
    expect(chartData.numerators).toEqual(expected.numerators);
    expect(chartData.denominators).toEqual(expected.denominators);
  });
});
