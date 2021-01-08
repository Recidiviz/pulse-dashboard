import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import Loading from "../../../Loading";
import Error from "../../../Error";

import useChartData from "../../../../hooks/useChartData";
import { translate } from "../../../../views/tenants/utils/i18nSettings";

import { filterOptimizedDataFormat } from "../../../../utils/charts/dataFilters";
import { filtersPropTypes } from "../../propTypes";
import {
  VIOLATION_COUNTS,
  sumByInteger,
  getReportedViolationsSum,
  getMaxRevocations,
  getDataMatrix,
  getDataFilteredByViolationType,
} from "./helpers";

import { useRootStore } from "../../../../StoreProvider";
import "./Matrix.scss";
import Matrix from "./Matrix";

const MatrixContainer = ({
  dataFilter,
  filterStates,
  timeDescription,
  updateFilters,
}) => {
  const { currentTenantId } = useRootStore();
  const violationTypes = translate("violationTypes");

  const { metadata, isLoading, isError, apiData } = useChartData(
    `${currentTenantId}/newRevocations`,
    "revocations_matrix_cells",
    filterStates,
    false
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const filteredData = getDataFilteredByViolationType(
    () =>
      filterOptimizedDataFormat({ apiData, metadata, filterFn: dataFilter }),
    violationTypes
  )();

  const dataMatrix = getDataMatrix(filteredData);

  if (!dataMatrix) {
    return null;
  }

  const maxRevocations = getMaxRevocations(dataMatrix, violationTypes)();

  const violationsSum = sumByInteger("total_revocations")(filteredData);

  const reportedViolationsSums = VIOLATION_COUNTS.map(
    getReportedViolationsSum(filteredData)
  );

  return (
    <Matrix
      timeDescription={timeDescription}
      violationTypes={violationTypes}
      dataMatrix={dataMatrix}
      violationsSum={violationsSum}
      updateFilters={updateFilters}
      filterStates={filterStates}
      maxRevocations={maxRevocations}
      reportedViolationsSums={reportedViolationsSums}
    />
  );
};

MatrixContainer.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
  // violationTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default observer(MatrixContainer);
