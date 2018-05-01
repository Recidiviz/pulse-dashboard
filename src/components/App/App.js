import React from 'react';

import Header from '../Header';
import Hero from '../Hero';
import Facts from '../Facts';
import Footer from '../Footer';
import Recidiviz from '../Recidiviz';

import './App.css';

import { Organization, RECIDIVIZ_FACTS } from '../../config/constants';
import RecidivizList from '../../config/recidivizList';

function App() {
  return (
    <div className="app-container">
      <Header
        title={Organization.NAME}
        contactEmail={Organization.PRIMARY_CONTACT}
      />
      <Hero
        title={Organization.NAME}
        description={Organization.DESCRIPTION}
      />
      <main className="w-100 bt b--black-10 bg-white">
        <Facts data={RECIDIVIZ_FACTS} />
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
