import React from "react";
import PropTypes from "prop-types";
import DataSignificanceWarningIcon from "../DataSignificanceWarningIcon";
import ExportMenu from "../ExportMenu";
import { filtersPropTypes } from "../propTypes";

const RevocationsByFeature = ({
  chartTitle,
  chartId,
  datasets,
  labels,
  metricTitle,
  timeDescription,
  filterStates,
  chart,
  showWarning,
  modeSwitcher,
}) => (
  <div>
    <h4>
      {chartTitle}
      {showWarning && <DataSignificanceWarningIcon />}
      <ExportMenu
        chartId={chartId}
        chart={{ props: { data: { datasets, labels } } }}
        metricTitle={metricTitle}
        timeWindowDescription={timeDescription}
        filters={filterStates}
      />
    </h4>
    <h6 className="pB-20">{timeDescription}</h6>
    {modeSwitcher}
    <div className="static-chart-container fs-block">{chart}</div>
  </div>
);

RevocationsByFeature.defaultProps = {
  showWarning: false,
  modeSwitcher: null,
};

RevocationsByFeature.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  chartId: PropTypes.string.isRequired,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      backgroundColor: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      data: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  metricTitle: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  filterStates: filtersPropTypes.isRequired,
  chart: PropTypes.element.isRequired,
  showWarning: PropTypes.bool,
  modeSwitcher: PropTypes.element,
};

export default RevocationsByFeature;
