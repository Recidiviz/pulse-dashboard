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
import FtrReferralsByAge from "../../../../components/charts/programming/FtrReferralsByAge";
import FtrReferralsByGender from "../../../../components/charts/programming/FtrReferralsByGender";
import FtrReferralsByLsir from "../../../../components/charts/programming/FtrReferralsByLsir";
import FtrReferralsByParticipationStatus from "../../../../components/charts/programming/FtrReferralsByParticipationStatus";
import FtrReferralsByRace from "../../../../components/charts/programming/FtrReferralsByRace";
import FtrReferralCountByMonth from "../../../../components/charts/programming/FtrReferralCountByMonth";
import ToggleBar from "../../../../components/toggles/ToggleBar";
import * as ToggleDefaults from "../../../../components/toggles/ToggleDefaults";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";

const importantNotes = [
  {
    header: "FTR REFERRALS",
    body: `Unless noted otherwise, the charts on this page count all people with a completed FTR
      referral based on the date of that referral. The number and characteristics of people who
      actually enroll in the program may differ slightly, as not all people who are referred are
      admitted.`,
  },
  {
    header: "DATA PULLED FROM ELITE & DOCSTARS",
    body: `Data in the dashboard is updated nightly using information pulled from Elite and Docstars.`,
  },
  {
    header: "LEARN MORE",
    body: `Click on "Methodology" for more information on the calculations behind that chart.`,
  },
];

const ProgrammingExplore = () => {
  const { apiData, isLoading } = useChartData("us_nd/programming/explore");
  const [metricType, setMetricType] = useState(ToggleDefaults.metricType);
  const [metricPeriodMonths, setMetricPeriodMonths] = useState(
    ToggleDefaults.metricPeriodMonths
  );
  const [supervisionType, setSupervisionType] = useState(
    ToggleDefaults.supervisionType
  );
  const [district, setDistrict] = useState(ToggleDefaults.district);

  if (isLoading) {
    return <Loading />;
  }

  const toggleBar = (
    <ToggleBar
      setChartMetricType={setMetricType}
      setChartMetricPeriodMonths={setMetricPeriodMonths}
      setChartSupervisionType={setSupervisionType}
      setChartDistrict={setDistrict}
      districtOffices={apiData.site_offices}
      availableDistricts={[
        "beulah",
        "bismarck",
        "bottineau",
        "devils-lake",
        "dickson",
        "fargo",
        "grafton",
        "grand-forks",
        "jamestown",
        "mandan",
        "minot",
        "oakes",
        "rolla",
        "washburn",
        "wahpeton",
        "williston",
      ]}
    />
  );

  return (
    <PageTemplate importantNotes={importantNotes} toggleBar={toggleBar}>
      <ChartCard
        chartId="ftrReferralCountByMonth"
        chartTitle="FTR REFERRALS BY MONTH"
        chart={
          <FtrReferralCountByMonth
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            ftrReferralCountByMonth={apiData.ftr_referrals_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="ftrReferralCountByMonth"
            chartTitle="FTR REFERRALS BY MONTH"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.ftr_referrals_by_period}
            numeratorKeys={["count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="ftrReferralCountByMonth" />}
      />

      <ChartCard
        chartId="ftrReferralsByParticipationStatus"
        chartTitle="FTR REFERRALS BY PARTICIPATION STATUS"
        chart={
          <FtrReferralsByParticipationStatus
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            ftrReferralsByParticipationStatus={
              apiData.ftr_referrals_by_participation_status
            }
          />
        }
        footer={
          <>
            <Methodology chartId="ftrReferralsByParticipationStatus" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        chartId="ftrReferralsByRace"
        chartTitle="FTR REFERRALS BY RACE"
        chart={
          <FtrReferralsByRace
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            ftrReferralsByRace={
              apiData.ftr_referrals_by_race_and_ethnicity_by_period
            }
            statePopulationByRace={apiData.race_proportions}
          />
        }
        footer={
          <>
            <Methodology chartId="ftrReferralsByRace" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        chartId="ftrReferralsByLsir"
        chartTitle="FTR REFERRALS BY LSI-R"
        chart={
          <FtrReferralsByLsir
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            ftrReferralsByLsir={apiData.ftr_referrals_by_lsir_by_period}
          />
        }
        footer={
          <>
            <Methodology chartId="ftrReferralsByLsir" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        chartId="ftrReferralsByGender"
        chartTitle="FTR REFERRALS BY GENDER"
        chart={
          <FtrReferralsByGender
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            ftrReferralsByGender={apiData.ftr_referrals_by_gender_by_period}
          />
        }
        footer={
          <>
            <Methodology chartId="ftrReferralsByGender" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        chartId="ftrReferralsByAge"
        chartTitle="FTR REFERRALS BY AGE"
        chart={
          <FtrReferralsByAge
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            ftrReferralsByAge={apiData.ftr_referrals_by_age_by_period}
          />
        }
        footer={
          <>
            <Methodology chartId="ftrReferralsByAge" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />
    </PageTemplate>
  );
};

export default ProgrammingExplore;
