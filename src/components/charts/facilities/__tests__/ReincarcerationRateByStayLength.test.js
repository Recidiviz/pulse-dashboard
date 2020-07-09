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

import ShallowRenderer from "react-test-renderer/shallow";
import "@testing-library/jest-dom/extend-expect";
import ReincarcerationRateByStayLength from "../ReincarcerationRateByStayLength";

const ratesByStayLength = [
  {
    stay_length_bucket: "120<",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.13,
    reincarceration_count: 610,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "60-72",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.18,
    reincarceration_count: 807,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "36-48",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.15,
    reincarceration_count: 763,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "72-84",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.12,
    reincarceration_count: 1311,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "108-120",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.09,
    reincarceration_count: 456,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "96-108",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0,
    reincarceration_count: 549,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "84-96",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0,
    reincarceration_count: 700,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "12-24",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.26,
    reincarceration_count: 155,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "<12",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.24,
    reincarceration_count: 223,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "24-36",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.11,
    reincarceration_count: 1402,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
  {
    stay_length_bucket: "48-60",
    district: "ALL",
    follow_up_period: "1",
    recidivism_rate: 0.12,
    reincarceration_count: 671,
    state_code: "US_DEMO",
    release_cohort: "2017",
  },
];

describe("test for component ReincarcerationRateByStayLength", () => {
  it("displays rate view", () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <ReincarcerationRateByStayLength
        metricType="rates"
        district={["all"]}
        ratesByStayLength={ratesByStayLength}
      />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.data.labels).toEqual([
      "0-12",
      "12-24",
      "24-36",
      "36-48",
      "48-60",
      "60-72",
      "72-84",
      "84-96",
      "96-108",
      "108-120",
      "120+",
    ]);

    expect(result.props.data.datasets[0].label).toEqual("Reincarceration rate");
    expect(result.props.data.datasets[0].data).toEqual([
      0.24,
      0.26,
      0.11,
      0.15,
      0.12,
      0.18,
      0.12,
      0,
      0,
      0.09,
      0.13,
    ]);
  });

  it("displays count view", () => {
    const renderer = new ShallowRenderer();
    renderer.render(
      <ReincarcerationRateByStayLength
        metricType="counts"
        district={["all"]}
        ratesByStayLength={ratesByStayLength}
      />
    );
    const result = renderer.getRenderOutput();

    expect(result.props.data.datasets[0].label).toEqual(
      "Number reincarcerated"
    );
    expect(result.props.data.datasets[0].data).toEqual([
      223,
      155,
      1402,
      763,
      671,
      807,
      1311,
      700,
      549,
      456,
      610,
    ]);
  });
});
