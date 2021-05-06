// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import {
  getSummaryStatus,
  getTimeSeriesDownloadableData,
  getVitalsSummaryDownloadableData,
} from "../helpers";
import { ENTITY_TYPES } from "../../models/types";

describe("getSummaryStatus", () => {
  describe("when value is less than 70", () => {
    it("returns POOR", () => {
      [0, 15, 25, 69].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("POOR");
      });
    });
  });
  describe("when value is greater than or equal to 70 and less than 80", () => {
    it("returns NEEDS_IMPROVEMENT", () => {
      [70, 75, 79].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("NEEDS_IMPROVEMENT");
      });
    });
  });
  describe("when value is greater than or equal to 80 and less than 90", () => {
    it("returns GOOD", () => {
      [80, 85, 89].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("GOOD");
      });
    });
  });
  describe("when value is greater than or equal to 90 and less than 95", () => {
    it("returns GREAT", () => {
      [90, 94].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("GREAT");
      });
    });
  });
  describe("when value is greater than 95", () => {
    it("returns EXCELLENT", () => {
      [95, 100].forEach((number) => {
        expect(getSummaryStatus(number)).toEqual("EXCELLENT");
      });
    });
  });
});

describe("getTimeSeriesDownloadableData", () => {
  const data = [
    {
      date: "2021-03-11",
      entityId: "STATE_DOC",
      metric: "OVERALL",
      value: 72.5,
      monthlyAvg: 72.8,
    },
    {
      date: "2021-03-12",
      entityId: "STATE_DOC",
      metric: "OVERALL",
      value: 75.5,
      monthlyAvg: 75.8,
    },
    {
      date: "2021-03-11",
      entityId: "STATE_DOC",
      metric: "DISCHARGE",
      value: 62.5,
      monthlyAvg: 62.8,
    },
    {
      date: "2021-03-12",
      entityId: "STATE_DOC",
      metric: "DISCHARGE",
      value: 65.5,
      monthlyAvg: 65.8,
    },
    {
      date: "2021-03-11",
      entityId: "STATE_DOC",
      metric: "FTR_ENROLLMENT",
      value: 52.5,
      monthlyAvg: 52.8,
    },
    {
      date: "2021-03-12",
      entityId: "STATE_DOC",
      metric: "FTR_ENROLLMENT",
      value: 55.5,
      monthlyAvg: 55.8,
    },
    {
      date: "2021-03-11",
      entityId: "STATE_DOC",
      metric: "CONTACT",
      value: 42.5,
      monthlyAvg: 42.8,
    },
    {
      date: "2021-03-12",
      entityId: "STATE_DOC",
      metric: "CONTACT",
      value: 45.5,
      monthlyAvg: 45.8,
    },
    {
      date: "2021-03-11",
      entityId: "STATE_DOC",
      metric: "RISK_ASSESSMENT",
      value: 32.5,
      monthlyAvg: 32.8,
    },
    {
      date: "2021-03-12",
      entityId: "STATE_DOC",
      metric: "RISK_ASSESSMENT",
      value: 35.5,
      monthlyAvg: 35.8,
    },
  ];

  it("returns the data formatted for download", () => {
    const expected = {
      chartDatasets: [
        { data: ["STATE_DOC", "STATE_DOC"], label: "Id" },
        {
          data: [
            {
              Total: "76%",
              "7D average": "76%",
            },
            {
              Total: "73%",
              "7D average": "73%",
            },
          ],
          label: "Overall",
        },
        {
          data: [
            {
              Total: "66%",
              "7D average": "66%",
            },
            {
              Total: "63%",
              "7D average": "63%",
            },
          ],
          label: "Timely discharge",
        },
        {
          data: [
            {
              Total: "56%",
              "7D average": "56%",
            },
            {
              Total: "53%",
              "7D average": "53%",
            },
          ],
          label: "Timely FTR enrollment",
        },
        {
          data: [
            {
              Total: "46%",
              "7D average": "46%",
            },
            {
              Total: "43%",
              "7D average": "43%",
            },
          ],
          label: "Timely contacts",
        },
        {
          data: [
            {
              Total: "36%",
              "7D average": "36%",
            },
            {
              Total: "33%",
              "7D average": "33%",
            },
          ],
          label: "Timely risk assessments",
        },
      ],
      chartLabels: ["2021-03-12", "2021-03-11"],
      chartId: "MetricsOverTime",
      dataExportLabel: "Date",
    };
    const result = getTimeSeriesDownloadableData(data);
    expect(result).toEqual(expected);
  });
});

describe("getVitalsSummaryDownloadableData", () => {
  const data = [
    {
      entity: {
        entityId: "OFFICE_A",
        entityName: "Office A",
        entityType: ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION,
      },
      overall: 85,
      overall30Day: 0,
      overall90Day: -2,
      parentEntityId: "STATE_DOC",
      timelyContact: 60,
      timelyDischarge: 63,
      timelyFtrEnrollment: 65,
      timelyRiskAssessment: 69,
    },
    {
      entity: {
        entityId: "OFFICE_B",
        entityName: "Office B",
        entityType: ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION,
      },
      overall: 95,
      overall30Day: 0,
      overall90Day: -2,
      parentEntityId: "STATE_DOC",
      timelyContact: 90,
      timelyDischarge: 93,
      timelyFtrEnrollment: 95,
      timelyRiskAssessment: 99,
    },
  ];

  it("returns the data formatted for download", () => {
    const expected = {
      chartDatasets: [
        {
          data: [
            {
              "28D change": "2%",
              "7D change": "0%",
              "Overall score": "85%",
              "Timely FTR enrollment": "65%",
              "Timely contacts": "60%",
              "Timely discharge": "63%",
              "Timely risk assessments": "69%",
            },
            {
              "28D change": "2%",
              "7D change": "0%",
              "Overall score": "95%",
              "Timely FTR enrollment": "95%",
              "Timely contacts": "90%",
              "Timely discharge": "93%",
              "Timely risk assessments": "99%",
            },
          ],
          label: "",
        },
      ],
      chartLabels: ["Office A", "Office B"],
      chartId: "MetricsByOffice",
      dataExportLabel: "Office",
    };

    const result = getVitalsSummaryDownloadableData(data);
    expect(result).toEqual(expected);
  });
});
