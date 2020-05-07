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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Pagination from "./Pagination";
import Sortable from "./Sortable";
import useSort from "./useSort";

import ExportMenu from "../../ExportMenu";
import Loading from "../../../Loading";

// eslint-disable-next-line import/no-cycle
import { useAuth0 } from "../../../../react-auth0-spa";
import usePrevious from "../../../../hooks/usePrevious";
import {
  fetchChartData,
  awaitingResults,
} from "../../../../utils/metricsClient";

import { COLORS } from "../../../../assets/scripts/constants/colors";
import parseViolationRecord from "../../../../utils/charts/parseViolationRecord";
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
} from "../../../../utils/charts/toggles";
import {
  humanReadableTitleCase,
  nameFromOfficerId,
  riskLevelValuetoLabel,
} from "../../../../utils/transforms/labels";

const CASES_PER_PAGE = 15;

const unknownStyle = {
  fontStyle: "italic",
  fontSize: "13px",
  color: COLORS["grey-500"],
};

const chartId = "filteredCaseTable";

const CaseTable = ({
  dataFilter,
  filterStates,
  metricPeriodMonths,
  skippedFilters,
  treatCategoryAllAsAbsent,
}) => {
  const [index, setIndex] = useState(0);
  const [countData, setCountData] = useState(0);

  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const { toggleOrder, comparator, getOrder } = useSort();

  useEffect(() => {
    fetchChartData(
      "us_mo",
      "newRevocations",
      "revocations_matrix_filtered_caseload",
      setApiData,
      setAwaitingApi,
      getTokenSilently
    );
  }, [getTokenSilently]);

  // TODO: After moving the API call inside this component, the pagination protections are not
  // working exactly as intended. We are relying on the commented safe-guard near the end only.
  const prevCount = usePrevious(countData);

  useEffect(() => {
    setCountData(apiData.length);
  }, [apiData.length]);

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  const filteredData = dataFilter(
    apiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );

  // Sort case load first by district, second by officer name, third by person id (all ascending)
  const caseLoad = filteredData.sort(comparator);
  let beginning = countData !== prevCount ? 0 : index * CASES_PER_PAGE;
  let end =
    beginning + CASES_PER_PAGE < filteredData.length
      ? beginning + CASES_PER_PAGE
      : filteredData.length;

  // Extra safe-guard against non-sensical pagination results
  if (beginning >= end) {
    beginning = 0;
    end = beginning + CASES_PER_PAGE;
  }

  function updatePage(change) {
    if (beginning === 0) {
      setIndex(1);
    } else {
      setIndex(index + change);
    }
  }

  const page = caseLoad.slice(beginning, end);

  const normalizeLabel = (label) =>
    label ? humanReadableTitleCase(label) : "";
  const nullSafeLabel = (label) => label || "Unknown";
  const nullSafeCell = (label) => {
    if (label) {
      return <td>{label}</td>;
    }
    return <td style={unknownStyle}>{nullSafeLabel(label)}</td>;
  };

  const labels = [
    "DOC ID",
    "District",
    "Officer",
    "Risk level",
    "Officer Recommendation",
    "Violation record",
  ];

  const tableData = (filteredData || []).map((record) => ({
    data: [
      nullSafeLabel(record.state_id),
      nullSafeLabel(record.district),
      nullSafeLabel(nameFromOfficerId(record.officer)),
      nullSafeLabel(riskLevelValuetoLabel[record.risk_level]),
      nullSafeLabel(normalizeLabel(record.officer_recommendation)),
      nullSafeLabel(parseViolationRecord(record.violation_record)),
    ],
  }));

  const trailingLabel = getTrailingLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  );
  const periodLabel = getPeriodLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  );

  return (
    <div className="case-table">
      <h4>
        Revoked individuals
        <ExportMenu
          chartId={chartId}
          shouldExport={false}
          tableData={tableData}
          metricTitle="Revoked individuals"
          isTable
          tableLabels={labels}
          timeWindowDescription={`${trailingLabel} (${periodLabel})`}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{`${trailingLabel} ${periodLabel}`}</h6>
      <table>
        <thead>
          <tr>
            <th>DOC ID</th>
            <th>District</th>
            <th>
              <Sortable
                order={getOrder("officer")}
                onClick={() => {
                  toggleOrder("officer");
                  setIndex(0);
                }}
              >
                Officer
              </Sortable>
            </th>
            <th>
              <Sortable
                order={getOrder("risk_level")}
                onClick={() => {
                  toggleOrder("risk_level");
                  setIndex(0);
                }}
              >
                Risk level
              </Sortable>
            </th>
            <th className="long-title">Officer Recommendation</th>
            <th>Violation record</th>
          </tr>
        </thead>
        <tbody className="fs-block">
          {page.map((details, i) => (
            // Need to know unique set of fields for uniq key
            // eslint-disable-next-line react/no-array-index-key
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
        <Pagination
          beginning={beginning}
          end={end}
          total={filteredData.length}
          onUpdatePage={updatePage}
        />
      )}
    </div>
  );
};

CaseTable.defaultProps = {
  skippedFilters: [],
};

CaseTable.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: PropTypes.objectOf({
    metricPeriodMonths: PropTypes.string,
    chargeCategory: PropTypes.string,
    district: PropTypes.string,
    supervisionType: PropTypes.string,
  }).isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool.isRequired,
  metricPeriodMonths: PropTypes.number.isRequired,
};

export default CaseTable;
