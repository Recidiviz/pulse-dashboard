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

import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-fill";

import {
  matchesAllFilters,
  matchesTopLevelFilters,
  applyAllFilters,
} from "./charts/new_revocations/helpers";
import { getTimeDescription } from "./charts/new_revocations/helpers/format";
import ToggleBarFilter from "./charts/new_revocations/ToggleBar/ToggleBarFilter";
import ErrorBoundary from "./ErrorBoundary";
import DistrictFilter from "./charts/new_revocations/ToggleBar/DistrictFilter";
import AdmissionTypeFilter from "./charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "./charts/new_revocations/ToggleBar/ViolationFilter";
import RevocationCountOverTime from "./charts/new_revocations/RevocationsOverTime";
import Matrix from "./charts/new_revocations/Matrix";
import MatrixExplanation from "./charts/new_revocations/Matrix/MatrixExplanation";
import RevocationCharts from "./charts/new_revocations/RevocationCharts";
import RevocationsByRiskLevel from "./charts/new_revocations/RevocationsByRiskLevel/RevocationsByRiskLevel";
import RevocationsByOfficer from "./charts/new_revocations/RevocationsByOfficer";
import RevocationsByViolation from "./charts/new_revocations/RevocationsByViolation";
import RevocationsByGender from "./charts/new_revocations/RevocationsByGender/RevocationsByGender";
import RevocationsByRace from "./charts/new_revocations/RevocationsByRace/RevocationsByRace";
import RevocationsByDistrict from "./charts/new_revocations/RevocationsByDistrict/RevocationsByDistrict";
import CaseTable from "./charts/new_revocations/CaseTable/CaseTable";
import { useAuth0 } from "../react-auth0-spa";
import { getUserAppMetadata } from "../utils/authentication/user";
import { useStateCode } from "../contexts/StateCodeContext";
import { translate } from "../views/tenants/utils/i18nSettings";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../constants/filterTypes";
import flags from "../flags";
import { useRootStore } from "../StoreProvider";

import "./Revocations.scss";

