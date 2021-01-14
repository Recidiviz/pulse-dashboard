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
import { observer } from "mobx-react-lite";

import getOr from "lodash/fp/getOr";
import pipe from "lodash/fp/pipe";
import sum from "lodash/fp/sum";
import values from "lodash/fp/values";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";

import { translate } from "../../../../views/tenants/utils/i18nSettings";
import {
  VIOLATION_COUNTS,
  sumByInteger,
  getReportedViolationsSum,
  getMaxRevocations,
  getExportableMatrixData,
} from "./helpers";
import { violationCountLabel } from "../../../../utils/transforms/labels";
import { useRootStore } from "../../../../StoreProvider";
import { dataStorePropTypes } from "../../propTypes";

import Loading from "../../../Loading";
import Error from "../../../Error";
import MatrixCell from "./MatrixCell";
import MatrixRow from "./MatrixRow";
import ExportMenu from "../../ExportMenu";
import "./Matrix.scss";

const TITLE =
  "Admissions by violation history (in year prior to their last reported violation)";

const sumRow = pipe(values, sum);

const Matrix = ({ dataStore, timeDescription }) => {
  const { filters, filtersStore } = useRootStore();

  const violationTypes = translate("violationTypes");

  if (dataStore.isLoading) {
    return <Loading />;
  }

  if (dataStore.isError) {
    return <Error />;
  }

  const updateFilters = (updatedFilters) => {
    filtersStore.setFilters(updatedFilters);
  };

  const isFiltered = filters.violationType || filters.reportedViolations;

  const dataMatrix = pipe(
    groupBy("violation_type"),
    mapValues(
      pipe(
        groupBy("reported_violations"),
        mapValues(sumByInteger("total_revocations"))
      )
    )
  )(dataStore.filteredData);

  if (!dataMatrix) {
    return null;
  }

  const maxRevocations = getMaxRevocations(dataMatrix, violationTypes)();

  const violationsSum = sumByInteger("total_revocations")(
    dataStore.filteredData
  );

  const reportedViolationsSums = VIOLATION_COUNTS.map(
    getReportedViolationsSum(dataStore.filteredData)
  );

  const exportableMatrixData = getExportableMatrixData(
    dataMatrix,
    violationTypes
  );

  const isSelected = (violationType, reportedViolations) =>
    filters.violationType === violationType &&
    filters.reportedViolations === reportedViolations;

  const toggleFilter = function (violationType, reportedViolations) {
    if (isSelected(violationType, reportedViolations)) {
      updateFilters({ violationType: "", reportedViolations: "" });
    } else {
      updateFilters({ violationType, reportedViolations });
    }
  };

  return (
    <div className="Matrix">
      <h4 className="Matrix__title">
        {TITLE}
        <ExportMenu
          chartId={`${translate("revocation")}Matrix`}
          regularElement
          datasets={exportableMatrixData}
          labels={VIOLATION_COUNTS.map(violationCountLabel)}
          metricTitle={TITLE}
          timeWindowDescription={timeDescription}
          fixLabelsInColumns
          dataExportLabel="Violations"
        />
      </h4>
      <h6 className="Matrix__dates">{timeDescription}</h6>
      <div className="Matrix__x-label">
        # of {translate("violationReports")}
      </div>
      <div id="revocationMatrix" className="Matrix__chart-container">
        <div className="Matrix__y-label" data-html2canvas-ignore>
          Most severe violation reported
        </div>
        <div
          className={cx("Matrix__matrix", {
            "Matrix__matrix--is-filtered": isFiltered,
          })}
        >
          <div className="Matrix__violation-counts">
            <span className="Matrix__empty-cell" />
            {VIOLATION_COUNTS.map((count, i) => (
              <span key={i} className="Matrix__violation-column">
                {violationCountLabel(count)}
              </span>
            ))}
            <span
              className={cx(
                "Matrix__violation-sum-column",
                "Matrix__top-right-total"
              )}
            >
              Total
            </span>
          </div>

          {violationTypes.map(function (violationType, i) {
            return (
              <MatrixRow
                key={`${violationType}-${i}`}
                violationType={violationType}
                sum={sumRow(dataMatrix[violationType])}
                isSelected={isSelected(violationType, "")}
                onClick={() => toggleFilter(violationType, "")}
              >
                {VIOLATION_COUNTS.map(function (violationCount, j) {
                  return (
                    <MatrixCell
                      key={`${violationType}-${violationCount}-${j}`}
                      count={getOr(
                        0,
                        [violationType, violationCount],
                        dataMatrix
                      )}
                      maxCount={maxRevocations}
                      isSelected={isSelected(violationType, violationCount)}
                      onClick={() =>
                        toggleFilter(violationType, violationCount)
                      }
                    />
                  );
                })}
              </MatrixRow>
            );
          })}

          <div className="Matrix__violation-sum-row">
            <span className="Matrix__empty-cell" />
            {reportedViolationsSums.map((reportedViolationSum, i) => (
              <span
                key={i}
                className={cx(
                  "Matrix__violation-column",
                  "Matrix__violation-sum"
                )}
              >
                {reportedViolationSum}
              </span>
            ))}

            <span
              className={cx(
                "Matrix__violation-sum-column",
                "Matrix__violation-sum",
                "Matrix__bottom-right-total"
              )}
            >
              {violationsSum}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

Matrix.propTypes = {
  dataStore: dataStorePropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(Matrix);
