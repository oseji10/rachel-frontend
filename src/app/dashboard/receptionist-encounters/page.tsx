// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
// import Encounters from '@/views/encounters'

// import ReceptionistEncountersTable from '@/views/encounters/receptionist-encounters/AllEncounters'
import TreatmentsTable from '@/views/encounters/receptionist-encounters/AllEncounters'

// const EncountersTab = dynamic(() => import('@/views/encounters/encounters'))
// const CreateTab = dynamic(() => import('@/views/encounters/create'))

// // Vars
// const tabContentList = (): { [key: string]: ReactElement } => ({
//   encounters: <EncountersTab />,
//   // create: <CreateTab />,
// })

const EncountersPage = () => {
  return <TreatmentsTable />
}

export default EncountersPage
