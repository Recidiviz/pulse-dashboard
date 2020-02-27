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
import { Bar } from 'react-chartjs-2';
import ExportMenu from '../ExportMenu';

import { COLORS } from '../../../assets/scripts/constants/colors';
import {
  getTrailingLabelFromMetricPeriodMonthsToggle, getPeriodLabelFromMetricPeriodMonthsToggle,
  tooltipForRateMetricWithCounts,
} from '../../../utils/charts/toggles';
import {
  toInt, technicalViolationTypes, lawViolationTypes, violationTypeToLabel,
} from '../../../utils/transforms/labels';

const chartId = 'revocationsByViolationType';

const RevocationsByViolation = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [numeratorCounts, setNumeratorCounts] = useState([]);
  const [denominatorCounts, setDenominatorCounts] = useState([]);

  const processResponse = () => {
    const violationToCount = props.data.reduce(
      (result, {
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
      }) => {
        return {
          ...result,
          abscondedCount: (result.abscondedCount || 0) + (toInt(abscondedCount) || 0),
          associationCount: (result.associationCount || 0) + (toInt(associationCount) || 0),
          directiveCount: (result.directiveCount || 0) + (toInt(directiveCount) || 0),
          employmentCount: (result.employmentCount || 0) + (toInt(employmentCount) || 0),
          felonyCount: (result.felonyCount || 0) + (toInt(felonyCount) || 0),
          interventionFeeCount: (result.interventionFeeCount || 0) + (toInt(interventionFeeCount) || 0),
          misdemeanorCount: (result.misdemeanorCount || 0) + (toInt(misdemeanorCount) || 0),
          municipalCount: (result.municipalCount || 0) + (toInt(municipalCount) || 0),
          residencyCount: (result.residencyCount || 0) + (toInt(residencyCount) || 0),
          specialCount: (result.specialCount || 0) + (toInt(specialCount) || 0),
          substanceCount: (result.substanceCount || 0) + (toInt(substanceCount) || 0),
          supervisionStrategyCount: (result.supervisionStrategyCount || 0) + (toInt(supervisionStrategyCount) || 0),
          travelCount: (result.travelCount || 0) + (toInt(travelCount) || 0),
          weaponCount: (result.weaponCount || 0) + (toInt(weaponCount) || 0),
          violationCount: (result.violationCount || 0) + (toInt(violationCount) || 0),
        };
      }, {},
    );

    const totalViolationCount = toInt(violationToCount.violationCount) || 0;

    const violationTypeFrequency = (type) => {
      if (!totalViolationCount) {
        return (0.0).toFixed(2);
      }
      return (100 * (violationToCount[type] / totalViolationCount)).toFixed(2);
    };

    const violationTypeKeys = technicalViolationTypes.concat(lawViolationTypes);
    const labels = violationTypeKeys.map((type) => violationTypeToLabel[type]);
    const dataPoints = violationTypeKeys.map((type) => violationTypeFrequency(type));

    setChartLabels(labels);
    setChartDataPoints(dataPoints);

    setNumeratorCounts(violationTypeKeys.map((type) => violationToCount[type]));
    setDenominatorCounts(violationTypeKeys.map((_) => totalViolationCount));
  };

  // This sets bar color to light-blue-500 when it's a technical violation, orange when it's law
  const colorTechnicalAndLaw = () => {
    const colors = [];
    for (let i = 0; i < technicalViolationTypes.length; i += 1) {
      colors.push(COLORS['lantern-light-blue']);
    }
    for (let i = 0; i < lawViolationTypes.length; i += 1) {
      colors.push(COLORS['lantern-orange']);
    }
    return colors;
  };

  useEffect(() => {
    processResponse();
  }, [props.data, props.metricPeriodMonths]);

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Proportion of violations',
          backgroundColor: colorTechnicalAndLaw(),
          hoverBackgroundColor: colorTechnicalAndLaw(),
          hoverBorderColor: colorTechnicalAndLaw(),
          data: chartDataPoints,
        }],
      }}
      options={{
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Violation type and condition violated',
            },
            stacked: true,
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Percent of total reported violations',
            },
            stacked: true,
            ticks: {
              min: 0,
            },
          }],
        },
        tooltips: {
          backgroundColor: COLORS['grey-800-light'],
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => tooltipForRateMetricWithCounts(tooltipItem, data, numeratorCounts, denominatorCounts),
          },
        },
      }}
    />
  );

  return (
    <div>
      <h4>
        Relative frequency of violation types
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle="Relative frequency of violation types"
        />
      </h4>
      <h6 className="pB-20">
        {`${getTrailingLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)} (${getPeriodLabelFromMetricPeriodMonthsToggle(props.metricPeriodMonths)})`}
      </h6>

      <div className="static-chart-container fs-block">
        {chart}
      </div>
    </div>
  );
};

export default RevocationsByViolation;
