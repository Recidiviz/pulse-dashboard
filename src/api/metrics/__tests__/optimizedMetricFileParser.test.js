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

import expandMetricRepresentation from "../optimizedMetricFileParser";

// This fixture data provides the inverse of unit tests on the publishing side in our data platform
const FLATTENED_VALUES =
  "0,0,1,1,2,0,0,1,1,2,2,0,0,0,0,0,1,1,1,1,1,1,0,1,0,1,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,100,68,73,41,10,30,36,51,38,15,4";
const METADATA = {
  total_data_points: "11",
  value_keys: ["total_revocations"],
  dimension_manifest: [
    ["district", ["4", "5", "6"]],
    ["month", ["11", "12"]],
    ["supervision_type", ["parole", "probation"]],
    ["year", ["2020"]],
  ],
};
const EXPECTED_OUTPUT = [
  {
    district: "4",
    year: "2020",
    month: "11",
    supervision_type: "PAROLE",
    total_revocations: "100",
  },
  {
    district: "4",
    year: "2020",
    month: "11",
    supervision_type: "PROBATION",
    total_revocations: "68",
  },
  {
    district: "5",
    year: "2020",
    month: "11",
    supervision_type: "PAROLE",
    total_revocations: "73",
  },
  {
    district: "5",
    year: "2020",
    month: "11",
    supervision_type: "PROBATION",
    total_revocations: "41",
  },
  {
    district: "6",
    year: "2020",
    month: "11",
    supervision_type: "PAROLE",
    total_revocations: "10",
  },
  {
    district: "4",
    year: "2020",
    month: "12",
    supervision_type: "PAROLE",
    total_revocations: "30",
  },
  {
    district: "4",
    year: "2020",
    month: "12",
    supervision_type: "PROBATION",
    total_revocations: "36",
  },
  {
    district: "5",
    year: "2020",
    month: "12",
    supervision_type: "PAROLE",
    total_revocations: "51",
  },
  {
    district: "5",
    year: "2020",
    month: "12",
    supervision_type: "PROBATION",
    total_revocations: "38",
  },
  {
    district: "6",
    year: "2020",
    month: "12",
    supervision_type: "PAROLE",
    total_revocations: "15",
  },
  {
    district: "6",
    year: "2020",
    month: "12",
    supervision_type: "PROBATION",
    total_revocations: "4",
  },
];

describe("Test expandMetricRepresentation", () => {
  it("produces the correct output for a standard input", () => {
    const contents = FLATTENED_VALUES;
    const metadata = METADATA;
    const expandedRepresentation = expandMetricRepresentation(
      contents,
      metadata
    );
    expect(expandedRepresentation).toEqual(EXPECTED_OUTPUT);
  });

  it("produces the correct output for an input with multiple value keys", () => {
    // Appends another value key of total_population and adds values of 100 for each data point
    const contents = `${FLATTENED_VALUES},100,100,100,100,100,100,100,100,100,100,100`;
    const metadata = {
      ...METADATA,
      value_keys: ["total_revocations", "total_population"],
    };
    const expectedOutput = EXPECTED_OUTPUT.map((dataPoint) => {
      return { ...dataPoint, total_population: "100" };
    });

    const expandedRepresentation = expandMetricRepresentation(
      contents,
      metadata
    );
    expect(expandedRepresentation).toEqual(expectedOutput);
  });

  it("produces empty output for empty input", () => {
    const contents = "";
    const metadata = {
      total_data_points: "0",
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", []],
        ["month", []],
        ["supervision_type", []],
        ["year", []],
      ],
    };
    const expectedOutput = [];

    const expandedRepresentation = expandMetricRepresentation(
      contents,
      metadata
    );
    expect(expandedRepresentation).toEqual(expectedOutput);
  });

  it("throws an error when an dimension value index cannot be found in the manifest", () => {
    const contents = FLATTENED_VALUES;
    const metadata = {
      total_data_points: "11",
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", ["4", "5"]], // No district 6 at index 2 in manifest entry
        ["month", ["11", "12"]],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      expandMetricRepresentation(contents, metadata);
    }).toThrow(
      "Metric file value array references dimension value index of 2 which is not found in the dimension_manifest for dimension of index 0. Dimension manifest for that dimension is district,4,5"
    );
  });
});
