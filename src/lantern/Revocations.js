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

import React from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-fill";
import { get } from "mobx";

import { getTimeDescription } from "./utils/format";
import SelectFilter from "./FiltersBar/SelectFilter";
import DistrictFilter from "./FiltersBar/DistrictFilter";
import AdmissionTypeFilter from "./FiltersBar/AdmissionTypeFilter";
import ViolationFilter from "./FiltersBar/ViolationFilter";
import RevocationsOverTime from "./RevocationsOverTime";
import Matrix from "./Matrix";
import MatrixExplanation from "./Matrix/MatrixExplanation";
import RevocationCharts from "./RevocationCharts";
import ErrorBoundary from "../components/ErrorBoundary";
import CaseTable from "./CaseTable/CaseTable";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  METRIC_PERIOD_MONTHS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
} from "./utils/constants";
import { useRootStore } from "../components/StoreProvider";

import "./Revocations.scss";
import { usePageState } from "../contexts/PageContext";

const Revocations = () => {
  const { filtersStore } = useRootStore();
  const { filters, filterOptions } = filtersStore;
  const { hideTopBar } = usePageState();

  const timeDescription = getTimeDescription(
    get(filters, METRIC_PERIOD_MONTHS),
    filterOptions[ADMISSION_TYPE].options,
    get(filters, ADMISSION_TYPE)
  );

  return (
    <main className="Revocations">
      <Sticky
        className="LanternFilterBar"
        style={{ zIndex: 700, top: hideTopBar ? 0 : 65 }}
      >
        <ErrorBoundary>
          <>
            <div className="top-level-filters d-f">
              <SelectFilter
                label="Time Period"
                dimension={METRIC_PERIOD_MONTHS}
              />
              <ErrorBoundary>
                <DistrictFilter />
              </ErrorBoundary>
              {filterOptions[CHARGE_CATEGORY].componentEnabled && (
                <SelectFilter label="Case Type" dimension={CHARGE_CATEGORY} />
              )}
              {filterOptions[SUPERVISION_LEVEL].componentEnabled && (
                <SelectFilter
                  label="Supervision Level"
                  dimension={SUPERVISION_LEVEL}
                />
              )}
              {filterOptions[ADMISSION_TYPE].componentEnabled && (
                <AdmissionTypeFilter />
              )}
              {filterOptions[SUPERVISION_TYPE].componentEnabled && (
                <SelectFilter
                  label="Supervision Type"
                  dimension={SUPERVISION_TYPE}
                />
              )}
            </div>
            <ViolationFilter />
          </>
        </ErrorBoundary>
      </Sticky>

      <div className="bgc-white p-20 m-20">
        <ErrorBoundary>
          <RevocationsOverTime timeDescription={timeDescription} />
        </ErrorBoundary>
      </div>
      <div className="d-f m-20 container-all-charts">
        <div className="Revocations__matrix">
          <ErrorBoundary>
            <Matrix timeDescription={timeDescription} />
          </ErrorBoundary>
        </div>
        <MatrixExplanation />
      </div>
      <ErrorBoundary>
        <RevocationCharts timeDescription={timeDescription} />
      </ErrorBoundary>
      <div className="bgc-white m-20 p-20">
        <ErrorBoundary>
          <CaseTable timeDescription={timeDescription} />
        </ErrorBoundary>
      </div>
    </main>
  );
};

Revocations.propTypes = {};

export default observer(Revocations);
