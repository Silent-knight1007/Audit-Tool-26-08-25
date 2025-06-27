import React, { useState } from 'react';
import AuditPlan from './AuditPlan'; // adjust the path if needed
import NonConformity from './NonConformity'; // adjust the path if needed

function AuditPage() {
  const [status, setStatus] = useState('');

  return (
    <div>
      <AuditPlan status={status} setStatus={setStatus} />
      {status === 'executed' && <NonConformity />}
    </div>
  );
}

export default AuditPage;
