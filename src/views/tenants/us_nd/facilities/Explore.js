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

import React, { useState } from "react";

import PageTemplate from "../PageTemplate";
import Loading from "../../../../components/Loading";
import ChartCard from "../../../../components/charts/ChartCard";
import GeoViewTimeChart from "../../../../components/charts/GeoViewTimeChart";
import Methodology from "../../../../components/charts/Methodology";
import PeriodLabel from "../../../../components/charts/PeriodLabel";
import WarningIcon from "../../../../components/charts/WarningIcon";
import AdmissionsVsReleases from "../../../../components/charts/reincarcerations/AdmissionsVsReleases";
import ReincarcerationCountOverTime from "../../../../components/charts/reincarcerations/ReincarcerationCountOverTime";
import ReincarcerationRateByStayLength from "../../../../components/charts/reincarcerations/ReincarcerationRateByStayLength";
import AdmissionCountsByType from "../../../../components/charts/revocations/AdmissionCountsByType";
import DaysAtLibertySnapshot from "../../../../components/charts/snapshots/DaysAtLibertySnapshot";
import ToggleBar from "../../../../components/toggles/ToggleBar";
import * as ToggleDefaults from "../../../../components/toggles/ToggleDefaults";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";
import { getYearFromNow } from "../../../../utils/transforms/years";

const getReincarcerationRateByStayLengthFooter = () => (
  <div className="layer bdT p-20 w-100">
    <div className="peers ai-c jc-c gapX-20">
      <div className="peer">
        <span className="fsz-def fw-600 mR-10 c-grey-800">
          <small className="c-grey-500 fw-600">Release Cohort </small>
          {getYearFromNow(-2)}
        </span>
      </div>
      <div className="peer fw-600">
        <span className="fsz-def fw-600 mR-10 c-grey-800">
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <small className="c-grey-500 fw-600">Follow Up Period </small> 1 year
        </span>
      </div>
    </div>
  </div>
);

const importantNotes = [
  {
    header: "REINCARCERATION",
    body: `For the purposes of this dashboard, reincarceration is the incarceration of someone in
      a North Dakota DOCR facility who has previously been incarcerated in a North Dakota DOCR
      facility no matter how much time has passed. A revocation is also a reincarceration for a
      formerly incarcerated individual, but not for an individual whose supervision revocation
      results in transfer from probation to a DOCR facility. An individual can also be
      reincarcerated following successful supervision termination, which would count towards
      reincarceration metrics but not revocation metrics. For example, if someone is incarcerated,
      released on parole, completes parole, and then a year later is incarcerated for a new crime,
      that incarceration is a reincarceration but not a revocation.

      We do not have data on incarceration in county jails or in other states. As a result, our
      reincarceration calculations consider only incarceration in North Dakota DOCR facilities.`,
  },
  {
    header: "DATA PULLED FROM ELITE & DOCSTARS",
    body: `Data in the dashboard is updated nightly using information pulled from Elite and
      Docstars.`,
  },
  {
    header: "LEARN MORE",
    body:
      'Click on "Methodology" for more information on the calculations behind that chart.',
  },
];

