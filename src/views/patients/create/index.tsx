// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreatePatient from './CreatePatient'
import AccountDelete from './AccountDelete'

const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreatePatient />
      </Grid>
      {/* <Grid item xs={12}>
        <AccountDelete />
      </Grid> */}
    </Grid>
  )
}

export default Create
