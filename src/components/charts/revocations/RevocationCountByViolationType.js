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

    var sorted_arrays = {
      'ABSCONDED': [],
      'FELONY': [],
      'TECHNICAL': [],
      'UNKNOWN_VIOLATION_TYPE': [],
    }

    countsByMonth.forEach(function (data) {
      const year = data.year;
      const month = data.month;
      const count = data.revocation_count;
      const violationType = data.violation_type;

      const violationData = [year, month, count];

      if (violationType in sorted_arrays) {
        const violationArray = sorted_arrays[violationType];
        violationArray.push(violationData);
      }
    });


    const sortFunction = function(a, b) {
        if (a[0] === b[0]) {
          return a[1] - b[1];
        } else {
          return a[0] - b[0];
        }
    };

    Object.keys(sorted_arrays).forEach(function(key) {
      var array = sorted_arrays[key];
      // Sort by month and year
      array.sort(sortFunction);
      // Just display the most recent 6 months
      array = array.slice(array.length - 6, array.length);
      sorted_arrays[key] = array;
    });

    let sorted_absconsion = sorted_arrays['ABSCONDED'];
    let sorted_new_offense = sorted_arrays['FELONY'];
    let sorted_technical = sorted_arrays['TECHNICAL'];
    let sorted_unknown = sorted_arrays['UNKNOWN_VIOLATION_TYPE']

    setChartLabels(sorted_absconsion.map(element => element[1]));
    setAbsconsionDataPoints(sorted_absconsion.map(element => element[2]));
    setNewOffenseDataPoints(sorted_new_offense.map(element => element[2]));
    setTechnicalDataPoints(sorted_technical.map(element => element[2]));
    setUnknownDataPoints(sorted_unknown.map(element => element[2]));
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
