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
import PeriodLabel from "../PeriodLabel";
import WarningIcon from "../../controls/WarningIcon";
import AdmissionCountsByType from "../AdmissionCountsByType";
import CaseTerminationsByOfficer from "./CaseTerminationsByOfficer";
import CaseTerminationsByTerminationType from "./CaseTerminationsByTerminationType";
import LsirScoreChangeSnapshot from "./LsirScoreChangeSnapshot";
import RevocationAdmissionsSnapshot from "./RevocationAdmissionsSnapshot";
import RevocationCountByOfficer from "./RevocationCountByOfficer";
import RevocationCountOverTime from "./RevocationCountOverTime";
import RevocationCountBySupervisionType from "./RevocationCountBySupervisionType";
import RevocationCountByViolationType from "./RevocationCountByViolationType";
import RevocationProportionByRace from "./RevocationProportionByRace";
import SupervisionSuccessSnapshot from "./SupervisionSuccessSnapshot";
import CoreFilterBar from "../CoreFilterBar";
import {
  defaultDistrict,
  defaultMetricPeriod,
  defaultMetricType,
  defaultSupervisionType,
} from "../utils/filterOptions";
import useChartData from "../hooks/useChartData";
import { isOfficerIdsHidden } from "../bars/utils";
import { METRIC_TYPES } from "../utils/constants";
import { availableDistricts, importantNotes } from "./constants";

const CommunityExplore = () => {
  const { apiData, isLoading, getTokenSilently } = useChartData(
    "us_nd/community/explore"
  );
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

  const filters = (
    <CoreFilterBar
      metricType={metricType}
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
    <PageTemplate importantNotes={importantNotes} filters={filters}>
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
            disableGoal
            officeData={apiData.site_offices.data}
            revocationCountsByMonth={apiData.revocations_by_month.data}
            stateCode="US_ND"
            getTokenSilently={getTokenSilently}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={apiData.revocations_by_period.data}
            numeratorKeys={["revocation_count"]}
            denominatorKeys={["total_supervision_count"]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
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
            {isOfficerIdsHidden(district) && (
              <WarningIcon
                tooltipText="Exporting this chart as an image will not include officer IDs unless 3 or fewer P&P offices are selected from the explore bar."
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
            revocationCountsByOfficer={
              apiData.revocations_by_officer_by_period.data
            }
            officeData={apiData.site_offices.data}
            getTokenSilently={getTokenSilently}
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
            revocationAdmissionsByMonth={
              apiData.admissions_by_type_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={apiData.admissions_by_type_by_period.data}
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
            getTokenSilently={getTokenSilently}
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
              metricType === METRIC_TYPES.RATES && (
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
            admissionCountsByType={apiData.admissions_by_type_by_period.data}
            getTokenSilently={getTokenSilently}
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
              apiData.revocations_by_supervision_type_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
              apiData.revocations_by_violation_type_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
              apiData.revocations_by_race_and_ethnicity_by_period.data
            }
            statePopulationByRace={apiData.race_proportions.data}
            getTokenSilently={getTokenSilently}
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
              apiData.supervision_termination_by_type_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={
              apiData.supervision_termination_by_type_by_period.data
            }
            numeratorKeys={["successful_termination"]}
            denominatorKeys={[
              "revocation_termination",
              "successful_termination",
            ]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
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
              apiData.case_terminations_by_type_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
            {isOfficerIdsHidden(district) && (
              <WarningIcon
                tooltipText="Exporting this chart as an image will not include officer IDs unless 3 or fewer P&P offices are selected from the explore bar."
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
              apiData.case_terminations_by_type_by_officer_by_period.data
            }
            officeData={apiData.site_offices.data}
            getTokenSilently={getTokenSilently}
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
            {metricType === "counts" && district.length > 1 && (
              <WarningIcon
                tooltipText="Note: selecting multiple offices takes the average across offices’ LSI-R score change averages, not the average across all people in the selected offices"
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
            lsirScoreChangeByMonth={
              apiData.average_change_lsir_score_by_month.data
            }
            getTokenSilently={getTokenSilently}
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
            officeData={apiData.site_offices.data}
            dataPointsByOffice={
              apiData.average_change_lsir_score_by_period.data
            }
            numeratorKeys={["average_change"]}
            denominatorKeys={[]}
            centerLat={47.3}
            centerLong={-100.5}
            getTokenSilently={getTokenSilently}
          />
        }
        footer={<Methodology chartId="lsirScoreChangeSnapshot" />}
      />
    </PageTemplate>
  );
};

export default CommunityExplore;