const Revocations = () => {
  const { filtersStore } = useRootStore();
  const { filters, filterOptions } = filtersStore;
  const { user } = useAuth0();
  const { currentStateCode: stateCode } = useStateCode();

  const { district } = getUserAppMetadata(user);
  useEffect(() => {
    if (district) {
      filtersStore.setRestrictedDistrict(district);
    }
  }, [district, filtersStore]);

  const violationTypes = translate("violationTypes");

  const updateFilters = (newFilters) => {
    filtersStore.setFilters({ ...filters, ...newFilters });
  };

  const createOnFilterChange = useCallback(
    (field) => (value) => {
      filtersStore.setFilters({ ...filters, [field]: value });
    },
    [filtersStore, filters]
  );

  const timeDescription = getTimeDescription(
    filters[METRIC_PERIOD_MONTHS],
    filterOptions[ADMISSION_TYPE].options,
    filters[ADMISSION_TYPE]
  );

  return (
    <main className="Revocations">
      <Sticky style={{ zIndex: 700, top: 65 }}>
        <>
          <div className="top-level-filters d-f">
            <ToggleBarFilter
              label="Time Period"
              value={filters[METRIC_PERIOD_MONTHS]}
              options={filterOptions[METRIC_PERIOD_MONTHS].options}
              defaultOption={filterOptions[METRIC_PERIOD_MONTHS].defaultOption}
              onChange={createOnFilterChange(METRIC_PERIOD_MONTHS)}
            />
            <ErrorBoundary>
              <DistrictFilter
                value={filters[DISTRICT]}
                stateCode={stateCode}
                onChange={createOnFilterChange(DISTRICT)}
              />
            </ErrorBoundary>
            <ToggleBarFilter
              label="Case Type"
              value={filters[CHARGE_CATEGORY]}
              options={filterOptions[CHARGE_CATEGORY].options}
              defaultOption={filterOptions[CHARGE_CATEGORY].defaultOption}
              onChange={createOnFilterChange(CHARGE_CATEGORY)}
            />
            {filterOptions[SUPERVISION_LEVEL].componentEnabled && (
              <ToggleBarFilter
                label="Supervision Level"
                value={filters[SUPERVISION_LEVEL]}
                options={filterOptions[SUPERVISION_LEVEL].options}
                defaultOption={filterOptions[SUPERVISION_LEVEL].defaultOption}
                onChange={createOnFilterChange(SUPERVISION_LEVEL)}
              />
            )}
            {filterOptions[ADMISSION_TYPE].componentEnabled && (
              <AdmissionTypeFilter
                value={filters[ADMISSION_TYPE]}
                options={filterOptions[ADMISSION_TYPE].options}
                summingOption={filterOptions[ADMISSION_TYPE].summingOption}
                defaultValue={filterOptions[ADMISSION_TYPE].defaultValue}
                onChange={createOnFilterChange(ADMISSION_TYPE)}
              />
            )}
            {filterOptions[SUPERVISION_TYPE].componentEnabled && (
              <ToggleBarFilter
                label="Supervision Type"
                value={filters[SUPERVISION_TYPE]}
                options={filterOptions[SUPERVISION_TYPE].options}
                defaultOption={filterOptions[SUPERVISION_TYPE].defaultOption}
                onChange={createOnFilterChange(SUPERVISION_TYPE)}
              />
            )}
          </div>
          <ViolationFilter
            violationType={filters[VIOLATION_TYPE]}
            reportedViolations={filters[REPORTED_VIOLATIONS]}
            onClick={updateFilters}
          />
        </>
      </Sticky>

      <div className="bgc-white p-20 m-20">
        <ErrorBoundary>
          <RevocationCountOverTime stateCode={stateCode} />
        </ErrorBoundary>
      </div>
      <div className="d-f m-20 container-all-charts">
        <div className="Revocations__matrix">
          <ErrorBoundary>
            <Matrix
              dataFilter={matchesTopLevelFilters({
                filters,
              })}
              filterStates={filters}
              updateFilters={updateFilters}
              timeDescription={timeDescription}
              stateCode={stateCode}
              violationTypes={violationTypes}
            />
          </ErrorBoundary>
        </div>
        <MatrixExplanation />
      </div>

      <RevocationCharts
        riskLevelChart={
          <ErrorBoundary>
            <RevocationsByRiskLevel
              dataFilter={matchesAllFilters({ filters })}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        officerChart={
          flags.enableOfficerChart && (
            <ErrorBoundary>
              <RevocationsByOfficer
                dataFilter={matchesAllFilters({ filters })}
                filterStates={filters}
                stateCode={stateCode}
                timeDescription={timeDescription}
              />
            </ErrorBoundary>
          )
        }
        violationChart={
          <ErrorBoundary>
            <RevocationsByViolation
              dataFilter={matchesAllFilters({ filters })}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
              violationTypes={filterOptions[VIOLATION_TYPE].options}
            />
          </ErrorBoundary>
        }
        genderChart={
          <ErrorBoundary>
            <RevocationsByGender
              dataFilter={matchesAllFilters({ filters })}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        raceChart={
          <ErrorBoundary>
            <RevocationsByRace
              dataFilter={matchesAllFilters({ filters })}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        districtChart={
          <ErrorBoundary>
            <RevocationsByDistrict
              dataFilter={matchesAllFilters({
                filters,
                skippedFilters: [DISTRICT],
              })}
              filterStates={filters}
              currentDistricts={filters[DISTRICT]}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
      />

      <div className="bgc-white m-20 p-20">
        <ErrorBoundary>
          <CaseTable
            dataFilter={applyAllFilters({
              filters,
              treatCategoryAllAsAbsent: true,
            })}
            filterStates={filters}
            metricPeriodMonths={filters[METRIC_PERIOD_MONTHS]}
            stateCode={stateCode}
          />
        </ErrorBoundary>
      </div>
    </main>
  );
};

Revocations.propTypes = {};

export default observer(Revocations);
