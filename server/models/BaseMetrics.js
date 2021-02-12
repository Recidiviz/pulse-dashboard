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
const { default: METRICS } = require("./metrics");
/**
 * The base class for all metrics. Use the helper `getMetricsByType` to instantiate a metric
 * by metricType and stateCode.
 */
class BaseMetrics {
  metricType;

  stateCode;

  metrics;

  constructor(metricType, stateCode) {
    this.stateCode = stateCode;
    this.metricType = metricType;
    this.metrics = METRICS[stateCode][metricType];
  }

  getAllFiles() {
    return Object.keys(this.metrics).map(
      (metric) => this.metrics[metric].filename
    );
  }

  getFile(fileKey) {
    const metric = this.metrics[fileKey];
    if (!metric) {
      throw new Error(
        `${fileKey} not found with either txt or json extension for metric type ${this.metricType}`
      );
    }
    return metric.filename;
  }

  getFiles(file = null) {
    if (file) {
      return [this.getFile(file)];
    }
    return this.getAllFiles();
  }

  validateDimensionsForFile(metricName, sourceDimensions) {
    // eslint-disable-next-line no-console
    console.log(
      `${this.metricType} - Source dimensions for ${metricName} validations skipped: ${sourceDimensions}`
    );
  }
}

exports.default = BaseMetrics;
