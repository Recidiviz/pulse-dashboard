// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import React, { useState } from "react";

import ErrorMessage from "../../components/ErrorMessage";
import LoadingChart from "../LoadingChart";
import ModeSwitcher from "../ModeSwitcher";
import getLabelByMode from "../utils/getLabelByMode";
import { isDenominatorsMatrixStatisticallySignificant } from "../utils/significantStatistics";
import RevocationsByDimensionComponent from "./RevocationsByDimensionComponent";

const RevocationsByDimension = observer(
  (
    {
      chartId,
      className,
      dataStore,
      containerHeight,
      renderChart,
      generateChartData,
      metricTitle,
      chartTitle,
      timeDescription,
      modes,
      defaultMode,
      dataExportLabel,
      includeWarning,
    },
    ref
  ) => {
    const [mode, setMode] = useState(defaultMode);

    if (dataStore.isLoading || dataStore.isStatePopulationLoading) {
      return <LoadingChart containerHeight={containerHeight} />;
    }

    if (dataStore.isError || dataStore.isStatePopulationError) {
      return <ErrorMessage />;
    }

    const { data, numerators, denominators, averageRate } = generateChartData(
      mode
    );

    const showWarning =
      includeWarning &&
      !isDenominatorsMatrixStatisticallySignificant(denominators);

    const modeButtons = modes.map((item) => ({
      label: getLabelByMode(item),
      value: item,
    }));

    return (
      <div ref={ref}>
        <RevocationsByDimensionComponent
          className={className}
          timeDescription={timeDescription}
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
              <ModeSwitcher
                mode={mode}
                setMode={setMode}
                buttons={modeButtons}
              />
            ) : null
          }
          classModifier={chartId}
          dataExportLabel={dataExportLabel}
        />
      </div>
    );
  },
  { forwardRef: true }
);

RevocationsByDimension.defaultProps = {
  modes: [],
  className: null,
  defaultMode: null,
  dataExportLabel: null,
  includeWarning: true,
  containerHeight: null,
};

RevocationsByDimension.propTypes = {
  className: PropTypes.string,
  dataStore: PropTypes.shape({
    filteredData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    isStatePopulationLoading: PropTypes.bool.isRequired,
    isStatePopulationError: PropTypes.bool.isRequired,
  }).isRequired,
  containerHeight: PropTypes.number,
  chartId: PropTypes.string.isRequired,
  renderChart: PropTypes.func.isRequired,
  generateChartData: PropTypes.func.isRequired,
  metricTitle: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    .isRequired,
  chartTitle: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  modes: PropTypes.arrayOf(PropTypes.string),
  defaultMode: PropTypes.string,
  dataExportLabel: PropTypes.string,
  includeWarning: PropTypes.bool,
};

export default RevocationsByDimension;
