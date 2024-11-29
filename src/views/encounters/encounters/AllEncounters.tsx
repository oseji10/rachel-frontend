'use client';

import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';

type Patient = {
  patientId: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: string;
  bloodGroup: string;
  doctor?: {
    doctors: {
      doctorName: string;
    };
  };
  phoneNumber?: string;
  email?: string;
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

const EncountersTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);


  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
  
    // Adjust if the birth date hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };

  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patients/all_patients`);
        setPatients(response.data);
        setFilteredPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patients data.');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patients.filter(
      (patient) =>
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
        patient.phoneNumber?.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
    setPage(0); // Reset pagination on search
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenViewModal(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    // Handle save logic (e.g., API call to update the patient)
    setOpenEditModal(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const displayedPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
    <h3>Encounters</h3>
      <TextField
        placeholder="Search by name, phone number, or email"
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
              <TableCell>Patient ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.patientId}>
                <TableCell>{patient.patientId}</TableCell>
                <TableCell>
                  {patient.firstName} {patient.lastName} {patient.otherNames}
                </TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(patient)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(patient)} color="secondary">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Modal */}
<Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={{ ...modalStyle, padding: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
    <Typography
      variant="h5"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        textAlign: 'center',
        marginBottom: '1.5rem',
      }}
    >
      Patient Details
    </Typography>

    {selectedPatient && (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Full Name:
          </Typography>
          <Typography variant="body1">
            {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Gender:
          </Typography>
          <Typography variant="body1">{selectedPatient.gender}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Blood Group:
          </Typography>
          <Typography variant="body1">{selectedPatient.bloodGroup}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Phone Number:
          </Typography>
          <Typography variant="body1">{selectedPatient?.user?.phoneNumber || 'N/A'}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Email:
          </Typography>
          <Typography variant="body1">{selectedPatient?.user?.email || 'N/A'}</Typography>
        </Box>


        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Address:
          </Typography>
          <Typography variant="body1">{selectedPatient?.address || 'N/A'}</Typography>
        </Box>


        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Occupation:
          </Typography>
          <Typography variant="body1">{selectedPatient?.occupation || 'N/A'}</Typography>
        </Box>


        <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  }}
>
  <Typography variant="body1" fontWeight="bold" color="text.secondary">
    Age:
  </Typography>
  <Typography variant="body1">
    {selectedPatient?.dateOfBirth
      ? calculateAge(selectedPatient.dateOfBirth)
      : 'N/A'}
  </Typography>
</Box>


        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            Doctor:
          </Typography>
          <Typography variant="body1">
            {selectedPatient.doctor?.doctors?.doctorName || 'N/A'}
          </Typography>
        </Box>
      </Box>
    )}

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginTop: '2rem',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenViewModal(false)}
        sx={{ textTransform: 'none', fontWeight: 'bold', padding: '0.5rem 2rem' }}
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>


      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Edit Patient
          </Typography>
          {selectedPatient && (
            <>
              <TextField
                label="First Name"
                defaultValue={selectedPatient.firstName}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                defaultValue={selectedPatient.lastName}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                defaultValue={selectedPatient.phoneNumber}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                defaultValue={selectedPatient.email}
                fullWidth
                margin="normal"
              />
            </>
          )}
          <Button variant="contained" color="primary" onClick={handleEditSave}>
            Save
          </Button>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
        </Box>
      </Modal>
    </>
  );
};

export default EncountersTable;
