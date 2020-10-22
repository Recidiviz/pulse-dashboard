import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import {
  applyAllFilters,
  applyTopLevelFilters,
  limitFiltersToUserDistricts,
} from "./charts/new_revocations/helpers";
import { getTimeDescription } from "./charts/new_revocations/helpers/format";
import ToggleBar from "./charts/new_revocations/ToggleBar/ToggleBar";
import ToggleBarFilter from "./charts/new_revocations/ToggleBar/ToggleBarFilter";
import ErrorBoundary from "./ErrorBoundary";
import DistrictFilter from "./charts/new_revocations/ToggleBar/DistrictFilter";
import AdmissionTypeFilter from "./charts/new_revocations/ToggleBar/AdmissionTypeFilter";
import ViolationFilter from "./charts/new_revocations/ToggleBar/ViolationFilter";
import RevocationCountOverTime from "./charts/new_revocations/RevocationsOverTime";
import RevocationMatrix from "./charts/new_revocations/RevocationMatrix/RevocationMatrix";
import RevocationMatrixExplanation from "./charts/new_revocations/RevocationMatrix/RevocationMatrixExplanation";
import RevocationCharts from "./charts/new_revocations/RevocationCharts";
import RevocationsByRiskLevel from "./charts/new_revocations/RevocationsByRiskLevel/RevocationsByRiskLevel";
import RevocationsByViolation from "./charts/new_revocations/RevocationsByViolation";
import RevocationsByGender from "./charts/new_revocations/RevocationsByGender/RevocationsByGender";
import RevocationsByRace from "./charts/new_revocations/RevocationsByRace/RevocationsByRace";
import RevocationsByDistrict from "./charts/new_revocations/RevocationsByDistrict/RevocationsByDistrict";
import CaseTable from "./charts/new_revocations/CaseTable/CaseTable";
import { useAuth0 } from "../react-auth0-spa";
import {
  getUserAppMetadata,
  getUserDistricts,
} from "../utils/authentication/user";
import flags from "../flags";
import * as lanternTenant from "../views/tenants/utils/lanternTenants";
import filterOptionsMap from "../views/tenants/constants/filterOptions";
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

const Revocations = ({ stateCode, violationTypes }) => {
  const { user } = useAuth0();
  const { district } = getUserAppMetadata(user);
  const userDistricts = getUserDistricts(user);

  const filterOptions = filterOptionsMap[stateCode];

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
  const allDataFilter = applyAllFilters(transformedFilters);

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
          {filterOptions[SUPERVISION_LEVEL].enabled && (
            <ToggleBarFilter
              label="Supervision Level"
              value={filters[SUPERVISION_LEVEL]}
              options={filterOptions[SUPERVISION_LEVEL].options}
              defaultOption={filterOptions[SUPERVISION_LEVEL].defaultOption}
              onChange={createOnFilterChange(SUPERVISION_LEVEL)}
            />
          )}
          {flags.enableAdmissionTypeFilter && (
            <AdmissionTypeFilter
              value={filters[ADMISSION_TYPE]}
              options={filterOptions[ADMISSION_TYPE].options}
              summingOption={filterOptions[ADMISSION_TYPE].summingOption}
              defaultValue={filterOptions[ADMISSION_TYPE].defaultValue}
              onChange={createOnFilterChange(ADMISSION_TYPE)}
            />
          )}
          {filterOptions[SUPERVISION_TYPE].enabled && (
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
      </ToggleBar>

      <div className="bgc-white p-20 m-20">
        <ErrorBoundary>
          <RevocationCountOverTime
            dataFilter={allDataFilter}
            skippedFilters={[
              METRIC_PERIOD_MONTHS,
              ...(stateCode === lanternTenant.PA ? [SUPERVISION_TYPE] : []),
            ]}
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
              violationTypes={violationTypes}
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
              violationTypes={filterOptions[VIOLATION_TYPE].options}
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
              skippedFilters={[DISTRICT]}
              filterStates={filters}
              currentDistricts={
                stateCode === lanternTenant.MO
                  ? transformedFilters[DISTRICT]
                  : filters[DISTRICT]
              }
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

Revocations.propTypes = {
  stateCode: PropTypes.string.isRequired,
  violationTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Revocations;
