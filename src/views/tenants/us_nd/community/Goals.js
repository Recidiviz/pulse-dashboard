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

import PageTemplate from "../PageTemplate";
import Loading from "../../../../components/Loading";
import ChartCard from "../../../../components/charts/ChartCard";
import GeoViewTimeChart from "../../../../components/charts/GeoViewTimeChart";
import Methodology from "../../../../components/charts/Methodology";
import MethodologyCollapse from "../../../../components/charts/MethodologyCollapse";
import RevocationCountOverTime from "../../../../components/charts/revocations/RevocationCountOverTime";
import LsirScoreChangeSnapshot from "../../../../components/charts/snapshots/LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "../../../../components/charts/snapshots/RevocationAdmissionsSnapshot";
import SupervisionSuccessSnapshot from "../../../../components/charts/snapshots/SupervisionSuccessSnapshot";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";

const metrics = {
  district: "all",
  metricPeriodMonths: "36",
  supervisionType: "all",
};

const CommunityGoals = () => {
  const { apiData, isLoading } = useChartData("us_nd/community/goals");

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageTemplate>
      <ChartCard
        chartId="revocationCountsByMonth"
        chartTitle="REVOCATION ADMISSIONS BY MONTH"
        chart={
          <RevocationCountOverTime
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            geoView={false}
            officeData={apiData.site_offices}
            revocationCountsByMonth={apiData.revocations_by_month}
            header="revocationCountsByMonth-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationCountsByMonth"
            chartTitle="REVOCATION ADMISSIONS BY MONTH"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.revocations_by_period}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={
          <MethodologyCollapse chartId="revocationCountsByMonth">
            <div>
              <ul>
                <li>
                  Revocations are included based on when the person was admitted
                  to a DOCR facility, not when the violation, offense, or
                  revocation occurred.
                </li>
                <li>
                  Revocations are attributed to the site of the terminating
                  officer on the revocation in Docstars. Revocation admissions
                  that can&apos;t be matched to a supervision case are not
                  attributed to an office.
                </li>
              </ul>
            </div>
          </MethodologyCollapse>
        }
      />

      <ChartCard
        chartId="supervisionSuccessSnapshot"
        chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
        chart={
          <SupervisionSuccessSnapshot
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            supervisionSuccessRates={
              apiData.supervision_termination_by_type_by_month
            }
            header="supervisionSuccessSnapshot-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="supervisionSuccessSnapshot"
            chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={
              apiData.supervision_termination_by_type_by_period
            }
            numeratorKeys={["successful_termination"]}
            denominatorKeys={[
              "revocation_termination",
              "successful_termination",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="supervisionSuccessSnapshot" />}
      />

      <ChartCard
        chartId="lsirScoreChangeSnapshot"
        chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
        chart={
          <LsirScoreChangeSnapshot
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            lsirScoreChangeByMonth={apiData.average_change_lsir_score_by_month}
            header="lsirScoreChangeSnapshot-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="lsirScoreChangeSnapshot"
            chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
            metricType="counts"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.average_change_lsir_score_by_period}
            numeratorKeys={["average_change"]}
            denominatorKeys={[]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="lsirScoreChangeSnapshot" />}
      />

      <ChartCard
        chartId="revocationAdmissionsSnapshot"
        chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
        chart={
          <RevocationAdmissionsSnapshot
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            district={metrics.district}
            revocationAdmissionsByMonth={apiData.admissions_by_type_by_month}
            header="revocationAdmissionsSnapshot-header"
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationAdmissionsSnapshot"
            chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
            metricType="rates"
            metricPeriodMonths={metrics.metricPeriodMonths}
            supervisionType={metrics.supervisionType}
            keyedByOffice
            shareDenominatorAcrossRates
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.admissions_by_type_by_period}
            numeratorKeys={[
              "technicals",
              "non_technicals",
              "unknown_revocations",
            ]}
            denominatorKeys={[
              "technicals",
              "non_technicals",
              "unknown_revocations",
              "new_admissions",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={
          <MethodologyCollapse chartId="revocationAdmissionsSnapshot">
            <div>
              <ul>
                <li>
                  Prison admissions include individuals who are newly
                  incarcerated in DOCR facilities. Transfers, periods of
                  temporary custody, returns from escape and/or erroneous
                  releases are not considered admissions.
                </li>
                <li>
                  Prison admissions are categorized as probation revocations,
                  parole revocations, or new admissions. Revocation admissions
                  are those admissions documented as probation revocations or
                  parole revocations.
                </li>
              </ul>
            </div>
          </MethodologyCollapse>
        }
      />
    </PageTemplate>
  );
};

export default CommunityGoals;
