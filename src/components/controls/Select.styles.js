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
import { COLORS } from "../../assets/scripts/constants/colors";

const fontStyles = {
  color: "#00413E",
  weight: 500,
  size: "0.8rem",
};

export default {
  container: (base) => ({
    ...base,
    flexGrow: 1,
  }),
  control: (base, state) => ({
    ...base,
    border: "1px solid #D2D8D8",
    boxShadow: "1px solid #D2D8D8",
    borderRadius: "15px",
    borderBottomRightRadius: state.menuIsOpen && 0,
    borderBottomLeftRadius: state.menuIsOpen && 0,

    "&:hover": {
      borderColor: "#D2D8D8",
    },
  }),
  menu: (base) => ({
    ...base,
    margin: 0,
    border: "1px solid #D2D8D8",
    borderBottomRightRadius: "15px",
    borderBottomLeftRadius: "15px",
    borderTop: "none",
  }),
  option: (base, state) => ({
    ...base,
    ...fontStyles,
    backgroundColor:
      state.isSelected && !state.isMulti ? "#006C67" : "transparent",
    color: state.isSelected && !state.isMulti ? COLORS.white : fontStyles.color,
    ":active": {
      background: "#E3E6E6",
    },
    ":hover": {
      background: "#E3E6E6",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }),
  singleValue: (base) => ({ ...base, ...fontStyles }),
  group: (base) => ({ ...base, ...fontStyles, marginLeft: 20 }),
};
