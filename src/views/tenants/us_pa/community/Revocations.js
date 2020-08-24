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
import RevocationCountOverTime from "../../../../components/charts/new_revocations/RevocationsOverTime";
import RevocationMatrix from "../../../../components/charts/new_revocations/RevocationMatrix";
import RevocationMatrixExplanation from "../../../../components/charts/new_revocations/RevocationMatrixExplanation";
import ToggleBar from "../../../../components/charts/new_revocations/ToggleBar/ToggleBar";
import MetricPeriodMonthsFilter from "../../../../components/charts/new_revocations/ToggleBar/MetricPeriodMonthsFilter";
import DistrictFilter from "../../../../components/charts/new_revocations/ToggleBar/DistrictFilter";
import ChargeCategoryFilter from "../../../../components/charts/new_revocations/ToggleBar/ChargeCategoryFilter";
import AdmissionTypeFilter from "../../../../components/charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "../../../../components/charts/new_revocations/ToggleBar/ViolationFilter";
import {
  applyAllFilters,
  applyTopLevelFilters,
} from "../../../../components/charts/new_revocations/helpers";
import {
  DEFAULT_METRIC_PERIOD,
  DEFAULT_CHARGE_CATEGORY,
  DEFAULT_DISTRICT,
  CHARGE_CATEGORIES,
  METRIC_PERIODS,
} from "../../../../components/charts/new_revocations/ToggleBar/options";
import { getTimeDescription } from "../../../../components/charts/new_revocations/helpers/format";

const stateCode = "us_pa";
const admissionTypeOptions = [
  { value: "All", label: "ALL" },
  { value: "REVOCATION", label: "Revocation" },
  {
    label: "SCI",
    allSelectedLabel: "All Short Term",
    options: [
      { value: "SCI_6", label: "SCI 6 months" },
      { value: "SCI_9", label: "SCI 9 months" },
      { value: "SCI_12", label: "SCI 12 months" },
    ],
  },
  { value: "PVC", label: "PVC" },
  { value: "INPATIENT_DA", label: "Inpatient D&A" },
  { value: "DA_DETOX", label: "D&A Detox" },
  { value: "MENTAL_HEALTH", label: "Mental Health" },
];

const Revocations = () => {
  const [filters, setFilters] = useState({
    metricPeriodMonths: DEFAULT_METRIC_PERIOD.value,
    chargeCategory: DEFAULT_CHARGE_CATEGORY.value,
    district: DEFAULT_DISTRICT.value,
    admissionType: [admissionTypeOptions[1].value],
    reportedViolations: "",
    violationType: "",
  });

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
            defaultValue={[admissionTypeOptions[1]]}
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
          dataFilter={applyAllFilters(filters)}
          skippedFilters={["metricPeriodMonths", "supervisionType"]}
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
            metricPeriodMonths={filters.metricPeriodMonths}
            stateCode={stateCode}
          />
        </div>
        <RevocationMatrixExplanation />
      </div>

      <RevocationCharts
        filters={filters}
        dataFilter={applyAllFilters(filters)}
        stateCode={stateCode}
        timeDescription={timeDescription}
      />

      <div className="bgc-white m-20 p-20">
        <CaseTable
          dataFilter={applyAllFilters(filters)}
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
