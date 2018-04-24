import React from 'react';

import Header from '../Header';
import Hero from '../Hero';
import Facts from '../Facts';

import './App.css';

import { Organization, RECIDIVIZ_FACTS } from '../../constants';

function App() {
  return (
    <div>
      <Header
        title={Organization.NAME}
        contactEmail={Organization.PRIMARY_CONTACT}
      />
      <Hero
        title={Organization.NAME}
        description={Organization.DESCRIPTION}
      />
      <Facts data={RECIDIVIZ_FACTS} />
    </div>
  );
}

export default App;
