import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import AppointmentDate from '../../components/review/AppointmentDate';
import ReviewDirectScheduleInfo from '../../components/review/ReviewDirectScheduleInfo';
import ReasonForAppointmentSection from '../../components/review/ReasonForAppointmentSection';
import ContactDetailSection from '../../components/review/ContactDetailSection';

const defaultData = {
  reasonForAppointment: 'routine-follow-up',
  reasonAdditionalInfo: 'additional information',
  calendarData: {
    selectedDates: [{ datetime: '2019-12-20T10:00:00' }],
  },
  vaParent: '983',
  vaFacility: '983GB',
  typeOfCareId: '323',
};

const facility = {
  institutionCode: '983GB',
  name: 'CHYSHR-Sidney VA Clinic',
  city: 'Sidney',
  stateAbbrev: 'NE',
  authoritativeName: 'CHYSHR-Sidney VA Clinic',
  rootStationCode: '983',
  adminParent: false,
  parentStationCode: '983',
  institutionTimezone: 'America/Denver',
};

const clinic = {
  clinicFriendlyLocationName: '',
};

const pageTitle = 'Review your appointment details';

describe('VAOS <ReviewDirectScheduleInfo>', () => {
  describe('Direct Schedule', () => {
    const data = { ...defaultData };
    let tree;

    beforeEach(() => {
      tree = mount(
        <ReviewDirectScheduleInfo
          data={data}
          facility={facility}
          clinic={clinic}
          pageTitle={pageTitle}
        />,
      );
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should display appointment date', () => {
      expect(
        tree
          .find(AppointmentDate)
          .find('h3')
          .text(),
      ).to.equal('Friday, December 20, 2019 at 10:00 a.m. MT');
    });

    it('should render type of care section', () => {
      expect(
        tree
          .find('h2')
          .at(1)
          .text(),
      ).to.equal('Primary care');
    });

    it('should render reason for appointment section', () => {
      expect(tree.find(ReasonForAppointmentSection)).to.have.lengthOf(1);
    });

    it('should render reason for appointment section additional information', () => {
      expect(
        tree
          .find(ReasonForAppointmentSection)
          .find('span')
          .text(),
      ).to.equal('additional information');
    });

    it('should render contact details section', () => {
      expect(tree.find(ContactDetailSection)).to.have.lengthOf(1);
    });

    it('should render page heading', () => {
      expect(tree.find('h1').text()).to.equal(pageTitle);
    });
  });

  describe('Accessibility', () => {
    const data = {
      ...defaultData,
    };
    let tree;

    beforeEach(() => {
      tree = mount(
        <ReviewDirectScheduleInfo
          data={data}
          facility={facility}
          clinic={clinic}
        />,
      );
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should have aria labels for edit purpose of appointment', () => {
      expect(
        tree.find('a[aria-label="Edit purpose of appointment"]'),
      ).to.have.lengthOf(1);
    });

    it('should have aria labels for edit call back time', () => {
      expect(tree.find('a[aria-label="Edit call back time"]')).to.have.lengthOf(
        1,
      );
    });

    it('should have aria labels for HR to hide from screen reader', () => {
      expect(tree.find('hr[aria-hidden="true"]').exists()).to.be.true;
    });
  });
});
