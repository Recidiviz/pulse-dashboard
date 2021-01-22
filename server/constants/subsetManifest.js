const SUBSET_MANIFEST = [
  [
    "violationType",
    [
      [
        "absconded",
        "all",
        "elec_monitoring",
        "escaped",
        "high_tech",
        "low_tech",
        "med_tech",
        "municipal",
        "no_violations",
        "substance_abuse",
        "technical",
      ],
      ["felony", "law", "misdemeanor"],
    ],
  ],
];

const FILES_WITH_SUBSETS = [
  "revocations_matrix_distribution_by_district",
  "revocations_matrix_distribution_by_gender",
  "revocations_matrix_distribution_by_officer",
  "revocations_matrix_distribution_by_race",
  "revocations_matrix_distribution_by_risk_level",
  "revocations_matrix_distribution_by_violation",
];

module.exports = {
  SUBSET_MANIFEST,
  FILES_WITH_SUBSETS,
};
