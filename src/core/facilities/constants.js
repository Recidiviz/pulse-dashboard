export const importantNotes = [
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
    header: "LOCATION FILTER",
    body: `Selecting a location filters charts to only show data from individuals living in that
      county or set of counties currently or prior to incarceration. Specifically, the county of
      residence is determined by an individual's most recent home address. If the most recent
      address is that of a ND DOCR facility or parole and probation office, the last known
      non-incarcerated address is used. Of note: just over 40% of people are missing location data.
      For approximately 28% of people, this is because there is no known non-incarcerated address.
      For approximately 13% of people, this is because the last known non-incarcerated address is
      outside of North Dakota.`,
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

export const availableDistricts = [
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
];

export const metrics = {
  district: ["all"],
  metricPeriodMonths: "36",
  supervisionType: "all",
};
