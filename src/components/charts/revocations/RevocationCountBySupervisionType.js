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

import { COLORS_STACKED_TWO_VALUES } from '../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../assets/scripts/utils/downloads';
import { getPerMonthChartDefinition } from './BarCharts';

const chartId = 'revocationsBySupervisionType';

export const getBarChartDefinition = (props) => {
  return getPerMonthChartDefinition({
    chartId,
    countsByMonth: props.revocationCountsByMonthBySupervisionType,
    metricType: props.metricType,
    numMonths: props.metricPeriodMonths,
    filters: {
      district: props.district,
    },
    bars: [
      {key: 'probation_count', label: 'Probation'},
      {key: 'parole_count', label: 'Parole'},
    ],
    yAxisLabel: props.metricType === 'counts' ? 'Revocation count' : 'Percentage',
    barColorPalette: COLORS_STACKED_TWO_VALUES
  });
};


const RevocationCountBySupervisionType = (props) => {
  const [chartDefinition, setChartDefinition] = useState(null);

  useEffect(() => {
    setChartDefinition(getBarChartDefinition(props));
  }, [
    props.revocationCountsByMonthBySupervisionType,
    props.metricType,
    props.metricPeriodMonths,
    props.district,
  ]);

  if (!chartDefinition) return null;

  const chart = <Bar { ...chartDefinition } />;

  const exportedStructureCallback = () => (
    {
      metric: 'Revocation counts by supervision type',
      series: [],
    });

  configureDownloadButtons(chartId, 'REVOCATIONS BY SUPERVISION TYPE',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback, props, true, true);

  return chart;
};

export default RevocationCountBySupervisionType;
