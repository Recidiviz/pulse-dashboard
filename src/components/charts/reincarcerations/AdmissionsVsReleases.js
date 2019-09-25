import React, { useState, useEffect } from 'react';

import { Bar } from 'react-chartjs-2';
import { COLORS_GOOD_BAD } from '../../../assets/scripts/constants/colors';
import { monthNamesWithYearsFromNumbers } from '../../../utils/monthConversion';
import { sortAndFilterMostRecentMonths } from '../../../utils/dataOrganizing';

const AdmissionsVsReleases = (props) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  const processResponse = () => {
    const { admissionsVsReleases } = props;

    const dataPoints = [];
    admissionsVsReleases.forEach((data) => {
      const { year, month, population_change: delta } = data;
      dataPoints.push({ year, month, delta });
    });

    const sorted = sortAndFilterMostRecentMonths(dataPoints, 6);

    setChartLabels(monthNamesWithYearsFromNumbers(sorted.map((element) => element.month), false));
    setChartDataPoints(sorted.map((element) => element.delta));
  };

  useEffect(() => {
    processResponse();
  }, [props.admissionsVsReleases]);

  const chart = (
    <Bar
      data={{
        labels: chartLabels,
        datasets: [{
          label: 'Admissions versus releases',
          backgroundColor: (context) => {
            if (context.dataset.data[context.dataIndex] > 0) {
              return COLORS_GOOD_BAD.bad;
            }
            return COLORS_GOOD_BAD.good;
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
              labelString: 'Admissions versus releases',
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
