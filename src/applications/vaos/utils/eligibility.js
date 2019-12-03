import {
  PRIMARY_CARE,
  DISABLED_LIMIT_VALUE,
  CANCELLED_APPOINTMENT_SET,
} from '../utils/constants';

import {
  checkPastVisits,
  getRequestLimits,
  getPacTeam,
  getClinics,
} from '../api';

export async function getEligibilityData(facilityId, typeOfCareId) {
  const eligibilityChecks = [
    checkPastVisits(facilityId, typeOfCareId, 'request'),
    getRequestLimits(facilityId, typeOfCareId),
    checkPastVisits(facilityId, typeOfCareId, 'direct'),
    getClinics(facilityId, typeOfCareId),
  ];

  if (typeOfCareId === PRIMARY_CARE) {
    eligibilityChecks.push(getPacTeam(facilityId));
  }

  const [requestPastVisit, requestLimits, ...directData] = await Promise.all(
    eligibilityChecks,
  );
  let eligibility = {
    requestPastVisit,
    requestLimits,
  };

  if (directData?.length) {
    const [directPastVisit, clinics, ...pacTeam] = directData;
    eligibility = {
      ...eligibility,
      directPastVisit,
      clinics,
    };

    if (pacTeam.length) {
      eligibility = {
        ...eligibility,
        pacTeam: pacTeam[0],
      };
    }
  }

  return eligibility;
}

function hasVisitedInPastMonthsDirect(eligibilityData) {
  return (
    eligibilityData.directPastVisit.durationInMonths === DISABLED_LIMIT_VALUE ||
    eligibilityData.directPastVisit.hasVisitedInPastMonths
  );
}

function hasVisitedInPastMonthsRequest(eligibilityData) {
  return (
    eligibilityData.requestPastVisit.durationInMonths ===
      DISABLED_LIMIT_VALUE ||
    eligibilityData.requestPastVisit.hasVisitedInPastMonths
  );
}

function hasPACTeamIfPrimaryCare(eligibilityData, typeOfCareId, vaFacility) {
  return (
    typeOfCareId !== PRIMARY_CARE ||
    eligibilityData.pacTeam.some(
      provider => provider.facilityId === vaFacility.substring(0, 3),
    )
  );
}

function isUnderRequestLimit(eligibilityData) {
  return (
    eligibilityData.requestLimits.requestLimit === DISABLED_LIMIT_VALUE ||
    eligibilityData.requestLimits.numberOfRequests <
      eligibilityData.requestLimits.requestLimit
  );
}

export function getEligibilityChecks(
  vaFacility,
  typeOfCareId,
  eligibilityData,
) {
  return {
    directPastVisit: hasVisitedInPastMonthsDirect(eligibilityData),
    directPastVisitValue: eligibilityData.directPastVisit.durationInMonths,
    directPACT: hasPACTeamIfPrimaryCare(
      eligibilityData,
      typeOfCareId,
      vaFacility,
    ),
    directClinics: !!eligibilityData.clinics.length,
    requestPastVisit: hasVisitedInPastMonthsRequest(eligibilityData),
    requestPastVisitValue: eligibilityData.requestPastVisit.durationInMonths,
    requestLimit: isUnderRequestLimit(eligibilityData),
    requestLimitValue: eligibilityData.requestLimits.requestLimit,
  };
}

export function isEligible(eligibilityChecks) {
  if (!eligibilityChecks) {
    return {
      direct: null,
      request: null,
    };
  }

  const {
    directPastVisit,
    directClinics,
    directPACT,
    requestLimit,
    requestPastVisit,
  } = eligibilityChecks;

  return {
    direct: directPastVisit && directPACT && directClinics,
    request: requestLimit && requestPastVisit,
  };
}

export function getEligibleFacilities(facilities) {
  return facilities.filter(
    facility => facility.requestSupported || facility.directSchedulingSupported,
  );
}

export function hasEligibleClinics(facilityId, pastAppointments, clinics) {
  const pastClinicIds = new Set(
    pastAppointments
      .filter(
        appt =>
          appt.facilityId === facilityId &&
          appt.clinicId &&
          !CANCELLED_APPOINTMENT_SET.has(
            appt.vdsAppointments?.[0]?.currentStatus || 'FUTURE',
          ),
      )
      .map(appt => appt.clinicId),
  );

  // TODO: Reproduce scenario when clinics is null
  return clinics?.some(clinic => pastClinicIds.has(clinic.clinicId));
}
