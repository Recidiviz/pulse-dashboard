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

import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import groupBy from "lodash/fp/groupBy";
import filter from "lodash/fp/filter";
import flatten from "lodash/fp/flatten";
import kebabCase from "lodash/fp/kebabCase";
import map from "lodash/fp/map";
import mapValues from "lodash/fp/mapValues";
import mergeAllWith from "lodash/fp/mergeAllWith";
import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";
import set from "lodash/fp/set";
import sortBy from "lodash/fp/sortBy";
import toInteger from "lodash/fp/toInteger";
import upperCase from "lodash/fp/upperCase";
import values from "lodash/fp/values";

import { COLORS } from "../../../../assets/scripts/constants/colors";
import { numberFromOfficerId } from "../../../../utils/transforms/labels";
import {
  filterDatasetBySupervisionType,
  filterDatasetByMetricPeriodMonths,
  updateTooltipForMetricType,
  toggleLabel,
  toggleYAxisTicksStackedRateBasicCount,
} from "../../../../utils/charts/toggles";

const sum = (a, b) => a + b;

/**
 * Checks if officer has valid name or not empty
 */
const isValidOfficer = (offices) => ({
  officer_external_id: officerIDRaw,
  district: officeId,
}) => {
  const officeName = offices[toInteger(officeId)];
  return officeName && officerIDRaw !== "OFFICER_UNKNOWN";
};

const isValidOffice = (visibleOffices) => ({ district: officeId }) => {
  if (visibleOffices.length === 1 && visibleOffices[0] === "all") {
    return true;
  }
  return visibleOffices.includes(officeId);
};

/**
 * Organizes the labels and data points so the chart can display the values
 * for the officers in the given `visibleOffice`.
 * `dataPoints` must be a dictionary where the office names are the keys,
 * and the values are arrays of dictionaries with values for the following keys:
 *    - officerID
 *    - violationsByType
 * Returns an array of officer ID labels and a dictionary of data points for
 * each violation type.
 */
const prepareData = (bars, metricType) => (data) => {
  const officerId = numberFromOfficerId(data.officer_external_id);

  const violationCountsByType = reduce(
    (counts, { key }) => ({ ...counts, [key]: toInteger(data[key]) }),
    {},
    bars
  );

  if (metricType === "counts") {
    return {
      officerId,
      violationsByType: violationCountsByType,
    };
  }
  if (metricType === "rates") {
    const totalCount = pipe(values, reduce(sum, 0))(violationCountsByType);
    const violationRatesByType = mapValues(
      (count) => 100 * (count / totalCount),
      violationCountsByType
    );

    return {
      officerId,
      violationsByType: violationRatesByType,
    };
  }
  return null;
};

const PerOfficerBarChart = ({
  chartId,
  // exportLabel,
  countsPerPeriodPerOfficer,
  metricType,
  metricPeriodMonths,
  supervisionType,
  district: visibleOffices,
  officeData,
  bars,
  yAxisLabel,
  barColorPalette,
}) => {
  const offices = reduce(
    (acc, { district: officeId, site_name: officeName }) =>
      set(officeId, kebabCase(officeName), acc),
    {},
    officeData
  );

  const normalizedData = pipe(
    // filter data
    (data) => filterDatasetBySupervisionType(data, upperCase(supervisionType)),
    (data) => filterDatasetByMetricPeriodMonths(data, metricPeriodMonths),
    filter(isValidOffice(visibleOffices)),
    filter(isValidOfficer(offices)),
    // transform data
    groupBy("district"),
    mapValues(map(prepareData(bars, metricType))),
    values,
    flatten,
    sortBy("officerId")
  )(countsPerPeriodPerOfficer);

  const officerLabels = map("officerId", normalizedData);

  const officerViolationCountsByType = pipe(
    map("violationsByType"),
    mergeAllWith((objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
      return [objValue, srcValue];
    })
  )(normalizedData);

  // configureDownloads(
  //   officerLabels,
  //   officerViolationCountsByType,
  //   offices,
  //   visibleOffices
  // );

  const chartLabels = officerLabels;
  const allDataPoints = officerViolationCountsByType;

  return (
    <Bar
      id={chartId}
      redraw // This forces a redraw of the entire chart on every change
      data={{
        labels: chartLabels,
        datasets: bars.map((bar, i) => ({
          label: bar.label,
          backgroundColor: barColorPalette[i],
          hoverBackgroundColor: barColorPalette[i],
          hoverBorderColor: barColorPalette[i],
          data: allDataPoints[bar.key],
        })),
      }}
      options={{
        responsive: true,
        legend: {
          position: "bottom",
          boxWidth: 10,
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "index",
          intersect: false,
          callbacks: {
            title: (tooltipItem) => "Officer ".concat(tooltipItem[0].label),
            label: (tooltipItem, data) =>
              updateTooltipForMetricType(metricType, tooltipItem, data),
          },
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Officer ID",
              },
              stacked: true,
              ticks: {
                display: true,
                autoSkip: false,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  { [metricType]: yAxisLabel },
                  metricType
                ),
              },
              stacked: true,
              ticks: toggleYAxisTicksStackedRateBasicCount(
                metricType,
                undefined
              ),
            },
          ],
        },
      }}
    />
  );
};

PerOfficerBarChart.defaultProps = {
  countsPerPeriodPerOfficer: {},
};

PerOfficerBarChart.propTypes = {
  chartId: PropTypes.string.isRequired,
  countsPerPeriodPerOfficer: PropTypes.arrayOf(PropTypes.shape({})),
  metricType: PropTypes.string.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  officeData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  bars: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  barColorPalette: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PerOfficerBarChart;

// function configureDownloads(
//   officerLabels,
//   officerViolationCountsByType,
//   offices,
//   visibleOffices,
//   exportLabel,
//   bars
// ) {
//   const exportedStructureCallback = () => ({
//     office: visibleOffices.join(", "),
//     metric: exportLabel,
//     series: [],
//   });

//   const downloadableDataFormat = bars.map((bar) => ({
//     label: bar.label,
//     data: officerViolationCountsByType[bar.key],
//   }));

//   const humanReadableOfficerLabels = officerLabels.map(
//     (element) => `Officer ${element}`
//   );

//   let officeReadable = toHumanReadable(visibleOffice).toUpperCase();
//   if (officeReadable !== "ALL") {
//     const officeName = offices[toInt(visibleOffice)];
//     if (officeName) {
//       officeReadable = toHumanReadable(officeName).toUpperCase();
//     }
//   }
//   const chartTitle = `${exportLabel.toUpperCase()} - ${officeReadable}`;

//   const convertValuesToNumbers = false;

//   configureDownloadButtons(
//     chartId,
//     chartTitle,
//     downloadableDataFormat,
//     humanReadableOfficerLabels,
//     document.getElementById(chartId),
//     exportedStructureCallback,
//     props,
//     convertValuesToNumbers
//   );
// }
