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

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Sticky from "react-sticky-fill";
import filter from "lodash/fp/filter";

import identity from "lodash/fp/identity";
import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import sortBy from "lodash/fp/sortBy";
import uniq from "lodash/fp/uniq";

import Select from "../../../controls/Select";
import Chip from "../Chip";
import Loading from "../../../Loading";
import useChartData from "../../../../hooks/useChartData";
import useTopBarShrinking from "../../../../hooks/useTopBarShrinking";
import {
  DEFAULT_DISTRICT,
  CHARGE_CATEGORIES,
  METRIC_PERIODS,
  SUPERVISION_TYPES,
  ADMISSION_TYPES,
  DEFAULT_ADMISSION_TYPE,
  DEFAULT_SUPERVISION_TYPE,
  DEFAULT_CHARGE_CATEGORY,
  DEFAULT_METRIC_PERIOD,
} from "./options";
import {
  matrixViolationTypeToLabel,
  violationCountLabel,
} from "../../../../utils/transforms/labels";

const TOGGLE_STYLE = {
  zIndex: 700,
  top: 65,
};

export const prependAllOption = (options) => [DEFAULT_DISTRICT, ...options];

const ToggleBar = ({ filters, stateCode, updateFilters }) => {
  const { isLoading, apiData } = useChartData(
    `${stateCode}/newRevocations`,
    "revocations_matrix_cells"
  );

  const {
    violationType,
    reportedViolations,
    metricPeriodMonths,
    district,
    chargeCategory,
    supervisionType,
    admissionType,
  } = filters;

  const districts = useMemo(
    () =>
      pipe(
        map("district"),
        filter((d) => d.toLowerCase() !== "all"),
        uniq,
        sortBy(identity),
        map((d) => ({ value: d, label: d })),
        prependAllOption
      )(apiData),
    [apiData]
  );

  const isTopBarShrinking = useTopBarShrinking();
  const topLevelFilterClassName = isTopBarShrinking
    ? "top-level-filter top-level-active d-f align-items-center"
    : "top-level-filter";
  const titleLevelClassName = isTopBarShrinking
    ? "title-level top-level-filters-title"
    : "title-level";

  const formattedMatrixFilters = useMemo(() => {
    const parts = [];
    if (violationType) {
      parts.push(matrixViolationTypeToLabel[violationType]);
    }
    if (reportedViolations) {
      parts.push(`${violationCountLabel(reportedViolations)} violations`);
    }
    return parts.join(", ");
  }, [reportedViolations, violationType]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Sticky style={TOGGLE_STYLE}>
      <>
        <div className="top-level-filters d-f">
          {metricPeriodMonths && (
            <div className={topLevelFilterClassName}>
              <h4 className={titleLevelClassName}>
                Time
                <br style={{ display: isTopBarShrinking ? "block" : "none" }} />
                Period
              </h4>
              <Select
                className="select-align"
                options={METRIC_PERIODS}
                onChange={(option) => {
                  updateFilters({ metricPeriodMonths: option.value });
                }}
                defaultValue={DEFAULT_METRIC_PERIOD}
              />
            </div>
          )}
          {district && (
            <div className={topLevelFilterClassName}>
              <h4 className={titleLevelClassName}>District</h4>
              <Select
                className="select-align"
                options={districts}
                onChange={(option) => updateFilters({ district: option.value })}
                defaultValue={DEFAULT_DISTRICT}
              />
            </div>
          )}
          {chargeCategory && (
            <div className={topLevelFilterClassName}>
              <h4 className={titleLevelClassName}>Case Type</h4>
              <Select
                className="select-align"
                options={CHARGE_CATEGORIES}
                onChange={(option) => {
                  updateFilters({ chargeCategory: option.value });
                }}
                defaultValue={DEFAULT_CHARGE_CATEGORY}
              />
            </div>
          )}
          {supervisionType && (
            <div className={topLevelFilterClassName}>
              <h4 className={titleLevelClassName}>Supervision Type</h4>
              <Select
                className="select-align"
                options={SUPERVISION_TYPES}
                onChange={(option) => {
                  updateFilters({ supervisionType: option.value });
                }}
                defaultValue={DEFAULT_SUPERVISION_TYPE}
              />
            </div>
          )}
          {admissionType && (
            <div className={topLevelFilterClassName}>
              <h4 className={titleLevelClassName}>Admission Type</h4>
              <Select
                className="select-align"
                options={ADMISSION_TYPES}
                onChange={(selected) => {
                  const values = map("value", selected);
                  updateFilters({ admissionType: values });
                }}
                isMulti
                allOption={DEFAULT_ADMISSION_TYPE}
                defaultValue={[DEFAULT_ADMISSION_TYPE]}
              />
            </div>
          )}
        </div>

        {formattedMatrixFilters && (
          <div className="top-level-filters pre-top-level-filters">
            <div className={topLevelFilterClassName}>
              <h4 className={titleLevelClassName}>Additional filters</h4>
              <Chip
                label={formattedMatrixFilters}
                isShrinking={isTopBarShrinking}
                onDelete={() => {
                  updateFilters({ violationType: "", reportedViolations: "" });
                }}
              />
            </div>
          </div>
        )}
      </>
    </Sticky>
  );
};

ToggleBar.propTypes = {
  filters: PropTypes.shape({
    metricPeriodMonths: PropTypes.string,
    chargeCategory: PropTypes.string,
    district: PropTypes.string,
    supervisionType: PropTypes.string,
    admissionType: PropTypes.arrayOf(PropTypes.string),
    violationType: PropTypes.string,
    reportedViolations: PropTypes.string,
  }).isRequired,
  stateCode: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
};

export default ToggleBar;
