import {
  ADMISSION_TYPE,
  CHARGE_CATEGORY,
  DISTRICT,
  METRIC_PERIOD_MONTHS,
  REPORTED_VIOLATIONS,
  SUPERVISION_LEVEL,
  SUPERVISION_TYPE,
  VIOLATION_TYPE,
  LEVEL_1_SUPERVISION_LOCATION,
  LEVEL_2_SUPERVISION_LOCATION,
} from "../../../../constants/filterTypes";

export default {
  TEST_STATE: {
    [METRIC_PERIOD_MONTHS]: {
      options: Array.from({ length: 5 }).map((_, i) => ({
        label: `${METRIC_PERIOD_MONTHS}-${i}-label`,
        value: `${METRIC_PERIOD_MONTHS}-${i}`,
      })),
      defaultOption: {
        label: `${METRIC_PERIOD_MONTHS}-0-label`,
        value: `${METRIC_PERIOD_MONTHS}-0`,
      },
      defaultValue: `${METRIC_PERIOD_MONTHS}-0`,
    },
    [CHARGE_CATEGORY]: {
      options: Array.from({ length: 2 }).map((_, i) => ({
        label: `${CHARGE_CATEGORY}-${i}-label`,
        value: `${CHARGE_CATEGORY}-${i}`,
      })),
      defaultOption: {
        label: `${CHARGE_CATEGORY}-0-label`,
        value: `${CHARGE_CATEGORY}-0`,
      },
      defaultValue: `${CHARGE_CATEGORY}-0`,
    },
    [REPORTED_VIOLATIONS]: {
      options: Array.from({ length: 3 }).map((_, i) => ({
        label: `${REPORTED_VIOLATIONS}-${i}-label`,
        value: `${REPORTED_VIOLATIONS}-${i}`,
      })),
      defaultOption: {
        label: `${REPORTED_VIOLATIONS}-0-label`,
        value: `${REPORTED_VIOLATIONS}-0`,
      },
      defaultValue: `${REPORTED_VIOLATIONS}-0`,
    },
    [VIOLATION_TYPE]: {
      options: Array.from({ length: 7 }).map((_, i) => ({
        key: `${VIOLATION_TYPE}-${i}-key`,
        label: `${VIOLATION_TYPE}-${i}-label`,
        type: `${VIOLATION_TYPE}-${i}-type`,
      })),
      defaultOption: {
        label: `${VIOLATION_TYPE}-0-label`,
        value: `${VIOLATION_TYPE}-0`,
      },
      defaultValue: `${VIOLATION_TYPE}-0`,
    },
    [SUPERVISION_TYPE]: {
      options: Array.from({ length: 4 }).map((_, i) => ({
        label: `${SUPERVISION_TYPE}-${i}-label`,
        value: `${SUPERVISION_TYPE}-${i}`,
      })),
      defaultOption: {
        label: `${SUPERVISION_TYPE}-0-label`,
        value: `${SUPERVISION_TYPE}-0`,
      },
      defaultValue: `${SUPERVISION_TYPE}-0`,
      componentEnabled: true,
    },
    [SUPERVISION_LEVEL]: {
      options: Array.from({ length: 4 }).map((_, i) => ({
        label: `${SUPERVISION_LEVEL}-${i}-label`,
        value: `${SUPERVISION_LEVEL}-${i}`,
      })),
      defaultOption: {
        label: `${SUPERVISION_LEVEL}-0-label`,
        value: `${SUPERVISION_LEVEL}-0`,
      },
      defaultValue: `${SUPERVISION_LEVEL}-0`,
      componentEnabled: true,
    },
    [ADMISSION_TYPE]: {
      options: Array.from({ length: 3 }).map((_, i) => ({
        label: `${ADMISSION_TYPE}-${i}-label`,
        value: `${ADMISSION_TYPE}-${i}`,
      })),
      defaultOption: {
        label: `${ADMISSION_TYPE}-0-label`,
        value: `${ADMISSION_TYPE}-0`,
      },
      defaultValue: [`${ADMISSION_TYPE}-0`],
      filterEnabled: true,
      componentEnabled: true,
    },
    [DISTRICT]: {
      options: Array.from({ length: 1 }).map((_, i) => ({
        label: `${DISTRICT}-${i}-label`,
        value: `${DISTRICT}-${i}`,
      })),
      defaultOption: {
        label: `${DISTRICT}-0-label`,
        value: `${DISTRICT}-0`,
      },
      defaultValue: `${DISTRICT}-0`,
    },
    [LEVEL_1_SUPERVISION_LOCATION]: { defaultValue: "All" },
    [LEVEL_2_SUPERVISION_LOCATION]: { defaultValue: "All" },
  },
};
