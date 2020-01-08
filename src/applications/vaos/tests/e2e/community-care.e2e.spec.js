const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const VAOSHelpers = require('./vaos-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = {
  '@disabled': true,
  after: (client, done) => {
    client.deleteCookies();
    client.end();
    done();
  },
  login: client => {
    const token = Auth.getUserToken();

    VAOSHelpers.initAppointmentListMock(token);

    Auth.logIn(
      token,
      client,
      '/health-care/schedule-view-va-appointments/appointments/',
      3,
    ).waitForElementVisible('#appointments-list', Timeouts.slow);
    // .axeCheck('.main');
  },
  'Select new appointment': client => {
    VAOSHelpers.newAppointmentTest(client);
  },
  'Choose the type of care you need': client => {
    client
      .click('[value="323"]')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('[value="communityCare"]', Timeouts.slow)
      .assert.containsText(
        'h1',
        'Choose where you would prefer to receive your care',
      );
  },
  'Choose where you would prefer to receive your care': client => {
    client
      .click('[value="communityCare"]')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('h1', Timeouts.slow)
      .assert.containsText(
        'h1',
        'What date and time would you like to make an appointment?',
      );
  },
  'What date and time would you like to make an appointment?': client => {
    VAOSHelpers.appointmentDateTimeTest(
      client,
      'Share your community care provider preferences',
    );
  },
  'Share your community care provider preferences': client => {
    client
      .waitForElementPresent('#root_communityCareSystemId_0', Timeouts.slow)
      .selectRadio('root_communityCareSystemId', '983')
      .selectDropdown('root_preferredLanguage', 'english')
      .selectYesNo('root_hasCommunityCareProvider', true)
      .waitForElementPresent(
        '#root_communityCareProvider_practiceName',
        Timeouts.slow,
      )
      .setValue('#root_communityCareProvider_practiceName', 'practice name')
      .setValue('#root_communityCareProvider_firstName', 'firstname')
      .setValue('#root_communityCareProvider_lastName', 'lastname')
      .setValue('#root_communityCareProvider_address_street', 'address1')
      .setValue('#root_communityCareProvider_address_street2', 'address2')
      .setValue('#root_communityCareProvider_address_city', 'city')
      .selectDropdown('root_communityCareProvider_address_state', 'IL')
      .setValue('#root_communityCareProvider_address_postalCode', '60613')
      .setValue('#root_communityCareProvider_phone', '1234567890')
      .click('.rjsf [type="submit"]')
      .waitForElementPresent('#root_reasonForAppointment_0', Timeouts.slow)
      .assert.containsText('h1', 'Reason for appointment');
  },
  'Reason for appointment': client => {
    VAOSHelpers.appointmentReasonTest(client, 'Contact information');
  },
  'Contact information': client => {
    VAOSHelpers.contactInformationTest(client);
  },
  'Review your appointment details': client => {
    VAOSHelpers.reviewAppointmentTest(client);
  },
  'Your appointment request has been submitted': client => {
    VAOSHelpers.appointmentSubmittedTest(client);
  },
};