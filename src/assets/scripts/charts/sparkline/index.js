// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2018 Recidiviz, Inc.
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

import * as $ from 'jquery';
import 'jquery-sparkline';
import { debounce } from 'lodash';
import { COLORS } from '../../constants/colors';

export default (function () {
  // ------------------------------------------------------
  // @Dashboard Sparklines
  // ------------------------------------------------------

  const drawSparklines = () => {
    if ($('#sparklinedash').length > 0) {
      $('#sparklinedash').sparkline([36, 32, 30, 34, 35, 31, 27, 37], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash2').length > 0) {
      $('#sparklinedash2').sparkline([41, 44, 50, 52, 50, 46, 44, 39], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash3').length > 0) {
      $('#sparklinedash3').sparkline([12, 11.5, 11.7, 11, 11.4, 11.3, 11.3], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['blue-500'],
      });
    }

    if ($('#sparklinedash4').length > 0) {
      $('#sparklinedash4').sparkline([15, 16.5, 15.8, 15.6, 14, 14.3, 14.7, 12.5], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash5').length > 0) {
      $('#sparklinedash5').sparkline([32, 32.1, 32.4, 32, 31, 31.4, 31.3, 28.8], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash-violations').length > 0) {
      $('#sparklinedash-violations').sparkline([23, 23, 30, 24, 21, 15, 22, 25], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash-recommendations').length > 0) {
      $('#sparklinedash-recommendations').sparkline([13, 10, 9, 14, 11, 18, 21, 17], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash-revocations').length > 0) {
      $('#sparklinedash-revocations').sparkline([8, 6, 5, 7, 7, 8, 9, 13], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash-technical-revocations').length > 0) {
      $('#sparklinedash-technical-revocations').sparkline([4, 6, 6, 5, 4, 5, 7, 10], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash-admissions').length > 0) {
      $('#sparklinedash-admissions').sparkline([547, 596, 801, 842, 706, 803], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash-releases').length > 0) {
      $('#sparklinedash-releases').sparkline([612, 654, 873, 776, 780, 948], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash-recidivism').length > 0) {
      $('#sparklinedash-recidivism').sparkline([37.2, 37.1, 36.2, 36.0, 35.8, 34.4], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash-revocation-rate').length > 0) {
      $('#sparklinedash-revocation-rate').sparkline([26.4, 26.1, 26.2, 25.6, 25.4, 27.6], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash-waitlist-additions').length > 0) {
      $('#sparklinedash-waitlist-additions').sparkline([18, 17, 20, 21, 18, 26], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['red-500'],
      });
    }

    if ($('#sparklinedash-parole-success').length > 0) {
      $('#sparklinedash-parole-success').sparkline([69, 75, 71, 66, 64, 72], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash-behavioral-relapses').length > 0) {
      $('#sparklinedash-behavioral-relapses').sparkline([77, 70, 71, 80, 92, 74], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }

    if ($('#sparklinedash-good-time').length > 0) {
      $('#sparklinedash-good-time').sparkline([171, 160, 157, 164, 166, 182], {
        type: 'bar',
        height: '20',
        barWidth: '3',
        resize: true,
        barSpacing: '3',
        barColor: COLORS['green-500'],
      });
    }
  };

  drawSparklines();

  // Redraw sparklines on resize
  $(window).resize(debounce(drawSparklines, 150));

  // ------------------------------------------------------
  // @Other Sparklines
  // ------------------------------------------------------

  $('#sparkline').sparkline(
    [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7],
    {
      type: 'line',
      resize: true,
      height: '20',
    },
  );

  $('#compositebar').sparkline(
    'html',
    {
      type: 'bar',
      resize: true,
      barColor: '#aaf',
      height: '20',
    },
  );

  $('#compositebar').sparkline(
    [4, 1, 5, 7, 9, 9, 8, 7, 6, 6, 4, 7, 8, 4, 3, 2, 2, 5, 6, 7],
    {
      composite: true,
      fillColor: false,
      lineColor: 'red',
      resize: true,
      height: '20',
    },
  );

  $('#normalline').sparkline(
    'html',
    {
      fillColor: false,
      normalRangeMin: -1,
      resize: true,
      normalRangeMax: 8,
      height: '20',
    },
  );

  $('.sparktristate').sparkline(
    'html',
    {
      type: 'tristate',
      resize: true,
      height: '20',
    },
  );

  $('.sparktristatecols').sparkline(
    'html',
    {
      type: 'tristate',
      colorMap: {
        '-2': '#fa7',
        resize: true,
        2: '#44f',
        height: '20',
      },
    },
  );

  const values = [5, 4, 5, -2, 0, 3, -5, 6, 7, 9, 9, 5, -3, -2, 2, -4];
  const valuesAlt = [1, 1, 0, 1, -1, -1, 1, -1, 0, 0, 1, 1];

  $('.sparkline').sparkline(values, {
    type: 'line',
    barWidth: 4,
    barSpacing: 5,
    fillColor: '',
    lineColor: COLORS['red-500'],
    lineWidth: 2,
    spotRadius: 3,
    spotColor: COLORS['red-500'],
    maxSpotColor: COLORS['red-500'],
    minSpotColor: COLORS['red-500'],
    highlightSpotColor: COLORS['red-500'],
    highlightLineColor: '',
    tooltipSuffix: ' Bzzt',
    tooltipPrefix: 'Hello ',
    width: 100,
    height: undefined,
    barColor: '9f0',
    negBarColor: 'ff0',
    stackedBarColor: ['ff0', '9f0', '999', 'f60'],
    sliceColors: ['ff0', '9f0', '000', 'f60'],
    offset: '30',
    borderWidth: 1,
    borderColor: '000',
  });

  $('.sparkbar').sparkline(values, {
    type: 'bar',
    barWidth: 4,
    barSpacing: 1,
    fillColor: '',
    lineColor: COLORS['deep-purple-500'],
    tooltipSuffix: 'Celsius',
    width: 100,
    barColor: '39f',
    negBarColor: COLORS['deep-purple-500'],
    stackedBarColor: ['ff0', '9f0', '999', 'f60'],
    sliceColors: ['ff0', '9f0', '000', 'f60'],
    offset: '30',
    borderWidth: 1,
    borderColor: '000',
  });

  $('.sparktri').sparkline(valuesAlt, {
    type: 'tristate',
    barWidth: 4,
    barSpacing: 1,
    fillColor: '',
    lineColor: COLORS['light-blue-500'],
    tooltipSuffix: 'Celsius',
    width: 100,
    barColor: COLORS['light-blue-500'],
    posBarColor: COLORS['light-blue-500'],
    negBarColor: 'f90',
    zeroBarColor: '000',
    stackedBarColor: ['ff0', '9f0', '999', 'f60'],
    sliceColors: ['ff0', '9f0', '000', 'f60'],
    offset: '30',
    borderWidth: 1,
    borderColor: '000',
  });

  $('.sparkdisc').sparkline(values, {
    type: 'discrete',
    barWidth: 4,
    barSpacing: 5,
    fillColor: '',
    lineColor: '9f0',
    tooltipSuffix: 'Celsius',
    width: 100,
    barColor: '9f0',

    negBarColor: 'f90',

    stackedBarColor: ['ff0', '9f0', '999', 'f60'],
    sliceColors: ['ff0', '9f0', '000', 'f60'],
    offset: '30',
    borderWidth: 1,
    borderColor: '000',
  });

  $('.sparkbull').sparkline(values, {
    type: 'bullet',
    barWidth: 4,
    barSpacing: 5,
    fillColor: '',
    lineColor: COLORS['amber-500'],
    tooltipSuffix: 'Celsius',
    height: 'auto',
    width: 'auto',
    targetWidth: 'auto',
    barColor: COLORS['amber-500'],
    negBarColor: 'ff0',
    stackedBarColor: ['ff0', '9f0', '999', 'f60'],
    sliceColors: ['ff0', '9f0', '000', 'f60'],
    offset: '30',
    borderWidth: 1,
    borderColor: '000',
  });

  $('.sparkbox').sparkline(values, {
    type: 'box',
    barWidth: 4,
    barSpacing: 5,
    fillColor: '',
    lineColor: '9f0',
    tooltipSuffix: 'Celsius',
    width: 100,
    barColor: '9f0',
    negBarColor: 'ff0',
    stackedBarColor: ['ff0', '9f0', '999', 'f60'],
    sliceColors: ['ff0', '9f0', '000', 'f60'],
    offset: '30',
    borderWidth: 1,
    borderColor: '000',
  });
}());
