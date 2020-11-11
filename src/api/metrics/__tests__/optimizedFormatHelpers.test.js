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
import * as methods from "../optimizedFormatHelpers";

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

describe("Test getDimensionValue", () => {
  it("returns the correct value for properly formatted input", () => {
    const dimensionValue = methods.getDimensionValue(
      METADATA.dimension_manifest,
      0,
      2
    );
    expect(dimensionValue).toEqual("6");
  });

  it("throws an error for improperly formatted input", () => {
    const dimensions = ["district", "4", "5", "6", "month", "11", "12"];
    expect(() => {
      methods.getDimensionValue(dimensions, 1, 0);
    }).toThrow(
      `Could not parse dimension manifest of ${dimensions} with dimension index of 1 and dimension value index of 0`
    );
  });
});

describe("Test unflattenValues", () => {
  it("unflattens a flat array into a proper number and size of arrays", () => {
    const contents = FLATTENED_VALUES.split(",");
    const unflattened = methods.unflattenValues(contents, 11);
    expect(unflattened).toEqual([
      ["0", "0", "1", "1", "2", "0", "0", "1", "1", "2", "2"],
      ["0", "0", "0", "0", "0", "1", "1", "1", "1", "1", "1"],
      ["0", "1", "0", "1", "0", "0", "1", "0", "1", "0", "1"],
      ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
      ["100", "68", "73", "41", "10", "30", "36", "51", "38", "15", "4"],
    ]);
  });

  it("returns an empty list if it receives an empty list", () => {
    const contents = [];
    const unflattened = methods.unflattenValues(contents, 0);
    expect(unflattened).toEqual([]);
  });
});

describe("Test convertFromStringToUnflattenedMatrix", () => {
  it("unflattens a comma-separated string into a proper number and size of arrays", () => {
    const contents = FLATTENED_VALUES;
    const unflattened = methods.convertFromStringToUnflattenedMatrix(
      contents,
      11
    );
    expect(unflattened).toEqual([
      ["0", "0", "1", "1", "2", "0", "0", "1", "1", "2", "2"],
      ["0", "0", "0", "0", "0", "1", "1", "1", "1", "1", "1"],
      ["0", "1", "0", "1", "0", "0", "1", "0", "1", "0", "1"],
      ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
      ["100", "68", "73", "41", "10", "30", "36", "51", "38", "15", "4"],
    ]);
  });

  it("returns an empty list if it receives an empty string", () => {
    const unflattened = methods.convertFromStringToUnflattenedMatrix("", 0);
    expect(unflattened).toEqual([]);
  });
});

describe("Test validateMetadata", () => {
  it("correctly validates against undefined metadata.total_data_points", () => {
    const metadata = {
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month", ["11", "12"]],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata has undefined or null "total_data_points"'
    );
  });

  it("correctly validates against null metadata.total_data_points", () => {
    const metadata = {
      total_data_points: null,
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month", ["11", "12"]],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata has undefined or null "total_data_points"'
    );
  });

  it("correctly validates against a non-numeric metadata.total_data_points", () => {
    const metadata = {
      total_data_points: "lots of em",
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month", ["11", "12"]],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata has a non-numeric value for "total_data_points": lots of em'
    );
  });

  it("correctly validates against a non-array metadata.value_keys", () => {
    const metadata = {
      total_data_points: 11,
      value_keys: "total_revocations",
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month", ["11", "12"]],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata requires a non-empty array of value keys, but "value_keys" equals total_revocations'
    );
  });

  it("correctly validates against empty metadata.value_keys", () => {
    const metadata = {
      total_data_points: 11,
      value_keys: [],
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month", ["11", "12"]],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata requires a non-empty array of value keys, but "value_keys" equals '
    );
  });

  it("correctly validates against a non-array metadata.dimension_manifest", () => {
    const metadata = {
      total_data_points: 11,
      value_keys: ["total_revocations"],
      dimension_manifest: "something else entirely",
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata requires a non-empty array of dimension ranges, but "dimension_manifest" equals something else entirely'
    );
  });

  it("correctly validates against empty metadata.dimension_manifest", () => {
    const metadata = {
      total_data_points: 11,
      value_keys: ["total_revocations"],
      dimension_manifest: [],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      'Given metric file metadata requires a non-empty array of dimension ranges, but "dimension_manifest" equals '
    );
  });

  it("correctly validates against malformed metadata.dimension_manifest", () => {
    const metadata = {
      total_data_points: 11,
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month"],
        ["supervision_type", "parole", "probation"],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      "Given metric file dimension manifest contains malformed dimensions that are not tuples: month, supervision_type,parole,probation"
    );
  });

  it("correctly validates against non-array dimension ranges in metadata.dimension_manifest", () => {
    const metadata = {
      total_data_points: 11,
      value_keys: ["total_revocations"],
      dimension_manifest: [
        ["district", ["4", "5", "6"]],
        ["month", "11"],
        ["supervision_type", ["parole", "probation"]],
        ["year", ["2020"]],
      ],
    };

    expect(() => {
      methods.validateMetadata(metadata);
    }).toThrow(
      "Given metric file dimension manifest contains dimensions with a set of possible values that is not an array: month"
    );
  });
});
