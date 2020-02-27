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

import { COLORS } from '../../assets/scripts/constants/colors';
import { getCurrentMonthName } from '../transforms/months';

function labelCurrentMonth(tooltipItems, labels) {
  const tooltipItem = tooltipItems[0];
  const { index, xLabel: label } = tooltipItem;

  const onlyMonthInSet = !labels[0] && !labels[labels.length - 1] && index === 1;
  const lastMonthInSet = index === labels.length - 1;
  const currentMonth = getCurrentMonthName();

  if ((lastMonthInSet || onlyMonthInSet) && label && label.startsWith(currentMonth)) {
    return `${label} (in progress)`;
  }

  return label;
}

function currentMonthBox(annotationId, chartLabels) {
  if (chartLabels.length < 2) {
    return null;
  }

  const currentMonth = getCurrentMonthName();
  const lastMonthInChart = chartLabels[chartLabels.length - 1];

  if (!lastMonthInChart.startsWith(currentMonth)) {
    return null;
  }

  const previousMonthTick = chartLabels[chartLabels.length - 2];
  return {
    drawTime: 'beforeDatasetsDraw',
    events: ['click'],

    // Array of annotation configuration objects
    // See below for detailed descriptions of the annotation options
    annotations: [{
      type: 'box',

      // optional annotation ID (must be unique)
      id: annotationId,
      xScaleID: 'x-axis-0',

      drawTime: 'beforeDatasetsDraw',

      borderColor: COLORS['grey-300'],
      borderWidth: 1,
      backgroundColor: 'rgba(224, 224, 224, 0.5)',

      xMin: previousMonthTick,

      onClick(e) { return e; },
    }],
  };
}

export {
  labelCurrentMonth,
  currentMonthBox,
};
