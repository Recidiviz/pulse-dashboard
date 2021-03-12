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
import Loading from "../../components/Loading";
import ChartCard from "../ChartCard";
import GeoViewTimeChart from "../GeoViewTimeChart";
import Methodology from "../Methodology";
import MethodologyCollapse from "../MethodologyCollapse";
import PeriodLabel from "../PeriodLabel";
import WarningIcon from "../../controls/WarningIcon";
import AdmissionsVsReleases from "./AdmissionsVsReleases";
import ReincarcerationCountOverTime from "./ReincarcerationCountOverTime";
import ReincarcerationRateByStayLength from "./ReincarcerationRateByStayLength";
import AdmissionCountsByType from "../AdmissionCountsByType";
import DaysAtLibertySnapshot from "./DaysAtLibertySnapshot";
import CoreFilterBar from "../CoreFilterBar";
import {
  defaultDistrict,
  defaultMetricPeriod,
  defaultMetricType,
} from "../utils/filterOptions";
import useChartData from "../hooks/useChartData";
import { getYearFromNow } from "../utils/timePeriod";
import { availableDistricts, importantNotes } from "./constants";

const FacilitiesExplore = () => {
  const { apiData, isLoading, getTokenSilently } = useChartData(
    "us_nd/facilities/explore"
  );
  const [metricType, setMetricType] = useState(defaultMetricType);
  const [metricPeriodMonths, setMetricPeriodMonths] = useState(
    defaultMetricPeriod
  );
  const [district, setDistrict] = useState(defaultDistrict);

  if (isLoading) {
    return <Loading />;
  }

  const filters = (
    <CoreFilterBar
      setChartMetricType={setMetricType}
      setChartMetricPeriodMonths={setMetricPeriodMonths}
      setChartDistrict={setDistrict}
      metricType={metricType}
      metricPeriodMonths={metricPeriodMonths}
      district={district}
      stateCode="US_ND"
      replaceLa
      availableDistricts={availableDistricts}
    />
  );

  return (
    <PageTemplate importantNotes={importantNotes} filters={filters}>
      <ChartCard
        chartId="reincarcerationCountsByMonth"
        chartTitle="REINCARCERATIONS BY MONTH"
        chart={
          <ReincarcerationCountOverTime
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
            disableGoal
            reincarcerationCountsByMonth={
              apiData.reincarcerations_by_month.data
            }
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
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
            dataPointsByOffice={apiData.reincarcerations_by_period.data}
            numeratorKeys={["returns"]}
            denominatorKeys={["total_admissions"]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="reincarcerationCountsByMonth" />}
      />

      <ChartCard
        chartId="daysAtLibertySnapshot"
        chartTitle={
          <>
            DAYS AT LIBERTY (AVERAGE)
            {(metricType === "rates" || district[0] !== "all") && (
              <WarningIcon
                tooltipText="This graph is showing average days at liberty for all reincarcerated individuals. It does not support showing this metric as a rate. This chart does not yet support filtering by county of residence."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <DaysAtLibertySnapshot
            metricPeriodMonths={metricPeriodMonths}
            disableGoal
            daysAtLibertyByMonth={apiData.avg_days_at_liberty_by_month.data}
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
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
            admissionsVsReleases={
              apiData.admissions_versus_releases_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
            dataPointsByOffice={
              apiData.admissions_versus_releases_by_period.data
            }
            numeratorKeys={["population_change"]}
            denominatorKeys={["month_end_population"]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="admissionsVsReleases" />}
      />

      <ChartCard
        chartId="admissionCountsByType"
        chartTitle={
          <>
            ADMISSIONS BY TYPE
            {district[0] !== "all" && (
              <WarningIcon
                tooltipText="This graph does not yet support filtering by county of residence."
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
            district={["all"]}
            admissionCountsByType={apiData.admissions_by_type_by_period.data}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={
          <>
            <MethodologyCollapse chartId="admissionCountsByType">
              <div>
                <ul>
                  <li>
                    Admissions include people admitted to DOCR facilities during
                    a particular time frame. Transfers, periods of temporary
                    custody, returns from escape and/or erroneous releases are
                    not considered admissions.
                  </li>
                  <li>
                    Prison admissions are categorized as probation revocations,
                    parole revocations, or new admissions. New admissions are
                    admissions resulting from a reason other than revocation.
                  </li>
                  <li>
                    &quot;Technical Revocations&quot; include only those
                    revocations which result solely from a technical violation.
                    If there is a violation that includes a new offense or
                    absconsion, it is considered a &quot;Non-Technical
                    Revocation&quot;.
                  </li>
                  <li>
                    Revocations of &quot;Unknown Type&quot; indicate individuals
                    who were admitted to prison for a supervision revocation
                    where the violation that caused the revocation cannot yet be
                    determined. Revocation admissions are linked to supervision
                    cases closed via revocation within 90 days of the admission.
                    Revocation admissions without a supervision case closed via
                    revocation in this window will always be considered of
                    &quot;Unknown Type&quot;.
                  </li>
                </ul>
              </div>
            </MethodologyCollapse>
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        chartId="reincarcerationRateByStayLength"
        chartTitle={
          <>
            REINCARCERATIONS BY PREVIOUS STAY LENGTH
            {metricPeriodMonths !== "12" && (
              <WarningIcon
                tooltipText="This graph is showing reincarceration by previous stay length with the follow up period noted below. It does not show follow up periods other than 1 year."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <ReincarcerationRateByStayLength
            metricType={metricType}
            district={district}
            ratesByStayLength={apiData.reincarceration_rate_by_stay_length.data}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={
          <>
            <Methodology chartId="reincarcerationRateByStayLength" />
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
                    <small className="c-grey-500 fw-600">
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      Follow Up Period{" "}
                    </small>
                    1 year
                  </span>
                </div>
              </div>
            </div>
          </>
        }
      />
    </PageTemplate>
  );
};

export default FacilitiesExplore;
