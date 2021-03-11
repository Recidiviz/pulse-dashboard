export const importantNotes = [
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
    header: "OFFICE FILTER",
    body: `Selecting an office or set of offices filters charts to only show data from people
      being supervised out of those office(s).`,
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
];

export const metrics = {
  district: ["all"],
  metricPeriodMonths: "36",
  supervisionType: "all",
};

export const mockCardContent = [
  {
    title: "Overall",
    percent: 79,
    status: "NEEDS_IMPROVEMENT",
    id: 1,
  },
  {
    title: "Program availability",
    percent: 56,
    status: "POOR",
    id: 2,
  },
  {
    title: "Timely contacts",
    percent: 100,
    status: "GREAT",
    id: 3,
  },
  {
    title: "Timely risk assessments",
    percent: 95,
    status: "GREAT",
    id: 4,
  },
  {
    title: "Timely discharge",
    percent: 79,
    status: "GOOD",
    id: 5,
  },
];
