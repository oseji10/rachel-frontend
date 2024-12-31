// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'
import Medicine from '@/views/medicines/all-medicines/AllMedicines'



const MedicinePage = () => {
  return <Medicine />
}

export default MedicinePage
