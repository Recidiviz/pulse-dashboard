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

import BarChartWithLabels from "../BarChartWithLabels";
import RevocationsByDimension from "../RevocationsByDimension";
import ModeSwitcher from "../ModeSwitcher";
import Loading from "../../../Loading";
import Error from "../../../Error";

import flags from "../../../../flags";
import { COLORS_LANTERN_SET } from "../../../../assets/scripts/constants/colors";
import { isDenominatorsMatrixStatisticallySignificant } from "../../../../utils/charts/significantStatistics";
import { filtersPropTypes } from "../../propTypes";
import useChartData from "../../../../hooks/useChartData";
import generateRevocationsByRaceData from "./generateRevocationsByRaceChartData";
import getLabelByMode from "../utils/getLabelByMode";

const chartId = "revocationsByRace";

const RevocationsByRace = ({
  stateCode,
  dataFilter,
  filterStates,
  timeDescription,
}) => {
  const [mode, setMode] = useState("rates"); // rates | exits

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

  const { data, numerators, denominators } = generateRevocationsByRaceData(
    apiData,
    dataFilter,
    mode,
    stateCode
  );

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const modeButtons = [
    { label: getLabelByMode("rates"), value: "rates" },
    { label: getLabelByMode("exits"), value: "exits" },
  ];

  return (
    <RevocationsByDimension
      chartTitle="Admissions by race/ethnicity and risk level"
      timeDescription={timeDescription}
      filterStates={filterStates}
      labels={data.labels}
      chartId={chartId}
      datasets={data.datasets}
      metricTitle={`${getLabelByMode(mode)} by race/ethnicity and risk level`}
      showWarning={showWarning}
      modeSwitcher={
        flags.enableRevocationRateByExit ? (
          <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
        ) : null
      }
      chart={
        <BarChartWithLabels
          id={chartId}
          data={data}
          labelColors={COLORS_LANTERN_SET}
          xAxisLabel="Race/ethnicity and risk level"
          yAxisLabel={getLabelByMode(mode)}
          numerators={numerators}
          denominators={denominators}
        />
      }
    />
  );
};

RevocationsByRace.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRace;
