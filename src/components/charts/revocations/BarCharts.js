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

import { COLORS } from '../../../assets/scripts/constants/colors';
import {
  toggleLabel, filterDatasetBySupervisionType, filterDatasetByMetricPeriodMonths,
  getMonthCountFromMetricPeriodMonthsToggle, updateTooltipForMetricType,
  toggleYAxisTicksStackedRateBasicCount,
} from '../../../utils/charts/toggles';
import { sortFilterAndSupplementMostRecentMonths } from '../../../utils/transforms/datasets';
import { monthNamesWithYearsFromNumbers } from '../../../utils/transforms/months';
import {
  toHtmlFriendly, toHumanReadable, toInt, numberFromOfficerId,
} from '../../../utils/transforms/labels';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';

export const getPerMonthChartDefinition = ({
  chartId,
  countsByMonth,
  metricType,
  numMonths,
  filters,
  bars,
  yAxisLabel,
  barColorPalette,
}) => {
  // TODO(233): Try to streamline this function more.
  const filteredCountsByMonth = countsByMonth.filter((entry) => {
    for (const key in filters) {
      if (String(entry[key]).toUpperCase() !== String(filters[key].toUpperCase())) return false;
    }

    return true;
  });

  const dataPoints = [];
  if (filteredCountsByMonth) {
    filteredCountsByMonth.forEach((data) => {
      const { year, month } = data;

      const monthCounts = bars
        .map((bar) => bar.key)
        .reduce((monthCounts, key) => Object.assign(monthCounts, { [key]: Number(data[key]) }), {});

      const totalCount = Object.values(monthCounts).reduce((total, val) => total + Number(val), 0);

      if (metricType === 'counts') {
        dataPoints.push({ year, month, monthDict: monthCounts });
      } else if (metricType === 'rates') {
        const monthRates = {};
        Object.keys(monthCounts).forEach((key) => {
          const count = monthCounts[key];
          monthRates[key] = Number((100 * (count / totalCount)).toFixed(2));
        });

        dataPoints.push({ year, month, monthDict: monthRates });
      }
    });
  }

  const emptyMonthDict = bars
    .map((bar) => bar.key)
    .reduce((monthCounts, key) => Object.assign(monthCounts, { [key]: 0 }), {});

  const months = getMonthCountFromMetricPeriodMonthsToggle(numMonths);
  const sorted = sortFilterAndSupplementMostRecentMonths(dataPoints, months, 'monthDict', emptyMonthDict);
  const monthsLabels = [];

  const dataArrays = bars
    .map((bar) => bar.key)
    .reduce((monthCounts, key) => Object.assign(monthCounts, { [key]: [] }), {});

  for (let i = 0; i < months; i += 1) {
    monthsLabels.push(sorted[i].month);
    const data = sorted[i].monthDict;
    Object.keys(data).forEach((dataType) => {
      dataArrays[dataType].push(data[dataType]);
    });
  }

  const chartLabels = monthNamesWithYearsFromNumbers(monthsLabels, false);

  const datasets = bars.map((bar, i) => ({
    label: bar.label,
    backgroundColor: barColorPalette[i],
    hoverBackgroundColor: barColorPalette[i],
    hoverBorderColor: barColorPalette[i],
    data: dataArrays[bar.key],
  }));

  return {
    id: chartId,
    data: {
      labels: chartLabels,
      datasets,
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
        boxWidth: 10,
      },
      tooltips: {
        backgroundColor: COLORS['grey-800-light'],
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem, data) => updateTooltipForMetricType(
            metricType, tooltipItem, data,
          ),
        },
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
          stacked: true,
        }],
        yAxes: [{
          ticks: toggleYAxisTicksStackedRateBasicCount(metricType, undefined),
          scaleLabel: {
            display: true,
            labelString: toggleLabel(
              { [metricType]: yAxisLabel },
              metricType,
            ),
          },
          stacked: true,
        }],
      },
    },
  };
};

