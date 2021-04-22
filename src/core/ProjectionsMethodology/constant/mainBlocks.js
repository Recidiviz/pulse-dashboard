export const mainBlocks = [
  {
    label: "Input Data and Data Processing",
    text: `The input data is collected from a standardized direct ingest feed from the Idaho Department of Corrections (IDOC). This data represents information about persons (including PII) who have been involved in the criminal justice system at the state level and the records of their interactions with that system, e.g. charges, sentence terms, periods of incarceration, periods of supervision. The model uses this data on admissions, releases, and sentences as the primary input, such as yearly admissions to jail and prison and the accompanying sentence lengths. The model can adapt to the granularity of the data: yearly, monthly, etc. The model is designed to simulate groups that are treated differently in the system as separate sub-simulations, such as different offense types and genders. Within each sub-simulation, additional disaggregations are handled such as legal statuses (i.e. rider, termers, parole violators). The output of the model is disaggregated to the same level as the input, so more granular input data can provide a more holistic projection for different groups. For instance, if the input data is disaggregated by crime code, then the projected population output would also have an estimated population total per crime code.`,
  },
  {
    label: "Model Infrastructure",
    text: `The underlying infrastructure of the model uses three core components: Cohorts, Compartments, and Compartment Transitions. These are used to simulate the movement of people through the system and count the total population at each time step. `,
    includeTable: true,
  },
  {
    label: "Initializing the Simulation",
    text: `The model requires historical data for admissions, releases or terminations, sentence lengths, and any other relevant transitions, which could include revocation data or recidivism data. If this data is disaggregated at any level, then one simulation is initialized per disaggregated group. The model also requires data for the population that is currently in the system to initialize the Compartments, including the total population, the length of time each person has been in the compartment, and their sentence information. The current population gets separate Compartment Transition tables from the incoming population in order to account for the time that has already been served. `,
  },
  {
    label: "Model Output",
    text: `The Model outputs the total population within each Compartment at each step in time, disaggregated by the same level as the input. `,
    list: [
      "[Compartment] Incarcerated (termer, rider, parole violator)",
      "[Compartment] Supervision (parole, probation)",
      "Gender (male, female)",
    ],
  },
  {
    label: "Model Validation",
    text: `The model performance was evaluated on held out datasets from 2018 and 2019. The model was built to minimize the average absolute percent difference each year between the model output and the monthly population for each breakdown (compartment and gender). This performance metric provides a rough idea for how accurate the model projection will be 1-2 years into the future, which is the primary use case for IDOC, and the goal was less than 4% error for the first projection year. The data from 2020 was excluded from the main validation because the admission and release data was quite different due to the pandemic response. However, the projection for 2021-2025 does use the 2020 data in order to incorporate those recent trends.`,
  },
];
