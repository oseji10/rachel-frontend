'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Print, Visibility } from '@mui/icons-material';
import CanvasDraw from 'react-canvas-draw';
import api from '@/app/utils/api';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Patient = {
  id: number;
  patientId: string;
  hospitalFileNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string | null;
  gender: string;
  cardNumber: string;
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
  consulting?: any;
  continue_consulting?: any;
  refractions?: any;
  sketches?: any;
  diagnosis?: any;
  appointments?: any;
  investigations?: any;
  treatments?: any;
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 1200,
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

const safeValue = (val: any): string => {
  if (!val) return 'N/A';
  if (typeof val === 'object' && val !== null && val.name) {
    return val.name;
  }
  return typeof val === 'string' ? val : 'N/A';
};

const safeArrayValue = (arr: any): string => {
  if (!arr || !Array.isArray(arr)) return 'N/A';
  return arr.map((item: any) => safeValue(item)).join(', ');
};

const EncountersTable = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedPatientEncounters, setSelectedPatientEncounters] = useState<Encounter[]>([]);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  // Refs for canvas
  const rightFrontRef = useRef<CanvasDraw>(null);
  const rightBackRef = useRef<CanvasDraw>(null);
  const leftFrontRef = useRef<CanvasDraw>(null);
  const leftBackRef = useRef<CanvasDraw>(null);

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_APP_URL}/encounters`);
        setPatients(response.data);
        setFilteredPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load encounters data.');
        setLoading(false);
      }
    };

    fetchEncounters();
  }, []);

  useEffect(() => {
    if (selectedEncounter) {
      if (rightFrontRef.current && selectedEncounter.sketches?.rightEyeFront) {
        rightFrontRef.current.loadSaveData(selectedEncounter.sketches.rightEyeFront);
      }
      if (rightBackRef.current && selectedEncounter.sketches?.rightEyeBack) {
        rightBackRef.current.loadSaveData(selectedEncounter.sketches.rightEyeBack);
      }
      if (leftFrontRef.current && selectedEncounter.sketches?.leftEyeFront) {
        leftFrontRef.current.loadSaveData(selectedEncounter.sketches.leftEyeFront);
      }
      if (leftBackRef.current && selectedEncounter.sketches?.leftEyeBack) {
        leftBackRef.current.loadSaveData(selectedEncounter.sketches.leftEyeBack);
      }
    }
  }, [selectedEncounter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = patients.filter((patient) => {
      const fullName = `${patient.firstName || ''} ${patient.lastName || ''} ${patient.otherNames || ''}`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredPatients(filtered);
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

  const encountersList = (patient: any) => {
    setSelectedPatientName(`${patient.firstName} ${patient.lastName}`);
    setSelectedPatientEncounters(patient.encounters || []);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const displayedPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
              <TableCell>Latest Encounter Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Card Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{formatDate(patient.encounters?.[0]?.created_at || '')}</TableCell>
                <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.cardNumber}</TableCell>
                <TableCell>
                  <IconButton onClick={() => encountersList(patient)} color="primary">
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
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal to show patient encounters */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedPatientName}'s Encounters</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Encounter Date</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPatientEncounters.map((encounter) => (
                  <TableRow key={encounter.encounterId}>
                    <TableCell>{formatDate(encounter?.created_at)} at {new Date(encounter?.created_at).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleView(encounter)} color="primary">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color="primary">
            Close
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Modal to view patient details */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          {selectedEncounter && (
            <div>
              <h1>Encounter Date: {formatDate(selectedEncounter?.created_at)}</h1>

              {/* Consulting Information */}
              <h2>Consulting Information</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Right Eye</strong></TableCell>
                      <TableCell><strong>Left Eye</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Chief Complaint</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.chief_complaint_right)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.chief_complaint_left)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Other Complaints</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.otherComplaintsRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.otherComplaintsLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Detailed History</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.detailedHistoryRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.detailedHistoryLeft)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Physical Information */}
              <h2>Physical Information</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>High Blood Pressure (HBP)</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.HBP)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Diabetes</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.diabetes)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Pregnancy</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.pregnancy)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Food Allergies</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.food)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Drug Allergy</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.drugAllergy)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Current Medication</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.currentMedication)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Findings */}
              <h2>Findings</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Right Eye</strong></TableCell>
                      <TableCell><strong>Left Eye</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Intra Occular Pressure</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.intraOccularPressureRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.intraOccularPressureLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Visual Acuity Far Presenting</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_far_presenting_right?.name)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_far_presenting_left?.name)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Visual Acuity Far Pinhole</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_far_pinhole_right?.name)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_far_pinhole_left?.name)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Visual Acuity Far Best Corrected</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_far_best_corrected_right?.name)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_far_best_corrected_left?.name)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Visual Acuity Near</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_near_right?.name)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.consulting?.visual_acuity_near_left?.name)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Findings</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.findingsRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.findingsLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Eyelid</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.eyelidRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.eyelidLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Conjunctiva</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.conjunctivaRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.conjunctivaLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Cornea</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.corneaRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.corneaLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Anterior Chamber (AC)</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.ACRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.ACLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Iris</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.irisRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.irisLeft)}</TableCell>
                    </TableRow>
                    {/* <TableRow>
                      <TableCell><strong>Pupil</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.pupilRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.pupilLeft)}</TableCell>
                    </TableRow> */}
                    <TableRow>
                      <TableCell><strong>Lens</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.lensRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.lensLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Vitreous</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.vitreousRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.vitreousLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Retina</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.retinaRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.retinaLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Other Findings</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.otherFindingsRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.otherFindingsLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>OCT</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.OCTRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.OCTLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>FFA</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.FFARight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.FFALeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Fundus Photography</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.fundusPhotographyRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.fundusPhotographyLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Pachymetry</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.pachymetryRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.pachymetryLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>CVFT</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.CVFTRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.CVFTLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>CVFT Kinetic</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.CVFTKineticRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.continue_consulting?.CVFTKineticLeft)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Refraction */}
              <h2>Refraction Information</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Right Eye</strong></TableCell>
                      <TableCell><strong>Left Eye</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Near Add</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.nearAddRight)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.nearAddLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Refraction Sphere</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.sphere_right)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.sphere_left)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Refraction Cylinder</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.cylinder_right)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.cylinder_left)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Refraction Axis</strong></TableCell>
                      <TableCell dangerouslySetInnerHTML={{ __html: safeValue(selectedEncounter?.refractions?.axis_right) }} />
                      <TableCell dangerouslySetInnerHTML={{ __html: safeValue(selectedEncounter?.refractions?.axis_left) }} />
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Refraction Prism</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.prism_right)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.refractions?.prism_left)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Pupillary Distance (PD)</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.pd)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Bridge</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.bridge)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Eye Size</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.eyeSize)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Temple</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.temple)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Decentration</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.decentration)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Segment Measurement</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.segmentMeasurement)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Case Size</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.caseSize)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Frame Type</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.frameType)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Frame Color</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.frameColor)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Frame Cost</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.frameCost)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Lens Type</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.lensType)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Lens Color</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.lensColor)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Lens Cost</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.lensCost)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Surfacing</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.surfacing)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Other Notes</strong></TableCell>
                      <TableCell colSpan={2}>{safeValue(selectedEncounter?.refractions?.other)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Sketches */}
              <h2>Sketches</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>View</strong></TableCell>
                      <TableCell><strong>Right Eye</strong></TableCell>
                      <TableCell><strong>Left Eye</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Front</strong></TableCell>
                      <TableCell>
                        <CanvasDraw
                          ref={rightFrontRef}
                          disabled={true}
                          hideGrid={true}
                          canvasWidth={300}
                          canvasHeight={300}
                          className="border border-gray-300 rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <CanvasDraw
                          ref={leftFrontRef}
                          disabled={true}
                          hideGrid={true}
                          canvasWidth={300}
                          canvasHeight={300}
                          className="border border-gray-300 rounded-lg"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Back</strong></TableCell>
                      <TableCell>
                        <CanvasDraw
                          ref={rightBackRef}
                          disabled={true}
                          hideGrid={true}
                          canvasWidth={300}
                          canvasHeight={300}
                          className="border border-gray-300 rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <CanvasDraw
                          ref={leftBackRef}
                          disabled={true}
                          hideGrid={true}
                          canvasWidth={300}
                          canvasHeight={300}
                          className="border border-gray-300 rounded-lg"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Diagnosis */}
              <h2>Diagnosis</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Right Eye</strong></TableCell>
                      <TableCell><strong>Left Eye</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Problems Identified</strong></TableCell>
                      <TableCell>{safeArrayValue(selectedEncounter?.diagnosis?.problemsRight)}</TableCell>
                      <TableCell>{safeArrayValue(selectedEncounter?.diagnosis?.problemsLeft)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Overall Diagnosis</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.diagnosis?.diagnosis_right_details)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.diagnosis?.diagnosis_left_details)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Investigations */}
              <h2>Investigations</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Investigations Required</strong></TableCell>
                      <TableCell>{safeArrayValue(selectedEncounter?.investigations?.investigationsRequired)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Other Investigations Required</strong></TableCell>
                      <TableCell>{'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>External Investigations Required</strong></TableCell>
                      <TableCell>{safeValue(selectedEncounter?.investigations?.externalInvestigationRequired)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Investigations Done</strong></TableCell>
                      <TableCell>{safeArrayValue(selectedEncounter?.investigations?.investigationsDone)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Other Investigations Done</strong></TableCell>
                      <TableCell>{'N/A'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Treatments */}
              <h2>Treatments</h2>
              <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Medicine</strong></TableCell>
                      <TableCell><strong>Dosage</strong></TableCell>
                      <TableCell><strong>Dose Duration</strong></TableCell>
                      <TableCell><strong>Dose Interval</strong></TableCell>
                      <TableCell><strong>Comment</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{safeValue(selectedEncounter?.treatments?.treatmentType)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.treatments?.medicine)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.treatments?.dosage)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.treatments?.doseDuration)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.treatments?.doseInterval)}</TableCell>
                      <TableCell>{safeValue(selectedEncounter?.treatments?.comment)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Next Appointment */}
              {selectedEncounter?.appointments && (
                <h3><strong>Next Appointment:</strong> {selectedEncounter.appointments.appointmentDate} at {selectedEncounter.appointments.appointmentTime}</h3>
              )}

              {/* Close Button */}
              <Button onClick={() => setOpenViewModal(false)} variant="contained" style={{ marginTop: '20px' }}>
                Close
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default EncountersTable;