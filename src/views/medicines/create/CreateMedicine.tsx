'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Swal from 'sweetalert2'

// Type Definitions
type FormData = {
  
  medicineName: string
  formulation: string
  quantity: string
  assignManufacturer: string
  drugCategory: string
}

const initialFormData: FormData = {
  medicineName: '',
  formulation: '',
  quantity: '',
  assignManufacturer: '',
  drugCategory: ''
}


const medicine_type = [
  { "id": "ointment", "option": "Ointment" },
  { "id": "eye_drop", "option": "Eye Drop" },
  { "id": "tablet", "option": "Tablet" },
 ];


const CreateMedicine = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [manufacturers, setManufacturers] = useState<{ manufacturerId: string; manufacturerName: string }[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch doctor names from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/manufacturers`)
        const data = await response.json()
        setManufacturers(data)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching manufacturers:', error)
      }
    }
    fetchRoles()
  }, [])

  // Handle form changes
  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    // Ensure dateOfBirth is a Date object
    const formattedDateOfBirth = new Date(`${formData.dateOfBirth}T00:00:00Z`);

    // Prepare payload with the Date object for dateOfBirth
    const payload = {
      
        
        medicineName: formData.medicineName,
        formulation: formData.formulation,
        manufacturer: formData.assignManufacturer,
        quantity: formData.quantity,
        type: formData.drugCategory
        
      
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/medicines`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )
  
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Medicine created successfully!',
        timer: 3000,
        showConfirmButton: false
      })
      setFormData(initialFormData) // Reset form after success
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred. Please try again.',
        timer: 3000,
        showConfirmButton: false
      })
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Medicine
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Form Fields */}
           
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Medicine Name"
                value={formData.medicineName}
                onChange={e => handleFormChange('medicineName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Formulation"
                value={formData.formulation}
                onChange={e => handleFormChange('formulation', e.target.value)}
              />
            </Grid>
         
            
          
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Quantity"
                value={formData.quantity}
                onChange={e => handleFormChange('quantity', e.target.value)}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Drug Category</InputLabel>
                <Select
                required
                  value={formData.drugCategory}
                  onChange={e => handleFormChange('drugCategory', e.target.value)}
                >
                  {medicine_type.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

          
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Drug Manufacturer</InputLabel>
                <Select
                required
                  value={formData.assignManufacturer}
                  onChange={e => handleFormChange('assignManufacturer', e.target.value)}
                >
                  {manufacturers.map(manufacturer => (
                    <MenuItem key={manufacturer.manufacturerId} value={manufacturer.manufacturerId}>
                      {manufacturer.manufacturerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          


        

            </Grid>

          
          {/* Submit and Reset Buttons */}
          <Grid item xs={12} className="mt-4">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Medicine'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              type="reset"
              className="ml-2"
              onClick={() => setFormData(initialFormData)}
            >
              Reset
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateMedicine
