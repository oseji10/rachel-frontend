// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllMedicines from './AllMedicines'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllMedicines/>
      </Grid>
    </Grid>
  )
}

export default Account
