'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Modal,
  Box,
  Button,
  TablePagination,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Cancel, Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Billing = {
  billingId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const BillingsTable = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [filteredBillings, setFilteredBillings] = useState<Billing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
const router = useRouter();

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`);
        setBillings(response.data);
        setFilteredBillings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load billings data.');
        setLoading(false);
      }
    };

    fetchBillings();
  }, []);



  const [doctors, setDoctors] = useState<{ doctorId: string; doctorName: string }[]>([])
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`)
        const data = await response.json()
        setDoctors(data)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    fetchDoctors()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = billings.filter(
      (billing) =>
        `${billing.patients.firstName} ${billing.patients.lastName}`.toLowerCase().includes(query)
    );
    setFilteredBillings(filtered);
    setPage(0);
  };

  const handleView = (billing: Billing) => {
    setSelectedBilling(billing);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleEdit = (billing: Billing) => {
    setSelectedBilling(billing); // Store the full billing object if needed for editing
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    // Handle save logic (e.g., API call to update the patient)
    setOpenEditModal(false);
  };

 

  const displayedBillings = filteredBillings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // const handleUpdate =  (billing) => {
  //   // e.preventDefault()
  //   // setLoading(true)

  //   try {
  //     await axios.put(
  //       `${process.env.NEXT_PUBLIC_APP_URL}/billings/${billingId}`,
  //       formData,
  //       { headers: { 'Content-Type': 'application/json' } }
  //     )

  //     // Show success message
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Success',
  //       text: 'Billing updated successfully!',
  //       timer: 3000,
  //       showConfirmButton: false
  //     })

  //     // onClose() // Close the modal
  //     router.push('/billings') // Redirect after successful update
  //   } catch (error) {
  //     console.error('Error updating billing:', error.response?.data || error.message)
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: error.response?.data?.message || 'An error occurred. Please try again.',
  //       timer: 3000,
  //       showConfirmButton: false
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedBilling((prev) =>
        prev ? { ...prev, [name]: value } : null
    );
};


  const handleUpdate = async () => {
    if (selectedBilling) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_APP_URL}/billings/${selectedBilling.billingId}`,
          selectedBilling // Send updated billing data
        );
        Swal.fire('Updated!', 'The billing has been updated.', 'success');
        setOpenEditModal(false);
      } catch (error) {
        Swal.fire('Error!', 'Failed to update the billing.', 'error');
      }
    }
  };
  



  const handleDelete = (billing) => {
    setOpenViewModal(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this billing?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Make API request to delete the billing
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`);
        axios
          .delete(`${process.env.NEXT_PUBLIC_APP_URL}/billings/${billingId}`)
          .then((response) => {
            Swal.fire('Deleted!', 'The billing has been canceled.', 'success');
            // Optionally, refresh the table or update state here
          })
          .catch((error) => {
            Swal.fire('Error!', 'Failed to cancel the billing.', 'error');
          });
      }
    });
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <h3>Billings</h3>
      <TextField
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Billing Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBillings.map((billing) => (
              <TableRow key={billing.id}>
                
                <TableCell>
  {billing?.billingDate &&
    new Date(`${billing?.billingDate}T${billing?.billingTime}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}
</TableCell>

                <TableCell>
                  {billing?.patients?.firstName} {billing?.patients?.lastName}
                </TableCell>
                <TableCell>{billing?.doctors.doctorName}</TableCell>
                {/* <TableCell>{billing?.role?.roleName}</TableCell> */}
                <TableCell>
                  <IconButton onClick={() => handleView(billing)} color="primary">
                    <Visibility />
                  </IconButton>

                  <IconButton onClick={() => handleEdit(billing)}  color="warning">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(billing)} color="error">
        <Cancel />
      </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredBillings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Modal */}
    
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={modalStyle}>
    <Typography variant="h5" gutterBottom>
      Billing Details
    </Typography>
    {selectedBilling && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedBilling?.patients?.firstName} ${selectedBilling?.patients?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedBilling?.patients?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedBilling?.patients?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Doctor:</strong> {selectedBilling.doctors?.doctorName || 'N/A'}
        </Typography>

        {/* <Typography variant="body1">
          <strong>Billing Date:</strong> {selectedBilling.billingDate || 'N/A'}
        </Typography> */}

        <Typography variant="body1">
          <strong>Billing Date:</strong> {selectedBilling?.billingDate &&
    new Date(`${selectedBilling?.billingDate}T${selectedBilling?.billingTime}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}
        </Typography>
</>
       
    )}
  </Box>
</Modal>





<Modal open={openEditModal}  onClose={() => setOpenEditModal(false)}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Edit Billing
        </Typography>
        <form onSubmit={handleUpdate}>
          <Grid container spacing={4}>
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
              name="billingDate"
                type="date"
                fullWidth
                label="Billing Date"
                value={selectedBilling?.billingDate || ''}
                // onChange={handleFormChange}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
              name="billingTime"
                type="time"
                fullWidth
                label="Billing Time"
                value={selectedBilling?.billingTime || ''}
                // onChange={e => handleFormChange('billingTime', e.target.value)}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
              name="comment"
                fullWidth
                label="Comment"
                value={selectedBilling?.comment || ''}
                // onChange={e => handleFormChange('comment', e.target.value)}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
  <InputLabel>Doctor</InputLabel>
  <Select
  name="doctor" // Add name attribute
  value={selectedBilling?.doctor || ''}
  onChange={handleFormChange}
>
  {doctors.map(doctor => (
    <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
      {doctor.doctorName}
    </MenuItem>
  ))}
</Select>

</FormControl>

            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} className="mt-4">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal>
    </>
  );
};

export default BillingsTable;
