/*
 * Recidiviz - a platform for tracking granular criminal justice metrics in real time
 * Copyright (C) 2018 Recidiviz, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ============================================================================
*/

const RecidivizList = [
  {
    type: 'slider',
    description: [
      'The chart below provides an introduction to the recidivism problem, with data from the <a href="https://www.bjs.gov/index.cfm?ty=pbdetail&iid=4986">United States Bureau of Justice Statistics</a>, which determined recidivism rates among inmates released from prisons across 30 states over 5 years, starting in 2005. Ideally, we\'d be able to do this calculation in real-time, in order to track progress: for example, how do recidivism rates compare to what they were, say, a decade ago? We don\'t know.',
      'Here, a recidivist is someone who has been arrested for a new crime after returning to their community. But different states, counties, and academics tend to measure recidivism differently, which makes it difficult to compare how programs are performing, what\'s working, and what isn\'t.',
    ],
  },
  {
    type: 'form',
    description: [
      'The next chart uses the same dataset, but this time dives a bit deeper, exploring how a prisoner\'s age, race, gender, and crime impact their likelihood of winding up back in prison. Try entering your own age, race, and gender.',
      'Collecting this data on an ongoing basis (rather than taking a snapshot from 2005) would allow us to design more effective programs for reducing recidivism and track their effectiveness over time.',
    ],
  },
  {
    type: 'table',
    description: [
      'The third chart is based on fake data because, as far as we know, this dataset doesn\'t exist. If we could compare prisons by recidivism rates — rather than by price per prisoner, for example — we could get a much clearer picture of what programs were working, share best practices, and reduce recidivism rates across the board.',
      'Today, it\'s virtually impossible to do this kind of comparison. Prisons themselves often don’t even know their recidivism rates, how they’re changing over time, how their programs are working for some inmates versus others, or how they might improve their programs to deliver better outcomes for all.',
    ],
  },
];

export default RecidivizList;
