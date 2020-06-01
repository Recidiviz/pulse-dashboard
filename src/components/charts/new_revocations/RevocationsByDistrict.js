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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import pattern from "patternomaly";

import DataSignificanceWarningIcon from "../DataSignificanceWarningIcon";
import ExportMenu from "../ExportMenu";
import Loading from "../../Loading";

// eslint-disable-next-line import/no-cycle
import { useAuth0 } from "../../../react-auth0-spa";
import { fetchChartData, awaitingResults } from "../../../utils/metricsClient";

import { COLORS } from "../../../assets/scripts/constants/colors";
import { axisCallbackForMetricType } from "../../../utils/charts/axis";
import {
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../../../utils/charts/significantStatistics";
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
  toggleLabel,
  updateTooltipForMetricTypeWithCounts,
} from "../../../utils/charts/toggles";
import { toInt } from "../../../utils/transforms/labels";

const chartId = "revocationsByDistrict";

const RevocationsByDistrict = ({
  currentDistrict,
  dataFilter,
  filterStates,
  metricPeriodMonths,
  skippedFilters,
  treatCategoryAllAsAbsent,
}) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [numeratorCounts, setNumeratorCounts] = useState([]);
  const [denominatorCounts, setDenominatorCounts] = useState([]);
  const [mode, setMode] = useState("counts"); // counts | rates

  const { loading, user, getTokenSilently } = useAuth0();
  const [revocationApiData, setRevocationApiData] = useState({});
  const [awaitingRevocationApi, setAwaitingRevocationApi] = useState(true);
  const [supervisionApiData, setSupervisionApiData] = useState({});
  const [awaitingSupervisionApi, setAwaitingSupervisionApi] = useState(true);

  const averageValue = Math.floor(
    chartDataPoints.reduce((acc, val) => acc + parseInt(val, 10), 0) /
      chartDataPoints.length
  );

  const timeDescription = `${getTrailingLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  )} (${getPeriodLabelFromMetricPeriodMonthsToggle(metricPeriodMonths)})`;

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominatorCounts
  );

  const handleModeChanging = (newMode) => {
    setMode(newMode);
  };

  useEffect(() => {
    fetchChartData(
      "us_mo",
      "newRevocations",
      "revocations_matrix_distribution_by_district",
      setRevocationApiData,
      setAwaitingRevocationApi,
      getTokenSilently
    );
  }, [getTokenSilently]);

  useEffect(() => {
    fetchChartData(
      "us_mo",
      "newRevocations",
      "revocations_matrix_supervision_distribution_by_district",
      setSupervisionApiData,
      setAwaitingSupervisionApi,
      getTokenSilently
    );
  }, [getTokenSilently]);

  useEffect(() => {
    if (
      awaitingRevocationApi ||
      awaitingSupervisionApi ||
      (!revocationApiData && !supervisionApiData)
    ) {
      return;
    }
    const filteredRevocationData = dataFilter(
      revocationApiData,
      skippedFilters,
      treatCategoryAllAsAbsent
    );
    const filteredSupervisionData = dataFilter(
      supervisionApiData,
      skippedFilters,
      treatCategoryAllAsAbsent
    );

    const districtToCount = filteredRevocationData.reduce(
      (result, { district, population_count: populationCount }) => {
        return {
          ...result,
          [district]: (result[district] || 0) + (toInt(populationCount) || 0),
        };
      },
      {}
    );

    // Explicitly remove the All district, if provided, for this by-district chart
    delete districtToCount.ALL;

    const supervisionDistributions = filteredSupervisionData.reduce(
      (result, { district, total_population: totalPopulation }) => {
        return {
          ...result,
          [district]: (result[district] || 0) + (toInt(totalPopulation) || 0),
        };
      },
      {}
    );
    // Explicitly remove the All district, if provided, for this by-district chart
    delete supervisionDistributions.ALL;

    const getRate = (district) =>
      (
        100 *
        (districtToCount[district] / supervisionDistributions[district])
      ).toFixed(2);

    const sortedDistrictCounts = Object.entries(districtToCount).sort(
      (a, b) => b[1] - a[1]
    );

    // Sort bars by decreasing count or rate
    const sorted =
      mode === "counts"
        ? sortedDistrictCounts
        : sortedDistrictCounts
            .map((entry) => [entry[0], getRate(entry[0])])
            .sort((a, b) => b[1] - a[1]);

    const sortedDataPoints = sorted.map((entry) => entry[1]);
    setChartDataPoints(sortedDataPoints);

    const sortedLabels = sorted.map((entry) => entry[0]);
    setChartLabels(sortedLabels);

    setNumeratorCounts(sorted.map((entry) => districtToCount[entry[0]]));
    setDenominatorCounts(
      sorted.map((entry) => supervisionDistributions[entry[0]])
    );
  }, [
    awaitingRevocationApi,
    awaitingSupervisionApi,
    revocationApiData,
    supervisionApiData,
    mode,
    dataFilter,
    skippedFilters,
    treatCategoryAllAsAbsent,
  ]);

  const barBackgroundColor = ({ dataIndex }) => {
    let color =
      currentDistrict &&
      currentDistrict.toLowerCase() === chartLabels[dataIndex].toLowerCase()
        ? COLORS["lantern-light-blue"]
        : COLORS["lantern-orange"];

    if (
      mode === "rates" &&
      !isDenominatorStatisticallySignificant(denominatorCounts[dataIndex])
    ) {
      color = pattern.draw("diagonal-right-left", color, "#ffffff", 5);
    }

    return color;
  };

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: toggleLabel(
              {
                counts: "Revocations",
                rates: "Percent revoked",
              },
              mode
            ),
            backgroundColor: barBackgroundColor,
            data: chartDataPoints,
          },
        ],
      }}
      options={{
        annotation: {
          drawTime: "afterDatasetsDraw",
          annotations: [
            {
              drawTime: "afterDraw",
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              value: averageValue,
              borderColor: "#72777a",
              borderWidth: 2,
              label: {
                backgroundColor: "transparent",
                fontColor: "#72777a",
                fontStyle: "normal",
                enabled: true,
                content: "State average",
                position: "right",
                yAdjust: -10,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "District",
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              id: "y-axis-0",
              scaleLabel: {
                display: true,
                labelString: toggleLabel(
                  {
                    counts: "Number of people revoked",
                    rates: "Percent revoked",
                  },
                  mode
                ),
              },
              stacked: true,
              ticks: {
                callback: axisCallbackForMetricType(mode === "rates"),
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          footerFontSize: 9,
          mode: "index",
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) =>
              updateTooltipForMetricTypeWithCounts(
                mode,
                tooltipItem,
                data,
                numeratorCounts,
                denominatorCounts
              ),
            footer: (tooltipItem) =>
              mode === "rates" &&
              tooltipForFooterWithCounts(tooltipItem, denominatorCounts),
          },
        },
      }}
    />
  );

  if (
    awaitingResults(loading, user, awaitingRevocationApi) ||
    awaitingResults(loading, user, awaitingSupervisionApi)
  ) {
    return <Loading />;
  }

  return (
    <div>
      <h4>
        Revocations by district
        {mode === "rates" && showWarning === true && (
          <DataSignificanceWarningIcon />
        )}
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Revocations by district"
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>

      <div
        id="modeButtons"
        className="pB-20 btn-group btn-group-toggle"
        data-toggle="buttons"
      >
        <label
          id="countModeButton"
          className="btn btn-sm btn-outline-primary active"
          htmlFor="countMode"
          onClick={() => handleModeChanging("counts")}
        >
          <input
            type="radio"
            name="modes"
            id="countMode"
            value="counts"
            autoComplete="off"
          />
          Revocation count
        </label>
        <label
          id="rateModeButton"
          className="btn btn-sm btn-outline-primary"
          htmlFor="rateMode"
          onClick={() => handleModeChanging("rates")}
        >
          <input
            type="radio"
            name="modes"
            id="rateMode"
            value="rates"
            autoComplete="off"
          />
          Percent revoked
        </label>
      </div>

      <div className="static-chart-container fs-block">{chart}</div>
    </div>
  );
};

RevocationsByDistrict.defaultProps = {
  treatCategoryAllAsAbsent: undefined,
};

RevocationsByDistrict.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dataFilter: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filterStates: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  skippedFilters: PropTypes.array.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  currentDistrict: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  treatCategoryAllAsAbsent: PropTypes.any,
};

export default RevocationsByDistrict;
