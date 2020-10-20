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

import React, { useCallback, useState } from "react";

import CaseTable from "../../../../components/charts/new_revocations/CaseTable/CaseTable";
import RevocationCharts from "../../../../components/charts/new_revocations/RevocationCharts";
import RevocationsByRiskLevel from "../../../../components/charts/new_revocations/RevocationsByRiskLevel/RevocationsByRiskLevel";
import RevocationsByViolation from "../../../../components/charts/new_revocations/RevocationsByViolation";
import RevocationsByGender from "../../../../components/charts/new_revocations/RevocationsByGender/RevocationsByGender";
import RevocationsByRace from "../../../../components/charts/new_revocations/RevocationsByRace/RevocationsByRace";
import RevocationsByDistrict from "../../../../components/charts/new_revocations/RevocationsByDistrict/RevocationsByDistrict";
import RevocationCountOverTime from "../../../../components/charts/new_revocations/RevocationsOverTime";
import RevocationMatrix from "../../../../components/charts/new_revocations/RevocationMatrix/RevocationMatrix";
import RevocationMatrixExplanation from "../../../../components/charts/new_revocations/RevocationMatrix/RevocationMatrixExplanation";
import ToggleBar from "../../../../components/charts/new_revocations/ToggleBar/ToggleBar";
import DistrictFilter from "../../../../components/charts/new_revocations/ToggleBar/DistrictFilter";
import AdmissionTypeFilter from "../../../../components/charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "../../../../components/charts/new_revocations/ToggleBar/ViolationFilter";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import ToggleBarFilter from "../../../../components/charts/new_revocations/ToggleBar/ToggleBarFilter";
import {
  applyAllFilters,
  applyTopLevelFilters,
  limitFiltersToUserDistricts,
} from "../../../../components/charts/new_revocations/helpers";
import { getTimeDescription } from "../../../../components/charts/new_revocations/helpers/format";
import flags from "../../../../flags";
import { useAuth0 } from "../../../../react-auth0-spa";
import {
  getUserAppMetadata,
  getUserDistricts,
} from "../../../../utils/authentication/user";
import * as lanternTenant from "../../utils/lanternTenants";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../../../../constants/filterTypes";
import { MOFilterOptions as filterOptions } from "../../constants/filterOptions";

const stateCode = lanternTenant.MO;

const Revocations = () => {
  const { user } = useAuth0();
  const { district } = getUserAppMetadata(user);
  const userDistricts = getUserDistricts(user);

  const [filters, setFilters] = useState({
    [METRIC_PERIOD_MONTHS]: filterOptions[METRIC_PERIOD_MONTHS].defaultValue,
    [CHARGE_CATEGORY]: filterOptions[CHARGE_CATEGORY].defaultValue,
    [REPORTED_VIOLATIONS]: filterOptions[REPORTED_VIOLATIONS].defaultValue,
    [VIOLATION_TYPE]: filterOptions[VIOLATION_TYPE].defaultValue,
    [SUPERVISION_TYPE]: filterOptions[SUPERVISION_TYPE].defaultValue,
    [SUPERVISION_LEVEL]: filterOptions[SUPERVISION_LEVEL].defaultValue,
    ...(flags.enableAdmissionTypeFilter
      ? { [ADMISSION_TYPE]: filterOptions[ADMISSION_TYPE].defaultValue }
      : {}),
    [DISTRICT]: [district || filterOptions[DISTRICT].defaultValue],
  });

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const createOnFilterChange = useCallback(
    (field) => (value) => {
      setFilters({ ...filters, [field]: value });
    },
    [filters]
  );

  const transformedFilters = limitFiltersToUserDistricts(
    filters,
    userDistricts
  );

  const timeDescription = getTimeDescription(
    filters[METRIC_PERIOD_MONTHS],
    filterOptions[ADMISSION_TYPE].options,
    filters[ADMISSION_TYPE]
  );

  return (
    <main className="dashboard bgc-grey-100">
      <ToggleBar>
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
          {flags.enableAdmissionTypeFilter && (
            <AdmissionTypeFilter
              value={filters[ADMISSION_TYPE]}
              options={filterOptions[ADMISSION_TYPE].options}
              summingOption={filterOptions[ADMISSION_TYPE].summingOption}
              defaultValue={filterOptions[ADMISSION_TYPE].defaultValue}
              onChange={createOnFilterChange(ADMISSION_TYPE)}
            />
          )}
          <ToggleBarFilter
            label="Supervision Type"
            value={filters[SUPERVISION_TYPE]}
            options={filterOptions[SUPERVISION_TYPE].options}
            defaultOption={filterOptions[SUPERVISION_TYPE].defaultOption}
            onChange={createOnFilterChange(SUPERVISION_TYPE)}
          />
        </div>
        <ViolationFilter
          violationType={filters[VIOLATION_TYPE]}
          reportedViolations={filters[REPORTED_VIOLATIONS]}
          onClick={updateFilters}
        />
      </ToggleBar>

      <div className="bgc-white p-20 m-20">
        <ErrorBoundary>
          <RevocationCountOverTime
            dataFilter={applyAllFilters(transformedFilters, [
              METRIC_PERIOD_MONTHS,
            ])}
            filterStates={filters}
            metricPeriodMonths={filters[METRIC_PERIOD_MONTHS]}
            stateCode={stateCode}
          />
        </ErrorBoundary>
      </div>
      <div className="d-f m-20 container-all-charts">
        <div className="matrix-container bgc-white p-20 mR-20">
          <ErrorBoundary>
            <RevocationMatrix
              dataFilter={applyTopLevelFilters(transformedFilters)}
              filterStates={filters}
              updateFilters={updateFilters}
              timeDescription={timeDescription}
              stateCode={stateCode}
              violationTypes={[
                "TECHNICAL",
                "SUBSTANCE_ABUSE",
                "MUNICIPAL",
                "ABSCONDED",
                "MISDEMEANOR",
                "FELONY",
              ]}
            />
          </ErrorBoundary>
        </div>
        <RevocationMatrixExplanation />
      </div>

      <RevocationCharts
        riskLevelChart={
          <ErrorBoundary>
            <RevocationsByRiskLevel
              dataFilter={applyAllFilters(transformedFilters)}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        violationChart={
          <ErrorBoundary>
            <RevocationsByViolation
              dataFilter={applyAllFilters(transformedFilters)}
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
              dataFilter={applyAllFilters(transformedFilters)}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        raceChart={
          <ErrorBoundary>
            <RevocationsByRace
              dataFilter={applyAllFilters(transformedFilters)}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        districtChart={
          <ErrorBoundary>
            <RevocationsByDistrict
              dataFilter={applyAllFilters(transformedFilters, [DISTRICT])}
              filterStates={filters}
              currentDistricts={transformedFilters[DISTRICT]}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
      />

      <div className="bgc-white m-20 p-20">
        <ErrorBoundary>
          <CaseTable
            dataFilter={applyAllFilters(transformedFilters, undefined, true)}
            filterStates={filters}
            metricPeriodMonths={filters[METRIC_PERIOD_MONTHS]}
            stateCode={stateCode}
          />
        </ErrorBoundary>
      </div>
    </main>
  );
};

export default Revocations;
