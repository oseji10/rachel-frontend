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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Button,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';

type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

type Treatment = {
  treatmentId: number;
  patientId: number;
  encounterId: number;
  treatmentType: string;
  medicine: string;
  dosage: string;
  doseDuration: string;
  doseInterval: string;
  time: string;
  comment: string;
  frame: string | null;
  lensType: string | null;
  costOfLens: string | null;
  costOfFrame: string | null;
  created_at: string;
};

type TreatmentGroup = {
  patient: Patient;
  treatments: Treatment[];
};

type TreatmentResponse = {
  success: boolean;
  data: { [treatmentId: string]: TreatmentGroup };
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TreatmentsTable = () => {
  const [treatmentGroups, setTreatmentGroups] = useState<{ [treatmentId: string]: TreatmentGroup }>({});
  const [filteredTreatmentGroups, setFilteredTreatmentGroups] = useState<{ [treatmentId: string]: TreatmentGroup }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedTreatmentGroup, setSelectedTreatmentGroup] = useState<TreatmentGroup | null>(null);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get<TreatmentResponse>(
          `${process.env.NEXT_PUBLIC_APP_URL}/prescriptions`,
          { params: { per_page: rowsPerPage, page: page + 1 } }
        );
        if (response.data.success) {
          setTreatmentGroups(response.data.data);
          setFilteredTreatmentGroups(response.data.data);
          setTotalCount(response.data.pagination?.total || Object.keys(response.data.data).length);
          setLoading(false);
        } else {
          setError('Failed to load treatments data.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load treatments data.');
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [page, rowsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = Object.fromEntries(
      Object.entries(treatmentGroups).filter(([_, group]) =>
        group.patient.name.toLowerCase().includes(query)
      )
    );

    setFilteredTreatmentGroups(filtered);
    setPage(0);
  };

  const handleViewTreatments = (treatmentId: string, group: TreatmentGroup) => {
    setSelectedTreatmentId(treatmentId);
    setSelectedTreatmentGroup(group);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTreatmentId(null);
    setSelectedTreatmentGroup(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedGroups = Object.entries(filteredTreatmentGroups).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
      <Typography variant="h5" gutterBottom>
        Patient Prescriptions
      </Typography>
      <TextField
        placeholder="Search by patient name"
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
              <TableCell>Prescription Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedGroups.map(([treatmentId, group]) => (
              <TableRow key={treatmentId}>
                <TableCell>{formatDate(group.treatments[0].created_at)}</TableCell>
                <TableCell>{group.patient.firstName} {group.patient.lastName}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleViewTreatments(treatmentId, group)}
                    color="primary"
                  >
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
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog to show treatments */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Treatments for {selectedTreatmentGroup?.patient.name} (Treatment ID: {selectedTreatmentId})
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Treatment Type</TableCell>
                  <TableCell>Medicine</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Dose Duration</TableCell>
                  <TableCell>Dose Interval</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedTreatmentGroup?.treatments.map((treatment, index) => (
                  <TableRow key={index}>
                    <TableCell>{treatment.treatmentType}</TableCell>
                    <TableCell>{treatment.medicine}</TableCell>
                    <TableCell>{treatment.dosage}</TableCell>
                    <TableCell>{treatment.doseDuration}</TableCell>
                    <TableCell>{treatment.doseInterval}</TableCell>
                    <TableCell>{treatment.time}</TableCell>
                    <TableCell>{treatment.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TreatmentsTable;