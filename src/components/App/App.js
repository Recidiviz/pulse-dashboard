import React from 'react';

import Header from '../Header';
import Hero from '../Hero';

import './App.css';

import { Organization } from '../../constants';

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
    </div>
  );
}

export default App;
