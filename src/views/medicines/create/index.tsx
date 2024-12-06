// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreateMedicine from './CreateMedicine'


const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateMedicine />
      </Grid>
    </Grid>
  )
}

export default Create
