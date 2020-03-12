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
import { Container, Row, Col } from 'reactstrap';
import Loading from '../components/Loading';
import { useAuth0 } from '../react-auth0-spa';
import { getUserStateName, isAdminUser } from '../utils/authentication/user';
import StateSelector from '../components/StateSelector';

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <main className="main-content bgc-grey-100">
      <div id="mainContent">
        <Container className="mb-5">
          <Row className="align-items-center profile-header mb-5 text-center text-md-left">
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
              />
            </Col>
            <Col md>
              <h2>{user.name}</h2>
              <p className="lead text-muted">{user.email}</p>
              <p className="lead text-muted">{getUserStateName(user)}</p>
              {isAdminUser(user) && (
              <div style={{ maxWidth: '33%' }}>
                <p className="lead text-muted">Current view state:</p>
                <StateSelector user={user} />
              </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </main>
  );
};

export default Profile;
