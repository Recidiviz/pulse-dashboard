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
  getMetricTitle,
  chartTitle,
  filterStates,
  timeDescription,
  modes,
  defaultMode,
}) => {
  const [mode, setMode] = useState(defaultMode);

  const { isLoading, isError, apiData } = useChartData(apiUrl, apiFile);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const { data, numerators, denominators } = generateChartData(apiData, mode);

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
      metricTitle={getMetricTitle(mode)}
      showWarning={showWarning}
      chartTitle={chartTitle}
      chart={renderChart({ chartId, data, denominators, numerators, mode })}
      modeSwitcher={
        modes.length ? (
          <ModeSwitcher mode={mode} setMode={setMode} buttons={modeButtons} />
        ) : null
      }
    />
  );
};

RevocationsByDimension.defaultProps = {
  modes: [],
  defaultMode: null,
};

RevocationsByDimension.propTypes = {
  chartId: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  apiFile: PropTypes.string.isRequired,
  renderChart: PropTypes.func.isRequired,
  generateChartData: PropTypes.func.isRequired,
  getMetricTitle: PropTypes.func.isRequired,
  chartTitle: PropTypes.string.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
  modes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  defaultMode: PropTypes.string,
};

export default RevocationsByDimension;
