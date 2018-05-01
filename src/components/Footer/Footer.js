import React from 'react';

import { Organization } from '../../config/constants';

function Footer() {
  return (
    <footer className="bg-white ph4 pv4 bt b--black-10">
      <p className="f6 f5-ns lh-copy text-our-gray">
        For feedback or questions, reach out to us at <a href="mailto:{Organization.PRIMARY_CONTACT}?Subject=Recidiviz%20Feedback">{Organization.PRIMARY_CONTACT}</a>
      </p>
    </footer>
  );
}

export default Footer;
