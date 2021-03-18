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

const COLORS = {
  white: "#ffffff",
  "red-50": "#ffebee",
  "red-100": "#ffcdd2",
  "red-200": "#ef9a9a",
  "red-300": "#e57373",
  "red-400": "#ef5350",
  "red-500": "#f44336",
  "red-600": "#e53935",
  "red-700": "#d32f2f",
  "red-800": "#c62828",
  "red-900": "#b71c1c",
  "red-a100": "#ff8a80",
  "red-a200": "#ff5252",
  "red-a400": "#ff1744",
  "red-a700": "#d50000",
  "red-standard": "#d12249",
  "pink-50": "#fce4ec",
  "pink-100": "#f8bbd0",
  "pink-200": "#f48fb1",
  "pink-300": "#f06292",
  "pink-400": "#ec407a",
  "pink-500": "#e91e63",
  "pink-600": "#d81b60",
  "pink-700": "#c2185b",
  "pink-800": "#ad1457",
  "pink-900": "#880e4f",
  "pink-a100": "#ff80ab",
  "pink-a200": "#ff4081",
  "pink-a400": "#f50057",
  "pink-a700": "#c51162",
  "purple-50": "#f3e5f5",
  "purple-100": "#e1bee7",
  "purple-200": "#ce93d8",
  "purple-300": "#ba68c8",
  "purple-400": "#ab47bc",
  "purple-500": "#9c27b0",
  "purple-600": "#8e24aa",
  "purple-700": "#7b1fa2",
  "purple-800": "#6a1b9a",
  "purple-900": "#4a148c",
  "purple-a100": "#ea80fc",
  "purple-a200": "#e040fb",
  "purple-a400": "#d500f9",
  "purple-a700": "#aa00ff",
  "deep-purple-50": "#ede7f6",
  "deep-purple-100": "#d1c4e9",
  "deep-purple-200": "#b39ddb",
  "deep-purple-300": "#9575cd",
  "deep-purple-400": "#7e57c2",
  "deep-purple-500": "#673ab7",
  "deep-purple-600": "#5e35b1",
  "deep-purple-700": "#512da8",
  "deep-purple-800": "#4527a0",
  "deep-purple-900": "#311b92",
  "deep-purple-a100": "#b388ff",
  "deep-purple-a200": "#7c4dff",
  "deep-purple-a400": "#651fff",
  "deep-purple-a700": "#6200ea",
  "indigo-50": "#e8eaf6",
  "indigo-100": "#c5cae9",
  "indigo-200": "#9fa8da",
  "indigo-300": "#7986cb",
  "indigo-400": "#5c6bc0",
  "indigo-500": "#3f51b5",
  "indigo-600": "#3949ab",
  "indigo-700": "#303f9f",
  "indigo-800": "#283593",
  "indigo-900": "#1a237e",
  "indigo-a100": "#8c9eff",
  "indigo-a200": "#536dfe",
  "indigo-a400": "#3d5afe",
  "indigo-a700": "#304ffe",
  "blue-50": "#e3f2fd",
  "blue-100": "#bbdefb",
  "blue-200": "#90caf9",
  "blue-300": "#64b5f6",
  "blue-400": "#42a5f5",
  "blue-500": "#2196f3",
  "blue-600": "#1e88e5",
  "blue-700": "#1976d2",
  "blue-800": "#1565c0",
  "blue-900": "#0d47a1",
  "blue-a100": "#82b1ff",
  "blue-a200": "#448aff",
  "blue-a400": "#2979ff",
  "blue-a700": "#2962ff",
  "light-blue-50": "#e1f5fe",
  "light-blue-100": "#b3e5fc",
  "light-blue-200": "#81d4fa",
  "light-blue-300": "#4fc3f7",
  "light-blue-400": "#29b6f6",
  "light-blue-500": "#03a9f4",
  "light-blue-600": "#039be5",
  "light-blue-700": "#0288d1",
  "light-blue-800": "#0277bd",
  "light-blue-900": "#01579b",
  "light-blue-a100": "#80d8ff",
  "light-blue-a200": "#40c4ff",
  "light-blue-a400": "#00b0ff",
  "light-blue-a700": "#0091ea",
  "cyan-50": "#e0f7fa",
  "cyan-100": "#b2ebf2",
  "cyan-200": "#80deea",
  "cyan-300": "#4dd0e1",
  "cyan-400": "#26c6da",
  "cyan-500": "#00bcd4",
  "cyan-600": "#00acc1",
  "cyan-700": "#0097a7",
  "cyan-800": "#00838f",
  "cyan-900": "#006064",
  "cyan-a100": "#84ffff",
  "cyan-a200": "#18ffff",
  "cyan-a400": "#00e5ff",
  "cyan-a700": "#00b8d4",
  "teal-50": "#e0f2f1",
  "teal-100": "#b2dfdb",
  "teal-200": "#80cbc4",
  "teal-300": "#4db6ac",
  "teal-400": "#26a69a",
  "teal-500": "#009688",
  "teal-600": "#00897b",
  "teal-700": "#00796b",
  "teal-800": "#00695c",
  "teal-900": "#004d40",
  "teal-a100": "#a7ffeb",
  "teal-a200": "#64ffda",
  "teal-a400": "#1de9b6",
  "teal-a700": "#00bfa5",
  "green-50": "#e8f5e9",
  "green-100": "#c8e6c9",
  "green-200": "#a5d6a7",
  "green-300": "#81c784",
  "green-400": "#66bb6a",
  "green-500": "#4caf50",
  "green-600": "#43a047",
  "green-700": "#388e3c",
  "green-800": "#2e7d32",
  "green-900": "#1b5e20",
  "green-a100": "#b9f6ca",
  "green-a200": "#69f0ae",
  "green-a400": "#00e676",
  "green-a700": "#00c853",
  "light-green-50": "#f1f8e9",
  "light-green-100": "#dcedc8",
  "light-green-200": "#c5e1a5",
  "light-green-300": "#aed581",
  "light-green-400": "#9ccc65",
  "light-green-500": "#8bc34a",
  "light-green-600": "#7cb342",
  "light-green-700": "#689f38",
  "light-green-800": "#558b2f",
  "light-green-900": "#33691e",
  "light-green-a100": "#ccff90",
  "light-green-a200": "#b2ff59",
  "light-green-a400": "#76ff03",
  "light-green-a700": "#64dd17",
  "lime-50": "#f9fbe7",
  "lime-100": "#f0f4c3",
  "lime-200": "#e6ee9c",
  "lime-300": "#dce775",
  "lime-400": "#d4e157",
  "lime-500": "#cddc39",
  "lime-600": "#c0ca33",
  "lime-700": "#afb42b",
  "lime-800": "#9e9d24",
  "lime-900": "#827717",
  "lime-a100": "#f4ff81",
  "lime-a200": "#eeff41",
  "lime-a400": "#c6ff00",
  "lime-a700": "#aeea00",
  "yellow-50": "#fffde7",
  "yellow-100": "#fff9c4",
  "yellow-200": "#fff59d",
  "yellow-300": "#fff176",
  "yellow-400": "#ffee58",
  "yellow-500": "#ffeb3b",
  "yellow-600": "#fdd835",
  "yellow-700": "#fbc02d",
  "yellow-800": "#f9a825",
  "yellow-900": "#f57f17",
  "yellow-a100": "#ffff8d",
  "yellow-a200": "#ffff00",
  "yellow-a400": "#ffea00",
  "yellow-a700": "#ffd600",
  "yellow-standard": "#ffd75e",
  "amber-50": "#fff8e1",
  "amber-100": "#ffecb3",
  "amber-200": "#ffe082",
  "amber-300": "#ffd54f",
  "amber-400": "#ffca28",
  "amber-500": "#ffc107",
  "amber-600": "#ffb300",
  "amber-700": "#ffa000",
  "amber-800": "#ff8f00",
  "amber-900": "#ff6f00",
  "amber-a100": "#ffe57f",
  "amber-a200": "#ffd740",
  "amber-a400": "#ffc400",
  "amber-a700": "#ffab00",
  "orange-50": "#fff3e0",
  "orange-100": "#ffe0b2",
  "orange-200": "#ffcc80",
  "orange-300": "#ffb74d",
  "orange-400": "#ffa726",
  "orange-500": "#ff9800",
  "orange-600": "#fb8c00",
  "orange-700": "#f57c00",
  "orange-800": "#ef6c00",
  "orange-900": "#e65100",
  "orange-a100": "#ffd180",
  "orange-a200": "#ffab40",
  "orange-a400": "#ff9100",
  "orange-a700": "#ff6d00",
  "deep-orange-50": "#fbe9e7",
  "deep-orange-100": "#ffccbc",
  "deep-orange-200": "#ffab91",
  "deep-orange-300": "#ff8a65",
  "deep-orange-400": "#ff7043",
  "deep-orange-500": "#ff5722",
  "deep-orange-600": "#f4511e",
  "deep-orange-700": "#e64a19",
  "deep-orange-800": "#d84315",
  "deep-orange-900": "#bf360c",
  "deep-orange-a100": "#ff9e80",
  "deep-orange-a200": "#ff6e40",
  "deep-orange-a400": "#ff3d00",
  "deep-orange-a700": "#dd2c00",
  "brown-50": "#efebe9",
  "brown-100": "#d7ccc8",
  "brown-200": "#bcaaa4",
  "brown-300": "#a1887f",
  "brown-400": "#8d6e63",
  "brown-500": "#795548",
  "brown-600": "#6d4c41",
  "brown-700": "#5d4037",
  "brown-800": "#4e342e",
  "brown-900": "#3e2723",
  "grey-50": "#fafafa",
  "grey-100": "#f5f5f5",
  "grey-200": "#eeeeee",
  "grey-300": "#e0e0e0",
  "grey-400": "#bdbdbd",
  "grey-500": "#9e9e9e",
  "grey-600": "#757575",
  "grey-700": "#616161",
  "grey-800": "#424242",
  "grey-800-light": "rgba(66, 66, 66, 0.95)",
  "grey-900": "#212121",
  "blue-grey-50": "#eceff1",
  "blue-grey-100": "#cfd8dc",
  "blue-grey-200": "#b0bec5",
  "blue-grey-300": "#90a4ae",
  "blue-grey-400": "#78909c",
  "blue-grey-500": "#607d8b",
  "blue-grey-600": "#546e7a",
  "blue-grey-700": "#455a64",
  "blue-grey-800": "#37474f",
  "blue-grey-900": "#263238",
  "blue-standard": "#809AE5",
  "blue-standard-2": "#3F4D62",
  "blue-standard-light": "rgba(63, 77, 98, .7)",
  "lantern-orange": "#F07132",
  "lantern-light-blue": "#03A9F4",
  "lantern-eggplant": "#5C384D",
  "lantern-burnt-orange": "#8B2D21",
  "lantern-blue": "#182B5E",
  "lantern-dark-blue": "#002C42",
  "lantern-soft-blue": "#88C0E6",
  "lantern-medium-blue": "#037FC2",
};

