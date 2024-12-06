// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllUsers from './AllUsers'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllUsers/>
      </Grid>
    </Grid>
  )
}

export default Account
