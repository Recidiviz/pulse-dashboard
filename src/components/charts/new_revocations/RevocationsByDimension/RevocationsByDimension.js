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

import ModeSwitcher from "../ModeSwitcher";
import RevocationsByDimensionComponent from "./RevocationsByDimensionComponent";

import useChartData from "../../../../hooks/useChartData";
import Loading from "../../../Loading";
import Error from "../../../Error";
import { isDenominatorsMatrixStatisticallySignificant } from "../../../../utils/charts/significantStatistics";
import getLabelByMode from "../utils/getLabelByMode";
import { filtersPropTypes } from "../../propTypes";

const RevocationsByDimension = ({
  chartId,
  apiUrl,
  apiFile,
  renderChart,
  generateChartData,
  metricTitle,
  chartTitle,
  filterStates,
  timeDescription,
  modes,
  defaultMode,
  dimension,
}) => {
  const [mode, setMode] = useState(defaultMode);

  const { isLoading, isError, apiData, unflattenedValues } = useChartData(
    apiUrl,
    apiFile,
    false
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const { data, numerators, denominators, averageRate } = generateChartData(
    apiData,
    mode,
    unflattenedValues
  );

  const showWarning = !isDenominatorsMatrixStatisticallySignificant(
    denominators
  );

  const modeButtons = modes.map((item) => ({
    label: getLabelByMode(item),
    value: item,
  }));

  return (
    <RevocationsByDimensionComponent
      timeDescription={timeDescription}
      filterStates={filterStates}
      chartId={chartId}
      datasets={data.datasets}
      labels={data.labels}
      metricTitle={
        typeof metricTitle === "function" ? metricTitle(mode) : metricTitle
      }
      showWarning={showWarning}
      chartTitle={chartTitle}
      chart={renderChart({
        chartId,
        data,
        denominators,
        numerators,
        mode,
        averageRate,
      })}
      modeSwitcher={
        modes.length ? (
          <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
        ) : null
      }
      classModifier={chartId}
      dimension={dimension}
    />
  );
};

RevocationsByDimension.defaultProps = {
  modes: [],
  defaultMode: null,
  dimension: null,
};

RevocationsByDimension.propTypes = {
  chartId: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  apiFile: PropTypes.string.isRequired,
  renderChart: PropTypes.func.isRequired,
  generateChartData: PropTypes.func.isRequired,
  metricTitle: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    .isRequired,
  chartTitle: PropTypes.string.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
  modes: PropTypes.arrayOf(PropTypes.string),
  defaultMode: PropTypes.string,
  dimension: PropTypes.string,
};

export default RevocationsByDimension;
