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
const { COLLECTIONS } = require("../constants/collections");
const { default: getCollectionsByStateCode } = require("./resources");
/**
 * The base class for all metrics. Use the helper `getResourcesByType` to instantiate a metric
 * by metricType and stateCode.
 */
class BaseMetrics {
  metricType;

  stateCode;

  metrics;

  constructor(metricType, stateCode) {
    this.constructor.validateMetricType(metricType);
    this.stateCode = stateCode;
    this.metricType = metricType;
    this.metrics = getCollectionsByStateCode(stateCode)[metricType];
  }

  static validateMetricType(metricType) {
    if (!Object.values(COLLECTIONS).includes(metricType)) {
      throw new Error(
        `Cannot instantiate BaseMetrics with metricType: ${metricType}`
      );
    }
  }

  getAllFileNames() {
    return Object.keys(this.metrics).map((metricName) =>
      this.getFileName(metricName)
    );
  }

  getFileName(metricName) {
    const metric = this.metrics[metricName];
    if (!metric) {
      throw new Error(
        `${metricName} file not found with either txt or json extension for metric type ${this.metricType}`
      );
    }
    return metric.filename;
  }

  getFileNamesList(metricName = null) {
    if (metricName) {
      return [this.getFileName(metricName)];
    }
    return this.getAllFileNames();
  }

  validateDimensionsForFile(metricName, sourceDimensions) {
    // eslint-disable-next-line no-console
    console.log(
      `${this.metricType} - Source dimensions for ${metricName} validations skipped: ${sourceDimensions}`
    );
  }
}

exports.default = BaseMetrics;
