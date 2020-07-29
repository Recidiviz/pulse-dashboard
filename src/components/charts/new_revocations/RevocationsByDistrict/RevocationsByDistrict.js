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

import RevocationCount from "./RevocationCount";
import PercentRevokedByPopulation from "./PercentRevokedByPopulation";
import PercentRevokedByExits from "./PercentRevokedByExits";
import Loading from "../../../Loading";
import { getTimeDescription } from "../helpers/format";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";
import { ADMISSION_TYPES } from "../ToggleBar/options";

const chartId = "revocationsByDistrict";
const chartTitle = "Admissions by district";

const RevocationsByDistrict = ({
  currentDistrict,
  dataFilter: filterData,
  filterStates,
  metricPeriodMonths,
  skippedFilters,
  treatCategoryAllAsAbsent,
  stateCode,
}) => {
  const [mode, setMode] = useState("counts"); // counts | rates | exits

  const timeDescription = getTimeDescription(
    metricPeriodMonths,
    ADMISSION_TYPES,
    filterStates.admissionType
  );

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
        <RevocationCount
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
        <PercentRevokedByPopulation
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
        <PercentRevokedByExits
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
