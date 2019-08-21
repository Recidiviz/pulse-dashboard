import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_GOOD_BAD } from "../../../assets/scripts/constants/colors";
import { monthNamesFromNumberList } from "../../../utils/monthConversion";

const AdmissionsVsReleases = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const admissionsVsReleases = props.admissionsVsReleases;

    const thisYear = new Date().getFullYear()
    var sorted = [];
    admissionsVsReleases.forEach(function (data) {
      const year = data.year;
      const month = data.month;
      const delta = data.population_change;

      if (year <= thisYear) {
        sorted.push([year, month, delta]);
      }
    });

    // Sort by month and year
    sorted.sort(function(a, b) {
        if (a[0] === b[0]) {
          return a[1] - b[1];
        } else {
          return a[0] - b[0];
        }
    });

    // Just display the most recent 6 months
    sorted = sorted.slice(sorted.length - 6, sorted.length);

    setChartLabels(sorted.map(element => element[1]));
    setChartDataPoints(sorted.map(element => element[2]));
  }

  useEffect(() => {
    processResponse();
  }, [props.admissionsVsReleases]);

  const chart = (
    <Bar data={{
      labels: monthNamesFromNumberList(chartLabels),
      datasets: [{
        label: 'Admissions versus releases',
        backgroundColor: function(context) {
          if (context.dataset.data[context.dataIndex] > 0) {
            return COLORS_GOOD_BAD['bad'];
          } else {
            return COLORS_GOOD_BAD['good']; }
          },
        fill: false,
        borderWidth: 2,
        data: chartDataPoints,
      }],
    }}
    options={{
      legend: {
        display: false,
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 20,
        },
      },
      tooltips: {
        mode: 'x',
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Counts',
          },
        }],
      },
    }}
    />
  );

  const chartData = chart.props.data.datasets[0].data;
  const mostRecentValue = chartData[chartData.length - 1];
  const direction = (mostRecentValue > 0) ? 'grew' : 'shrank';

  const header = document.getElementById(props.header);

  if (header && mostRecentValue) {
    const title = `The ND facilities <b style='color:#809AE5'>${direction} by ${mostRecentValue} people</b> this month.`;
    header.innerHTML = title;
  }

  return chart;
};

export default AdmissionsVsReleases;
