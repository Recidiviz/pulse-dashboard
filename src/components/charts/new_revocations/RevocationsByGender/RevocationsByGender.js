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

import { translate } from "../../../../views/tenants/utils/i18nSettings";

import generateRevocationsByGenderChartData from "./generateRevocationsByGenderChartData";
import ModeSwitcher from "../ModeSwitcher";
import Loading from "../../../Loading";
import Error from "../../../Error";

import flags from "../../../../flags";
import { isDenominatorsMatrixStatisticallySignificant } from "../../../../utils/charts/significantStatistics";
import useChartData from "../../../../hooks/useChartData";
import { filtersPropTypes } from "../../propTypes";
import BarChartWithLabels from "../BarChartWithLabels";
import RevocationsByDimension from "../RevocationsByDimension";
import getLabelByMode from "../utils/getLabelByMode";
import { CHART_COLORS } from "./constants";

const chartId = "revocationsByGender";

const RevocationsByGender = ({
  stateCode,
  dataFilter,
  filterStates,
  timeDescription,
}) => {
  const [mode, setMode] = useState("rates"); // rates | exits

  const { isLoading, isError, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_gender"
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const {
    data,
    numerators,
    denominators,
  } = generateRevocationsByGenderChartData(
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
      timeDescription={timeDescription}
      filterStates={filterStates}
      chartId={chartId}
      datasets={data.datasets}
      labels={data.labels}
      metricTitle={`${getLabelByMode(mode)} by ${translate(
        "gender"
      )} and risk level`}
      showWarning={showWarning}
      chartTitle={`Admissions by ${translate("gender")} and risk level`}
      chart={
        <BarChartWithLabels
          id={chartId}
          data={data}
          xAxisLabel={`${translate("Gender")} and risk level`}
          yAxisLabel={getLabelByMode(mode)}
          labelColors={CHART_COLORS}
          denominators={denominators}
          numerators={numerators}
        />
      }
      modeSwitcher={
        flags.enableRevocationRateByExit ? (
          <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
        ) : null
      }
    />
  );
};

RevocationsByGender.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByGender;
