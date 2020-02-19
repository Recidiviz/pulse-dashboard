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
import { scaleLinear } from 'd3-scale';
import { toHumanReadable } from '../transforms/labels';
import { COLORS } from '../../assets/scripts/constants/colors';

const BLUES = ['#F5F6F7', '#9FB1E3', COLORS['blue-standard-2']];
const DARK_BLUES = ['#CCD1DE', '#8897C4', '#1F2A3B'];
const REDS = ['#F7F5F6', '#E39FB1', COLORS['red-standard']];
const DARK_REDS = ['#DECCD1', '#C48897', '#3B1F2A'];

function colorForValue(value, maxValue, useDark, possibleNegative) {
  const scaleValue = possibleNegative ? Math.abs(value) : value;
  const valueWasNegative = value < 0;

  // For charts without negative values, default to using blues. If negative values can occur,
  // use reds for positive and blues for negative, in line with convention elsewhere in the UI.
  const positiveColors = possibleNegative ? REDS : BLUES;
  const darkPositiveColors = possibleNegative ? DARK_REDS : DARK_BLUES;
  const negativeColors = BLUES;
  const darkNegativeColors = DARK_BLUES;

  const positiveScale = scaleLinear()
    .domain([0, maxValue / 8, maxValue])
    .range(positiveColors);

  const darkPositiveScale = scaleLinear()
    .domain([0, maxValue / 2, maxValue])
    .range(darkPositiveColors);

  const negativeScale = scaleLinear()
    .domain([0, maxValue / 8, maxValue])
    .range(negativeColors);

  const darkNegativeScale = scaleLinear()
    .domain([0, maxValue / 2, maxValue])
    .range(darkNegativeColors);

  if (useDark) {
    if (valueWasNegative) {
      return darkNegativeScale(scaleValue);
    }
    return darkPositiveScale(scaleValue);
  }

  if (valueWasNegative) {
    return negativeScale(scaleValue);
  }
  return positiveScale(scaleValue);
}

function countyNameFromCode(stateCode, countyCode) {
  let newCountyName = countyCode.replace(stateCode.concat('_'), '');
  newCountyName = toHumanReadable(newCountyName);
  return newCountyName;
}

export {
  colorForValue,
  countyNameFromCode,
};
