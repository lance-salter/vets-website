import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { API_ROUTES, FIELD_NAMES, PHONE_TYPE, USA } from 'vet360/constants';

import { isValidPhone } from 'platform/forms/validations';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import Vet360ProfileField from 'vet360/containers/Vet360ProfileField';

import PhoneEditModal from './PhoneEditModal';
import PhoneView from './PhoneView';

const formSchema = {
  type: 'object',
  properties: {
    'view:noInternationalNumbers': {
      type: 'object',
      properties: {},
    },
    inputPhoneNumber: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    extension: {
      type: 'string',
      pattern: '^\\s*[a-zA-Z0-9]{1,10}\\s*$',
    },
    isTextPermitted: {
      type: 'boolean',
    },
  },
  required: ['inputPhoneNumber'],
};

const uiSchema = {
  'view:noInternationalNumbers': {
    'ui:description': () => (
      <AlertBox isVisible status="info" className="vads-u-margin-bottom--3">
        <p>
          We can only support U.S. phone numbers right now. If you have an
          international number, please check back later.
        </p>
      </AlertBox>
    ),
  },
  inputPhoneNumber: {
    'ui:widget': PhoneNumberWidget,
    'ui:options': {
      inputType: 'tel',
    },
    'ui:title': 'Number',
    'ui:errorMessages': {
      pattern: 'Please enter a valid phone number.',
    },
  },
  extension: {
    'ui:title': 'Extension',
    'ui:errorMessages': {
      pattern: 'Please enter a valid extension.',
    },
  },
  isTextPermitted: {
    'ui:title':
      'Send me text message (SMS) reminders for my VA health care appointments',
    'ui:options': {
      hideIf: formData => !formData['view:showSMSCheckbox'],
    },
  },
};

export default class PhoneField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([
      FIELD_NAMES.HOME_PHONE,
      FIELD_NAMES.MOBILE_PHONE,
      FIELD_NAMES.TEMP_PHONE,
      FIELD_NAMES.WORK_PHONE,
      FIELD_NAMES.FAX_NUMBER,
    ]).isRequired,
  };

  convertNextValueToCleanData(value) {
    const {
      id,
      countryCode,
      extension,
      phoneType,
      inputPhoneNumber,
      isTextable,
      isTextPermitted,
    } = value;

    const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
    const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

    return {
      id,
      areaCode: strippedPhone.substring(0, 3),
      countryCode,
      extension: strippedExtension,
      phoneType,
      phoneNumber: strippedPhone.substring(3),
      isInternational: countryCode !== USA.COUNTRY_CODE,
      inputPhoneNumber,
      isTextable,
      isTextPermitted,
    };
  }

  validateCleanData({ inputPhoneNumber }) {
    return {
      inputPhoneNumber:
        inputPhoneNumber && isValidPhone(inputPhoneNumber)
          ? ''
          : 'Please enter a valid phone.',
    };
  }

  convertCleanDataToPayload(data, fieldName) {
    const cleanData = this.convertNextValueToCleanData(data);
    return pickBy(
      {
        id: cleanData.id,
        areaCode: cleanData.areaCode,
        countryCode: USA.COUNTRY_CODE, // currently no international phone number support
        extension: cleanData.extension,
        phoneNumber: cleanData.phoneNumber,
        isInternational: false, // currently no international phone number support
        isTextable: cleanData.isTextable,
        isTextPermitted: cleanData.isTextPermitted,
        phoneType: PHONE_TYPE[fieldName],
      },
      e => !!e,
    );
  }

  render() {
    return (
      <Vet360ProfileField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.TELEPHONES}
        convertNextValueToCleanData={this.convertNextValueToCleanData}
        validateCleanData={this.validateCleanData}
        convertCleanDataToPayload={this.convertCleanDataToPayload}
        Content={PhoneView}
        EditModal={PhoneEditModal}
        formSchema={formSchema}
        uiSchema={uiSchema}
      />
    );
  }
}
