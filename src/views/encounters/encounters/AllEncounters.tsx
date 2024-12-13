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

// type Consulting = {
//   consultingId: number;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   visualAcuityFarPresentingLeft?: VisualAcuity | null;
//   visualAcuityFarPresentingRight?: VisualAcuity | null;
//   visualAcuityFarPinholeRight?: VisualAcuity | null;
//   visualAcuityFarPinholeLeft?: VisualAcuity | null;
//   visualAcuityFarBestCorrectedLeft?: VisualAcuity | null;
//   visualAcuityFarBestCorrectedRight?: VisualAcuity | null;
//   visualAcuityNearLeft?: VisualAcuity | null;
//   visualAcuityNearRight?: VisualAcuity | null;
// };

// type ContinueConsulting = {
//   intraOccularPressureRight: string | null;
//   intraOccularPressureLeft: string | null;
//   otherComplaintsRight: string | null;
//   otherComplaintsLeft: string | null;
//   detailedHistoryRight: string | null;
//   detailedHistoryLeft: string | null;
//   findingsRight: string | null;
//   findingsLeft: string | null;
//   eyelidRight: string | null;
//   eyelidLeft: string | null;
//   conjunctivaRight: string | null;
//   conjunctivaLeft: string | null;
//   corneaRight: string | null;
//   corneaLeft: string | null;
//   ACRight: string | null;
//   ACLeft: string | null;
//   irisRight: string | null;
//   irisLeft: string | null;
//   pupilRight: string | null;
//   pupilLeft: string | null;
//   lensRight: string | null;
//   lensLeft: string | null;
//   vitreousRight: string | null;
//   vitreousLeft: string | null;
//   retinaRight: string | null;
//   retinaLeft: string | null;
//   otherFindingsRight: string | null;
//   otherFindingsLeft: string | null;
//   chiefComplaintRight: VisualAcuity | null;
//   chiefComplaintLeft: VisualAcuity | null;
  
// };



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
  // consulting?: Consulting | null;
  // continueConsulting?: ContinueConsulting | null;


  visualAcuityFarPresentingLeft?: VisualAcuity | null;
    visualAcuityFarPresentingRight?: VisualAcuity | null;
    visualAcuityFarPinholeRight?: VisualAcuity | null;
    visualAcuityFarPinholeLeft?: VisualAcuity | null;
    visualAcuityFarBestCorrectedLeft?: VisualAcuity | null;
    visualAcuityFarBestCorrectedRight?: VisualAcuity | null;
    visualAcuityNearLeft?: VisualAcuity | null;
    visualAcuityNearRight?: VisualAcuity | null;

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

  nearAddRight?: string | null;
nearAddLeft?: string | null; 
OCTRight?: string | null; 
OCTLeft?: string | null; 
FFARight?: string | null; 
FFALeft?: string | null; 
fundusPhotographyRight?: string | null;
fundusPhotographyLeft?: string | null;
pachymetryRight?: string | null;
pachymetryLeft?: string | null; 
CUFTRight?: string | null; 
CUFTLeft?: string | null; 
CUFTKineticRight?: string | null; 
CUFTKineticLeft?: string | null; 
pupilDistanceRight: string | null;
pupilDistanceLeft: string | null;
refractionSphereRight?: string | null;
refractionSphereLeft?: string | null; 
refractionCylinderRight?: string | null; 
refractionCylinderLeft?: string | null; 
refractionAxisRight?: string | null; 
refractionAxisLeft?: string | null; 
refractionPrismRight?: string | null;
refractionPrismLeft?: string | null;
diagnosisRight?: string | null;
diagnosisLeft?: string | null;

investigationsRequired?: string | null;  
externalInvestigationRequired?: string | null; 
investigationsDone?: string | null;
HBP?: string | null; 
diabetes?: string | null;  
pregnancy?: string | null;  
drugAllergy?: string | null;  
currentMedication?: string | null;  
documentId?: string | null;

