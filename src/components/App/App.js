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

import React from 'react';

import Header from '../Header';
import Hero from '../Hero';
import Facts from '../Facts';
import Footer from '../Footer';
import Recidiviz from '../Recidiviz';

import './App.css';

import Organization from '../../config/constants';
import RecidivizList from '../../config/recidivizList';

function App() {
  return (
    <div className="app-container">
      <Header
        title={Organization.name}
        contactEmail={Organization.primaryContact}
      />
      <Hero
        title={Organization.name}
        description={Organization.description}
        contactEmail={Organization.primaryContact}
      />
      <main className="w-100 bt b--black-10 bg-white">
        <Facts />
        {RecidivizList.map(recidiviz => (
          <Recidiviz
            type={recidiviz.type}
            description={recidiviz.description}
            key={recidiviz.type}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default App;
