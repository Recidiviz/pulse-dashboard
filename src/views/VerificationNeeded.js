// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React from 'react';

const VerificationNeeded = () => (
  <main className="main-content bgc-grey-100">
    <div className="pos-a t-0 l-0 bgc-white w-100 h-100 d-f fxd-r fxw-w ai-c jc-c pos-r p-30">
      <div className="d-f jc-c fxd-c">
        <h1 className="mB-30 fw-900 lh-1 recidiviz-dark-green-text" style={{ fontSize: '60px' }}>Almost there</h1>
        <h3 className="mB-10 fsz-lg c-grey-900 tt-c">Please verify your email</h3>
        <p className="mB-30 fsz-def c-grey-700">
          If you have just signed up for an account, please check your inbox for an email asking you
          to verify your email address. After you click the verification button or link in that
          email, you can reach the home page below.
        </p>
        <p className="mB-30 fsz-def c-grey-700">
          If you have reached this page by mistake, please try to log in again. If you are still
          having trouble, please reach out to <a href="mailto:web-support@recidiviz.org?Subject=Trouble%20logging%20in" target="_top">Recidiviz Support</a>.
        </p>
        <div>
          <a href="/" type="primary" className="btn btn-primary">Back to home</a>
        </div>
      </div>
    </div>
  </main>
);

export default VerificationNeeded;
