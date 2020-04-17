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

import React, { useState, useEffect, useRef } from 'react';

import ExportMenu from '../ExportMenu';
import Loading from '../../Loading';

import { useAuth0 } from '../../../react-auth0-spa';
import { fetchChartData, awaitingResults } from '../../../utils/metricsClient';

import { COLORS } from '../../../assets/scripts/constants/colors';
import parseViolationRecord from '../../../utils/charts/parseViolationRecord';
import {
  getTrailingLabelFromMetricPeriodMonthsToggle, getPeriodLabelFromMetricPeriodMonthsToggle,
} from '../../../utils/charts/toggles';
import {
  humanReadableTitleCase, nameFromOfficerId, riskLevelValuetoLabel, toTitleCase
} from '../../../utils/transforms/labels';

const CASES_PER_PAGE = 15;

const unknownStyle = {
  fontStyle: 'italic',
  fontSize: '13px',
  color: COLORS['grey-500'],
};

const chartId = 'filteredCaseTable';

const CaseTable = (props) => {
  const [index, setIndex] = useState(0);
  const [countData, setCountData] = useState(0);

  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  useEffect(() => {
    fetchChartData(
      'us_mo', 'newRevocations', 'revocations_matrix_filtered_caseload',
      setApiData, setAwaitingApi, getTokenSilently,
    );
  }, []);

  const updatePage = (change) => {
    (beginning === 0) ? setIndex(1) : setIndex(index + change);
  };

  // TODO: After moving the API call inside this component, the pagination protections are not
  // working exactly as intended. We are relying on the commented safe-guard near the end only.
  const prevCount = usePrevious(countData);

  function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
      ref.current = value;
    }, [value]);

    return ref.current;
  }

  useEffect(() => {
    setCountData(apiData.length);
  });

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  const filteredData = props.dataFilter(
    apiData, props.skippedFilters, props.treatCategoryAllAsAbsent,
  );

  // Sort case load first by district, second by officer name, third by person id (all ascending)
  const caseLoad = filteredData.sort((a, b) => {
    // Sort by district, with undefined districts to the bottom
    if (!a.district && b.district) return 1;
    if (!b.district && a.district) return -1;

    if (String(a.district) > String(b.district)) return 1;
    if (String(a.district) < String(b.district)) return -1;

    const aOfficer = a.officer || '';
    const bOfficer = b.officer || '';

    // Sort by officer, with undefined officers to the bottom
    if (!aOfficer && bOfficer) return 1;
    if (!bOfficer && aOfficer) return -1;

    if (aOfficer.toLowerCase() > bOfficer.toLowerCase()) return 1;
    if (aOfficer.toLowerCase() < bOfficer.toLowerCase()) return -1;

    // Sort by person external id
    if (String(a.state_id) > String(b.state_id)) return 1;
    if (String(a.state_id) < String(b.state_id)) return -1;

    return 0;
  });

  let beginning = (countData !== prevCount) ? 0 : index * CASES_PER_PAGE ;
  let end = beginning + CASES_PER_PAGE < filteredData.length
    ? (beginning + CASES_PER_PAGE) : filteredData.length;

  // Extra safe-guard against non-sensical pagination results
  if (beginning >= end) {
    beginning = 0;
    end = beginning + CASES_PER_PAGE;
  }

  const page = caseLoad.slice(beginning, end);

  const normalizeLabel = (label) => (label ? humanReadableTitleCase(label) : '');
  const nullSafeLabel = (label) => label || 'Unknown';
  const nullSafeCell = (label) => {
    if (label) {
      return <td>{label}</td>;
    }
    return <td style={unknownStyle}>{nullSafeLabel(label)}</td>;
  };

  const labels = ['DOC ID', 'District', 'Officer', 'Risk level', 'Officer Recommendation', 'Violation record'];

  const tableData = filteredData === undefined ? [] : filteredData.map((record) => {
      let obj = { data: [] };
      obj.data.push(record.state_id);
      obj.data.push(record.district);
      obj.data.push(nameFromOfficerId(record.officer));
      obj.data.push(humanReadableTitleCase(record.risk_level));
      obj.data.push(toTitleCase(record.officer_recommendation));
      obj.data.push(parseViolationRecord(record.violation_record));
      return obj;
    });

  return (
    <div className="case-table">
      <h4>
        Revoked individuals
        <ExportMenu
          chartId={chartId}
          shouldExport={false}
          tableData={tableData}
          metricTitle="Revoked individuals"
          isTable={true}
          tableLabels={labels}
          timeWindowDescription={`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
          filters={props.filterStates}
        />
      </h4>
      <h6 className="pB-20">
        {`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
      </h6>
      <table>
        <thead>
          <tr>
            <th>DOC ID</th>
            <th>District</th>
            <th>Officer</th>
            <th>Risk level</th>
            <th className="long-title">Officer <br className="separation-column" />Recommendation</th>
            <th>Violation record</th>
          </tr>
        </thead>
        <tbody className="fs-block">
          {page.map((details, i) => (
            <tr key={i}>
              <td>{details.state_id}</td>
              {nullSafeCell(details.district)}
              {nullSafeCell(nameFromOfficerId(details.officer))}
              {nullSafeCell(riskLevelValuetoLabel[details.risk_level])}
              {nullSafeCell(normalizeLabel(details.officer_recommendation))}
              {nullSafeCell(parseViolationRecord(details.violation_record))}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredData.length > CASES_PER_PAGE && (
        <div className="table-navigation fs-block">
          {beginning !== 0 &&
            <button onClick={(e) => updatePage(-1)}>&#10094;</button>
          }
          Showing {beginning + 1} {beginning + 1 !== end && <> - {end} </>} of {filteredData.length}
          {end < filteredData.length &&
            <button onClick={(e) => updatePage(1)}>&#10095;</button>
          }
        </div>
      )}
    </div>
  );
};

export default CaseTable;
