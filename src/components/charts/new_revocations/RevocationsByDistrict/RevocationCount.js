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

import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

import groupBy from "lodash/fp/groupBy";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";
import orderBy from "lodash/fp/orderBy";
import pipe from "lodash/fp/pipe";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import values from "lodash/fp/values";

import { COLORS } from "../../../../assets/scripts/constants/colors";
import { standardTooltipForCountMetric } from "../../../../utils/charts/toggles";
import ModeSwitcher from "../ModeSwitcher";
import ExportMenu from "../../ExportMenu";
import { modeButtons } from "./helpers";
import { filtersPropTypes } from "../../propTypes";

const RevocationCount = ({
  chartId,
  chartTitle,
  setMode,
  filterStates,
  timeDescription,
  currentDistricts,
  revocationApiData,
}) => {
  const data = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("district"),
    values,
    map((dataset) => ({
      district: dataset[0].district,
      count: sumBy((item) => toInteger(item.population_count), dataset),
    })),
    orderBy(["count"], ["desc"])
  )(revocationApiData);

  const labels = map("district", data);
  const dataPoints = data.map((item) => item.count);

  const barBackgroundColor = ({ dataIndex }) =>
    currentDistricts.find(
      (currentDistrict) =>
        currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
    )
      ? COLORS["lantern-light-blue"]
      : COLORS["lantern-orange"];

  const chart = (
    <Bar
      id={chartId}
      data={{
        labels,
        datasets: [
          {
            label: "Revocations",
            backgroundColor: barBackgroundColor,
            data: dataPoints,
          },
        ],
      }}
      options={{
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "District",
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              id: "y-axis-0",
              scaleLabel: {
                display: true,
                labelString: "Number of people revoked",
              },
              stacked: true,
            },
          ],
        },
        tooltips: {
          backgroundColor: COLORS["grey-800-light"],
          footerFontSize: 9,
          mode: "index",
          intersect: false,
          callbacks: {
            label: standardTooltipForCountMetric,
          },
        },
      }}
    />
  );

  return (
    <div>
      <h4>
        {chartTitle}
        <ExportMenu
          chartId={chartId}
          chart={chart}
          metricTitle={chartTitle}
          timeWindowDescription={timeDescription}
          filters={filterStates}
        />
      </h4>
      <h6 className="pB-20">{timeDescription}</h6>
      <ModeSwitcher mode="counts" setMode={setMode} buttons={modeButtons} />
      <div className="static-chart-container fs-block">{chart}</div>
    </div>
  );
};

RevocationCount.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartTitle: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
  currentDistricts: PropTypes.arrayOf(PropTypes.string).isRequired,
  revocationApiData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default RevocationCount;
