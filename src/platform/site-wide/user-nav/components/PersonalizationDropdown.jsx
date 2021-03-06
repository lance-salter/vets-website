import React from 'react';
import { connect } from 'react-redux';

import { ssoe } from 'platform/user/authentication/selectors';
import { logout } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';

import { showProfile2 } from 'applications/personalization/profile-2/selectors';

const recordNavUserEvent = section => () => {
  recordEvent({ event: 'nav-user', 'nav-user-section': section });
};

const recordMyVaEvent = recordNavUserEvent('my-va');
const recordMyHealthEvent = recordNavUserEvent('my-health');
const recordProfileEvent = recordNavUserEvent('profile');
const recordAccountEvent = recordNavUserEvent('account');

export class PersonalizationDropdown extends React.Component {
  profileUrl = () => (this.props.useProfile2 ? '/profile-2' : '/profile');

  signOut = () => {
    // Prevent double clicking of "Sign Out"
    if (!this.signOutDisabled) {
      this.signOutDisabled = true;
      logout(this.props.useSSOe ? 'v1' : 'v0');
    }
  };

  render() {
    return (
      <ul>
        <li>
          <a href="/my-va/" onClick={recordMyVaEvent}>
            My VA
          </a>
        </li>
        <li>
          <a
            href="/health-care/my-health-account-validation/"
            onClick={recordMyHealthEvent}
          >
            My Health
          </a>
        </li>
        <li>
          <a href={this.profileUrl()} onClick={recordProfileEvent}>
            Profile
          </a>
        </li>
        <li>
          <a href="/account" onClick={recordAccountEvent}>
            Account
          </a>
        </li>
        <li>
          <a href="#" onClick={this.signOut}>
            Sign Out
          </a>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    useSSOe: ssoe(state),
    useProfile2: showProfile2(state),
  };
}

export default connect(mapStateToProps)(PersonalizationDropdown);
