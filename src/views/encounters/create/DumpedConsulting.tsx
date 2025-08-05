'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import CanvasDraw from 'react-canvas-draw';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Swal from 'sweetalert2';
import { StepLabel } from '@mui/material';

const Consulting = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');

  const rightEyeFrontRef = useRef(null);
  const rightEyeBackRef = useRef(null);
  const leftEyeFrontRef = useRef(null);
  const leftEyeBackRef = useRef(null);

  const [visualAcuityFar, setVisualAcuityFar] = useState([]);
  const [visualAcuityNear, setVisualAcuityNear] = useState([]);
  const [chiefComplaintOptions, setChiefComplaintOptions] = useState([]);
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [refractionAxis, setRefractionAxis] = useState([]);
  const [refractionSphere, setRefractionSphere] = useState([]);
  const [refractionCylinder, setRefractionCylinder] = useState([]);
  const [refractionPrism, setRefractionPrism] = useState([]);
  const [medicineList, setMedicineList] = useState([]);
  const [brushColor, setBrushColor] = useState('#000000');
  const [formData, setFormData] = useState({
    chiefComplaintRight: '',
    chiefComplaintLeft: '',
    intraOccularPressureRight: '',
    intraOccularPressureLeft: '',
    otherComplaintsRight: '',
    otherComplaintsLeft: '',
    detailedHistoryRight: '',
    detailedHistoryLeft: '',
    visualAcuityFarBestCorrectedLeft: '',
    visualAcuityFarBestCorrectedRight: '',
    visualAcuityFarPresentingLeft: '',
    visualAcuityFarPresentingRight: '',
    visualAcuityFarPinholeRight: '',
    visualAcuityFarPinholeLeft: '',
    visualAcuityNearLeft: '',
    visualAcuityNearRight: '',
    findingsRight: '',
    findingsLeft: '',
    eyelidRight: '',
    eyelidLeft: '',
    conjunctivaRight: '',
    conjunctivaLeft: '',
    corneaRight: '',
    corneaLeft: '',
    ACRight: '',
    ACLeft: '',
    irisRight: '',
    irisLeft: '',
    pupilRight: '',
    pupilLeft: '',
    lensRight: '',
    lensLeft: '',
    vitreousRight: '',
    vitreousLeft: '',
    retinaRight: '',
    retinaLeft: '',
    otherFindingsRight: '',
    otherFindingsLeft: '',
    nearAddRight: '',
    nearAddLeft: '',
    OCTRight: '',
    OCTLeft: '',
    FFARight: '',
    FFALeft: '',
    fundusPhotographyRight: '',
    fundusPhotographyLeft: '',
    pachymetryRight: '',
    pachymetryLeft: '',
    CUFTRight: '',
    CUFTLeft: '',
    CUFTKineticRight: '',
    CUFTKineticLeft: '',
    refractionSphereRight: '',
    refractionSphereLeft: '',
    refractionCylinderRight: '',
    refractionCylinderLeft: '',
    refractionAxisRight: '',
    refractionAxisLeft: '',
    refractionPrismRight: '',
    refractionPrismLeft: '',
    diagnosisRight: '',
    diagnosisLeft: '',
    investigationsRequired: '',
    externalInvestigationsRequired: '',
    investigationsDone: '',
    HBP: false,
    diabetes: false,
    pregnancy: false,
    food: '',
    drugAllergy: '',
    currentMedication: '',
  });
  const [eyeDrops, setEyeDrops] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [tablets, setTablets] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [ointments, setOintments] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [prescriptionGlasses, setPrescriptionGlasses] = useState([{ lensType: '' }]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [canvasData, setCanvasData] = useState({
    rightEyeFront: null,
    rightEyeBack: null,
    leftEyeFront: null,
    leftEyeBack: null,
  });

  const doseDurationOptions = [
    '1/7', '2/7', '3/7', '4/7', '5/7', '8/7', '9/7', '10/7', '11/7', '12/7', '13/7', '14/7',
    '1/52', '2/52', '3/52', '4/52',
    '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12', '14/12'
  ];
  const dosageOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'When necessary'];
  const quantityOptions = Array.from({ length: 150 }, (_, i) => (i + 1).toString());

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem(`formData_${patientId}_${encounterId}`);
    const savedEyeDrops = localStorage.getItem(`eyeDrops_${patientId}_${encounterId}`);
    const savedTablets = localStorage.getItem(`tablets_${patientId}_${encounterId}`);
    const savedOintments = localStorage.getItem(`ointments_${patientId}_${encounterId}`);
    const savedPrescriptionGlasses = localStorage.getItem(`prescriptionGlasses_${patientId}_${encounterId}`);
    const savedCanvasData = localStorage.getItem(`canvasData_${patientId}_${encounterId}`);
    const savedActiveStep = localStorage.getItem(`activeStep_${patientId}_${encounterId}`);

    if (savedFormData) setFormData(JSON.parse(savedFormData));
    if (savedEyeDrops) setEyeDrops(JSON.parse(savedEyeDrops));
    if (savedTablets) setTablets(JSON.parse(savedTablets));
    if (savedOintments) setOintments(JSON.parse(savedOintments));
    if (savedPrescriptionGlasses) setPrescriptionGlasses(JSON.parse(savedPrescriptionGlasses));
    if (savedCanvasData) setCanvasData(JSON.parse(savedCanvasData));
    if (savedActiveStep) setActiveStep(parseInt(savedActiveStep, 10));
  }, [patientId, encounterId]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`formData_${patientId}_${encounterId}`, JSON.stringify(formData));
  }, [formData, patientId, encounterId]);

  useEffect(() => {
    localStorage.setItem(`eyeDrops_${patientId}_${encounterId}`, JSON.stringify(eyeDrops));
  }, [eyeDrops, patientId, encounterId]);

  useEffect(() => {
    localStorage.setItem(`tablets_${patientId}_${encounterId}`, JSON.stringify(tablets));
  }, [tablets, patientId, encounterId]);

  useEffect(() => {
    localStorage.setItem(`ointments_${patientId}_${encounterId}`, JSON.stringify(ointments));
  }, [ointments, patientId, encounterId]);

  useEffect(() => {
    localStorage.setItem(`prescriptionGlasses_${patientId}_${encounterId}`, JSON.stringify(prescriptionGlasses));
  }, [prescriptionGlasses, patientId, encounterId]);

  useEffect(() => {
    localStorage.setItem(`canvasData_${patientId}_${encounterId}`, JSON.stringify(canvasData));
  }, [canvasData, patientId, encounterId]);

  useEffect(() => {
    localStorage.setItem(`activeStep_${patientId}_${encounterId}`, activeStep.toString());
  }, [activeStep, patientId, encounterId]);

  // Restore canvas sketches when navigating to the sketch step
  useEffect(() => {
    if (activeStep === 4) {
      if (canvasData.rightEyeFront && rightEyeFrontRef.current) {
        rightEyeFrontRef.current.loadSaveData(canvasData.rightEyeFront, true);
      }
      if (canvasData.rightEyeBack && rightEyeBackRef.current) {
        rightEyeBackRef.current.loadSaveData(canvasData.rightEyeBack, true);
      }
      if (canvasData.leftEyeFront && leftEyeFrontRef.current) {
        leftEyeFrontRef.current.loadSaveData(canvasData.leftEyeFront, true);
      }
      if (canvasData.leftEyeBack && leftEyeBackRef.current) {
        leftEyeBackRef.current.loadSaveData(canvasData.leftEyeBack, true);
      }
    }
  }, [activeStep, canvasData]);

  // Save canvas data to state when canvas changes
  const saveCanvasData = () => {
    setCanvasData({
      rightEyeFront: rightEyeFrontRef.current?.getSaveData() || null,
      rightEyeBack: rightEyeBackRef.current?.getSaveData() || null,
      leftEyeFront: leftEyeFrontRef.current?.getSaveData() || null,
      leftEyeBack: leftEyeBackRef.current?.getSaveData() || null,
    });
  };

  // Fetch data for options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farResponse, nearResponse, complaintResponse, diagnosisResponse, axisRes, sphereRes, cylinderRes, prismRes, medicineRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/visual_acuity_far`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/visual_acuity_near`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/chief_complaint`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/diagnosis_list`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_axis`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_sphere`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_cylinder`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_prism`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`),
        ]);
        setVisualAcuityFar(Array.isArray(farResponse.data) ? farResponse.data : []);
        setVisualAcuityNear(Array.isArray(nearResponse.data) ? nearResponse.data : []);
        setChiefComplaintOptions(Array.isArray(complaintResponse.data) ? complaintResponse.data : []);
        setDiagnosisList(Array.isArray(diagnosisResponse.data) ? diagnosisResponse.data : []);
        setRefractionAxis(Array.isArray(axisRes.data) ? axisRes.data : []);
        setRefractionSphere(Array.isArray(sphereRes.data) ? sphereRes.data : []);
        setRefractionCylinder(Array.isArray(cylinderRes.data) ? cylinderRes.data : []);
        setRefractionPrism(Array.isArray(prismRes.data) ? prismRes.data : []);
        setMedicineList(Array.isArray(medicineRes.data) ? medicineRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load options.',
        });
      }
    };
    fetchData();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTableInputChange = (index, field, value, state, setter) => {
    const updatedRows = [...state];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setter(updatedRows);
  };

  const handleAddRow = (setter) => {
    setter((prev) => [...prev, { medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  };

  const handleRemoveRow = (index, state, setter) => {
    setter(state.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (activeStep === 4) {
      saveCanvasData();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 4) {
      saveCanvasData();
    }
    setActiveStep((prev) => prev - 1);
  };

  const handleStep = (step) => () => {
    if (activeStep === 4) {
      saveCanvasData();
    }
    setActiveStep(step);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const normalizeData = (data) => {
      return data.map(item => {
        const normalizedItem = {};
        for (const [key, value] of Object.entries(item)) {
          normalizedItem[key] = value || null;
        }
        return normalizedItem;
      });
    };

    const sketches = {
      rightEyeFront: rightEyeFrontRef.current?.getSaveData() || null,
      rightEyeBack: rightEyeBackRef.current?.getSaveData() || null,
      leftEyeFront: leftEyeFrontRef.current?.getSaveData() || null,
      leftEyeBack: leftEyeBackRef.current?.getSaveData() || null,
    };

    const payload = {
      patientId,
      encounterId,
      ...formData,
      ...sketches,
      eyeDrops: normalizeData(eyeDrops),
      tablets: normalizeData(tablets),
      ointments: normalizeData(ointments),
      prescriptionGlasses: normalizeData(prescriptionGlasses),
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/consulting`, payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Consultation data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
      // Clear localStorage on successful submission
      localStorage.removeItem(`formData_${patientId}_${encounterId}`);
      localStorage.removeItem(`eyeDrops_${patientId}_${encounterId}`);
      localStorage.removeItem(`tablets_${patientId}_${encounterId}`);
      localStorage.removeItem(`ointments_${patientId}_${encounterId}`);
      localStorage.removeItem(`prescriptionGlasses_${patientId}_${encounterId}`);
      localStorage.removeItem(`canvasData_${patientId}_${encounterId}`);
      localStorage.removeItem(`activeStep_${patientId}_${encounterId}`);
      router.push(`/dashboard/appointments/encounter-appointment?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}&encounterId=${encounterId}`);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting data.',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title, rows, setter, fields) => (
    <div className="mt-4">
      <Typography variant="h6" className="text-gray-700 mb-2">{title}</Typography>
      <Grid container spacing={2}>
        {rows.map((row, index) => (
          <Grid container spacing={2} key={index}>
            {fields.map((field) => (
              <Grid item xs={3} key={field.name}>
                {field.type === 'select' ? (
                  <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={row[field.name] || ''}
                      onChange={(e) => handleTableInputChange(index, field.name, e.target.value, rows, setter)}
                      className="rounded-lg"
                    >
                      {(field.options || []).map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    label={field.label}
                    value={row[field.name] || ''}
                    onChange={(e) => handleTableInputChange(index, field.name, e.target.value, rows, setter)}
                    fullWidth
                    className="rounded-lg"
                    variant="outlined"
                  />
                )}
              </Grid>
            ))}
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveRow(index, rows, setter)} color="error">
                <RemoveCircleIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="secondary" onClick={() => handleAddRow(setter)} className="mt-2 bg-blue-500 hover:bg-blue-600">
        Add More
      </Button>
    </div>
  );

  const steps = ['Chief Complaints & History', 'Visual Acuity', 'Examination Findings', 'Refraction', 'Sketch', 'Diagnosis', 'Investigation', 'Treatment'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={4}>
            {['Right', 'Left'].map((side) => (
              <Grid item xs={12} sm={6} key={`chiefComplaint${side}`}>
                <FormControl fullWidth>
                  <InputLabel>Chief Complaint ({side})</InputLabel>
                  <Select
                    value={formData[`chiefComplaint${side}`]}
                    onChange={(e) => handleFormChange(`chiefComplaint${side}`, e.target.value)}
                    className="rounded-lg"
                  >
                    {chiefComplaintOptions.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
            {['intraOccularPressure', 'otherComplaints', 'detailedHistory'].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <TextField
                    label={`${field.replace(/([A-Z])/g, ' $1').trim()} (${side})`}
                    multiline
                    rows={3}
                    fullWidth
                    value={formData[`${field}${side}`]}
                    onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                    className="rounded-lg"
                    variant="outlined"
                  />
                </Grid>
              ))
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={4}>
            {[
              { label: 'Far Best Corrected Left', field: 'visualAcuityFarBestCorrectedLeft' },
              { label: 'Far Best Corrected Right', field: 'visualAcuityFarBestCorrectedRight' },
              { label: 'Far Presenting Left', field: 'visualAcuityFarPresentingLeft' },
              { label: 'Far Presenting Right', field: 'visualAcuityFarPresentingRight' },
              { label: 'Far Pinhole Right', field: 'visualAcuityFarPinholeRight' },
              { label: 'Far Pinhole Left', field: 'visualAcuityFarPinholeLeft' },
              { label: 'Near Left', field: 'visualAcuityNearLeft' },
              { label: 'Near Right', field: 'visualAcuityNearRight' },
            ].map(({ label, field }) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    value={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    className="rounded-lg"
                  >
                    {(field.includes('Near') ? visualAcuityNear : visualAcuityFar).map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={4}>
            {['findings', 'eyelid', 'conjunctiva', 'cornea', 'AC', 'iris', 'pupil', 'lens', 'vitreous', 'retina', 'otherFindings'].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <TextField
                    label={`${field.replace(/([A-Z])/g, ' $1').trim()} (${side})`}
                    multiline
                    rows={3}
                    fullWidth
                    value={formData[`${field}${side}`]}
                    onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                    className="rounded-lg"
                    variant="outlined"
                  />
                </Grid>
              ))
            )}
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={4}>
            {[
              'nearAdd', 'OCT', 'FFA', 'fundusPhotography', 'pachymetry', 'CUFT', 'CUFTKinetic', 'pupil'
            ].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <TextField
                    label={`${field.replace(/([A-Z])/g, ' $1').trim()} (${side})`}
                    fullWidth
                    value={formData[`${field}${side}`]}
                    onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                    className="rounded-lg"
                    variant="outlined"
                  />
                </Grid>
              ))
            )}
            {['refractionSphere', 'refractionCylinder', 'refractionAxis', 'refractionPrism'].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <FormControl fullWidth>
                    <InputLabel>{`${field.replace(/([A-Z])/g, ' $1').trim()} (${side})`}</InputLabel>
                    <Select
                      value={formData[`${field}${side}`]}
                      onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                      className="rounded-lg"
                    >
                      {(field === 'refractionSphere'
                        ? refractionSphere
                        : field === 'refractionCylinder'
                        ? refractionCylinder
                        : field === 'refractionAxis'
                        ? refractionAxis
                        : refractionPrism
                      ).map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          <span dangerouslySetInnerHTML={{ __html: option.name }} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))
            )}
          </Grid>
        );
      case 4:
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" className="text-gray-700 mb-4">Sketch Pad</Typography>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4} width="100%">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Right Eye Front</Typography>
                <CanvasDraw
                  ref={rightEyeFrontRef}
                  brushColor={brushColor}
                  brushRadius={0.5}
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                  onChange={saveCanvasData}
                />
                <Button variant="contained" color="secondary" onClick={() => rightEyeFrontRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Right Eye Back</Typography>
                <CanvasDraw
                  ref={rightEyeBackRef}
                  brushColor={brushColor}
                  brushRadius={0.5}
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                  onChange={saveCanvasData}
                />
                <Button variant="contained" color="secondary" onClick={() => rightEyeBackRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Left Eye Front</Typography>
                <CanvasDraw
                  ref={leftEyeFrontRef}
                  brushColor={brushColor}
                  brushRadius={0.5}
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                  onChange={saveCanvasData}
                />
                <Button variant="contained" color="secondary" onClick={() => leftEyeFrontRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Left Eye Back</Typography>
                <CanvasDraw
                  ref={leftEyeBackRef}
                  brushColor={brushColor}
                  brushRadius={0.5}
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                  onChange={saveCanvasData}
                />
                <Button variant="contained" color="secondary" onClick={() => leftEyeBackRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
              <Typography variant="subtitle1" className="text-gray-700 mb-2">Brush Color</Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#ff0000', color: '#fff' }}
                  onClick={() => setBrushColor('#ff0000')}
                  className="hover:bg-red-700"
                >
                  Red
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#0000ff', color: '#fff' }}
                  onClick={() => setBrushColor('#0000ff')}
                  className="hover:bg-blue-700"
                >
                  Blue
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#008000', color: '#fff' }}
                  onClick={() => setBrushColor('#008000')}
                  className="hover:bg-green-700"
                >
                  Green
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: '#000000', color: '#fff' }}
                  onClick={() => setBrushColor('#000000')}
                  className="hover:bg-gray-700"
                >
                  Black
                </Button>
              </Box>
            </Box>
          </Box>
        );
      case 5:
        return (
          <Grid container spacing={4}>
            {['diagnosisRight', 'diagnosisLeft'].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{`Diagnosis (${field.includes('Right') ? 'Right' : 'Left'})`}</InputLabel>
                  <Select
                    value={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    className="rounded-lg"
                  >
                    {diagnosisList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        );
      case 6:
        return (
          <Grid container spacing={4}>
            {[
              { field: 'investigationsRequired', label: 'Investigations Required' },
              { field: 'externalInvestigationsRequired', label: 'External Investigations Required' },
              { field: 'investigationsDone', label: 'Investigations Done' },
            ].map(({ field, label }) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={label}
                  multiline
                  rows={3}
                  fullWidth
                  value={formData[field]}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  className="rounded-lg"
                  variant="outlined"
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="h6" className="text-gray-700">Physical Information</Typography>
            </Grid>
            {[
              { label: 'HBP', field: 'HBP' },
              { label: 'Diabetes', field: 'diabetes' },
              { label: 'Pregnancy', field: 'pregnancy' },
            ].map(({ label, field }) => (
              <Grid item xs={12} sm={4} key={field}>
                <FormControl className="flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.checked)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <Typography variant="body2" className="text-gray-700">{label}</Typography>
                </FormControl>
              </Grid>
            ))}
            {[
              { label: 'Food', field: 'food' },
              { label: 'Drug Allergy', field: 'drugAllergy' },
              { label: 'Current Medication', field: 'currentMedication' },
            ].map(({ label, field }) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={label}
                  multiline
                  rows={3}
                  fullWidth
                  value={formData[field]}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  className="rounded-lg"
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        );
      case 7:
        return (
          <Grid container spacing={4}>
            {renderTable('Eye Drops', eyeDrops, setEyeDrops, [
              { name: 'medicine', label: 'Medicine', type: 'select', options: medicineList.map(m => m.name) },
              { name: 'dosage', label: 'Dosage', type: 'select', options: dosageOptions },
              { name: 'doseDuration', label: 'Dosage Duration', type: 'select', options: doseDurationOptions },
              { name: 'doseInterval', label: 'Quantity', type: 'select', options: quantityOptions },
              { name: 'comment', label: 'Comment' },
            ])}
            {renderTable('Tablets', tablets, setTablets, [
              { name: 'medicine', label: 'Medicine', type: 'select', options: medicineList.map(m => m.name) },
              { name: 'dosage', label: 'Dosage', type: 'select', options: dosageOptions },
              { name: 'doseDuration', label: 'Dosage Duration', type: 'select', options: doseDurationOptions },
              { name: 'doseInterval', label: 'Quantity', type: 'select', options: quantityOptions },
              { name: 'comment', label: 'Comment' },
            ])}
            {renderTable('Ointments', ointments, setOintments, [
              { name: 'medicine', label: 'Medicine', type: 'select', options: medicineList.map(m => m.name) },
              { name: 'dosage', label: 'Dosage', type: 'select', options: dosageOptions },
              { name: 'doseDuration', label: 'Dosage Duration', type: 'select', options: doseDurationOptions },
              { name: 'doseInterval', label: 'Quantity', type: 'select', options: quantityOptions },
              { name: 'comment', label: 'Comment' },
            ])}
            {renderTable('Prescription Glasses', prescriptionGlasses, setPrescriptionGlasses, [
              { name: 'lensType', label: 'Lens Type' },
            ])}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
      <CardContent className="p-6 sm:p-10">
        <Typography variant="h4" className="text-2xl font-bold text-gray-800 mb-4">
          Eye Clinic Consultation
        </Typography>
        <Typography variant="h6" className="text-gray-600 mb-6">
          Patient: {patientName}
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton onClick={handleStep(index)}>
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {getStepContent(activeStep)}
          <Grid container spacing={4} className="mt-6">
            <Grid item xs={12} className="flex justify-between">
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  Next
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default Consulting;