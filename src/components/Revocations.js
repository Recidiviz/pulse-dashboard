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

import { getTimeDescription } from "./charts/new_revocations/helpers/format";
import ToggleBarFilter from "./charts/new_revocations/ToggleBar/ToggleBarFilter";
import DistrictFilter from "./charts/new_revocations/ToggleBar/DistrictFilter";
import AdmissionTypeFilter from "./charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "./charts/new_revocations/ToggleBar/ViolationFilter";
import RevocationsOverTime from "./charts/new_revocations/RevocationsOverTime";
import Matrix from "./charts/new_revocations/Matrix";
import MatrixExplanation from "./charts/new_revocations/Matrix/MatrixExplanation";
import RevocationCharts from "./charts/new_revocations/RevocationCharts";
import ErrorBoundary from "./ErrorBoundary";
import CaseTable from "./charts/new_revocations/CaseTable/CaseTable";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  METRIC_PERIOD_MONTHS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
} from "../constants/filterTypes";
import { useRootStore } from "../StoreProvider";

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
        className="FilterBar"
        style={{ zIndex: 700, top: hideTopBar ? 0 : 65 }}
      >
        <ErrorBoundary>
          <div className="top-level-filters d-f">
            <ToggleBarFilter
              label="Time Period"
              dimension={METRIC_PERIOD_MONTHS}
            />
            <ErrorBoundary>
              <DistrictFilter />
            </ErrorBoundary>
            {filterOptions[CHARGE_CATEGORY].componentEnabled && (
              <ToggleBarFilter label="Case Type" dimension={CHARGE_CATEGORY} />
            )}
            {filterOptions[SUPERVISION_LEVEL].componentEnabled && (
              <ToggleBarFilter
                label="Supervision Level"
                dimension={SUPERVISION_LEVEL}
              />
            )}
            {filterOptions[ADMISSION_TYPE].componentEnabled && (
              <AdmissionTypeFilter />
            )}
            {filterOptions[SUPERVISION_TYPE].componentEnabled && (
              <ToggleBarFilter
                label="Supervision Type"
                dimension={SUPERVISION_TYPE}
              />
            )}
          </div>
          <ViolationFilter />
        </ErrorBoundary>
      </Sticky>

      <div className="bgc-white p-20 m-20">
        <ErrorBoundary>
          <RevocationsOverTime />
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
          <CaseTable />
        </ErrorBoundary>
      </div>
    </main>
  );
};

Revocations.propTypes = {};

export default observer(Revocations);