const GREYS = {
  "grey-100": "#f9fafb",
  "grey-200": "#f2f3f5",
  "grey-300": "#e6eaf0",
  "grey-400": "#d3d9e3",
  "grey-500": "#b9c2d0",
  "grey-600": "#7c8695",
  "grey-700": "#72777a",
  "grey-800": "#565a5c",
  "grey-900": "#313435",
};

const CORE_COLORS = {
  forest: "rgba(37, 99, 111, 1)",
  "forest-dark": "rgba(0, 75, 91, 1)",
  gold: "rgba(217, 169, 95, 1)",
  "gold-dark": "rgba(183, 135, 61, 1)",
  crimson: "rgba(186, 79, 79, 1)",
  "crimson-dark": "rgba(164, 57, 57, 1)",
  indigo: "rgba(76, 98, 144, 1)",
  "indigo-dark": "rgba(62, 84, 130, 1)",
  teal: "rgba(144, 174, 181, 1)",
  "teal-dark": "rgba(110, 140, 147, 1)",
  salmon: "rgba(204, 152, 156, 1)",
  "salmon-dark": "rgba(171, 119, 123, 1)",
};

// A placeholder color rotator for charts that need to dynamically pick colors
const COLOR_ROTATION = [
  "#25636f",
  "#d9a95f",
  "#ba4f4f",
  "#4c6290",
  "#90aeb5",
  "#cc989c",
  "#c2cbd0",
];

const COLORS_GOOD_BAD = {
  good: "#809ae5",
  bad: "#d12249",
};

const COLORS_STACKED_TWO_VALUES = COLOR_ROTATION.slice(0, 2);

const COLORS_THREE_VALUES = COLOR_ROTATION.slice(0, 3);

const COLORS_FIVE_VALUES = COLOR_ROTATION.slice(0, 5);

const COLORS_SEVEN_VALUES = COLOR_ROTATION;

const COLORS_LANTERN_SET = [
  "#F26825",
  "#02BFF0",
  "#037FC2",
  "#CC79A7",
  "#049E73",
];

export {
  COLORS,
  GREYS,
  COLOR_ROTATION,
  COLORS_GOOD_BAD,
  COLORS_STACKED_TWO_VALUES,
  COLORS_THREE_VALUES,
  COLORS_FIVE_VALUES,
  COLORS_SEVEN_VALUES,
  COLORS_LANTERN_SET,
  CORE_COLORS,
};
