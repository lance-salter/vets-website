import React from 'react';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation-react/ErrorableRadioButtons';
import { pageNames } from './pageList';
import environment from 'platform/utilities/environment';

let pageNameYes = pageNames.originalClaim;
if (!environment.isProduction()) {
  pageNameYes = pageNames.appeals;
}

const options = [
  { value: pageNameYes, label: 'Yes' },
  { value: pageNames.bdd, label: 'No' },
];

const StartPage = ({ setPageState, state = {} }) => (
  <ErrorableRadioButtons
    name={`${pageNames.start}-option`}
    label="Have you separated from your military or uniformed service?"
    id={`${pageNames.start}-option`}
    options={options}
    onValueChange={({ value }) => setPageState({ selected: value }, value)}
    value={{ value: state.selected }}
  />
);

export default {
  name: pageNames.start,
  component: StartPage,
};
