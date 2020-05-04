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

import React, { useState, useEffect } from 'react';
import ExportMenu from '../ExportMenu';
import Loading from '../../Loading';

import { useAuth0 } from '../../../react-auth0-spa';
import { fetchChartData, awaitingResults } from '../../../utils/metricsClient';

import { COLORS } from '../../../assets/scripts/constants/colors';
import {
  getPeriodLabelFromMetricPeriodMonthsToggle, getTrailingLabelFromMetricPeriodMonthsToggle,
} from '../../../utils/charts/toggles';
import { toInt } from '../../../utils/transforms/labels';

// These can also be defined from the data
const VIOLATION_TYPES = [
  ['TECHNICAL', 'Technical'],
  ['SUBSTANCE_ABUSE', 'Subs. Use'],
  ['MUNICIPAL', 'Municipal'],
  ['ABSCONDED', 'Absconsion'],
  ['MISDEMEANOR', 'Misdemeanor'],
  ['FELONY', 'Felony'],
];

const VIOLATION_COUNTS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const violationCountLabel = (count) => (count === '8' ? '8+' : count);

const RevocationMatrix = (props) => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const isFiltered = props.filterStates.violationType || props.filterStates.reportedViolations;

  const [dataMatrix, setDataMatrix] = useState();
  const [maxRevocations, setMaxRevocations] = useState();

  const processResponse = () => {
    if (awaitingApi || !apiData) {
      return;
    }
    const filteredData = props.dataFilter(
      apiData, props.skippedFilters, props.treatCategoryAllAsAbsent,
    );
    setFilteredData(filteredData);

    const matrix = filteredData.reduce(
      (result, { violation_type: violationType, reported_violations: reportedViolations, total_revocations: totalRevocations }) => {
        if (!result[violationType]) {
          return { ...result, [violationType]: { [reportedViolations]: toInt(totalRevocations) } };
        }
        return {
          ...result,
          [violationType]: {
            ...result[violationType],
            [reportedViolations]: (result[violationType][reportedViolations] || 0) + (toInt(totalRevocations) || 0)
          }
        }
      }, {},
    );
    setDataMatrix(matrix);

    const max = Object.values(matrix).reduce((result, row) => (
      Math.max(result, Object.values(row).reduce((result, count) => Math.max(result, count), 0))
    ), 0);
    setMaxRevocations(max);
  };

  useEffect(() => {
    fetchChartData(
      'us_mo', 'newRevocations', 'revocations_matrix_cells',
      setApiData, setAwaitingApi, getTokenSilently,
    );
  }, []);

  useEffect(() => {
    processResponse();
  }, [
    apiData,
    awaitingApi,
    props.filterStates,
    props.metricPeriodMonths,
  ]);

  const exportableMatrixData = () => {
    const datasets = [];
    Object.keys(dataMatrix).forEach((rowLabel) => {
      const dataset = { label: rowLabel, data: [] };
      const rowValues = dataMatrix[rowLabel] || {};
      VIOLATION_COUNTS.forEach((columnLabel) => {
        dataset.data.push(rowValues[columnLabel] || 0);
      });

      datasets.push(dataset);
    });
    return datasets;
  };

  const isSelected = (violationType, reportedViolations) => {
    return props.filterStates.violationType === violationType &&
      props.filterStates.reportedViolations === reportedViolations;
  };

  const toggleFilter = (violationType, reportedViolations) => {
    if (isSelected(violationType, reportedViolations)) {
      violationType = '';
      reportedViolations = '';
    }

    props.updateFilters({ violationType, reportedViolations });
  };

  const renderCell = (violationType, violationCount, i) => {
    const matrixRow = dataMatrix[violationType];
    const cellCount = matrixRow === undefined ? 0 : matrixRow[violationCount] || 0;

    const minRadius = 25;
    const maxRadius = 50;
    const ratio = maxRevocations > 0 ? (cellCount / maxRevocations) : 0;
    const radius = Math.max(minRadius, Math.ceil(ratio * maxRadius));

    const containerStyle = {
      background: 'white',
      display: 'inline-block',
      width: radius,
      height: radius,
      lineHeight: `${radius}px`,
    };
    const cellStyle = {
      background: `rgba(0, 44, 66, ${ratio})`,  // lantern-dark-blue with opacity
      width: '100%',
      height: '100%',
      borderRadius: Math.ceil(radius / 2),
      color: ratio >= 0.5 ? COLORS.white : COLORS['lantern-dark-blue'],
    };

    return (
      <div key={i} className="cell">
        <div style={containerStyle}>
          <button
            className={`total-revocations ${isSelected(violationType, violationCount)  ? 'is-selected': ''}`}
            onClick={() => toggleFilter(violationType, violationCount)}
            style={cellStyle}
          >
            {cellCount}
          </button>
        </div>
      </div>
    );
  };

  const renderRow = ([violationType, name], i) => {
    const matrixRow = dataMatrix[violationType];
    const sum = matrixRow === undefined ? 0 : Object.values(matrixRow).reduce((sum, count) => sum += count, 0);

    return (
      <div
        key={i}
        className={`violation-row ${isSelected(violationType, '') ? 'is-selected' : ''}`}
      >
        <div className="violation-type-label">
          <button
            onClick={() => toggleFilter(violationType, '')}
          >
            {name}
          </button>
        </div>
        {VIOLATION_COUNTS.map((violationCount, i) => renderCell(violationType, violationCount, i))}
        <span className="violation-sum violation-sum-column">{sum}</span>
      </div>
    );
  };

  const reportedViolationsSum = (count) => {
    const items = filteredData.filter((item) => item.reported_violations === count);
    return items.reduce((sum, item) => sum += toInt(item.total_revocations), 0);
  };

  if (!dataMatrix) {
    return null;
  }

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  return (
    <div className="revocation-matrix">
      <h4>
        People revoked to prison by violation history
        <ExportMenu
          chartId="revocationMatrix"
          regularElement
          elementDatasets={exportableMatrixData()}
          elementLabels={VIOLATION_COUNTS.map((count) => violationCountLabel(count))}
          metricTitle="People revoked to prison by violation history"
          timeWindowDescription={`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
          filters={props.filterStates}
        />
      </h4>
      <h6>
        {`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
      </h6>
      <div className="x-label pY-30">
        Number of violation reports and notices of citation<br/>(filed within one year of the last violation prior to revocation)
      </div>
      <div className="matrix-content">
        <div id="revocationMatrix" className="d-f matrix-chart-container">
          <div className="y-label" data-html2canvas-ignore>
            Most severe violation reported<br/>(filed within one year of the last violation prior to revocation)
          </div>
          <div className={`matrix ${isFiltered ? 'is-filtered' : ''} fs-block`}>
            <div className="violation-counts">
              <span className="empty-cell"/>
              {VIOLATION_COUNTS.map((count, i) => (
                <span key={i} className="violation-column">{violationCountLabel(count)}</span>
              ))}
              <span className="violation-sum-column top-right-total">Total</span>
            </div>
            {VIOLATION_TYPES.map(renderRow)}
            <div className="violation-sum-row">
              <span className="empty-cell"/>
              {VIOLATION_COUNTS.map((count, i) => (
                <span key={i} className="violation-column violation-sum">
                {reportedViolationsSum(count)}
              </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevocationMatrix;
