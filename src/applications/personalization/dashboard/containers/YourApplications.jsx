import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectProfile } from 'platform/user/selectors';
import {
  getDismissedHCANotification,
  getEnrollmentStatus,
  setDismissedHCANotification,
} from 'applications/hca/actions';
import {
  dismissedHCANotificationDate,
  isEnrollmentStatusLoading,
  isInESR,
  isLoadingDismissedNotification,
  selectEnrollmentStatus,
} from 'applications/hca/selectors';
import {
  getAlertContent,
  getAlertStatusHeadline,
  getAlertStatusInfo,
  getAlertType,
} from 'applications/hca/enrollment-status-helpers';

import DashboardAlert from '../components/DashboardAlert';
import FormItem from '../components/FormItem';
import { isSIPEnabledForm } from '../helpers';

class YourApplications extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentStatus();
    this.props.getDismissedHCANotification();
  }

  dismissHCANotification() {
    const {
      enrollmentStatus,
      enrollmentStatusEffectiveDate,
    } = this.props.hcaEnrollmentStatus;
    this.props.setDismissedHCANotification(
      enrollmentStatus,
      enrollmentStatusEffectiveDate,
    );
  }

  renderHCAStatusAlert({ applicationDate, enrollmentStatus }) {
    return (
      <DashboardAlert
        status={getAlertType(enrollmentStatus)}
        headline="Application for health care"
        subheadline="FORM 10-10EZ"
        statusHeadline={getAlertStatusHeadline(enrollmentStatus)}
        statusInfo={getAlertStatusInfo(enrollmentStatus)}
        content={getAlertContent(enrollmentStatus, applicationDate, () => {
          this.dismissHCANotification();
        })}
      />
    );
  }

  render() {
    const {
      hcaEnrollmentStatus,
      savedForms,
      shouldRenderContent,
      shouldRenderHCAAlert,
    } = this.props;

    if (!shouldRenderContent) return null;

    return (
      <div className="profile-section medium-12 columns">
        <h2 className="section-header">Your applications</h2>
        {savedForms.map(form => (
          <FormItem key={form.form} savedFormData={form} />
        ))}
        {shouldRenderHCAAlert && this.renderHCAStatusAlert(hcaEnrollmentStatus)}
      </div>
    );
  }
}

export const mapStateToProps = state => {
  const hcaEnrollmentStatus = selectEnrollmentStatus(state);
  const isLoading =
    isEnrollmentStatusLoading(state) || isLoadingDismissedNotification(state);
  const profileState = selectProfile(state);
  const { savedForms } = profileState;
  const verifiedSavedForms = savedForms.filter(isSIPEnabledForm);
  const hasVerifiedSavedForms = !!verifiedSavedForms.length;
  const hcaStatusEffectiveDate =
    hcaEnrollmentStatus.enrollmentStatusEffectiveDate;
  const dismissedNotificationDate = dismissedHCANotificationDate(state);
  const shouldRenderHCAAlert =
    isInESR(state) &&
    (!dismissedNotificationDate ||
      new Date(hcaStatusEffectiveDate) > new Date(dismissedNotificationDate));
  const shouldRenderContent =
    !isLoading && (hasVerifiedSavedForms || shouldRenderHCAAlert);

  return {
    hcaEnrollmentStatus,
    savedForms: verifiedSavedForms,
    shouldRenderContent,
    shouldRenderHCAAlert,
  };
};

YourApplications.propTypes = {
  getDismissedHCANotification: PropTypes.func.isRequired,
  getEnrollmentStatus: PropTypes.func.isRequired,
  setDismissedHCANotification: PropTypes.func.isRequired,
  hcaEnrollmentStatus: PropTypes.shape({
    enrollmentStatus: PropTypes.string,
    applicationDate: PropTypes.string,
  }),
  savedForms: PropTypes.arrayOf(
    PropTypes.shape({
      form: PropTypes.string.required,
      metadata: PropTypes.shape({
        lastUpdated: PropTypes.string,
        expiresAt: PropTypes.string,
      }),
    }),
  ),
  shouldRenderContent: PropTypes.bool.isRequired,
  shouldRenderHCAAlert: PropTypes.bool,
};

const mapDispatchToProps = {
  getDismissedHCANotification,
  getEnrollmentStatus,
  setDismissedHCANotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YourApplications);

export { YourApplications };