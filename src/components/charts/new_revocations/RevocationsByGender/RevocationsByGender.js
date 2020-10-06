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

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";
import { translate } from "../../../../views/tenants/utils/i18nSettings";

import {
  dataTransformer,
  getCounts,
  findDenominatorKeyByMode,
  getLabelByMode,
} from "./helpers";
import ModeSwitcher from "../ModeSwitcher";
import DataSignificanceWarningIcon from "../../DataSignificanceWarningIcon";
import ExportMenu from "../../ExportMenu";
import Loading from "../../../Loading";
import Error from "../../../Error";

import flags from "../../../../flags";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { axisCallbackForPercentage } from "../../../../utils/charts/axis";
import {
  generateLabelsWithCustomColors,
  getBarBackgroundColor,
  isDenominatorsMatrixStatisticallySignificant,
  tooltipForFooterWithNestedCounts,
} from "../../../../utils/charts/significantStatistics";
import { tooltipForRateMetricWithNestedCounts } from "../../../../utils/charts/toggles";
import useChartData from "../../../../hooks/useChartData";
import { filtersPropTypes } from "../../propTypes";
import { riskLevelLabels } from "../../../../utils/transforms/labels";

const colors = [COLORS["lantern-light-blue"], COLORS["lantern-orange"]];

const chartId = "revocationsByGender";

const RevocationsByGender = ({
  stateCode,
  dataFilter,
  skippedFilters,
  treatCategoryAllAsAbsent,
  filterStates,
  timeDescription,
}) => {
  const [mode, setMode] = useState("rates"); // rates | exits

  const numeratorKey = "population_count";
  const denominatorKey = findDenominatorKeyByMode(mode);

  const { isLoading, isError, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_gender"
  );

  const modeButtons = [
    { label: translate("percentOfPopulationRevoked"), value: "rates" },
    { label: "Percent revoked of exits", value: "exits" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const { dataPoints, numerators, denominators } = pipe(
    (dataset) => dataFilter(dataset, skippedFilters, treatCategoryAllAsAbsent),
    reduce(dataTransformer(numeratorKey, denominatorKey), {}),
    getCounts
  )(apiData);

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const generateDataset = (label, index) => ({
    label,
    backgroundColor: getBarBackgroundColor(colors[index], denominators),
    data: dataPoints[index],
  });

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: riskLevelLabels(stateCode),
        datasets: [generateDataset("Women", 0), generateDataset("Men", 1)],
      }}
      options={{
        legend: {
          position: "bottom",
          labels: {
            generateLabels: (ch) => generateLabelsWithCustomColors(ch, colors),
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `${translate("Gender")} and risk level`,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: axisCallbackForPercentage(),
              },
              scaleLabel: {
                display: true,
                labelString: getLabelByMode(mode),
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
              tooltipForRateMetricWithNestedCounts(
                tooltipItem,
                data,
                numerators,
                denominators
              ),
            footer: (tooltipItem) =>
              tooltipForFooterWithNestedCounts(tooltipItem, denominators),
          },
        },
      }}
    />
  );

  return (
    <div>
      <h4>
        Admissions by {translate("gender")} and risk level
        {showWarning === true && <DataSignificanceWarningIcon />}
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle={`${getLabelByMode(mode)} by ${translate(
            "gender"
          )} and risk level`}
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>
      {flags.enableRevocationRateByExit && (
        <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
      )}
      <div className="static-chart-container fs-block">{chart}</div>
    </div>
  );
};

RevocationsByGender.defaultProps = {
  skippedFilters: [],
  treatCategoryAllAsAbsent: false,
};

RevocationsByGender.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByGender;
