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
const { default: BaseMetrics } = require("./BaseMetrics");

class NewRevocationsMetrics extends BaseMetrics {
  getValidDimensionsForMetric(fileName) {
    return this.metrics[fileName].dimensions;
  }

  static formatInvalidDimensions(invalidDimensions) {
    return Object.keys(invalidDimensions)
      .map((dimensionKey) => {
        return `${dimensionKey}: ${invalidDimensions[dimensionKey].join(", ")}`;
      })
      .join(", ");
  }

  validateDimensionsForFile(fileName, sourceDimensions) {
    const validDimensions = this.getValidDimensionsForMetric(fileName);
    const invalidDimensions = {};

    if (!validDimensions || !sourceDimensions) {
      // eslint-disable-next-line no-console
      console.log(`Skipping dimensions validations for ${fileName}`);
      return;
    }

    sourceDimensions.forEach(([dimensionKey, sourceDimensionValues]) => {
      const validDimensionValues = validDimensions[dimensionKey];

      if (!validDimensionValues) {
        return;
      }

      sourceDimensionValues.forEach((sourceDimensionValue) => {
        if (!validDimensionValues.includes(sourceDimensionValue)) {
          if (!invalidDimensions[dimensionKey]) {
            invalidDimensions[dimensionKey] = [];
          }
          invalidDimensions[dimensionKey].push(sourceDimensionValue);
        }
      });
    });

    if (Object.keys(invalidDimensions).length > 0) {
      throw new Error(
        `${fileName} includes unexpected dimension values: ${this.constructor.formatInvalidDimensions(
          invalidDimensions
        )}`
      );
    }
  }
}

exports.default = NewRevocationsMetrics;
