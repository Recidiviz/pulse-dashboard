// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

/*
 * The logic for these trendline calculations was based on this linear trendline
 * plugin for Chart.js: https://github.com/Makanz/chartjs-plugin-trendline
 */
function TrendlineFitter() {
  this.count = 0;
  this.sumX = 0;
  this.sumX2 = 0;
  this.sumXY = 0;
  this.sumY = 0;
  this.minx = 1e100;
  this.maxx = -1e100;
}

TrendlineFitter.prototype = {
  add: function add(x, y) {
    this.count += 1;
    this.sumX += x;
    this.sumX2 += x * x;
    this.sumXY += x * y;
    this.sumY += y;
    if (x < this.minx) this.minx = x;
    if (x > this.maxx) this.maxx = x;
  },
  f: function f(x) {
    const det = this.count * this.sumX2 - this.sumX * this.sumX;
    const offset = (this.sumX2 * this.sumY - this.sumX * this.sumXY) / det;
    const scale = (this.count * this.sumXY - this.sumX * this.sumY) / det;
    return offset + x * scale;
  },
};

/**
 * Calculates the values of a linear trendline for the given `dataPoints`.
 */
function trendlineData(dataPoints) {
  const fitter = new TrendlineFitter();

  dataPoints.forEach((data, index) => {
    const dataValue = parseFloat(data, 10);
    fitter.add(index, dataValue);
  });

  const y1 = (fitter.f(fitter.minx));
  const y2 = (fitter.f(fitter.maxx));

  const overallDelta = y2 - y1;
  const incrementalDelta = overallDelta / dataPoints.length;

  const trendlineValues = [];

  for (let i = 0; i < dataPoints.length; i += 1) {
    trendlineValues[i] = y1 + (i * incrementalDelta);
  }

  return trendlineValues;
}

function generateTrendlineDataset(chartDataPoints, lineColor) {
  return {
    label: 'trendline',
    backgroundColor: lineColor,
    borderColor: lineColor,
    fill: false,
    pointRadius: 0,
    hitRadius: 0,
    hoverRadius: 0,
    borderWidth: 1.5,
    lineTension: 0,
    data: trendlineData(chartDataPoints),
  };
}

/**
 * Returns the slope of the linear trendline with the given values.
 */
function trendlineSlope(trendlineValues) {
  if (!trendlineValues) {
    return 0;
  }

  const firstValue = trendlineValues[0];
  const lastValue = trendlineValues[trendlineValues.length - 1];
  return (lastValue - firstValue) / trendlineValues.length;
}

/**
 * Returns the string value for a tooltip that excludes information about
 * trendline data points.
 * Appends the `units` string to the data yLabel value if provided.
 */
function getTooltipWithoutTrendline(tooltipItem, data, units) {
  const { label } = data.datasets[tooltipItem.datasetIndex];
  if (label === 'trendline') return '';
  let tooltipLabel = (tooltipItem.yLabel).toString();
  if (units) {
    tooltipLabel = tooltipLabel.concat(units);
  }

  return tooltipLabel;
}

export {
  generateTrendlineDataset,
  getTooltipWithoutTrendline,
  trendlineSlope,
  trendlineData,
};
