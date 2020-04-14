/**
 * The intent for this module is to provide a flexible, reusable address schema and widget that can be used in any form throughout VA.gov.
 * The address uiSchema should be flexible enough to handle these cases:
 * 1. Top level address property (schema.properties.address)
 * 2. Nested address property (schema.properties.someProperty.properties.address)
 * 3. Array items.
 *
 * Fields that may depend on external variables to make the form required:
 * 1. Country - could depend on things like: yes/no field, checkbox in a different form chapter, etc.
 * 2. Address Line 1 - same as country
 * 3. City - same as country
 *
 * Fields that are required based on internal field variables:
 * 1. State - required if the country is the United States OR US Military Address
 * 2. Zipcode - required if the country is the United States OR US Military Address
 * 3. International Postal Code - required if the country is NOT the United States OR US Military address
 *
 * Fields that are optional:
 * 1. State/Province/Region - shows up if the country is NOT the US, but NOT required.
 */

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { countries } from 'platform/forms-system/src/js/utilities/address';
import ADDRESS_DATA from 'platform/forms/address/data';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import get from 'platform/utilities/data/get';
import React from 'react';
import { militaryCities, states50AndDC } from '../constants';

/**
 * CONSTANTS:
 * 1. MILITARY_STATES - object of military state codes and names.
 * 2. USA - used to just reference the United States
 * 3. MilitaryBaseInfo - expandable text to expound on military base addresses.
 * 4. addressSchema - data model for address schema.
 */

const MILITARY_STATES = Object.entries(ADDRESS_DATA.states).reduce(
  (militaryStates, [stateCode, stateName]) => {
    if (ADDRESS_DATA.militaryStates.includes(stateCode)) {
      return {
        ...militaryStates,
        [stateCode]: stateName,
      };
    }
    return militaryStates;
  },
  {},
);

const USA = {
  value: 'USA',
  name: 'United States',
};

const MilitaryBaseInfo = () => (
  <div className="vads-u-padding-x--2p5">
    <AdditionalInfo
      status="info"
      triggerText="Learn more about military base addresses"
    >
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </AdditionalInfo>
  </div>
);

const addressSchema = {
  type: 'object',
  properties: {
    'view:livesOnMilitaryBase': {
      type: 'boolean',
    },
    'view:livesOnMilitaryBaseInfo': {
      type: 'object',
      properties: {},
    },
    country: {
      type: 'string',
      enum: countries.map(country => country.label),
    },
    street: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    street2: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^.*\\S.*',
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
      enum: states50AndDC.map(state => state.value),
      enumNames: states50AndDC.map(state => state.label),
    },
    province: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
      pattern: '(^\\d{5}$)|(^\\d{5}-\\d{4}$)',
    },
    internationalPostalCode: {
      type: 'string',
      maxLength: 10,
    },
  },
};

/**
 * Builds address schema based on isMilitaryAddress.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 * @returns {object} an object containing the necessary properties for a domestic US address, foreign US military address, and international address.
 */
export const buildAddressSchema = isMilitaryBaseAddress => {
  if (isMilitaryBaseAddress) return cloneDeep(addressSchema);
  const schema = cloneDeep(addressSchema);
  delete schema.properties['view:livesOnMilitaryBase'];
  delete schema.properties['view:livesOnMilitaryBaseInfo'];
  return schema;
};

/**
 * This method takes a list of parameters and generates an addressUiSchema.
 * @param {function} callback slots into the 'ui:required' for the necessary fields.
 * @param {string} path represents the path to the address in formData.
 * @param {boolean} isMilitaryBaseAddress represents whether or not the form page requires the address to support the option of military address.
 */

const MILITARY_BASE_PATH = '[view:livesOnMilitaryBase]';

