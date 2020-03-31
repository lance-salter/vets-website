import * as Sentry from '@sentry/browser';
// import { setData } from 'platform/forms-system/src/js/actions';
import {
  FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION,
  FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION_FAILURE,
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
  PERM_ADDRESS_MILITARY_BASE_DESELECTED,
  PERM_ADDRESS_MILITARY_BASE_SELECTED,
  PERM_ADDRESS_MILITARY_BASE_SELECTION_FAILURE,
  PERM_ADDRESS_SELECTED_FAILURE,
  PERM_ADDRESS_SELECTED_SUCCESSFUL,
  TEMP_ADDRESS_MILITARY_BASE_DESELECTED,
  TEMP_ADDRESS_MILITARY_BASE_SELECTED,
  TEMP_ADDRESS_MILITARY_BASE_SELECTION_FAILURE,
  TEMP_ADDRESS_SELECTED_FAILURE,
  TEMP_ADDRESS_SELECTED_SUCCESSFUL,
} from '../constants';

export const fetchVeteranInformation = data => ({
  type: FETCH_VETERAN_INFORMATION,
  data,
});

export const fetchVeteranInformationFailure = error => ({
  type: FETCH_VETERAN_INFORMATION_FAILURE,
  error,
});

export const fetchReOrderBatteryAndAccessoriesInformation = data => ({
  type: FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION,
  data,
});

export const fetchReOrderBatteryAndAccessoriesInformationFailure = error => ({
  type: FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION_FAILURE,
  error,
});

export const getVeteranInformationData = data => async dispatch => {
  try {
    const veteranInformation = {
      fullName: data.formData.fullName,
      gender: data.formData.gender,
      dateOfBirth: data.formData.dateOfBirth,
      veteranAddress: data.formData.veteranAddress,
      email: data.formData.email,
    };
    dispatch(fetchVeteranInformation(veteranInformation));
  } catch (error) {
    // eslint-disable-next-line no-unused-expressions
    Sentry.captureMessage('failed to retrieve data from the api');
    dispatch(fetchVeteranInformationFailure(error));
  }
};

export const getReOrderBatteryAndAccessoriesInformationData = data => async dispatch => {
  try {
    const batteryAndAccessoriesInformation = {
      supplies: data.formData.supplies,
    };
    dispatch(
      fetchReOrderBatteryAndAccessoriesInformation(
        batteryAndAccessoriesInformation,
      ),
    );
  } catch (error) {
    dispatch(
      fetchReOrderBatteryAndAccessoriesInformationFailure(
        error,
        Sentry.captureMessage('failed to retrieve data from the api'),
      ),
    );
  }
};

export const permAddressSelectedSuccessful = data => ({
  type: PERM_ADDRESS_SELECTED_SUCCESSFUL,
  data,
});

export const permAddressSelectedFailure = error => ({
  type: PERM_ADDRESS_SELECTED_FAILURE,
  error,
});

export const tempAddressSelectedSuccessful = data => ({
  type: TEMP_ADDRESS_SELECTED_SUCCESSFUL,
  data,
});

export const tempAddressSelectedFailure = error => ({
  type: TEMP_ADDRESS_SELECTED_FAILURE,
  error,
});

export const permAddressMilitaryBaseStatusChange = (data, actionType) => ({
  type: actionType,
  data,
});

export const permAddressMilitaryBaseStatusChangeFailure = error => ({
  type: PERM_ADDRESS_MILITARY_BASE_SELECTION_FAILURE,
  error,
});

export const tempAddressMilitaryBaseStatusChange = (data, actionType) => ({
  type: actionType,
  data,
});

export const tempAddressIsAMilitaryBaseStatusChangeFailure = error => ({
  type: TEMP_ADDRESS_MILITARY_BASE_SELECTION_FAILURE,
  error,
});

export const permAddressIsSelected = data => dispatch => {
  try {
    dispatch(permAddressSelectedSuccessful(data));
    // dispatch(setData(data));
  } catch (error) {
    permAddressSelectedFailure(
      error,
      Sentry.captureMessage('failed to select permanent address'),
    );
  }
};

export const tempAddressIsSelected = data => dispatch => {
  try {
    dispatch(tempAddressSelectedSuccessful(data));
    // dispatch(setData(data));
  } catch (error) {
    tempAddressSelectedFailure(
      error,
      Sentry.captureMessage('failed to select temporary address'),
    );
  }
};

export const permAddressMilitaryBaseChecker = data => dispatch => {
  try {
    if (data) {
      dispatch(
        permAddressMilitaryBaseStatusChange(
          data,
          PERM_ADDRESS_MILITARY_BASE_SELECTED,
        ),
      );
    } else {
      dispatch(
        permAddressMilitaryBaseStatusChange(
          data,
          PERM_ADDRESS_MILITARY_BASE_DESELECTED,
        ),
      );
    }
    // dispatch(setData(data));
  } catch (error) {
    permAddressMilitaryBaseStatusChangeFailure(
      error,
      Sentry.captureMessage(
        'failed to select/deselect permanent address military base',
      ),
    );
  }
};

export const tempAddressMilitaryBaseChecker = data => dispatch => {
  try {
    if (data) {
      dispatch(
        tempAddressMilitaryBaseStatusChange(
          data,
          TEMP_ADDRESS_MILITARY_BASE_SELECTED,
        ),
      );
    } else {
      dispatch(
        tempAddressMilitaryBaseStatusChange(
          data,
          TEMP_ADDRESS_MILITARY_BASE_DESELECTED,
        ),
      );
    }
    // dispatch(setData(data));
  } catch (error) {
    tempAddressIsAMilitaryBaseStatusChangeFailure(
      error,
      Sentry.captureMessage(
        'failed to select/deselect temporary address military base',
      ),
    );
  }
};
