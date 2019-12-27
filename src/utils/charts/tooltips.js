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

function tooltipForCountChart(firstDataset, firstPrefix, secondDataset, secondPrefix) {
  return {
    title: (tooltipItem, data) => data.labels[tooltipItem[0].index],
    label: (tooltipItem, data) => {
      const { index } = tooltipItem;

      const datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
      let countValue = [];
      if (datasetLabel.startsWith(firstPrefix)) {
        countValue = firstDataset[index];
      } else if (datasetLabel.startsWith(secondPrefix)) {
        countValue = secondDataset[index];
      } else {
        countValue = 0;
      }

      return `${data.datasets[tooltipItem.datasetIndex].label}: ${countValue}`;
    },
  };
}

function tooltipForRateChart() {
  return {
    title: (tooltipItem, data) => {
      const dataset = data.datasets[tooltipItem[0].datasetIndex];
      return dataset.label;
    },
    label: (tooltipItem, data) => {
      const dataset = data.datasets[tooltipItem.datasetIndex];
      const currentValue = dataset.data[tooltipItem.index];

      return `${currentValue.toFixed(2)}% of ${data.labels[tooltipItem.index]}`;
    },
  };
}

export {
  tooltipForCountChart,
  tooltipForRateChart,
};
