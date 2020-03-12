// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Sticky from 'react-sticky-fill';

import Loading from '../../../components/Loading';
import '../../../assets/styles/index.scss';
import { useAuth0 } from '../../../react-auth0-spa';
import { callMetricsApi, awaitingResults } from '../../../utils/metricsClient';

import RevocationMatrix
  from '../../../components/charts/new_revocations/RevocationMatrix';
import RevocationCountOverTime
  from '../../../components/charts/new_revocations/RevocationsOverTime';
import RevocationsByDistrict
  from '../../../components/charts/new_revocations/RevocationsByDistrict';
import RevocationsByRiskLevel
  from '../../../components/charts/new_revocations/RevocationsByRiskLevel';
import RevocationsByViolation
  from '../../../components/charts/new_revocations/RevocationsByViolation';
import RevocationsByGender
  from '../../../components/charts/new_revocations/RevocationsByGender';
import RevocationsByRace
  from '../../../components/charts/new_revocations/RevocationsByRace';
import CaseTable
  from '../../../components/charts/new_revocations/CaseTable';

import { toInt } from '../../../utils/transforms/labels';

const METRIC_PERIODS = [
  { value: '36', label: '3 years' },
  { value: '12', label: '1 year' },
  { value: '6', label: '6 months' },
  { value: '3', label: '3 months' },
  { value: '1', label: '1 month' },
];

const DEFAULT_METRIC_PERIOD = '12';

const DEFAULT_BASE_DISTRICT = { value: 'All', label: 'All districts' };

const CHARGE_CATEGORIES = [
  { value: 'All', label: 'All' },
  { value: 'GENERAL', label: 'General' },
  { value: 'SEX_OFFENDER', label: 'Sex Offense' },
  { value: 'DOMESTIC_VIOLENCE', label: 'Domestic Violence' },
];

// TODO: Determine if we want to continue to explicitly provide charge_category=ALL or treat it
// like supervision type where ALL is a summation of other rows
const DEFAULT_CHARGE_CATEGORY = 'All';

const SUPERVISION_TYPES = [
  { value: '', label: 'All' },
  { value: 'PROBATION', label: 'Probation' },
  { value: 'PAROLE', label: 'Parole' },
  // TODO: Enable dual supervision filtering when supported in calculation methodology
  // { value: 'DUAL_SUPERVISION', label: 'Dual supervision' },
];

const DEFAULT_DISTRICT = 'All';

const TOGGLE_STYLE = {
  zIndex: 700,
  top: 65,
};

const CHARTS = ['District', 'Risk level', 'Violation', 'Gender', 'Race'];

