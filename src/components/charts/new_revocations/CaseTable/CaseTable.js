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

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import CaseTableComponent from "./CaseTableComponent";
import useSort from "./useSort";
import ExportMenu from "../../ExportMenu";
import Loading from "../../../Loading";
import Error from "../../../Error";
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
} from "../../../../utils/charts/toggles";
import { filtersPropTypes } from "../../propTypes";
import useChartData from "../../../../hooks/useChartData";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { formatData, formatExportData } from "./utils/helpers";
import { useRootStore } from "../../../../StoreProvider";

export const CASES_PER_PAGE = 15;

const CaseTable = ({ dataFilter, filterStates, metricPeriodMonths }) => {
  const { currentTenantId } = useRootStore();
  const [page, setPage] = useState(0);
  const { sortOrder, toggleOrder, comparator } = useSort();

  const { isLoading, isError, apiData } = useChartData(
    `${currentTenantId}/newRevocations`,
    "revocations_matrix_filtered_caseload"
  );

  const sortedData = useMemo(() => {
    return dataFilter(apiData || []).sort(comparator);
  }, [dataFilter, apiData, comparator]);

  const { pageData, startCase, endCase } = useMemo(() => {
    const start = page * CASES_PER_PAGE;
    const end = Math.min(sortedData.length, start + CASES_PER_PAGE);

    return {
      pageData: formatData(sortedData.slice(start, end)),
      startCase: start,
      endCase: end,
    };
  }, [sortedData, page]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const createUpdatePage = (diff) => () => setPage(page + diff);

  const createSortableProps = (field) => ({
    order: sortOrder,
    onClick: () => {
      toggleOrder(field);
      setPage(0);
    },
  });

  const trailingLabel = getTrailingLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  );
  const periodLabel = getPeriodLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  );
  const timeWindowDescription = `${trailingLabel} (${periodLabel})`;

  const options = [
    { key: "state_id", label: "DOC ID" },
    { key: "district", label: "District" },
    { key: "officer", label: translate("Officer") },
    { key: "risk_level", label: "Risk level" },
    {
      key: "officer_recommendation",
      label: translate("lastRecommendation"),
    },
    { key: "violation_record", label: "Violation record" },
  ];

  return (
    <CaseTableComponent
      filterStates={filterStates}
      timeWindowDescription={timeWindowDescription}
      options={options}
      createSortableProps={createSortableProps}
      pageData={pageData}
      startCase={startCase}
      endCase={endCase}
      totalCases={sortedData.length}
      casesPerPage={CASES_PER_PAGE}
      createUpdatePage={createUpdatePage}
      exportMenu={
        <ExportMenu
          chartId="filteredCaseTable"
          shouldExport={false}
          datasets={formatExportData(sortedData)}
          labels={options.map((o) => o.label)}
          metricTitle="Admitted individuals"
          fixLabelsInColumns
          timeWindowDescription={timeWindowDescription}
          filters={filterStates}
        />
      }
    />
  );
};

const metricPeriodMonthsType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

CaseTable.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  metricPeriodMonths: metricPeriodMonthsType.isRequired,
};

export default observer(CaseTable);
