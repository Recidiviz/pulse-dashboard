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

/* eslint-disable react/no-array-index-key */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import filter from "lodash/fp/filter";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";
import max from "lodash/fp/max";
import flatten from "lodash/fp/flatten";
import pipe from "lodash/fp/pipe";
import sum from "lodash/fp/sum";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import RevocationMatrixCell from "./RevocationMatrixCell";
import RevocationMatrixRow from "./RevocationMatrixRow";
import ExportMenu from "../../ExportMenu";
import Loading from "../../../Loading";
import Error from "../../../Error";

import useChartData from "../../../../hooks/useChartData";
import {
  matrixViolationTypeToLabel,
  violationCountLabel,
} from "../../../../utils/transforms/labels";
import { filterOptimizedDataFormat } from "../../../../utils/charts/dataFilters";
import { filtersPropTypes } from "../../propTypes";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import "./RevocationMatrix.scss";

const TITLE =
  "Admissions by violation history (in year prior to their last reported violation)";
const VIOLATION_COUNTS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const getInteger = (field) => pipe(get(field), toInteger);
const sumByInteger = (field) => sumBy(getInteger(field));
const sumRow = pipe(values, sum);

const RevocationMatrix = ({
  stateCode,
  dataFilter,
  filterStates,
  timeDescription,
  updateFilters,
  violationTypes,
}) => {
  const { apiData, isLoading, isError, unflattenedValues } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_cells",
    false
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  const isFiltered =
    filterStates.violationType || filterStates.reportedViolations;

  const filteredData = pipe(
    (metricFile) =>
      filterOptimizedDataFormat(
        unflattenedValues,
        apiData,
        metricFile.metadata,
        dataFilter
      ),
    filter((data) => violationTypes.includes(data.violation_type))
  )(apiData);

  const dataMatrix = pipe(
    groupBy("violation_type"),
    mapValues(
      pipe(
        groupBy("reported_violations"),
        mapValues(sumByInteger("total_revocations"))
      )
    )
  )(filteredData);

  if (!dataMatrix) {
    return null;
  }

  const maxRevocations = pipe(
    () =>
      violationTypes.map((rowLabel) =>
        VIOLATION_COUNTS.map((columnLabel) =>
          getOr(0, [rowLabel, columnLabel], dataMatrix)
        )
      ),
    flatten,
    max
  )();

  const violationsSum = sumByInteger("total_revocations")(filteredData);
  const reportedViolationsSum = pipe(
    (count) =>
      filter((data) => data.reported_violations === count, filteredData),
    sumByInteger("total_revocations")
  );

  const isSelected = (violationType, reportedViolations) =>
    filterStates.violationType === violationType &&
    filterStates.reportedViolations === reportedViolations;

  const toggleFilter = (violationType, reportedViolations) => {
    if (isSelected(violationType, reportedViolations)) {
      updateFilters({ violationType: "", reportedViolations: "" });
    } else {
      updateFilters({ violationType, reportedViolations });
    }
  };

  const exportableMatrixData = violationTypes.map((rowLabel) => ({
    label: matrixViolationTypeToLabel[rowLabel],
    data: VIOLATION_COUNTS.map((columnLabel) =>
      getOr(0, [rowLabel, columnLabel], dataMatrix)
    ),
  }));

  return (
    <div className="RevocationMatrix">
      <h4 className="RevocationMatrix__title">
        {TITLE}
        <ExportMenu
          chartId="revocationMatrix"
          regularElement
          elementDatasets={exportableMatrixData}
          elementLabels={VIOLATION_COUNTS.map(violationCountLabel)}
          metricTitle={TITLE}
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="RevocationMatrix__dates">{timeDescription}</h6>
      <div className="RevocationMatrix__x-label">
        # of {translate("violationReports")}
      </div>
      <div className="RevocationMatrix__content">
        <div
          id="revocationMatrix"
          className="RevocationMatrix__chart-container"
        >
          <div className="RevocationMatrix__y-label" data-html2canvas-ignore>
            Most severe violation reported
          </div>
          <div
            className={cx("RevocationMatrix__matrix", {
              "RevocationMatrix__matrix--is-filtered": isFiltered,
            })}
          >
            <div className="RevocationMatrix__violation-counts">
              <span className="RevocationMatrix__empty-cell" />
              {VIOLATION_COUNTS.map((count, i) => (
                <span key={i} className="RevocationMatrix__violation-column">
                  {violationCountLabel(count)}
                </span>
              ))}
              <span
                className={cx(
                  "RevocationMatrix__violation-sum-column",
                  "RevocationMatrix__top-right-total"
                )}
              >
                Total
              </span>
            </div>

            {violationTypes.map((violationType, i) => (
              <RevocationMatrixRow
                key={i}
                violationType={violationType}
                sum={sumRow(dataMatrix[violationType])}
                isSelected={isSelected(violationType, "")}
                onClick={() => toggleFilter(violationType, "")}
              >
                {VIOLATION_COUNTS.map((violationCount, j) => (
                  <RevocationMatrixCell
                    key={j}
                    count={getOr(
                      0,
                      [violationType, violationCount],
                      dataMatrix
                    )}
                    maxCount={maxRevocations}
                    isSelected={isSelected(violationType, violationCount)}
                    onClick={() => toggleFilter(violationType, violationCount)}
                  />
                ))}
              </RevocationMatrixRow>
            ))}

            <div className="RevocationMatrix__violation-sum-row">
              <span className="RevocationMatrix__empty-cell" />
              {VIOLATION_COUNTS.map((count, i) => (
                <span
                  key={i}
                  className={cx(
                    "RevocationMatrix__violation-column",
                    "RevocationMatrix__violation-sum"
                  )}
                >
                  {reportedViolationsSum(count)}
                </span>
              ))}

              <span
                className={cx(
                  "RevocationMatrix__violation-sum-column",
                  "RevocationMatrix__violation-sum",
                  "RevocationMatrix__bottom-right-total"
                )}
              >
                {violationsSum}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RevocationMatrix.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  stateCode: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
  violationTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RevocationMatrix;
