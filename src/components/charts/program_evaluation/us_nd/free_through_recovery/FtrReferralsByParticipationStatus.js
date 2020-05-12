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

import { COLORS_FIVE_VALUES } from '../../../../../assets/scripts/constants/colors';
import { configureDownloadButtons } from '../../../../../assets/scripts/utils/downloads';
import { getPerMonthChartDefinition } from '../../../BarCharts';

const chartId = 'ftrReferralsByParticipationStatus';

const chartColors = [
  COLORS_FIVE_VALUES[0],
  COLORS_FIVE_VALUES[1],
  COLORS_FIVE_VALUES[2],
  COLORS_FIVE_VALUES[3],
];

export const getBarChartDefinition = (props) => {
  return getPerMonthChartDefinition({
    chartId,
    countsByMonth: props.ftrReferralsByParticipationStatus,
    metricType: props.metricType,
    numMonths: props.metricPeriodMonths,
    filters: {
      district: props.district,
      supervision_type: props.supervisionType,
    },
    bars: [
      { key: 'pending', label: 'Pending' },
      { key: 'in_progress', label: 'In Progress' },
      { key: 'denied', label: 'Denied' },
      { key: 'discharged', label: 'Discharged' },
    ],
    yAxisLabel: props.metricType === 'counts' ? 'Count' : 'Percentage',
    barColorPalette: chartColors,
  });
};

const FtrReferralsByParticipationStatus = (props) => {
  const [chartDefinition, setChartDefinition] = useState(null);

  useEffect(() => {
    setChartDefinition(getBarChartDefinition(props));
  }, [
    props.ftrReferralsByParticipationStatus,
    props.metricType,
    props.metricPeriodMonths,
    props.supervisionType,
    props.district,
  ]);

  if (!chartDefinition) return null;

  const chart = <Bar {...chartDefinition} />;

  const exportedStructureCallback = () => (
    {
      metric: 'FTR Referrals by Participation Status',
      series: [],
    });

  configureDownloadButtons(chartId, 'FTR REFERRALS BY PARTICIPATION STATUS',
    chart.props.data.datasets, chart.props.data.labels,
    document.getElementById(chartId), exportedStructureCallback, props, true, true);

  return chart;
};

export default FtrReferralsByParticipationStatus;
