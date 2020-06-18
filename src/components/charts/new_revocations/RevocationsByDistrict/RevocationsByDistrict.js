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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import pattern from "patternomaly";
import pipe from "lodash/fp/pipe";

import {
  calculateAverageRate,
  sortByCount,
  sortByRate,
  groupRevocationDataByDistrict,
  groupSupervisionDataByDistrict,
  mergeRevocationData,
} from "./helpers";

import DataSignificanceWarningIcon from "../../DataSignificanceWarningIcon";
import ExportMenu from "../../ExportMenu";
import Loading from "../../../Loading";

import { COLORS } from "../../../../assets/scripts/constants/colors";
// eslint-disable-next-line import/no-cycle
import { useAuth0 } from "../../../../react-auth0-spa";
import {
  fetchChartData,
  awaitingResults,
} from "../../../../utils/metricsClient";
import { axisCallbackForMetricType } from "../../../../utils/charts/axis";
import {
  isDenominatorStatisticallySignificant,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithCounts,
} from "../../../../utils/charts/significantStatistics";
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
  toggleLabel,
  updateTooltipForMetricTypeWithCounts,
} from "../../../../utils/charts/toggles";

const chartId = "revocationsByDistrict";

const RevocationsByDistrict = ({
  currentDistrict,
  dataFilter: filterData,
  filterStates,
  metricPeriodMonths,
  skippedFilters,
  treatCategoryAllAsAbsent,
  stateCode,
}) => {
  const [mode, setMode] = useState("counts"); // counts | rates

  const { loading, user, getTokenSilently } = useAuth0();
  const [revocationApiData, setRevocationApiData] = useState({});
  const [awaitingRevocationApi, setAwaitingRevocationApi] = useState(true);
  const [supervisionApiData, setSupervisionApiData] = useState({});
  const [awaitingSupervisionApi, setAwaitingSupervisionApi] = useState(true);

  const timeDescription = `${getTrailingLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  )} (${getPeriodLabelFromMetricPeriodMonthsToggle(metricPeriodMonths)})`;

  const handleModeChanging = (newMode) => {
    setMode(newMode);
  };

  useEffect(() => {
    fetchChartData(
      stateCode,
      "newRevocations",
      "revocations_matrix_distribution_by_district",
      setRevocationApiData,
      setAwaitingRevocationApi,
      getTokenSilently
    );

    fetchChartData(
      "us_mo",
      "newRevocations",
      "revocations_matrix_supervision_distribution_by_district",
      setSupervisionApiData,
      setAwaitingSupervisionApi,
      getTokenSilently
    );
  }, [getTokenSilently, stateCode]);

  if (
    awaitingResults(loading, user, awaitingRevocationApi) ||
    awaitingResults(loading, user, awaitingSupervisionApi)
  ) {
    return <Loading />;
  }

  const filteredRevocationData = filterData(
    revocationApiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );

  const filteredSupervisionData = filterData(
    supervisionApiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );

  const mergedRevocationData = pipe(
    mergeRevocationData,
    mode === "counts" ? sortByCount : sortByRate
  )(
    groupRevocationDataByDistrict(filteredRevocationData),
    groupSupervisionDataByDistrict(filteredSupervisionData)
  );

  const averageRate = calculateAverageRate(
    filteredRevocationData,
    filteredSupervisionData
  );

  const dataPoints =
    mode === "counts"
      ? mergedRevocationData.map((item) => item.count)
      : mergedRevocationData.map((item) => item.rate.toFixed(2));

  const labels = mergedRevocationData.map((item) => item.district);
  const numerators = mergedRevocationData.map((item) => item.count);
  const denominators = mergedRevocationData.map((item) => item.total);

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const barBackgroundColor = ({ dataIndex }) => {
    let color =
      currentDistrict &&
      currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
        ? COLORS["lantern-light-blue"]
        : COLORS["lantern-orange"];
    if (
      mode === "rates" &&
      !isDenominatorStatisticallySignificant(denominators[dataIndex])
    ) {
      color = pattern.draw("diagonal-right-left", color, "#ffffff", 5);
    }
    return color;
  };

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels,
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
            data: dataPoints,
          },
        ],
      }}
      options={{
        annotation:
          mode === "rates"
            ? {
                drawTime: "afterDatasetsDraw",
                annotations: [
                  {
                    drawTime: "afterDraw",
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y-axis-0",
                    value: averageRate,
                    borderColor: "#72777a",
                    borderWidth: 2,
                    label: {
                      backgroundColor: "transparent",
                      fontColor: "#72777a",
                      fontStyle: "normal",
                      enabled: true,
                      content: `Overall: ${averageRate.toFixed(2)}%`,
                      position: "right",
                      yAdjust: -10,
                    },
                  },
                ],
              }
            : null,
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
                numerators,
                denominators
              ),
            footer: (tooltipItem) =>
              mode === "rates" &&
              tooltipForFooterWithCounts(tooltipItem, denominators),
          },
        },
      }}
    />
  );

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
  stateCode: PropTypes.string.isRequired,
};

export default RevocationsByDistrict;
