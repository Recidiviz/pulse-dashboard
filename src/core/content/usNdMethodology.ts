import { ViewMethodology } from "../models/types";

export const US_ND: ViewMethodology = {
  vitals: {
    title: "At A Glance",
    description: `The "At A Glance" page provides a snapshot of agency \
    performance on a set of key metrics to proactively identify potential \
    resource constraints and focus attention on operational successes and \
    areas for improvement.`,
    content: [
      {
        heading: "Percentage Calculations",
        content: `\
        <p class="Methodology__block--content">\
        The numerator for each percentage calculation is the number of people \
        who meet following criteria on a given day:</p>\
        <ul class="Methodology__block--content">
          <li><b>Overall:</b> The sum of all the counts below.</li>
          <li><b>Timely discharge:</b> Number of people on supervision who are \
          not past their projected supervision completion date.
          </li>
          <li><b>Timely FTR enrollment:</b> Number of people on supervision \
          who do not have a Pending FTR participation status.
          </li>
          <li><b>Timely contacts:</b> The sum of all the counts below. \
            <ul class="Methodology__block--content">
            <li>Number of people on Minimum Supervision who have had a \
            face-to-face contact within the last 90 days and a home visit \
            within 90 days of their supervision start.</li>
            <li>Number of people on Medium Supervision who have had a \
            face-to-face contact within the last 60 days, a home visit within \
            90 days of their supervision start, and a home visit within the \
            last 365 days.</li>
            <li>Number of people on Maximum Supervision who have had a \
            face-to-face contact within the last 30 days, a home visit within \
            90 days of their supervision start, and a home visit within the \
            last 365 days.</li>
            </ul>
          </li>
          <li><b>Timely risk assessments:</b> Number of people on supervision \
          who have had a risk assessment completed within the last 212 days, or\
           had an assessment within the first 30 days of supervision, if they have been on supervision for fewer than 212 days.
          </li>
        </ul>\
        <p class="Methodology__block--content">\
        The denominator of each rate calculation is all people on supervision \
        in a given day for a given region. For example, the denominators of \
        the percentages for Oakes Office represent the total number of people \
        on supervision in Oakes.</p>`,
      },
      {
        heading: "Over-time Calculations",
        content: `\
        <ul class="Methodology__block--content">
          <li><b>"Current Performance"</b> takes the numerator and denominator \
          for the "Data last updated" date. For example, if the data was last \
          updated on 3/31/21, the timely discharge performance would be \
          represented by the total number of people with a projected \
          supervision completion date before 3/31/21 divided by the total \
          number of people on supervision on 3/31/21. </li>
          <li><b>Rolling 7-day average:</b> Number of people on supervision who are \
          not past their projected supervision completion date.
          </li>
          <li><b>Over-time chart:</b> The bars represent the \
          "Current Performance" as of a given day, and the trendline on a \
          given day represents the rolling 7-day average.
          </li>
          <li><b>7D change:</b> This percentage displays the difference \
          between the rolling 7-day average on the "Data last updated" date \
          and the rolling 7-day average of 7 days prior to the \
          "Data last updated" date.
          </li>
          <li><b>28D change:</b>This percentage displays the difference \
          between the rolling 7-day average on the "Data last updated" date \
          and the rolling 7-day average of 7 days prior to the \
          "Data last updated" date.
          </li>
        </ul>`,
      },
    ],
  },
};
