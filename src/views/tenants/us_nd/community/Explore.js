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
import AdmissionCountsByType from "../../../../components/charts/common/AdmissionCountsByType";
import CaseTerminationsByOfficer from "../../../../components/charts/community/CaseTerminationsByOfficer";
import CaseTerminationsByTerminationType from "../../../../components/charts/community/CaseTerminationsByTerminationType";
import LsirScoreChangeSnapshot from "../../../../components/charts/community/LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "../../../../components/charts/community/RevocationAdmissionsSnapshot";
import RevocationCountByOfficer from "../../../../components/charts/community/RevocationCountByOfficer";
import RevocationCountOverTime from "../../../../components/charts/community/RevocationCountOverTime";
import RevocationCountBySupervisionType from "../../../../components/charts/community/RevocationCountBySupervisionType";
import RevocationCountByViolationType from "../../../../components/charts/community/RevocationCountByViolationType";
import RevocationProportionByRace from "../../../../components/charts/community/RevocationProportionByRace";
import SupervisionSuccessSnapshot from "../../../../components/charts/community/SupervisionSuccessSnapshot";
import ToggleBar from "../../../../components/toggles/ToggleBar";
import {
  defaultDistrict,
  defaultMetricPeriod,
  defaultMetricType,
  defaultSupervisionType,
} from "../../../../components/toggles/options";
// eslint-disable-next-line import/no-cycle
import useChartData from "../../../../hooks/useChartData";

