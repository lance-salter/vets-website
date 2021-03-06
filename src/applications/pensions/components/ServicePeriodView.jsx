import React from 'react';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export default function ServicePeriodView({ formData }) {
  let from = '';
  let to = '';
  if (formData.activeServiceDateRange) {
    from = formatReviewDate(formData.activeServiceDateRange.from);
    to = formatReviewDate(formData.activeServiceDateRange.to);
  }

  return (
    <div>
      <strong>{formData.serviceBranch}</strong>
      <br />
      {from} &mdash; {to}
    </div>
  );
}
