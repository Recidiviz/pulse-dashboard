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
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import ExportMenu from "../ExportMenu";
import Loading from "../../Loading";

import { COLORS } from "../../../assets/scripts/constants/colors";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../hooks/useChartData";
import { axisCallbackForPercentage } from "../../../utils/charts/axis";
import {
  getTrailingLabelFromMetricPeriodMonthsToggle,
  getPeriodLabelFromMetricPeriodMonthsToggle,
  tooltipForRateMetricWithCounts,
} from "../../../utils/charts/toggles";
import {
  toInt,
  technicalViolationTypes,
  violationTypeToLabel,
  allViolationTypes,
} from "../../../utils/transforms/labels";

const chartId = "revocationsByViolationType";

const RevocationsByViolation = ({
  dataFilter,
  filterStates,
  metricPeriodMonths,
  skippedFilters,
  treatCategoryAllAsAbsent,
}) => {
  const { isLoading, apiData } = useChartData(
    "us_mo/newRevocations",
    "revocations_matrix_distribution_by_violation"
  );

  if (isLoading) {
    return <Loading />;
  }

  const filteredData = dataFilter(
    apiData,
    skippedFilters,
    treatCategoryAllAsAbsent
  );

  const plus = (term1, term2) => (term1 || 0) + (toInt(term2) || 0);

  const violationToCount = filteredData.reduce(
    (
      result,
      {
        absconded_count: abscondedCount,
        association_count: associationCount,
        directive_count: directiveCount,
        employment_count: employmentCount,
        felony_count: felonyCount,
        intervention_fee_count: interventionFeeCount,
        misdemeanor_count: misdemeanorCount,
        municipal_count: municipalCount,
        residency_count: residencyCount,
        special_count: specialCount,
        substance_count: substanceCount,
        supervision_strategy_count: supervisionStrategyCount,
        travel_count: travelCount,
        weapon_count: weaponCount,
        violation_count: violationCount,
      }
    ) => ({
      ...result,
      abscondedCount: plus(result.abscondedCount, abscondedCount),
      associationCount: plus(result.associationCount, associationCount),
      directiveCount: plus(result.directiveCount, directiveCount),
      employmentCount: plus(result.employmentCount, employmentCount),
      felonyCount: plus(result.felonyCount, felonyCount),
      interventionFeeCount: plus(
        result.interventionFeeCount,
        interventionFeeCount
      ),
      misdemeanorCount: plus(result.misdemeanorCount, misdemeanorCount),
      municipalCount: plus(result.municipalCount, municipalCount),
      residencyCount: plus(result.residencyCount, residencyCount),
      specialCount: plus(result.specialCount, specialCount),
      substanceCount: plus(result.substanceCount, substanceCount),
      supervisionStrategyCount: plus(
        result.supervisionStrategyCount,
        supervisionStrategyCount
      ),
      travelCount: plus(result.travelCount, travelCount),
      weaponCount: plus(result.weaponCount, weaponCount),
      violationCount: plus(result.violationCount, violationCount),
    }),
    {}
  );

  const totalViolationCount = toInt(violationToCount.violationCount) || 0;

  const chartLabels = allViolationTypes.map(
    (type) => violationTypeToLabel[type]
  );

  const chartDataPoints = allViolationTypes.map((type) => {
    if (!totalViolationCount) {
      return (0.0).toFixed(2);
    }
    return (100 * (violationToCount[type] / totalViolationCount)).toFixed(2);
  });

  const numeratorCounts = allViolationTypes.map(
    (type) => violationToCount[type]
  );

  const denominatorCounts = allViolationTypes.map(() => totalViolationCount);

  // This sets bar color to light-blue-500 when it's a technical violation, orange when it's law
  const colorTechnicalAndLaw = () =>
    allViolationTypes.map((violationType) => {
      if (technicalViolationTypes.includes(violationType)) {
        return COLORS["lantern-light-blue"];
      }
      return COLORS["lantern-orange"];
    });

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [
          {
            label: "Proportion of violations",
            backgroundColor: colorTechnicalAndLaw(),
            hoverBackgroundColor: colorTechnicalAndLaw(),
            hoverBorderColor: colorTechnicalAndLaw(),
            data: chartDataPoints,
          },
        ],
      }}
      options={{
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Violation type and condition violated",
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Percent of total reported violations",
              },
              stacked: true,
              ticks: {
                min: 0,
                callback: axisCallbackForPercentage(),
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          mode: "index",
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) =>
              tooltipForRateMetricWithCounts(
                tooltipItem,
                data,
                numeratorCounts,
                denominatorCounts
              ),
          },
        },
      }}
    />
  );

  const description = `${getTrailingLabelFromMetricPeriodMonthsToggle(
    metricPeriodMonths
  )} (${getPeriodLabelFromMetricPeriodMonthsToggle(metricPeriodMonths)})`;

  return (
    <div>
      <h4>
        Relative frequency of violation types
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Relative frequency of violation types"
          timeWindowDescription={description}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{description}</h6>

      <div className="static-chart-container fs-block">{chart}</div>
    </div>
  );
};

RevocationsByViolation.defaultProps = {
  skippedFilters: [],
  treatCategoryAllAsAbsent: undefined,
};

const metricPeriodMonthsType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

RevocationsByViolation.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: PropTypes.shape({
    metricPeriodMonths: metricPeriodMonthsType.isRequired,
    chargeCategory: PropTypes.string,
    district: PropTypes.string,
    supervisionType: PropTypes.string,
  }).isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  skippedFilters: PropTypes.arrayOf(PropTypes.string),
  treatCategoryAllAsAbsent: PropTypes.bool,
};

export default RevocationsByViolation;