export const addressUISchema = (
  isMilitaryBaseAddress = false,
  path,
  callback,
) => {
  // As mentioned above, there are certain fields that depend on the values of other fields when using updateSchema, replaceSchema, and hideIf.
  // The two constants below are paths used to retrieve the values in those other fields.
  const livesOnMilitaryBasePath = `${path}${MILITARY_BASE_PATH}`;
  const insertArrayIndex = (key, index) => key.replace('[INDEX]', `[${index}]`);

  const getCountryNamePath = index => {
    let countryNamePath = `${path}.country`;
    if (typeof index === 'number') {
      countryNamePath = insertArrayIndex(countryNamePath, index);
    }
    return countryNamePath;
  };

  return (function returnAddressUI() {
    return {
      'view:livesOnMilitaryBase': {
        'ui:title':
          'I live on a United States military base outside of the United States',
        'ui:options': {
          hideIf: () => !isMilitaryBaseAddress,
          hideOnReview: true,
        },
      },
      'view:livesOnMilitaryBaseInfo': {
        'ui:description': MilitaryBaseInfo,
        'ui:options': {
          hideIf: () => !isMilitaryBaseAddress,
        },
      },
      country: {
        'ui:required': callback,
        'ui:title': 'Country',
        'ui:options': {
          updateSchema: (formData, schema, uiSchema) => {
            const countryUI = uiSchema;
            const countryFormData = get(path, formData);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              countryUI['ui:disabled'] = true;
              countryFormData.country = USA.name;
              return {
                enum: [USA.name],
                default: USA.name,
              };
            }
            countryUI['ui:disabled'] = false;
            return {
              type: 'string',
              enum: countries.map(country => country.label),
            };
          },
        },
      },
      street: {
        'ui:required': callback,
        'ui:title': 'Street address',
        'ui:errorMessages': {
          required: 'Please enter a street address',
          pattern: 'Please enter a street address that is under 100 characters',
        },
      },
      street2: {
        'ui:title': 'Line 2',
        'ui:options': {
          hideOnReviewIfFalse: true,
        },
      },
      city: {
        'ui:required': callback,
        'ui:errorMessages': {
          required: 'Please enter a city',
          pattern: 'Please enter a city that is under 100 characters',
        },
        'ui:options': {
          replaceSchema: formData => {
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return {
                type: 'string',
                title: 'APO/FPO/DPO',
                enum: militaryCities,
              };
            }
            return {
              type: 'string',
              title: 'City',
              minLength: 1,
              maxLength: 100,
              pattern: '^.*\\S.*',
            };
          },
        },
      },
      state: {
        'ui:required': (formData, index) => {
          if (
            formData.selectedAddress === 'newAddress' &&
            (!formData.newAddress.country ||
              formData.newAddress.country === 'United States')
          ) {
            const countryNamePath = getCountryNamePath(path, index);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            const countryName = get(countryNamePath, formData);
            return (
              !countryName || countryName === USA.name || livesOnMilitaryBase
            );
          }
          return false;
        },
        'ui:title': 'State',
        'ui:errorMessages': {
          required: 'Please enter a state',
        },
        'ui:options': {
          hideIf: (formData, index) => {
            // Because we have to update countryName manually in formData above,
            // We have to check this when a user selects a non-US country and then selects
            // the military base checkbox.
            const countryNamePath = getCountryNamePath(path, index);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return false;
            }
            const countryName = get(countryNamePath, formData);
            return countryName && countryName !== USA.name;
          },
          updateSchema: formData => {
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return {
                enum: Object.keys(MILITARY_STATES),
                enumNames: Object.values(MILITARY_STATES),
              };
            }
            return {
              enum: states50AndDC.map(state => state.value),
              enumNames: states50AndDC.map(state => state.label),
            };
          },
        },
      },
      province: {
        'ui:title': 'State/Province/Region',
        'ui:options': {
          hideIf: (formData, index) => {
            const countryNamePath = getCountryNamePath(path, index);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName === USA.name || !countryName;
          },
        },
        'ui:required': (formData, index) => {
          if (
            formData.selectedAddress === 'newAddress' &&
            (formData.newAddress.country &&
              formData.newAddress.country !== 'United States')
          ) {
            const countryNamePath = getCountryNamePath(path, index);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName !== USA.name || !countryName;
          }
          return false;
        },
        'ui:errorMessages': {
          required: 'Please enter a state/province/region',
        },
      },
      postalCode: {
        'ui:required': callback,
        'ui:title': 'Postal Code',
        'ui:errorMessages': {
          required: 'Please enter a postal code',
          pattern: 'Please enter a valid 5 digit postal code',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideIf: (formData, index) => {
            // Because we have to update countryName manually in formData above,
            // We have to check this when a user selects a non-US country and then selects
            // the military base checkbox.
            const countryNamePath = getCountryNamePath(path, index);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            const countryName = get(countryNamePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return false;
            }
            return countryName && countryName !== USA.name;
          },
        },
      },
      internationalPostalCode: {
        'ui:required': (formData, index) => {
          const countryNamePath = getCountryNamePath(path, index);
          const countryName = get(countryNamePath, formData);
          return countryName && countryName !== USA.name;
        },
        'ui:title': 'International postal code',
        'ui:errorMessages': {
          required: 'Please enter a postal code',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideIf: (formData, index) => {
            const countryNamePath = getCountryNamePath(path, index);
            const livesOnMilitaryBase = get(livesOnMilitaryBasePath, formData);
            if (isMilitaryBaseAddress && livesOnMilitaryBase) {
              return true;
            }
            const countryName = get(countryNamePath, formData);
            return countryName === USA.name || !countryName;
          },
        },
      },
    };
  })();
};
