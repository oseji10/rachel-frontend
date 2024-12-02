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

type Consulting = {
  consultingId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  visualAcuityFarPresentingLeft?: VisualAcuity | null;
  visualAcuityFarPresentingRight?: VisualAcuity | null;
  visualAcuityFarPinholeRight?: VisualAcuity | null;
  visualAcuityFarPinholeLeft?: VisualAcuity | null;
  visualAcuityFarBestCorrectedLeft?: VisualAcuity | null;
  visualAcuityFarBestCorrectedRight?: VisualAcuity | null;
  visualAcuityNearLeft?: VisualAcuity | null;
  visualAcuityNearRight?: VisualAcuity | null;
};

type ContinueConsulting = {
  intraOccularPressureRight: string | null;
  intraOccularPressureLeft: string | null;
  otherComplaintsRight: string | null;
  otherComplaintsLeft: string | null;
  detailedHistoryRight: string | null;
  detailedHistoryLeft: string | null;
  findingsRight: string | null;
  findingsLeft: string | null;
  eyelidRight: string | null;
  eyelidLeft: string | null;
  conjunctivaRight: string | null;
  conjunctivaLeft: string | null;
  corneaRight: string | null;
  corneaLeft: string | null;
  ACRight: string | null;
  ACLeft: string | null;
  irisRight: string | null;
  irisLeft: string | null;
  pupilRight: string | null;
  pupilLeft: string | null;
  lensRight: string | null;
  lensLeft: string | null;
  vitreousRight: string | null;
  vitreousLeft: string | null;
  retinaRight: string | null;
  retinaLeft: string | null;
  otherFindingsRight: string | null;
  otherFindingsLeft: string | null;
  chiefComplaintRight: VisualAcuity | null;
  chiefComplaintLeft: VisualAcuity | null;
  
};



type Patient = {
  id: number;
  patientId: string;
  hospitalFileNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string | null;
  gender: string;
  bloodGroup: string;
  occupation?: string | null;
  dateOfBirth: string;
  address?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

type Encounter = {
  encounterId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  patient: Patient;
  consulting?: Consulting | null;
  continueConsulting?: ContinueConsulting | null;
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


const EncountersTable = () => {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [filteredEncounters, setFilteredEncounters] = useState<Encounter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patients/encounters`);
        setEncounters(response.data);
        setFilteredEncounters(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load encounters data.');
        setLoading(false);
      }
    };

    fetchEncounters();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = encounters.filter(
      (encounter) =>
        `${encounter.patient.firstName} ${encounter.patient.lastName}`.toLowerCase().includes(query)
    );
    setFilteredEncounters(filtered);
    setPage(0);
  };

  const handleView = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedEncounters = filteredEncounters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <h3>Encounters</h3>
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
              <TableCell>Encounter Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedEncounters.map((encounter) => (
              <TableRow key={encounter.encounterId}>
                <TableCell>{formatDate(encounter.createdAt)}</TableCell>
                <TableCell>
                  {encounter.patient.firstName} {encounter.patient.lastName}
                </TableCell>
                <TableCell>{encounter.patient.gender}</TableCell>
                <TableCell>{encounter.patient.bloodGroup}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(encounter)} color="primary">
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
          count={filteredEncounters.length}
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
      Encounter Details
    </Typography>
    {selectedEncounter && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedEncounter.patient.firstName} ${selectedEncounter.patient.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Gender:</strong> {selectedEncounter.patient.gender}
        </Typography>
        <Typography variant="body1">
          <strong>Blood Group:</strong> {selectedEncounter.patient.bloodGroup}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {selectedEncounter.patient.occupation || 'N/A'}
        </Typography>

        {/* <Typography variant="h6" gutterBottom mt={2}>
          Visual Acuity
        </Typography> */}
        {selectedEncounter.consulting ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Right Eye</strong></TableCell>
                  <TableCell><strong>Left Eye</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Visual Acuity Far Presenting</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityFarPresentingRight?.name || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityFarPresentingLeft?.name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visual AcuityFar Pinhole</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityFarPinholeRight?.name || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityFarPinholeLeft?.name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visual Acuity Far Best Corrected</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityFarBestCorrectedRight?.name || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityFarBestCorrectedLeft?.name || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visual Acuity Near</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityNearRight?.name || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter.consulting.visualAcuityNearLeft?.name || 'N/A'}</TableCell>
                </TableRow>
                {selectedEncounter?.continueConsulting && (
                  <>
                    <TableRow>
                      <TableCell>Intra Occular Pressure</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.intraOccularPressureRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.intraOccularPressureLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Chief Complaint</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.chiefComplaintRight?.name || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.chiefComplaintLeft?.name || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Other Complaints</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.otherComplaintsRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.otherComplaintsLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Detailed History</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.detailedHistoryRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.detailedHistoryLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Findings</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.findingsRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.findingsLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Eyelid </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.eyelidRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.eyelidLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Conjunctiva </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.conjunctivaRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.conjunctivaLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Cornea </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.corneaRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.corneaLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>AC </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.ACRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.ACLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Iris </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.irisRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.irisLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Pupil </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.pupilRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.pupilLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Lens </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.lensRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.lensLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Retina </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.retinaRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.retinaLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Vitreous </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.vitreousRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.vitreousLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Other Findings </TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.otherFindingsRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter.continueConsulting.otherFindingsLeft || 'N/A'}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">No consulting information available.</Typography>
        )}
      </>
    )}
  </Box>
</Modal>


    </>
  );
};

export default EncountersTable;
