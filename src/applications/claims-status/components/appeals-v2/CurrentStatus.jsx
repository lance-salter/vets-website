import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description, isClosed }) => (
  <div className={`current-status ${isClosed ? 'closed' : ''}`}>
    <h2>Current status</h2>
    <div className="current-status-content">
      <h3>{title}</h3>
      <div>{description}</div>
    </div>
    {!isClosed && <div className="down-arrow" />}
  </div>
);

CurrentStatus.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.element.isRequired,
  isClosed: PropTypes.bool,
};

export default CurrentStatus;
