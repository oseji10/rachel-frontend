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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 15; // Fixed rows per page for server-side pagination
  const [totalPatients, setTotalPatients] = useState<number>(0); // Total patients count for pagination

  const fetchPatients = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/patients?page=${currentPage + 1}&limit=${rowsPerPage}`
      );

      const patientsData = response.data.data;
      setPatients(patientsData);
      setTotalPatients(response.data.total); // Update total count from server response
    } catch (err) {
      setError('Failed to load patients data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName} ${patient.otherNames}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    // You can adjust the `rowsPerPage` here if you want dynamic row limits
    // For now, we're using a fixed rowsPerPage value
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
            {filteredPatients.map((patient) => (
              <TableRow key={patient.patientId}>
                <TableCell>{patient.patientId}</TableCell>
                <TableCell>{`${patient.firstName} ${patient.lastName} ${patient.otherNames || ''}`}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton color="secondary">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[100]} // Fixed to 100 for server-side
          component="div"
          count={totalPatients}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </TableContainer>
    </>
  );
};

export default PatientsTable;