export const getPerOfficerChartDefinition = (props) => {
  // TODO(233): Streamline this function more.
  const {
    chartId,
    exportLabel,
    countsPerPeriodPerOfficer,
    metricType,
    metricPeriodMonths,
    supervisionType,
    district: visibleOffice,
    officeData,
    bars,
    yAxisLabel,
    barColorPalette,
  } = props;

  let chartLabels;
  let displayOfficerIds = true;

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
  function getDataForVisibleOffice(dataPoints, visibleOffice) {
    const officerLabels = [];

    const officerViolationCountsByType = bars
      .map((bar) => bar.key)
      .reduce((counts, key) => Object.assign(counts, { [key]: [] }), {});

    let visibleOfficeData = [];

    if (visibleOffice === 'all') {
      Object.keys(dataPoints).forEach((office) => {
        dataPoints[office].forEach((officerData) => {
          visibleOfficeData.push(officerData);
        });
      });
    } else {
      visibleOfficeData = dataPoints[visibleOffice];
    }

    if (visibleOfficeData) {
      const sortedDataPoints = visibleOfficeData.sort((a, b) => (
        a.officerId - b.officerId));

      for (let i = 0; i < sortedDataPoints.length; i += 1) {
        officerLabels.push(sortedDataPoints[i].officerId);
        const countsByType = sortedDataPoints[i].violationsByType;
        Object.keys(countsByType).forEach((violationType) => {
          officerViolationCountsByType[violationType].push(countsByType[violationType]);
        });
      }
    }

    return { officerLabels, officerViolationCountsByType };
  }

  let allDataPoints;

  /**
   * Sets the labels and data points of the chart to display the values for the
   * officers in the given `visibleOffice`.
   */
  function setDataForVisibleOffice(
    officerLabels, officerViolationCountsByType, visibleOffice,
  ) {
    if (visibleOffice.toLowerCase() === 'all') {
      displayOfficerIds = false;
    } else {
      displayOfficerIds = true;
    }

    chartLabels = officerLabels;

    allDataPoints = officerViolationCountsByType;
  }

  function configureDownloads(
    officerLabels, officerViolationCountsByType, offices, visibleOffice,
  ) {
    const exportedStructureCallback = () => (
      {
        office: visibleOffice,
        metric: exportLabel,
        series: [],
      });

    const downloadableDataFormat = bars.map((bar) => ({
      label: bar.label,
      data: officerViolationCountsByType[bar.key],
    }));

    const humanReadableOfficerLabels = officerLabels.map((element) => `Officer ${element}`);
    let officeReadable = toHumanReadable(visibleOffice).toUpperCase();
    if (officeReadable !== 'ALL') {
      const officeName = offices[toInt(visibleOffice)];
      if (officeName) {
        officeReadable = toHumanReadable(officeName).toUpperCase();
      }
    }
    const chartTitle = `${exportLabel.toUpperCase()} - ${officeReadable}`;

    const convertValuesToNumbers = false;
    configureDownloadButtons(chartId, chartTitle,
      downloadableDataFormat, humanReadableOfficerLabels, document.getElementById(chartId),
      exportedStructureCallback, props, convertValuesToNumbers);
  }

  const offices = {};
  const officeIds = [];

  if (officeData) {
    officeData.forEach((office) => {
      const {
        district: officeId,
        site_name: officeName,
      } = office;

      offices[officeId] = toHtmlFriendly(officeName).toLowerCase();
      officeIds.push(officeId);
    });
  }

  const countsByOfficerAndSupervisionType = filterDatasetBySupervisionType(
    countsPerPeriodPerOfficer, supervisionType.toUpperCase(),
  );

  const countsByOfficerAndTime = filterDatasetByMetricPeriodMonths(
    countsByOfficerAndSupervisionType, metricPeriodMonths,
  );

  const dataPoints = {};

  if (countsByOfficerAndTime) {
    countsByOfficerAndTime.forEach((data) => {
      const {
        officer_external_id: officerIDRaw, district: officeId,
      } = data;

      const violationCountsByType = bars
        .map((bar) => bar.key)
        .reduce((counts, key) => Object.assign(counts, { [key]: toInt(data[key]) }), {});

      const totalCount = Object.values(violationCountsByType)
        .reduce((total, val) => total + val, 0);

      const officeName = offices[toInt(officeId)];

      if (officeName && officerIDRaw !== 'OFFICER_UNKNOWN') {
        const officerId = numberFromOfficerId(officerIDRaw);
        if (dataPoints[officeId] == null) {
          dataPoints[officeId] = [];
        }

        if (metricType === 'counts') {
          dataPoints[officeId].push({
            officerId,
            violationsByType: violationCountsByType,
          });
        } else if (metricType === 'rates') {
          const violationRatesByType = {};
          Object.keys(violationCountsByType).forEach((key) => {
            const count = violationCountsByType[key];
            violationRatesByType[key] = (100 * (count / totalCount)).toFixed(2);
          });

          dataPoints[officeId].push({
            officerId,
            violationsByType: violationRatesByType,
          });
        }
      }
    });

    const {
      officerLabels, officerViolationCountsByType,
    } = getDataForVisibleOffice(dataPoints, String(visibleOffice));
    setDataForVisibleOffice(officerLabels, officerViolationCountsByType, visibleOffice);
    configureDownloads(officerLabels, officerViolationCountsByType, offices, visibleOffice);
  }

  return {
    id: chartId,
    redraw: true, // This forces a redraw of the entire chart on every change
    data: {
      labels: chartLabels,
      datasets: bars.map((bar, i) => ({
        label: bar.label,
        backgroundColor: barColorPalette[i],
        hoverBackgroundColor: barColorPalette[i],
        hoverBorderColor: barColorPalette[i],
        data: allDataPoints[bar.key],
      })),
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
        boxWidth: 10,
      },
      tooltips: {
        backgroundColor: COLORS['grey-800-light'],
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItem) => ('Officer '.concat(tooltipItem[0].label)),
          label: (tooltipItem, data) => updateTooltipForMetricType(
            metricType, tooltipItem, data,
          ),
        },
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Officer ID',
          },
          stacked: true,
          ticks: {
            display: displayOfficerIds,
            autoSkip: false,
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: toggleLabel(
              { [metricType]: yAxisLabel },
              metricType,
            ),
          },
          stacked: true,
          ticks: toggleYAxisTicksStackedRateBasicCount(metricType, undefined),
        }],
      },
    },
  };
};
