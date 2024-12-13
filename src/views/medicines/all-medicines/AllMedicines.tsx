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
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Medicine = {
  medicineId: number;
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


const MedicinesTable = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`);
        setMedicines(response.data);
        setFilteredMedicines(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load medicines data.');
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = medicines.filter(
      (medicine) =>
        `${medicine.medicineName}`.toLowerCase().includes(query)
    );
    setFilteredMedicines(filtered);
    setPage(0);
  };

  const handleView = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedMedicines = filteredMedicines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <h3>Medicines</h3>
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
              <TableCell>Medicine Name</TableCell>
              <TableCell>Formualtion</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedMedicines.map((medicine) => (
              <TableRow key={medicine.id}>
                
                <TableCell>
                  {medicine?.medicineName} 
                </TableCell>
                <TableCell>{medicine?.formulation}</TableCell>
                <TableCell>{medicine?.manufacturer?.manufacturerName}</TableCell>
                <TableCell>{medicine?.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(medicine)} color="primary">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredMedicines.length}
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
      Medicine Details
    </Typography>
    {selectedMedicine && (
      <>
        <Typography variant="body1">
          <strong>Medicine Name:</strong> {`${selectedMedicine?.medicineName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Formulation:</strong> {selectedMedicine?.formulation}
        </Typography>
        <Typography variant="body1">
          <strong>Manufacturer:</strong> {selectedMedicine?.manufacturer?.manufacturerName}
        </Typography>
        <Typography variant="body1">
          <strong>Quantity:</strong> {selectedMedicine?.quantity || 'N/A'}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


    </>
  );
};

export default MedicinesTable;
