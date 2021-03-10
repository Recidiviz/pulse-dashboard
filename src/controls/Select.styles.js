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
import { COLORS } from "../assets/scripts/constants/colors";

const fontStyles = {
  color: "rgba(114, 119, 122, 0.8)",
  textTransform: "uppercase",
};

export default {
  container: (base) => ({
    ...base,
    flexGrow: 1,
  }),
  option: (base, state) => ({
    ...base,
    ...fontStyles,
    backgroundColor: state.isMulti ? "transparent" : base.backgroundColor,
    color: state.isSelected && !state.isMulti ? COLORS.white : fontStyles.color,
    ":active": {
      backgroundColor: state.isMulti ? "transparent" : base.backgroundColor,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }),
  singleValue: (base) => ({ ...base, ...fontStyles }),
  group: (base) => ({ ...base, ...fontStyles, marginLeft: 20 }),
};
