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

const CHARGE_CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'GENERAL', label: 'General' },
  { value: 'SEX_OFFENSE', label: 'Sex offense' },
  { value: 'DOMESTIC_VIOLENCE', label: 'Domestic Violence' },
  { value: 'SIS', label: 'SIS/SES' },
];
const SUPERVISION_TYPES = [
  { value: '', label: 'All' },
  { value: 'PROBATION', label: 'Probation' },
  { value: 'PAROLE', label: 'Parole' },
  // TODO: Enable dual supervision filtering when supported in calculation methodology
  // { value: 'DUAL_SUPERVISION', label: 'Dual supervision' },
];

const CHARTS = ['District', 'Risk level', 'Violation', 'Gender', 'Race'];

const Revocations = () => {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState({});
  const [awaitingApi, setAwaitingApi] = useState(true);

  const [districts, setDistricts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedChart, setSelectedChart] = useState('District');


  const fetchChartData = async () => {
    try {
      const responseData = await callMetricsApi('us_mo/newRevocations', getTokenSilently);
      setApiData(responseData);
      setAwaitingApi(false);

      const districtValues = [
        ...new Set(responseData.revocations_matrix_cells.map((item) => item.district)),
      ];
      const districtsFromResponse = [
        { value: '', label: 'All districts' },
        ...districtValues.map((district) => ({ value: district, label: district })),
      ];
      districtsFromResponse.sort((a, b) => a.label - b.label);
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

  const applyTopLevelFilters = (data) => {
    return data.filter((item) => {
      if (filters.district) {
        if (!nullSafeComparison(item.district, filters.district)) {
          return false;
        }
      }
      if (filters.chargeCategory) {
        if (!nullSafeComparison(item.charge_category, filters.chargeCategory)) {
          return false;
        }
      }
      if (filters.supervisionType) {
        if (!nullSafeComparison(item.supervision_type, filters.supervisionType)) {
          return false;
        }
      }
      return true;
    });
  };

  const applyDistrictAndSupervisionTypeFilters = (data) => {
    return data.filter((item) => {
      if (filters.district) {
        if (!nullSafeComparison(item.district, filters.district)) {
          return false;
        }
      }
      if (filters.supervisionType) {
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

  const applyAllFilters = (data) => {
    let filteredData = applyTopLevelFilters(data);
    filteredData = applyMatrixFilters(filteredData);
    return filteredData;
  };

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'Risk level':
        return (
          <RevocationsByRiskLevel
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_risk_level)}
          />
        );
      case 'Violation':
        return (
          <RevocationsByViolation
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_violation)}
          />
        );
      case 'Gender':
        return (
          <RevocationsByGender
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_gender)}
          />
        );
      case 'Race':
        return (
          <RevocationsByRace
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_race)}
          />
        );
      default:
        return (
          <RevocationsByDistrict
            data={applyAllFilters(apiData.revocations_matrix_distribution_by_district)}
            supervisionPopulation={applyDistrictAndSupervisionTypeFilters(apiData.revocations_matrix_supervision_distribution_by_district)}
          />
        );
    }
  };

  if (awaitingResults(loading, user, awaitingApi)) {
    return <Loading />;
  }

  return (
    <main className="dashboard bgc-grey-100">
      <div className="top-level-filters d-f">
        <div className="top-level-filter">
          <h4>District</h4>
          <Select
            options={districts}
            onChange={(option) => updateFilters({ district: option.value })}
          />
        </div>
        <div className="top-level-filter">
          <h4>Charge Category</h4>
          <Select
            options={CHARGE_CATEGORIES}
            onChange={(option) => updateFilters({ chargeCategory: option.value })}
          />
        </div>
        <div className="top-level-filter">
          <h4>Supervision Type</h4>
          <Select
            options={SUPERVISION_TYPES}
            onChange={(option) => updateFilters({ supervisionType: option.value })}
          />
        </div>
      </div>
      <div className="bgc-white p-20 m-20">
        <RevocationCountOverTime
          data={applyAllFilters(apiData.revocations_matrix_by_month)}
        />
      </div>
      <div className="d-f">
        <div className="bgc-white p-20 m-20">
          <RevocationMatrix
            data={applyTopLevelFilters(apiData.revocations_matrix_cells)}
            filters={filters}
            updateFilters={updateFilters}
          />
        </div>
        <div className="matrix-explanation bgc-white p-20 m-20">
          <h4>Using this chart</h4>
          <p className="fw-600">
            This chart shows the number of people revoked to prison from
            probation and parole, broken down by their most severe violation
            and the number of violation reports filed before revocation.
          </p>
          <div className="d-f mT-20">
            <div className="example-icon-container">
              <div className="example-violation-total">
                35
              </div>
            </div>
            <p className="fs-i fw-600">
              Click on a bubble to filter the dashboard by that set of
              revocations
            </p>
          </div>
          <div className="d-f mT-20">
            <div className="example-icon-container">
              <div className="example-violation-type">
                Technical
              </div>
            </div>
            <p className="fs-i fw-600">
              Click on the violation to filter the dashboard by that violation.
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
      <div className="bgc-white m-20">
        <CaseTable
          data={applyAllFilters(apiData.revocations_matrix_filtered_caseload)}
        />
      </div>
    </main>
  );
};

export default Revocations;
