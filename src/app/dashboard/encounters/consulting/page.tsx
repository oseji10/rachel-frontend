
'use client';

import Consulting from '@/views/encounters/create/DumpedConsulting'
import { Suspense } from 'react';

const EncountersPage = () => {
  return (
  <Suspense fallback={<div>Loading...</div>}>
      <Consulting />
    </Suspense>
  );
}

export default EncountersPage
