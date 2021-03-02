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
import ChartCard from "../../../../core/ChartCard";
import GeoViewTimeChart from "../../../../core/GeoViewTimeChart";
import Methodology from "../../../../core/Methodology";
import PeriodLabel from "../../../../core/PeriodLabel";
import FtrReferralsByAge from "../../../../core/programming/FtrReferralsByAge";
import FtrReferralsByGender from "../../../../core/programming/FtrReferralsByGender";
import FtrReferralsByLsir from "../../../../core/programming/FtrReferralsByLsir";
import FtrReferralsByParticipationStatus from "../../../../core/programming/FtrReferralsByParticipationStatus";
import FtrReferralsByRace from "../../../../core/programming/FtrReferralsByRace";
import FtrReferralCountByMonth from "../../../../core/programming/FtrReferralCountByMonth";
import ToggleBar from "../../../../components/toggles/ToggleBar";
import {
  defaultDistrict,
  defaultMetricPeriod,
  defaultMetricType,
  defaultSupervisionType,
} from "../../../../components/toggles/options";
import useChartData from "../../../../hooks/useChartData";
import { availableDistricts, importantNotes } from "./constants";

const ProgrammingExplore = () => {
  const { apiData, isLoading } = useChartData("us_nd/programming/explore");
  const [metricType, setMetricType] = useState(defaultMetricType);
  const [metricPeriodMonths, setMetricPeriodMonths] = useState(
    defaultMetricPeriod
  );
  const [supervisionType, setSupervisionType] = useState(
    defaultSupervisionType
  );
  const [district, setDistrict] = useState(defaultDistrict);

  if (isLoading) {
    return <Loading />;
  }

  const toggleBar = (
    <ToggleBar
      metricPeriodMonths={metricPeriodMonths}
      district={district}
      supervisionType={supervisionType}
      setChartMetricType={setMetricType}
      setChartMetricPeriodMonths={setMetricPeriodMonths}
      setChartSupervisionType={setSupervisionType}
      setChartDistrict={setDistrict}
      districtOffices={apiData.site_offices.data}
      availableDistricts={availableDistricts}
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
            ftrReferralCountByMonth={apiData.ftr_referrals_by_month.data}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={apiData.ftr_referrals_by_period.data}
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
              apiData.ftr_referrals_by_participation_status.data
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
              apiData.ftr_referrals_by_race_and_ethnicity_by_period.data
            }
            statePopulationByRace={apiData.race_proportions.data}
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
            ftrReferralsByLsir={apiData.ftr_referrals_by_lsir_by_period.data}
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
            ftrReferralsByGender={
              apiData.ftr_referrals_by_gender_by_period.data
            }
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
            ftrReferralsByAge={apiData.ftr_referrals_by_age_by_period.data}
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