const Revocations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState(
    {
      metricPeriodMonths: DEFAULT_METRIC_PERIOD,
      chargeCategory: DEFAULT_CHARGE_CATEGORY,
      district: DEFAULT_DISTRICT,
    },
  );
  const [selectedChart, setSelectedChart] = useState('District');


  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('us_mo/newRevocations', getTokenSilently);
      setApiData(responseData);
      setAwaitingApi(false);

      const districtValues = [
        ...new Set(responseData.revocations_matrix_cells
          .map((item) => item.district)
          .filter((district) => district.toLowerCase() !== 'all')),
      ];
      districtValues.sort();

      const districtsFromResponse = [
        DEFAULT_BASE_DISTRICT,
        ...districtValues.map((district) => ({ value: district, label: district })),
      ];

      setDistricts(districtsFromResponse);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const nullSafeComparison = (a, b) => {
    if (!a && !b) {
      return true;
    }
    if (!a) {
      return false;
    }
    if (!b) {
      return false;
    }

    return a.toLowerCase() === b.toLowerCase();
  };

  const applyTopLevelFilters = (data, skippedFilters, treatCategoryAllAsAbsent) => {
    const toSkip = skippedFilters || [];
    return data.filter((item) => {
      if (filters.metricPeriodMonths && !toSkip.includes('metricPeriodMonths')) {
        if (!nullSafeComparison(item.metric_period_months, filters.metricPeriodMonths)) {
          return false;
        }
      }
      if (filters.district && !toSkip.includes('district')
        && !(treatCategoryAllAsAbsent && filters.district.toLowerCase() === 'all')) {
        if (!nullSafeComparison(item.district, filters.district)) {
          return false;
        }
      }
      if (filters.chargeCategory && !toSkip.includes('chargeCategory')
        && !(treatCategoryAllAsAbsent && filters.chargeCategory.toLowerCase() === 'all')) {
        if (!nullSafeComparison(item.charge_category, filters.chargeCategory)) {
          return false;
        }
      }
      if (filters.supervisionType && !toSkip.includes('supervisionType')) {
        if (!nullSafeComparison(item.supervision_type, filters.supervisionType)) {
          return false;
        }
      }
      return true;
    });
  };

  const applyMatrixFilters = (data) => {
    return data.filter((item) => {
      if (filters.violationType) {
        if (!nullSafeComparison(item.violation_type, filters.violationType)) {
          return false;
        }
      }
      if (filters.reportedViolations) {
        if (toInt(item.reported_violations) !== toInt(filters.reportedViolations)) {
          return false;
        }
      }
      return true;
    });
  };

  const applyAllFilters = (data, skippedFilters, treatCategoryAllAsAbsent) => {
    let filteredData = applyTopLevelFilters(data, skippedFilters, treatCategoryAllAsAbsent);
    filteredData = applyMatrixFilters(filteredData);
    return filteredData;
  };

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'Risk level':
        return (
          <RevocationsByRiskLevel
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_risk_level)}
            metricPeriodMonths={filters.metricPeriodMonths}
          />
        );
      case 'Violation':
        return (
          <RevocationsByViolation
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_violation)}
            metricPeriodMonths={filters.metricPeriodMonths}
          />
        );
      case 'Gender':
        return (
          <RevocationsByGender
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_gender)}
            metricPeriodMonths={filters.metricPeriodMonths}
          />
        );
      case 'Race':
        return (
          <RevocationsByRace
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_race)}
            metricPeriodMonths={filters.metricPeriodMonths}
          />
        );
      default:
        return (
          <RevocationsByDistrict
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_district, ['district'])}
            supervisionPopulation={applyAllFilters(apiData.revocations_matrix_supervision_distribution_by_district, ['district'])}
            metricPeriodMonths={filters.metricPeriodMonths}
            currentDistrict={filters.district}
          />
        );
    }
  };

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  return (
    <main className="dashboard bgc-grey-100">
      <Sticky style={TOGGLE_STYLE}>
        <div className="top-level-filters d-f">
          <div className="top-level-filter">
            <h4>Time Period</h4>
            <Select
              options={METRIC_PERIODS}
              onChange={(option) => updateFilters({ metricPeriodMonths: option.value })}
              value={METRIC_PERIODS.filter((option) => option.value === filters.metricPeriodMonths)}
            />
          </div>
          <div className="top-level-filter">
            <h4>District</h4>
            <Select
              options={districts}
              onChange={(option) => updateFilters({ district: option.value })}
              defaultValue={DEFAULT_BASE_DISTRICT}
            />
          </div>
          <div className="top-level-filter">
            <h4>Supervision Level</h4>
            <Select
              options={CHARGE_CATEGORIES}
              onChange={(option) => updateFilters({ chargeCategory: option.value })}
              defaultValue={CHARGE_CATEGORIES[0]}
            />
          </div>
          <div className="top-level-filter">
            <h4>Supervision Type</h4>
            <Select
              options={SUPERVISION_TYPES}
              onChange={(option) => updateFilters({ supervisionType: option.value })}
              defaultValue={SUPERVISION_TYPES[0]}
            />
          </div>
        </div>
      </Sticky>
      <div className="bgc-white p-20 m-20">
        <RevocationCountOverTime
          data={applyAllFilters(apiData.revocations_matrix_by_month, ['metricPeriodMonths'])}
          metricPeriodMonths={filters.metricPeriodMonths}
        />
      </div>
      <div className="d-f m-20">
        <div className="matrix-container bgc-white p-20 mR-20">
          <RevocationMatrix
            data={applyTopLevelFilters(apiData.revocations_matrix_cells)}
            filters={filters}
            updateFilters={updateFilters}
            metricPeriodMonths={filters.metricPeriodMonths}
          />
        </div>
        <div className="matrix-explanation bgc-white p-20">
          <h4>Using this chart</h4>
          <p className="fw-300">
            This chart plots all people who were revoked to prison during the selected time period,
            according to their most serious violation and the total number of violation reports and
            notices of citation filed within 12 months before revocation.
          </p>
          <p className="fw-300">
            The numbers inside the bubbles represent the number of people who were revoked, whose
            most serious violation matches the violation at the head of that row, and who have the
            number of prior violations at the head of that column.
          </p>
          <div className="d-f mT-20">
            <div className="example-icon-container">
              <div className="example-violation-total">
                35
              </div>
            </div>
            <p className="fs-i fw-600">
              Click on a bubble to filter all charts on this dashboard to the group of
              people who are in that bubble. Click the bubble again to undo the selection.
            </p>
          </div>
          <div className="d-f mT-20">
            <div className="example-icon-container">
              <div className="example-violation-type">
                Technical
              </div>
            </div>
            <p className="fs-i fw-600">
              Click on a row label to filter all charts on this dashboard to the group
              of people who are in that row. Click the label again to undo the selection.
            </p>
          </div>
        </div>
      </div>
      <div className="static-charts d-f bgc-white m-20">
        <div className="chart-type-labels p-20">
          {CHARTS.map((chart, i) => (
            <div key={i}>
              <button
                className={`chart-type-label ${selectedChart === chart ? 'selected' : ''}`}
                onClick={() => setSelectedChart(chart)}
              >
                {chart}
              </button>
            </div>
          ))}
        </div>
        <div className="selected-chart p-20">
          {renderSelectedChart()}
        </div>
      </div>
      <div className="bgc-white m-20 p-20">
        <CaseTable
          data={applyAllFilters(apiData.revocations_matrix_filtered_caseload, [], true)}
          metricPeriodMonths={filters.metricPeriodMonths}
        />
      </div>
    </main>
  );
};

export default Revocations;
