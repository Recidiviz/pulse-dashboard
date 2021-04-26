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
        revocation_count: "1",
        revocation_count_all: "100",
        gender: "MALE",
        supervision_population_count: "200",
        supervision_count_all: "202",
        recommended_for_revocation_count: "1",
        recommended_for_revocation_count_all: "10",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "04",
        revocation_count: "3",
        revocation_count_all: "103",
        gender: "MALE",
        supervision_population_count: "300",
        supervision_count_all: "505",
        recommended_for_revocation_count: "3",
        recommended_for_revocation_count_all: "30",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "03",
        revocation_count: "1",
        revocation_count_all: "100",
        gender: "FEMALE",
        supervision_population_count: "200",
        supervision_count_all: "202",
        recommended_for_revocation_count: "2",
        recommended_for_revocation_count_all: "20",
      },
      {
        admission_type: "ALL",
        level_2_supervision_location: "04",
        revocation_count: "4",
        revocation_count_all: "104",
        gender: "FEMALE",
        supervision_population_count: "400",
        supervision_count_all: "404",
        recommended_for_revocation_count: "4",
        recommended_for_revocation_count_all: "40",
      },
    ];
    const statePopulationData = [
      {
        gender: "MALE",
        population_count: "30000",
        total_state_population_count: "3000000",
      },
      {
        gender: "FEMALE",
        population_count: "40000",
        total_state_population_count: "4000000",
      },
    ];
    const expected = {
      data: ["2.45", "99.01", "1.00"],
      denominators: [204, 606, 4000000],
      numerators: [5, 600, 40000],
    };
    const chartData = createGenerateChartData({
      filteredData,
      statePopulationData,
    })("FEMALE");
    expect(chartData.data.datasets[0].data).toEqual(expected.data);
    expect(chartData.numerators).toEqual(expected.numerators);
    expect(chartData.denominators).toEqual(expected.denominators);
  });

  describe("when there are more than one admission_type", () => {
    let filteredData = [];
    let statePopulationData = [];

    beforeEach(() => {
      filteredData = [
        {
          admission_type: "SCI_6",
          level_2_supervision_location: "03",
          revocation_count: "1",
          revocation_count_all: "100",
          gender: "FEMALE",
          supervision_population_count: "200",
          supervision_count_all: "220",
          recommended_for_revocation_count: "0",
          recommended_for_revocation_count_all: "0",
        },
        {
          admission_type: "SCI_6",
          level_2_supervision_location: "04",
          revocation_count: "4",
          revocation_count_all: "104",
          gender: "FEMALE",
          supervision_population_count: "400",
          supervision_count_all: "440",
          recommended_for_revocation_count: "0",
          recommended_for_revocation_count_all: "0",
        },
        {
          admission_type: "SCI_12",
          level_2_supervision_location: "03",
          revocation_count: "2",
          revocation_count_all: "101",
          gender: "FEMALE",
          supervision_population_count: "200",
          supervision_count_all: "220",
          recommended_for_revocation_count: "0",
          recommended_for_revocation_count_all: "0",
        },
        {
          admission_type: "SCI_12",
          level_2_supervision_location: "04",
          revocation_count: "6",
          revocation_count_all: "106",
          gender: "FEMALE",
          supervision_population_count: "400",
          supervision_count_all: "4440",
          recommended_for_revocation_count: "0",
          recommended_for_revocation_count_all: "0",
        },
      ];
      statePopulationData = [
        {
          gender: "MALE",
          population_count: "30000",
          total_state_population_count: "3000000",
        },
        {
          gender: "FEMALE",
          population_count: "40000",
          total_state_population_count: "4000000",
        },
      ];
    });

    describe("when the chart is not stacked", () => {
      it("does not sum the denominator", () => {
        const stacked = false;
        const expected = {
          data: ["3.16", "90.91", "1.00"],
          denominators: [411, 660, 4000000],
          numerators: [13, 600, 40000],
        };
        const chartData = createGenerateChartData(
          {
            filteredData,
            statePopulationData,
          },
          stacked
        )("FEMALE");
        expect(chartData.data.datasets[0].data).toEqual(expected.data);
        expect(chartData.numerators).toEqual(expected.numerators);
        expect(chartData.denominators).toEqual(expected.denominators);
      });
    });

    describe("when the chart is stacked", () => {
      it("does not sum the denominator when there are more than one admission_type", () => {
        const stacked = true;
        const expected = {
          data: [
            ["0.00", "0.00", "1.00"],
            ["3.16", "90.91", "1.00"],
          ],
          denominators: [
            [0, 0, 3000000],
            [411, 660, 4000000],
          ],
          numerators: [
            [0, 0, 30000],
            [13, 600, 40000],
          ],
        };
        const chartData = createGenerateChartData(
          {
            filteredData,
            statePopulationData,
          },
          stacked
        )();
        expect(chartData.data.datasets[0].data).toEqual(expected.data[0]);
        expect(chartData.data.datasets[1].data).toEqual(expected.data[1]);
        expect(chartData.numerators).toEqual(expected.numerators);
        expect(chartData.denominators).toEqual(expected.denominators);
      });
    });
  });
});
