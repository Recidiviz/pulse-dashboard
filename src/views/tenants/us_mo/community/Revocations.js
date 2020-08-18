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
import MetricPeriodMonthsFilter from "../../../../components/charts/new_revocations/ToggleBar/MetricPeriodMonthsFilter";
import DistrictFilter from "../../../../components/charts/new_revocations/ToggleBar/DistrictFilter";
import ChargeCategoryFilter from "../../../../components/charts/new_revocations/ToggleBar/ChargeCategoryFilter";
import AdmissionTypeFilter from "../../../../components/charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import SupervisionTypeFilter from "../../../../components/charts/new_revocations/ToggleBar/SupervisionTypeFilter";
import ViolationFilter from "../../../../components/charts/new_revocations/ToggleBar/ViolationFilter";
import {
  applyAllFilters,
  applyTopLevelFilters,
} from "../../../../components/charts/new_revocations/helpers";
import { getTimeDescription } from "../../../../components/charts/new_revocations/helpers/format";
import {
  DEFAULT_METRIC_PERIOD,
  DEFAULT_CHARGE_CATEGORY,
  DEFAULT_SUPERVISION_TYPE,
  DEFAULT_DISTRICT,
  CHARGE_CATEGORIES,
  METRIC_PERIODS,
  SUPERVISION_TYPES,
} from "../../../../components/charts/new_revocations/ToggleBar/options";

const stateCode = "us_mo";
const admissionTypeOptions = [
  { value: "All", label: "ALL" },
  { value: "REVOCATION", label: "Revocation" },
  {
    value: "INSTITUTIONAL TREATMENT",
    label: "Institutional Treatment",
  },
  { value: "BOARDS_RETURN", label: "Board Returns" },
];
const defaultAdmissionTypeOptions = [admissionTypeOptions[1]];

const Revocations = () => {
  const [filters, setFilters] = useState({
    metricPeriodMonths: DEFAULT_METRIC_PERIOD.value,
    chargeCategory: DEFAULT_CHARGE_CATEGORY.value,
    district: DEFAULT_DISTRICT.value,
    supervisionType: DEFAULT_SUPERVISION_TYPE.value,
    admissionType: defaultAdmissionTypeOptions.map((option) => option.value),
    reportedViolations: "",
    violationType: "",
  });

  const allDataFilter = applyAllFilters(filters);
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const timeDescription = getTimeDescription(
    filters.metricPeriodMonths,
    admissionTypeOptions,
    filters.admissionType
  );

  return (
    <main className="dashboard bgc-grey-100">
      <ToggleBar>
        <div className="top-level-filters d-f">
          <MetricPeriodMonthsFilter
            options={METRIC_PERIODS}
            defaultValue={DEFAULT_METRIC_PERIOD}
            onChange={updateFilters}
          />
          <DistrictFilter
            stateCode={stateCode}
            defaultValue={DEFAULT_DISTRICT}
            onChange={updateFilters}
          />
          <ChargeCategoryFilter
            options={CHARGE_CATEGORIES}
            defaultValue={DEFAULT_CHARGE_CATEGORY}
            onChange={updateFilters}
          />
          <AdmissionTypeFilter
            options={admissionTypeOptions}
            summingOption={admissionTypeOptions[0]}
            defaultValue={defaultAdmissionTypeOptions}
            onChange={updateFilters}
          />
          <SupervisionTypeFilter
            options={SUPERVISION_TYPES}
            defaultValue={DEFAULT_SUPERVISION_TYPE}
            onChange={updateFilters}
          />
        </div>
        <ViolationFilter
          violationType={filters.violationType}
          reportedViolations={filters.reportedViolations}
          onClick={updateFilters}
        />
      </ToggleBar>

      <div className="bgc-white p-20 m-20">
        <RevocationCountOverTime
          dataFilter={allDataFilter}
          skippedFilters={["metricPeriodMonths"]}
          filterStates={filters}
          metricPeriodMonths={filters.metricPeriodMonths}
          stateCode={stateCode}
        />
      </div>
      <div className="d-f m-20 container-all-charts">
        <div className="matrix-container bgc-white p-20 mR-20">
          <RevocationMatrix
            dataFilter={applyTopLevelFilters(filters)}
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
        </div>
        <RevocationMatrixExplanation />
      </div>

      <RevocationCharts
        riskLevelChart={
          <RevocationsByRiskLevel
            dataFilter={allDataFilter}
            filterStates={filters}
            stateCode={stateCode}
            timeDescription={timeDescription}
          />
        }
        violationChart={
          <RevocationsByViolation
            dataFilter={allDataFilter}
            filterStates={filters}
            stateCode={stateCode}
            timeDescription={timeDescription}
            technicalViolationTypes={[
              "travel_count",
              "residency_count",
              "employment_count",
              "association_count",
              "directive_count",
              "supervision_strategy_count",
              "intervention_fee_count",
              "special_count",
              "substance_count",
              "absconded_count",
              "weapon_count",
            ]}
            lawViolationTypes={[
              "municipal_count",
              "misdemeanor_count",
              "felony_count",
            ]}
            allViolationTypes={[
              "travel_count",
              "residency_count",
              "employment_count",
              "association_count",
              "directive_count",
              "supervision_strategy_count",
              "intervention_fee_count",
              "special_count",
              "weapon_count",
              "substance_count",
              "municipal_count",
              "absconded_count",
              "misdemeanor_count",
              "felony_count",
            ]}
          />
        }
        genderChart={
          <RevocationsByGender
            dataFilter={allDataFilter}
            filterStates={filters}
            stateCode={stateCode}
            timeDescription={timeDescription}
          />
        }
        raceChart={
          <RevocationsByRace
            dataFilter={allDataFilter}
            filterStates={filters}
            stateCode={stateCode}
            timeDescription={timeDescription}
          />
        }
        districtChart={
          <RevocationsByDistrict
            dataFilter={allDataFilter}
            skippedFilters={["district"]}
            filterStates={filters}
            currentDistrict={filters.district}
            stateCode={stateCode}
            timeDescription={timeDescription}
          />
        }
      />

      <div className="bgc-white m-20 p-20">
        <CaseTable
          dataFilter={allDataFilter}
          treatCategoryAllAsAbsent
          filterStates={filters}
          metricPeriodMonths={filters.metricPeriodMonths}
          stateCode={stateCode}
        />
      </div>
    </main>
  );
};

export default Revocations;
