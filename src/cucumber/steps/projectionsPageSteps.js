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

import { Then, When } from "@cucumber/cucumber";

import projectionsPage from "../pages/projectionsPage";

When("I'm on the {string} view", (view) => {
  projectionsPage.selectView(view);
});

Then("I should see the projections chart for {string}", (view) => {
  const header = projectionsPage.projectionsChartHeader.getText();
  if (view === "facilities") {
    expect(header).toContain("Total Incarcerated Population");
  }
  if (view === "community") {
    expect(header).toContain("Total Supervised Population");
  }
});
