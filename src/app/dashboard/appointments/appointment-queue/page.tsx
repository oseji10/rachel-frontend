// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import CheckedInAppointments from '@/views/appointments/all-appointments/CheckedInAppoitnments'


const AppointmentsPage = () => {
  // return <CreateAppointment />
return <CheckedInAppointments/>
}

export default AppointmentsPage
