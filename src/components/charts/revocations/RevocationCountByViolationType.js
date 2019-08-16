import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_FIVE_VALUES } from "../../../assets/scripts/constants/colors";
import { monthNamesFromNumberList } from "../../../utils/monthConversion";

const RevocationCountByViolationType = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [absconsionDataPoints, setAbsconsionDataPoints] = useState([]);
  const [newOffenseDataPoints, setNewOffenseDataPoints] = useState([]);
  const [technicalDataPoints, setTechnicalDataPoints] = useState([]);
  const [unknownDataPoints, setUnknownDataPoints] = useState([]);

  const processResponse = () => {
    const countsByMonth = props.revocationCountsByMonthByViolationType;

    var overallCounts = {}

    countsByMonth.forEach(function (data) {
      const year = data.year;
      const month = data.month;
      const count = data.revocation_count;
      const violationType = data.violation_type;

      if (year in overallCounts) {
        let yearDict = overallCounts[year];
        if (month in yearDict) {
          let monthDict = yearDict[month];
          monthDict[violationType] = count;
        } else {
          yearDict[month] = {};
          yearDict[month][violationType] = count;
        }
      } else {
        overallCounts[year] = {};
        overallCounts[year][month] = {};
        overallCounts[year][month][violationType] = count;
      }
    });

    const simpleSort = function(a, b) {
      return a - b;
    }

    let sortedYears = Object.keys(overallCounts);
    sortedYears.sort(simpleSort);

    var sorted_arrays = {
      'ABSCONDED': [],
      'FELONY': [],
      'TECHNICAL': [],
      'UNKNOWN_VIOLATION_TYPE': [],
    }

    const monthsLabels = [];
    const monthsThisYear = Object.keys(overallCounts[sortedYears[sortedYears.length - 1]]);
    monthsThisYear.sort(simpleSort);

    let mostRecentMonth = monthsThisYear[monthsThisYear.length - 1];
    let firstMonthLastYear = 13 + (mostRecentMonth - 6);

    if (firstMonthLastYear <= 12) {
      let monthsLastYearData = overallCounts[sortedYears[sortedYears.length - 2]];
      for (var i = firstMonthLastYear; i <= 12; i++) {
        monthsLabels.push(i);
        let data = monthsLastYearData[i];
        Object.keys(data).forEach(function (violationType) {
          sorted_arrays[violationType].push(data[violationType]);
        })
      }
    }

    let monthsThisYearData = overallCounts[sortedYears[sortedYears.length - 1]];
    monthsThisYear.forEach(function (month) {
      monthsLabels.push(month);
      let data = monthsThisYearData[month];
      Object.keys(data).forEach(function (violationType) {
        sorted_arrays[violationType].push(data[violationType]);
      })
    })

    const sorted_absconsion = sorted_arrays['ABSCONDED'];
    const sorted_new_offense = sorted_arrays['FELONY'];
    const sorted_technical = sorted_arrays['TECHNICAL'];
    const sorted_unknown = sorted_arrays['UNKNOWN_VIOLATION_TYPE'];

    setChartLabels(monthsLabels);
    setAbsconsionDataPoints(sorted_absconsion);
    setNewOffenseDataPoints(sorted_new_offense);
    setTechnicalDataPoints(sorted_technical);
    setUnknownDataPoints(sorted_unknown);
  }

  useEffect(() => {
    processResponse();
  }, [props.revocationCountsByMonthByViolationType]);

  return (
    <Bar data={{
      labels: monthNamesFromNumberList(chartLabels),
      datasets: [{
          label: "Absconsion",
          backgroundColor: COLORS_FIVE_VALUES[0],
          data: absconsionDataPoints,
        }, {
          label: "New Offense",
          backgroundColor: COLORS_FIVE_VALUES[1],
          data: newOffenseDataPoints,
        }, {
          label: "Technical",
          backgroundColor: COLORS_FIVE_VALUES[2],
          data: technicalDataPoints,
        }, {
          label: "Unknown Type",
          backgroundColor: COLORS_FIVE_VALUES[4],
          data: unknownDataPoints,
        },
      ],
    }}
    options={{
      responsive: true,
      legend: {
        position: 'bottom',
        boxWidth: 10,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
          stacked: true,
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Revocation counts',
          },
          stacked: true,
        }],
      },
    }}
    />
  );
}

export default RevocationCountByViolationType;
