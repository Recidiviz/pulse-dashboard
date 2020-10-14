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

import pipe from "lodash/fp/pipe";
import reduce from "lodash/fp/reduce";

import {
  dataTransformer,
  findDenominatorKeyByMode,
  getCounts,
  getLabelByMode,
} from "./helpers";
import ModeSwitcher from "../ModeSwitcher";
import DataSignificanceWarningIcon from "../../DataSignificanceWarningIcon";
import ExportMenu from "../../ExportMenu";
import Loading from "../../../Loading";
import Error from "../../../Error";

import flags from "../../../../flags";
import { COLORS_LANTERN_SET } from "../../../../assets/scripts/constants/colors";
import useChartData from "../../../../hooks/useChartData";
import {
  getBarBackgroundColor,
  isDenominatorsMatrixStatisticallySignificant,
} from "../../../../utils/charts/significantStatistics";
import { filtersPropTypes } from "../../propTypes";
import { riskLevelLabels } from "../../../../utils/transforms/labels";
import BarChartWithLabels from "../BarChartWithLabels";

const modeButtons = [
  { label: "Percent revoked of standing population", value: "rates" },
  { label: "Percent revoked of exits", value: "exits" },
];

const chartId = "revocationsByRace";

const RevocationsByRace = ({
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
    "revocations_matrix_distribution_by_race"
  );

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
    backgroundColor: getBarBackgroundColor(
      COLORS_LANTERN_SET[index],
      denominators
    ),
    data: dataPoints[index],
  });

  const data = {
    labels: riskLevelLabels(stateCode),
    datasets: [
      "Caucasian",
      "African American",
      "Hispanic",
      "Asian",
      "Native American",
      "Pacific Islander",
    ].map(generateDataset),
  };

  return (
    <div>
      <h4>
        Admissions by race/ethnicity and risk level
        {showWarning && <DataSignificanceWarningIcon />}
        <ExportMenu
          chartId={chartId}
          chart={{ props: { data } }}
          metricTitle={`${getLabelByMode(
            mode
          )} by race/ethnicity and risk level`}
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>
      {flags.enableRevocationRateByExit && (
        <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
      )}
      <div className="static-chart-container fs-block">
        <BarChartWithLabels
          id={chartId}
          data={data}
          labelColors={COLORS_LANTERN_SET}
          xAxisLabel="Race/ethnicity and risk level"
          yAxisLabel={getLabelByMode(mode)}
          numerators={numerators}
          denominators={denominators}
        />
      </div>
    </div>
  );
};

RevocationsByRace.defaultProps = {
  skippedFilters: [],
  treatCategoryAllAsAbsent: false,
};

RevocationsByRace.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRace;
