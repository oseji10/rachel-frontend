'use client';


import Refraction from '@/views/encounters/create/Refraction';
import { Suspense } from 'react';

const RefractionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Refraction />
    </Suspense>
  );
}

export default RefractionPage
