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
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';

type Patient = {
  patientId: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: string;
  bloodGroup: string;
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

const PatientsTable = () => {
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
  const [totalPatients, setTotalPatients] = useState<number>(0);

  // Fetch patients from the server
  const fetchPatients = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/patients?page=${currentPage + 1}&limit=${rowsPerPage}`
      );

      const patientsData = response.data.data;
      setPatients(patientsData);
      setFilteredPatients(patientsData);
      setTotalPatients(response.data.total);
    } catch (err) {
      setError('Failed to load patients data.');
    } finally {
      setLoading(false);
    }
  };

  // UseEffect hook to fetch data on page change
  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patients.filter(
      (patient) =>
        `${patient.firstName} ${patient.lastName} ${patient.otherNames}`.toLowerCase().includes(query) ||
        patient.phoneNumber?.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.patientId?.toLowerCase().includes(query)
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
    setPage(0); // Reset to the first page whenever rows per page changes
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
      <TextField
        placeholder="Search by name, date of birth, Hospital ID, phone number, or email"
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
                  <IconButton onClick={() => handleEdit(patient)} color="warning">
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[20]}
          component="div"
          count={totalPatients}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="body1" fontWeight="bold" color="text.secondary">Patient ID:</Typography>
                <Typography variant="body1">
                {selectedPatient.patientId} 
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="body1" fontWeight="bold" color="text.secondary">Full Name:</Typography>
                <Typography variant="body1">
                  {`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="body1" fontWeight="bold" color="text.secondary">Gender:</Typography>
                <Typography variant="body1">{selectedPatient.gender}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="body1" fontWeight="bold" color="text.secondary">Blood Group:</Typography>
                <Typography variant="body1">{selectedPatient.bloodGroup}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="body1" fontWeight="bold" color="text.secondary">Phone Number:</Typography>
                <Typography variant="body1">{selectedPatient.phoneNumber}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <Typography variant="body1" fontWeight="bold" color="text.secondary">Email:</Typography>
                <Typography variant="body1">{selectedPatient.email}</Typography>
              </Box>

            </Box>

            
          )}
          <Button onClick={() => setOpenViewModal(false)} sx={{ width: '100%' }} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
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
            Edit Patient Information
          </Typography>
          <Button onClick={handleEditSave} sx={{ width: '100%' }} variant="contained" color="secondary">
            Save Changes
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PatientsTable;