const importantNotes = [
  {
    header: "PERSON-BASED COUNTING",
    body: `Unless noted otherwise, counts in this dashboard are based on people: the number of
      people admitted to prison because of a revocation, the number of people an officer was
      supervising who had a revocation resulting in a return to prison, and so on.`,
  },
  {
    header: "REVOCATIONS TO DOCR FACILITY",
    body: `As noted in chart titles and unless noted otherwise, this data focuses on revocation
      admissions: revocations resulting in incarceration at a DOCR facility. Revocations resulting
      in continuation of supervision, a county jail sentence, or termination of supervision are not
      considered. In addition, revocations are counted only when an individual’s admittance to a
      facility is documented in Elite as a revocation. Individuals who have their supervision
      terminated due to revocation (resulting in incarceration) but are admitted back into the
      system with the code "new admission" are not included in revocation counts.

      However, in case termination charts, all cases terminated via revocation as noted in Docstars
      are included whether or not they result in incarceration.`,
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

const CommunityExplore = () => {
  const { apiData, isLoading } = useChartData("us_nd/community/explore");
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
        key="revocationCountsByMonth"
        chartId="revocationCountsByMonth"
        chartTitle="REVOCATION ADMISSIONS BY MONTH"
        chart={
          <RevocationCountOverTime
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            geoView={false}
            disableGoal
            officeData={apiData.site_offices}
            revocationCountsByMonth={apiData.revocations_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationCountsByMonth"
            chartTitle="REVOCATION ADMISSIONS BY MONTH"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            officeData={apiData.site_offices}
            dataPointsByOffice={apiData.revocations_by_period}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
          />
        }
        footer={<Methodology chartId="revocationCountsByMonth" />}
      />

      <ChartCard
        key="revocationsByOfficer"
        chartId="revocationsByOfficer"
        chartTitle={
          <>
            REVOCATION ADMISSIONS BY OFFICER
            {district[0] === "all" && (
              <WarningIcon
                tooltipText="Exporting this chart as an image will not include officer IDs unless a specific P&P office is selected from the explore bar."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <RevocationCountByOfficer
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationCountsByOfficer={apiData.revocations_by_officer_by_period}
            officeData={apiData.site_offices}
          />
        }
        footer={
          <>
            <Methodology chartId="revocationsByOfficer" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />
      <ChartCard
        key="revocationAdmissionsSnapshot"
        chartId="revocationAdmissionsSnapshot"
        chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
        chart={
          <RevocationAdmissionsSnapshot
            stateCode="US_ND"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            disableGoal
            revocationAdmissionsByMonth={apiData.admissions_by_type_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="revocationAdmissionsSnapshot"
            chartTitle="PRISON ADMISSIONS DUE TO REVOCATION"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
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
        footer={<Methodology chartId="revocationAdmissionsSnapshot" />}
      />

      <ChartCard
        key="admissionCountsByType"
        chartId="admissionCountsByType"
        chartTitle={
          <>
            ADMISSIONS BY TYPE
            {(supervisionType !== "all" || district[0] !== "all") &&
              metricType === "rates" && (
                <WarningIcon
                  tooltipText="This graph is showing both non-revocation and revocation admissions to prison. We cannot show percentages of admissions from a specific supervision type or office because those filters can’t be applied to non-revocation admissions to prison."
                  className="pL-10 toggle-alert"
                />
              )}
          </>
        }
        chart={
          <AdmissionCountsByType
            metricType={metricType}
            supervisionType={supervisionType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
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
        key="revocationsBySupervisionType"
        chartId="revocationsBySupervisionType"
        chartTitle={
          <>
            REVOCATION ADMISSIONS BY SUPERVISION TYPE
            {supervisionType !== "all" && (
              <WarningIcon
                tooltipText="This graph is showing all individuals on supervision. It doesn’t support showing only individuals on probation or only individuals on parole."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <RevocationCountBySupervisionType
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            district={district}
            revocationCountsByMonthBySupervisionType={
              apiData.revocations_by_supervision_type_by_month
            }
          />
        }
        footer={<Methodology chartId="revocationsBySupervisionType" />}
      />

      <ChartCard
        chartId="revocationsByViolationType"
        chartTitle="REVOCATION ADMISSIONS BY VIOLATION TYPE"
        chart={
          <RevocationCountByViolationType
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationCountsByMonthByViolationType={
              apiData.revocations_by_violation_type_by_month
            }
          />
        }
        footer={<Methodology chartId="revocationsByViolationType" />}
      />

      <ChartCard
        key="revocationsByRace"
        chartId="revocationsByRace"
        chartTitle="REVOCATION ADMISSIONS BY RACE"
        chart={
          <RevocationProportionByRace
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            revocationProportionByRace={
              apiData.revocations_by_race_and_ethnicity_by_period
            }
            statePopulationByRace={apiData.race_proportions}
          />
        }
        footer={
          <>
            <Methodology chartId="revocationsByRace" />
            <PeriodLabel metricPeriodMonths={metricPeriodMonths} />
          </>
        }
      />

      <ChartCard
        key="supervisionSuccessSnapshot"
        chartId="supervisionSuccessSnapshot"
        chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
        chart={
          <SupervisionSuccessSnapshot
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            disableGoal
            stateCode="US_ND"
            supervisionSuccessRates={
              apiData.supervision_termination_by_type_by_month
            }
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="supervisionSuccessSnapshot"
            chartTitle="SUCCESSFUL COMPLETION OF SUPERVISION"
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
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
        key="caseTerminationsByTerminationType"
        chartId="caseTerminationsByTerminationType"
        chartTitle="CASE TERMINATIONS BY TERMINATION TYPE"
        chart={
          <CaseTerminationsByTerminationType
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            caseTerminationCountsByMonthByTerminationType={
              apiData.case_terminations_by_type_by_month
            }
          />
        }
        footer={<Methodology chartId="caseTerminationsByTerminationType" />}
      />

      <ChartCard
        key="caseTerminationsByOfficer"
        chartId="caseTerminationsByOfficer"
        chartTitle={
          <>
            CASE TERMINATIONS BY OFFICER
            {district[0] === "all" && (
              <WarningIcon
                tooltipText="Exporting this chart as an image will not include officer IDs unless a specific P&P office is selected from the explore bar."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <CaseTerminationsByOfficer
            metricType={metricType}
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            terminationCountsByOfficer={
              apiData.case_terminations_by_type_by_officer_by_period
            }
            officeData={apiData.site_offices}
          />
        }
        footer={<Methodology chartId="caseTerminationsByOfficer" />}
      />

      <ChartCard
        key="lsirScoreChangeSnapshot"
        chartId="lsirScoreChangeSnapshot"
        chartTitle={
          <>
            LSI-R SCORE CHANGES (AVERAGE)
            {metricType !== "counts" && (
              <WarningIcon
                tooltipText="This graph is showing average LSI-R score change. It does not support showing this metric as a rate."
                className="pL-10 toggle-alert"
              />
            )}
          </>
        }
        chart={
          <LsirScoreChangeSnapshot
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            district={district}
            disableGoal
            lsirScoreChangeByMonth={apiData.average_change_lsir_score_by_month}
          />
        }
        geoChart={
          <GeoViewTimeChart
            chartId="lsirScoreChangeSnapshot"
            chartTitle="LSI-R SCORE CHANGES (AVERAGE)"
            metricType="counts"
            metricPeriodMonths={metricPeriodMonths}
            supervisionType={supervisionType}
            keyedByOffice
            possibleNegativeValues
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
    </PageTemplate>
  );
};

export default CommunityExplore;
