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

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import { COLORS_SEVEN_VALUES } from '../../../assets/scripts/constants/colors';
import { getPerOfficerChartDefinition } from './BarCharts';

const chartId = 'caseTerminationsByOfficer';

export const getBarChartDefinition = (props) => {
  return getPerOfficerChartDefinition({
    chartId,
    exportLabel: 'Case terminations by officer',
    countsPerPeriodPerOfficer: props.terminationCountsByOfficer,
    officeData: props.officeData,
    metricType: props.metricType,
    metricPeriodMonths: props.metricPeriodMonths,
    supervisionType: props.supervisionType,
    district: props.district,
    bars: [
      {key: 'absconsion', label: 'Absconsion'},
      {key: 'revocation', label: 'Revocation'},
      {key: 'suspension', label: 'Suspension'},
      {key: 'discharge', label: 'Discharge'},
      {key: 'expiration', label: 'Expiration'},
      {key: 'death', label: 'Death'},
      {key: 'other', label: 'Other'}
    ],
    yAxisLabel: props.metricType === 'counts' ? 'Case terminations' : 'Percentage',
    barColorPalette: COLORS_SEVEN_VALUES
  });
};

const CaseTerminationsByOfficer = (props) => {
  const [chartDefinition, setChartDefinition] = useState(null);

  useEffect(() => {
    setChartDefinition(getBarChartDefinition(props));
  }, [
    props.revocationCountsByOfficer,
    props.metricType,
    props.metricPeriodMonths,
    props.supervisionType,
    props.district,
  ]);

  if (!chartDefinition) return null;

  return <Bar { ...chartDefinition } />;
}


export default CaseTerminationsByOfficer;
