import React, { useState, useEffect } from "react";

import { Bar } from 'react-chartjs-2';
import { COLORS_GOOD_BAD } from "../../../assets/scripts/constants/colors";

const ReleasesVsAdmissions = (props) => {
  const [apiMessage, setApiMessage] = useState([]);

  const processResponse = () => {
    const admissions = props.admissions;
    const releases = props.releases;

    if (!admissions || !releases) {
      return;
    }

    const deltas = [];
    var i;
    for (i = 0; i < admissions.length; i += 1) {
      deltas[i] = admissions[i] - releases[i];
    }

    setApiMessage(deltas);
  }

  useEffect(() => {
    processResponse();
  }, [props.admissions, props.releases]);

  return (
    <Bar data={{
      labels: ['November', 'December', 'January', 'February', 'March', 'April'],
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
        data: apiMessage,
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
}

export default ReleasesVsAdmissions;
