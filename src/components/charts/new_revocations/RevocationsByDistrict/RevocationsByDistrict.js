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

import pipe from "lodash/fp/pipe";

import RevocationCount from "./RevocationCount";
import PercentRevokedByPopulation from "./PercentRevokedByPopulation";
import PercentRevokedByExits from "./PercentRevokedByExits";
import Loading from "../../../Loading";
import Error from "../../../Error";
import useChartData from "../../../../hooks/useChartData";
import { filtersPropTypes } from "../../propTypes";
import { filterOptimizedDataFormat } from "../../../../utils/charts/dataFilters";

const chartId = "revocationsByDistrict";
const chartTitle = "Admissions by district";

const RevocationsByDistrict = ({
  currentDistricts,
  dataFilter,
  filterStates,
  skippedFilters,
  treatCategoryAllAsAbsent = false,
  stateCode,
  timeDescription,
}) => {
  const [mode, setMode] = useState("counts"); // counts | rates | exits

  const {
    isError,
    isLoading: revocationIsLoading,
    apiData: revocationApiData,
    unflattenedValues,
  } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_distribution_by_district",
    false
  );

  if (revocationIsLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const filterFn = dataFilter(skippedFilters, treatCategoryAllAsAbsent);

  const filteredRevocationData = pipe((metricFile) =>
    filterOptimizedDataFormat(
      unflattenedValues,
      metricFile.metadata,
      {},
      filterFn
    )
  )(revocationApiData);

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
          currentDistricts={currentDistricts}
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
          currentDistricts={currentDistricts}
          revocationApiData={filteredRevocationData}
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
          currentDistricts={currentDistricts}
          revocationApiData={filteredRevocationData}
        />
      );
  }
};

RevocationsByDistrict.defaultProps = {
  treatCategoryAllAsAbsent: false,
};

RevocationsByDistrict.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentDistricts: PropTypes.arrayOf(PropTypes.string).isRequired,
  treatCategoryAllAsAbsent: PropTypes.bool,
  stateCode: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByDistrict;
