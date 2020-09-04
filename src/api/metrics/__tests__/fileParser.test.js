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

import "@testing-library/jest-dom/extend-expect";
import * as methods from "../fileParser";

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

describe("Test fileParser.parseResponseByFileFormat", () => {
  it("produces the correct output for an optimized metric file input", () => {
    const contents = FLATTENED_VALUES;
    const metadata = METADATA;
    const response = {
      my_metric_file: {
        flattenedValueMatrix: contents,
        metadata,
      },
    };
    const parsedResponse = methods.parseResponseByFileFormat(
      response,
      "my_metric_file"
    );
    expect(parsedResponse).toEqual(EXPECTED_OUTPUT);
  });

  it("produces the correct output for a json lines metric file input", () => {
    const response = {
      my_metric_file: EXPECTED_OUTPUT,
    };
    const parsedResponse = methods.parseResponseByFileFormat(
      response,
      "my_metric_file"
    );
    expect(parsedResponse).toEqual(EXPECTED_OUTPUT);
  });
});

describe("Test fileParser.parseResponsesByFileFormat", () => {
  it("produces the correct output for a mix of input types", () => {
    const contents = FLATTENED_VALUES;
    const metadata = METADATA;
    const response = {
      my_optimized_metric_file: {
        flattenedValueMatrix: contents,
        metadata,
      },
      my_metric_file: EXPECTED_OUTPUT,
    };
    const expectedOutput = {
      my_optimized_metric_file: EXPECTED_OUTPUT,
      my_metric_file: EXPECTED_OUTPUT,
    };

    const parsedResponse = methods.parseResponsesByFileFormat(response);
    expect(parsedResponse).toEqual(expectedOutput);
  });
});
