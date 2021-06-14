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

import React, { useState } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import useSort from "./useSort";
import ExportMenu from "../ExportMenu";
import LoadingChart from "../LoadingChart";
import ErrorMessage from "../../components/ErrorMessage";
import Sortable from "./Sortable";
import Pagination from "./Pagination";
import { useContainerHeight } from "../hooks/useContainerHeight";
import { nullSafeCell } from "./utils/helpers";
import { useLanternStore } from "../LanternStoreProvider";
import { translate } from "../../utils/i18nSettings";

export const CASES_PER_PAGE = 15;

const CaseTable = ({ timeDescription }) => {
  const { dataStore } = useLanternStore();
  const store = dataStore.caseTableStore;
  const TABLE_TITLE = translate("caseTableTitle");
  const [page, setPage] = useState(0);
  const { sortOrder, sortField, toggleOrder, comparator } = useSort();
  const { containerHeight, containerRef } = useContainerHeight();

  const filteredData = store.filteredData.slice();
  const sortedData = filteredData.sort(comparator);
  const { columns, formatTableData, formatExportData } = store;

  if (store.isLoading) {
    return <LoadingChart containerHeight={containerHeight} />;
  }

  if (store.isError) {
    return <ErrorMessage />;
  }

  const startCase = page * CASES_PER_PAGE;
  const endCase = Math.min(sortedData.length, startCase + CASES_PER_PAGE);
  const pageData = formatTableData(sortedData.slice(startCase, endCase));
  const createUpdatePage = (diff) => () => setPage(page + diff);

  const createSortableProps = (field) => ({
    order: field === sortField ? sortOrder : null,
    onClick: () => {
      toggleOrder(field);
      setPage(0);
    },
  });

  return (
    <div ref={containerRef} className="CaseTable">
      <h4>
        {TABLE_TITLE}
        <ExportMenu
          chartId="filteredCaseTable"
          shouldExport={false}
          datasets={formatExportData(sortedData)}
          labels={columns.map((o) => o.label)}
          metricTitle="Admitted individuals"
          fixLabelsInColumns
          timeWindowDescription={timeDescription}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <Sortable {...createSortableProps(column.key)}>
                  {column.label}
                </Sortable>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="fs-block">
          {pageData.map((details, idx) => (
            <tr
              key={`${details.state_id}-${details.officer
                .split(" ")
                .join("")}-${idx + 1}`}
            >
              {columns.map((column) =>
                nullSafeCell(column.key, details[column.key], idx)
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length > CASES_PER_PAGE && (
        <Pagination
          beginning={startCase}
          end={endCase}
          total={sortedData.length}
          createUpdatePage={createUpdatePage}
        />
      )}
    </div>
  );
};

CaseTable.propTypes = {
  timeDescription: PropTypes.string.isRequired,
};

export default observer(CaseTable);
