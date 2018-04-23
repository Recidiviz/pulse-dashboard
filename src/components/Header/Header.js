import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string.isRequired,
  contactEmail: PropTypes.string.isRequired,
};

function Header(props) {
  return (
    <header className="w-100 pa3 ph5-ns bg-white">
      <div className="db dt-ns mw9 center w-100">
        <div className="db dtc-ns v-mid tl w-50">
          <a className="dib f5 f4-ns fw6 mt0 mb1 link black-70" href="/" title="Home">{props.title}</a>
        </div>
        <nav className="db dtc-ns v-mid w-100 tl tr-ns mt2 mt0-ns">
          <i className="f6 fw6 link black-70 mr2 mr3-m mr4-l dib">In progress. Reach us with questions at <a href={`mailto:${props.contactEmail}`}>{props.contactEmail}</a>.</i>
        </nav>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;

export default Header;