treatmentType?: string | null;  
dosage?: string | null; 
doseDuration?: string | null;
doseInterval?: string | null; 
time?: string | null;  
comment?: string | null;  
lensType?: string | null;  
costOfLens?: string | null;
costOfFrame?: string | null;
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/encounters`);
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

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const query = e.target.value.toLowerCase();
  //   setSearchQuery(query);
  //   const filtered = encounters.filter(
  //     (encounter) =>
  //       `${encounter.patients.firstName} ${encounter.patients.lastName}`.toLowerCase().includes(query)
  //   );
  //   setFilteredEncounters(filtered);
  //   setPage(0);
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = encounters.filter((encounter) => {
      const fullName = `${encounter.patients.firstName || ''} ${encounter.patients.lastName || ''} ${encounter.patients.otherNames || ''}`.toLowerCase();
      
      return (
        fullName.includes(query)
      );
    });
  
    setFilteredEncounters(filtered);
    setPage(0); // Reset to the first page after search
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
                <TableCell>{formatDate(encounter?.created_at)}</TableCell>
                <TableCell>
                  {encounter?.firstName} {encounter?.lastName}
                </TableCell>
                <TableCell>{encounter?.gender}</TableCell>
                <TableCell>{encounter?.bloodGroup}</TableCell>
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
          <strong>Full Name:</strong> {`${selectedEncounter?.firstName} ${selectedEncounter?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Gender:</strong> {selectedEncounter?.gender}
        </Typography>
        <Typography variant="body1">
          <strong>Blood Group:</strong> {selectedEncounter?.bloodGroup}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {selectedEncounter?.occupation || 'N/A'}
        </Typography>

        {/* <Typography variant="h6" gutterBottom mt={2}>
          Visual Acuity
        </Typography> */}
        {selectedEncounter ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead><br/>
              <h4>Consulting</h4>
                <TableRow>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Right Eye</strong></TableCell>
                  <TableCell><strong>Left Eye</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Visual Acuity Far Presenting</TableCell>
                  <TableCell>{selectedEncounter.visualAcuityFarPresentingRight || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter.visualAcuityFarPresentingLeft || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visual AcuityFar Pinhole</TableCell>
                  <TableCell>{selectedEncounter?.visualAcuityFarPinholeRight || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter?.visualAcuityFarPinholeLeft || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visual Acuity Far Best Corrected</TableCell>
                  <TableCell>{selectedEncounter?.visualAcuityFarBestCorrectedRight || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter?.visualAcuityFarBestCorrectedLeft || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Visual Acuity Near</TableCell>
                  <TableCell>{selectedEncounter?.visualAcuityNearRight || 'N/A'}</TableCell>
                  <TableCell>{selectedEncounter?.visualAcuityNearLeft || 'N/A'}</TableCell>
                </TableRow>
                
               
                    <TableRow>
                      <TableCell>Intra Occular Pressure</TableCell>
                      <TableCell>{selectedEncounter?.intraOccularPressureRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.intraOccularPressureLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Chief Complaint</TableCell>
                      <TableCell>{selectedEncounter?.chiefComplaintRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.chiefComplaintLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Other Complaints</TableCell>
                      <TableCell>{selectedEncounter?.otherComplaintsRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.otherComplaintsLeft || 'N/A'}</TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>Detailed History</TableCell>
                      <TableCell>{selectedEncounter?.detailedHistoryRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.detailedHistoryLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Findings</TableCell>
                      <TableCell>{selectedEncounter?.findingsRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.findingsLeft || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Eyelid </TableCell>
                      <TableCell>{selectedEncounter?.eyelidRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.eyelidLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Conjunctiva </TableCell>
                      <TableCell>{selectedEncounter?.conjunctivaRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.conjunctivaLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Cornea </TableCell>
                      <TableCell>{selectedEncounter?.corneaRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.corneaLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>AC </TableCell>
                      <TableCell>{selectedEncounter?.ACRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.ACLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Iris </TableCell>
                      <TableCell>{selectedEncounter?.irisRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.irisLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Pupil </TableCell>
                      <TableCell>{selectedEncounter?.pupilRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.pupilLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Lens </TableCell>
                      <TableCell>{selectedEncounter?.lensRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.lensLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Retina </TableCell>
                      <TableCell>{selectedEncounter?.retinaRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.retinaLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Vitreous </TableCell>
                      <TableCell>{selectedEncounter?.vitreousRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.vitreousLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Other Findings </TableCell>
                      <TableCell>{selectedEncounter?.otherFindingsRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.otherFindingsLeft || 'N/A'}</TableCell>
                    </TableRow>


                    <h4>Refractions</h4>

                    <TableRow>
                      <TableCell>Near Add </TableCell>
                      <TableCell>{selectedEncounter?.nearAddRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.nearAddLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>OCT </TableCell>
                      <TableCell>{selectedEncounter?.OCTRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.OCTLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>FFA </TableCell>
                      <TableCell>{selectedEncounter?.FFARight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.FFALeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Fundus Photography </TableCell>
                      <TableCell>{selectedEncounter?.fundusPhotographyRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.fundusPhotographyLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Pachymetry</TableCell>
                      <TableCell>{selectedEncounter?.pachymetryRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.pachymetryLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>CUFT</TableCell>
                      <TableCell>{selectedEncounter?.CUFTRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.CUFTLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>CUFT Kinetic</TableCell>
                      <TableCell>{selectedEncounter?.CUFTKineticRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.CUFTKineticLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Pupil Distance</TableCell>
                      <TableCell>{selectedEncounter?.pupilDistanceRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.pupilDistanceLeft || 'N/A'}</TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>Refraction Sphere</TableCell>
                      <TableCell>{selectedEncounter?.refractionSphereRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.refractionSphereLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Refraction Cylinder</TableCell>
                      <TableCell>{selectedEncounter?.refractionCylinderRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.refractionCylinderLeft || 'N/A'}</TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>Refraction Axis</TableCell>
                      <TableCell>{selectedEncounter?.refractionAxisRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.refractionAxisLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Refraction Prism</TableCell>
                      <TableCell>{selectedEncounter?.refractionPrismRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.refractionPrismLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <h4>Diagnosis</h4>
                    <TableRow>
                      <TableCell>Diagnosis</TableCell>
                      <TableCell>{selectedEncounter?.diagnosisRight || 'N/A'}</TableCell>
                      <TableCell>{selectedEncounter?.diagnosisLeft || 'N/A'}</TableCell>
                    </TableRow>

                    <h4>Investigations</h4>
                    <TableRow>
                      <TableCell>Investigations Required</TableCell>
                      <TableCell>{selectedEncounter?.investigationsRequired || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>External Investigations Required</TableCell>
                      <TableCell>{selectedEncounter?.externalInvestigationRequired || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Investigations Done</TableCell>
                      <TableCell>{selectedEncounter?.investigationsDone || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>HBP</TableCell>
                      <TableCell>{selectedEncounter?.HBP || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Diabetes</TableCell>
                      <TableCell>{selectedEncounter?.diabetes || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Pregnancy</TableCell>
                      <TableCell>{selectedEncounter?.pregnancy || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Drug Allergy</TableCell>
                      <TableCell>{selectedEncounter?.drugAllergy || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Current Medication</TableCell>
                      <TableCell>{selectedEncounter?.currentMedication || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Uploaded Dcoument</TableCell>
                      <TableCell>{selectedEncounter?.documentId || 'N/A'}</TableCell>
                    </TableRow>


                  <h4>Treatment</h4>
                    <TableRow>
                      <TableCell>Treatment Type</TableCell>
                      <TableCell>{selectedEncounter?.treatmentType || 'N/A'}</TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>Dosage</TableCell>
                      <TableCell>{selectedEncounter?.documentId || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Dose Duration</TableCell>
                      <TableCell>{selectedEncounter?.doseDuration || 'N/A'}</TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>Dose Interval</TableCell>
                      <TableCell>{selectedEncounter?.doseInterval || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>{selectedEncounter?.time || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Comment</TableCell>
                      <TableCell>{selectedEncounter?.comment || 'N/A'}</TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell>Lens Type</TableCell>
                      <TableCell>{selectedEncounter?.lensType || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Cost Of Lens</TableCell>
                      <TableCell>{selectedEncounter?.costOfLens || 'N/A'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Cost Of Frame</TableCell>
                      <TableCell>{selectedEncounter?.costOfFrame || 'N/A'}</TableCell>
                    </TableRow>

               
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
