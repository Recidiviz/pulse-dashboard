import React from 'react';

import Header from '../Header';
import Hero from '../Hero';
import Facts from '../Facts';
import RecidivizIntro from '../Recidiviz/RecidivizIntro';

import './App.css';

import { Organization, RECIDIVIZ_FACTS } from '../../config/constants';
import RecidivizList from '../../config/recidivizList';

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
      {/* TODO: This will be wrapped in a Recidiviz component in next PR */}
      {RecidivizList.map(recidiviz =>
        <RecidivizIntro description={recidiviz.description} key={recidiviz.type} />)}
    </div>
  );
}

export default App;
