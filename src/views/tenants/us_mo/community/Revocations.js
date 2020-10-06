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
import RevocationMatrixExplanation from "../../../../components/charts/new_revocations/RevocationMatrixExplanation";
import ToggleBar from "../../../../components/charts/new_revocations/ToggleBar/ToggleBar";
import ToggleBarFilter from "../../../../components/charts/new_revocations/ToggleBar/ToggleBarFilter";
import DistrictFilter from "../../../../components/charts/new_revocations/ToggleBar/DistrictFilter";
import AdmissionTypeFilter from "../../../../components/charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "../../../../components/charts/new_revocations/ToggleBar/ViolationFilter";
import {
  applyAllFilters,
  applyTopLevelFilters,
  limitFiltersToUserDistricts,
} from "../../../../components/charts/new_revocations/helpers";
import { getTimeDescription } from "../../../../components/charts/new_revocations/helpers/format";
import {
  DEFAULT_METRIC_PERIOD,
  DEFAULT_SUPERVISION_TYPE,
  METRIC_PERIODS,
  SUPERVISION_TYPES,
} from "../../../../components/charts/new_revocations/ToggleBar/options";
import flags from "../../../../flags";
import { useAuth0 } from "../../../../react-auth0-spa";
import {
  getUserAppMetadata,
  getUserDistricts,
} from "../../../../utils/authentication/user";
import * as lanternState from "../../../../utils/lanternConstants";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
} from "../../../../constants/filterTypes";

const stateCode = lanternState.MO;
const admissionTypeOptions = [
  { value: "All", label: "ALL" },
  { value: "REVOCATION", label: "Revocation" },
  {
    value: "INSTITUTIONAL TREATMENT",
    label: "Institutional Treatment",
  },
  { value: "BOARDS_RETURN", label: "Board Returns" },
];
const chargeCategoryOptions = [
  { value: "All", label: "All" },
  { value: "GENERAL", label: "General" },
  { value: "SEX_OFFENDER", label: "Sex Offense" },
  { value: "DOMESTIC_VIOLENCE", label: "Domestic Violence" },
  { value: "SERIOUS_MENTAL_ILLNESS", label: "Serious Mental Illness" },
];
const violationTypes = [
  { key: "travel_count", label: "Travel", type: "TECHNICAL" },
  { key: "residency_count", label: "Residency", type: "TECHNICAL" },
  { key: "employment_count", label: "Employment", type: "TECHNICAL" },
  { key: "association_count", label: "Association", type: "TECHNICAL" },
  { key: "directive_count", label: "Report / Directives", type: "TECHNICAL" },
  {
    key: "supervision_strategy_count",
    label: "Supervision Strategies",
    type: "TECHNICAL",
  },
  {
    key: "intervention_fee_count",
    label: "Intervention Fees",
    type: "TECHNICAL",
  },
  { key: "special_count", label: "Special Conditions", type: "TECHNICAL" },
  { key: "weapon_count", label: "Weapons", type: "TECHNICAL" },
  { key: "substance_count", label: "Substance Use", type: "TECHNICAL" },
  { key: "municipal_count", label: "Municipal", type: "LAW" },
  { key: "absconded_count", label: "Absconsion", type: "TECHNICAL" },
  { key: "misdemeanor_count", label: "Misdemeanor", type: "LAW" },
  { key: "felony_count", label: "Felony", type: "LAW" },
];

const Revocations = () => {
  const { user } = useAuth0();
  const { district } = getUserAppMetadata(user);
  const userDistricts = getUserDistricts(user);

  const [filters, setFilters] = useState({
    [METRIC_PERIOD_MONTHS]: DEFAULT_METRIC_PERIOD.value,
    [CHARGE_CATEGORY]: chargeCategoryOptions[0].value,
    district: [district || "All"],
    [SUPERVISION_TYPE]: DEFAULT_SUPERVISION_TYPE.value,
    ...(flags.enableAdmissionTypeFilter
      ? { [ADMISSION_TYPE]: [admissionTypeOptions[1].value] }
      : {}),
    [REPORTED_VIOLATIONS]: "",
    [VIOLATION_TYPE]: "",
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
  const allDataFilter = applyAllFilters(transformedFilters, false);

  const timeDescription = getTimeDescription(
    filters[METRIC_PERIOD_MONTHS],
    admissionTypeOptions,
    filters[ADMISSION_TYPE]
  );

  return (
    <main className="dashboard bgc-grey-100">
      <ToggleBar>
        <div className="top-level-filters d-f">
          <ToggleBarFilter
            label="Time Period"
            value={filters[METRIC_PERIOD_MONTHS]}
            options={METRIC_PERIODS}
            defaultValue={DEFAULT_METRIC_PERIOD}
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
            options={chargeCategoryOptions}
            defaultValue={chargeCategoryOptions[0]}
            onChange={createOnFilterChange(CHARGE_CATEGORY)}
          />
          {flags.enableAdmissionTypeFilter && (
            <AdmissionTypeFilter
              value={filters[ADMISSION_TYPE]}
              options={admissionTypeOptions}
              summingOption={admissionTypeOptions[0]}
              defaultValue={[admissionTypeOptions[1]]}
              onChange={createOnFilterChange(ADMISSION_TYPE)}
            />
          )}
          <ToggleBarFilter
            label="Supervision Type"
            value={filters[SUPERVISION_TYPE]}
            options={SUPERVISION_TYPES}
            defaultValue={DEFAULT_SUPERVISION_TYPE}
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
            dataFilter={allDataFilter}
            skippedFilters={[METRIC_PERIOD_MONTHS]}
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
              dataFilter={applyTopLevelFilters(transformedFilters, false)}
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
              dataFilter={allDataFilter}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        violationChart={
          <ErrorBoundary>
            <RevocationsByViolation
              dataFilter={allDataFilter}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
              violationTypes={violationTypes}
            />
          </ErrorBoundary>
        }
        genderChart={
          <ErrorBoundary>
            <RevocationsByGender
              dataFilter={allDataFilter}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        raceChart={
          <ErrorBoundary>
            <RevocationsByRace
              dataFilter={allDataFilter}
              filterStates={filters}
              stateCode={stateCode}
              timeDescription={timeDescription}
            />
          </ErrorBoundary>
        }
        districtChart={
          <ErrorBoundary>
            <RevocationsByDistrict
              dataFilter={allDataFilter}
              skippedFilters={["district"]}
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
            dataFilter={allDataFilter}
            treatCategoryAllAsAbsent
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
