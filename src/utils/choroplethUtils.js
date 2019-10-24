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
import { toHumanReadable } from './variableConversion';
import { COLORS } from '../assets/scripts/constants/colors';

function colorForValue(value, maxValue, useDark) {
  const scale = scaleLinear()
    .domain([0, maxValue / 8, maxValue])
    .range(['#F5F6F7', '#9FB1E3', COLORS['blue-standard-2']]);

  const darkScale = scaleLinear()
    .domain([0, maxValue / 2, maxValue])
    .range(['#CCD1DE', '#8897C4', '#1F2A3B']);

  const color = (useDark)
    ? darkScale(value) : scale(value);
  return color;
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
