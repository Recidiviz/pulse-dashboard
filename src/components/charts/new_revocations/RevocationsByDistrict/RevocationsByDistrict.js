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

import CountsChart from "./CountsChart";
import RatesChart from "./RatesChart";
import ExitsChart from "./ExitesChart";
import Loading from "../../../Loading";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
} from "../../../../utils/charts/toggles";

const chartId = "revocationsByDistrict";
const chartTitle = "Revocations by district";

const RevocationsByDistrict = ({
  currentDistrict,
  dataFilter: filterData,
  filterStates,
  metricPeriodMonths: months,
  skippedFilters,
  treatCategoryAllAsAbsent,
  stateCode,
}) => {
  const [mode, setMode] = useState("counts"); // counts | rates | exits

  const trailingLabel = getTrailingLabelFromMetricPeriodMonthsToggle(months);
  const periodLabel = getPeriodLabelFromMetricPeriodMonthsToggle(months);
  const timeDescription = `${trailingLabel} ${periodLabel}`;

  const {
    isLoading: revocationIsLoading,
    apiData: revocationApiData,
  } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_district"
  );

  const {
    isLoading: supervisionIsLoading,
    apiData: supervisionApiData,
  } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_supervision_distribution_by_district"
  );

  if (revocationIsLoading || supervisionIsLoading) {
    return <Loading />;
  }

  const filteredRevocationData = filterData(
    revocationApiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );
  const filteredSupervisionData = filterData(
    supervisionApiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );

  switch (mode) {
    case "counts":
    default:
      return (
        <CountsChart
          chartId={chartId}
          chartTitle={chartTitle}
          setMode={setMode}
          filterStates={filterStates}
          timeDescription={timeDescription}
          currentDistrict={currentDistrict}
          revocationApiData={filteredRevocationData}
        />
      );
    case "rates":
      return (
        <RatesChart
          chartId={chartId}
          chartTitle={chartTitle}
          setMode={setMode}
          filterStates={filterStates}
          timeDescription={timeDescription}
          currentDistrict={currentDistrict}
          revocationApiData={filteredRevocationData}
          supervisionApiData={filteredSupervisionData}
        />
      );
    case "exits":
      return (
        <ExitsChart
          chartId={chartId}
          chartTitle={chartTitle}
          setMode={setMode}
          filterStates={filterStates}
          timeDescription={timeDescription}
          currentDistrict={currentDistrict}
          revocationApiData={filteredRevocationData}
          supervisionApiData={filteredSupervisionData}
        />
      );
  }
};

RevocationsByDistrict.defaultProps = {
  treatCategoryAllAsAbsent: undefined,
};

RevocationsByDistrict.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dataFilter: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filterStates: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  skippedFilters: PropTypes.array.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  currentDistrict: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  treatCategoryAllAsAbsent: PropTypes.any,
  stateCode: PropTypes.string.isRequired,
};

export default RevocationsByDistrict;