const FacilitiesExplore = () => {
  const { apiData, isLoading } = useChartData("us_nd/facilities/explore");
  const [metricType, setMetricType] = useState(ToggleDefaults.metricType);
  const [metricPeriodMonths, setMetricPeriodMonths] = useState(
    ToggleDefaults.metricPeriodMonths
  );
  const [district, setDistrict] = useState(ToggleDefaults.district);

  if (isLoading) {
    return <Loading />;
  }

  const toggleBar = (
    <ToggleBar
      setChartMetricType={setMetricType}
      setChartMetricPeriodMonths={setMetricPeriodMonths}
      setChartDistrict={setDistrict}
      stateCode="US_ND"
      replaceLa
      availableDistricts={[
        "US_ND_ADAMS",
        "US_ND_BARNES",
        "US_ND_BENSON",
        "US_ND_BILLSON",
        "US_ND_BOTTINEAU",
        "US_ND_BOWMAN",
        "US_ND_BURKE",
        "US_ND_BURLEIGH",
        "US_ND_CASS",
        "US_ND_CAVALIER",
        "US_ND_DICKEY",
        "US_ND_DIVIDE",
        "US_ND_DUNN",
        "US_ND_EDDY",
        "US_ND_EMMONS",
        "US_ND_FOSTER",
        "US_ND_GOLDEN VALLEY",
        "US_ND_GRAND FORKS",
        "US_ND_GRANT",
        "US_ND_GRIGGS",
        "US_ND_HETTINGER",
        "US_ND_KIDDER",
        "US_ND_LAMOURE",
        "US_ND_LOGAN",
        "US_ND_MCHENRY",
        "US_ND_MCINTOSH",
        "US_ND_MCKENZIE",
        "US_ND_MCLEAN",
        "US_ND_MERCER",
        "US_ND_MORTON",
        "US_ND_MOUNTRAIL",
        "US_ND_NELSON",
        "US_ND_OLIVER",
        "US_ND_PEMBINA",
        "US_ND_PIERCE",
        "US_ND_RAMSEY",
        "US_ND_RANSOM",
        "US_ND_RENVILLE",
        "US_ND_RICHLAND",
        "US_ND_ROLETTE",
        "US_ND_SARGENT",
        "US_ND_SHERIDAN",
        "US_ND_SIOUX",
        "US_ND_SLOPE",
        "US_ND_STARK",
        "US_ND_STEELE",
        "US_ND_STUTSMAN",
        "US_ND_TOWNER",
        "US_ND_TRAILL",
        "US_ND_WALSH",
        "US_ND_WARD",
        "US_ND_WELLS",
        "US_ND_WILLIAMS",
      ]}
    />
  );

  return (
    <PageTemplate importantNotes={importantNotes} toggleBar={toggleBar}>
      <ChartCard
        chartId="reincarcerationCountsByMonth"
        chartTitle="REINCARCERATIONS BY MONTH"
        chart={
          <ReincarcerationCountOverTime
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
            disableGoal
            reincarcerationCountsByMonth={apiData.reincarcerations_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="reincarcerationCountsByMonth"
            chartTitle="REINCARCERATIONS BY MONTH"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            keyedByOffice={false}
            stateCode="us_nd"
            dataPointsByOffice={apiData.reincarcerations_by_period}
            numeratorKeys={["returns"]}
            denominatorKeys={["total_admissions"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="reincarcerationCountsByMonth" />}
      />

      <ChartCard
        chartId="daysAtLibertySnapshot"
        chartTitle={
          <>
            DAYS AT LIBERTY (AVERAGE)
            {(metricType !== "counts" || district !== "all") && (
              <WarningIcon
                tooltipText="This graph is showing average days at liberty for all reincarcerated individuals. It does not support showing this metric as a rate. This chart does not yet support filtering by district of residence."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <DaysAtLibertySnapshot
            metricPeriodMonths={metricPeriodMonths}
            disableGoal
            daysAtLibertyByMonth={apiData.avg_days_at_liberty_by_month}
          />
        }
        footer={<Methodology chartId="daysAtLibertySnapshot" />}
      />

      <ChartCard
        chartId="admissionsVsReleases"
        chartTitle="ADMISSIONS VERSUS RELEASES"
        chart={
          <AdmissionsVsReleases
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
            admissionsVsReleases={apiData.admissions_versus_releases_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="admissionsVsReleases"
            chartTitle="ADMISSIONS VERSUS RELEASES"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            keyedByOffice={false}
            possibleNegativeValues
            stateCode="us_nd"
            dataPointsByOffice={apiData.admissions_versus_releases_by_period}
            numeratorKeys={["population_change"]}
            denominatorKeys={["month_end_population"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="admissionsVsReleases" />}
      />

      <ChartCard
        chartId="admissionCountsByType"
        chartTitle={
          <>
            ADMISSIONS BY TYPE
            {district !== "all" && (
              <WarningIcon
                tooltipText="This graph is showing both non-revocation admissions to prison and admissions due to revocation from both parole and probation. We cannot show percentages of admissions broken down by supervision type or district because non-revocation admissions to prison cannot be broken down along those dimensions."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <AdmissionCountsByType
            metricType={metricType}
            supervisionType="all"
            metricPeriodMonths={metricPeriodMonths}
            district="all"
            admissionCountsByType={apiData.admissions_by_type_by_period}
          />
        }
        footer={
          <>
            <Methodology chartId="admissionCountsByType" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        chartId="reincarcerationRateByStayLength"
        chartTitle={
          <>
            REINCARCERATION RATE BY PREVIOUS STAY LENGTH
            {(metricType !== "rates" || metricPeriodMonths !== "12") && (
              <WarningIcon
                tooltipText="This graph is showing the reincarceration rate by previous stay length with the follow up period noted below. It cannot show this metric as a count. It also does not show follow up periods other than 1 year."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <ReincarcerationRateByStayLength
            district={district}
            ratesByStayLength={apiData.reincarceration_rate_by_stay_length}
          />
        }
        footer={
          <>
            <Methodology chartId="reincarcerationRateByStayLength" />
            {getReincarcerationRateByStayLengthFooter()}
          </>
        }
      />
    </PageTemplate>
  );
};

export default FacilitiesExplore;
