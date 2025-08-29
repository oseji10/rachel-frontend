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
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { Cancel, Visibility, CheckCircle, Queue, Bed } from '@mui/icons-material';
import Swal from 'sweetalert2';
import api from '@/app/utils/api';
import { getRole } from '../../../../lib/auth';
import { useRouter } from 'next/navigation';

type QueueItem = {
  queueId: number;
  patientId: number;
  appointmentId: number;
  doctorId: number;
  queueNumber: string;
  attendedTo: string | null;
  scheduledBy: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  patients: {
    patientId: number;
    firstName: string;
    lastName: string;
    otherNames: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
    address: string;
    hospitalFileNumber: string;
    cardNumber: string;
    occupation: string;
  };
  doctors: {
    doctorId: number;
    doctorName: string;
    title: string;
    department: string;
  };
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

const QueuePage = () => {
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [filteredQueues, setFilteredQueues] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const role = getRole();
  const router = useRouter();

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_APP_URL}/checked-in-appointments`);
        setQueues(response.data);
        setFilteredQueues(response.data);
      } catch (err) {
        setError('Failed to load queue data.');
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = queues.filter(
      (q) =>
        `${q.patients.firstName} ${q.patients.lastName}`.toLowerCase().includes(query) ||
        q.doctors.doctorName.toLowerCase().includes(query)
    );
    setFilteredQueues(filtered);
    setPage(0);
  };

  const handleView = (queue: QueueItem) => {
    setSelectedQueue(queue);
    setOpenViewModal(true);
  };


  const handleEncounter = (queue: QueueItem) => {
    const { patientId, firstName, lastName } = queue.patients;
    const patientName = firstName + ' ' + lastName; // Extract patientName correctly
    router.push(`/dashboard/encounters/continue-consulting?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
  };

  const handleDelete = (queue: QueueItem) => {
    setOpenViewModal(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this patient from the queue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`${process.env.NEXT_PUBLIC_APP_URL}/appointments/queue/${queue.queueId}`)
          .then(() => {
            Swal.fire('Removed!', 'Patient has been removed from the queue.', 'success');
            setQueues((prev) => prev.filter((q) => q.queueId !== queue.queueId));
            setFilteredQueues((prev) => prev.filter((q) => q.queueId !== queue.queueId));
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to remove patient from queue.', 'error');
          });
      }
    });
  };

  const displayedQueues = filteredQueues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <h3>Appointment Queue</h3>
      </Box>

      <TextField
        placeholder="Search by patient or doctor"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Queue #</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedQueues.map((queue) => (
                  <TableRow key={queue.queueId}>
                    <TableCell>
                      <Chip
                        label={`#${queue.queueNumber}`}
                        color="primary"
                        icon={<Queue />}
                      />
                    </TableCell>
                    <TableCell>
                      {queue.patients.firstName} {queue.patients.lastName}
                    </TableCell>
                    <TableCell>{queue.doctors.doctorName}</TableCell>
                    <TableCell>{queue.doctors.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={queue.status}
                        color={
                          queue.status === 'waiting'
                            ? 'default'
                            : queue.status === 'in-progress'
                            ? 'secondary'
                            : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleView(queue)} color="primary">
                        <Visibility />
                      </IconButton>
                                        {(role === 'DOCTOR' || role === 'FRONT_DESK' || role === 'SUPER_ADMIN') && (
                                             
                        <IconButton onClick={() => handleEncounter(queue)} color="success">
                          <Bed />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete(queue)} color="error">
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
              count={filteredQueues.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Queue Details
          </Typography>
          {selectedQueue && (
            <>
              <Typography><strong>Queue #:</strong> {selectedQueue.queueNumber}</Typography>
              <Typography><strong>Patient:</strong> {selectedQueue.patients.firstName} {selectedQueue.patients.lastName}</Typography>
              <Typography><strong>Phone:</strong> {selectedQueue.patients.phoneNumber}</Typography>
              <Typography><strong>Email:</strong> {selectedQueue.patients.email}</Typography>
              <Typography><strong>Doctor:</strong> {selectedQueue.doctors.title} {selectedQueue.doctors.doctorName}</Typography>
              <Typography><strong>Department:</strong> {selectedQueue.doctors.department}</Typography>
              <Typography><strong>Status:</strong> {selectedQueue.status}</Typography>
              <Typography><strong>Created At:</strong> {new Date(selectedQueue.created_at).toLocaleString()}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default QueuePage;
