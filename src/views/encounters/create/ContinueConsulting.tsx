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
// import RemoveCircleIcon from '@mui/icons-material-RemoveCircle';
import RemoveCircle from '@mui/icons-material/RemoveCircle'
import Swal from 'sweetalert2';
import { StepLabel } from '@mui/material';


const Consulting = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');

  const rightEyeRef = useRef(null);
  const rightEyeBackRef = useRef(null);
  const leftEyeRef = useRef(null);
  const leftEyeBackRef = useRef(null);

  // const [visualAcuityFar, setVisualAcuityFar] = useState([]);
  // const [visualAcuityNear, setVisualAcuityNear] = useState([]);
  // const [chiefComplaintOptions, setChiefComplaintOptions] = useState([]);
  // const [diagnosisList, setDiagnosisList] = useState([]);
  // const [refractionAxis, setRefractionAxis] = useState([]);
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
    CVFTRight: '',
    CVFTLeft: '',
    CVFTKineticRight: '',
    CVFTKineticLeft: '',
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
    visualAcuityNear: '',
  });

  const [eyeDrops, setEyeDrops] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [tablets, setTablets] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [ointments, setOintments] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [prescriptionGlasses, setPrescriptionGlasses] = useState([{ lensType: '' }]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  
  const doseDurationOptions = [
    '1/7', '2/7', '3/7', '4/7', '5/7', '6/7', '7/7', '8/7', '9/7', '10/7', '11/7', '12/7', '13/7', '14/7',
    '1/52', '2/52', '3/52', '4/52',
    '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12', '12/12', '13/12', '14/12'
  ];

  const chiefComplaintOptions = [
    {"id": 1, "name": "Pain",},
    {"id": 2, "name": "Watering"},
    {"id": 3, "name": "Loss of vision"},
    {"id": 4, "name": "Redness"},
    {"id": 5, "name": "Swelling", "status": "active"},
    {"id": 6, "name": "Other", "status": "active" }
];

const visualAcuityFar = [
    { "id": 1, "name": "NPL", "status": "active" },
    { "id": 2, "name": "PL", "status": "active" },
    { "id": 3, "name": "HM", "status": "active" },
    { "id": 4, "name": "6/60", "status": "active" },
    { "id": 5, "name": "6/36", "status": "active" },
    { "id": 6, "name": "6/24", "status": "active" },
    { "id": 7, "name": "6/18", "status": "active" },
    { "id": 8, "name": "6/12", "status": "active" },
    { "id": 9, "name": "6/9",  "status": "active" },
    { "id": 10, "name": "6/6", "status": "active" },
    { "id": 11, "name": "6/5", "status": "active" },
    { "id": 12, "name": "6/4", "status": "active" }
];

const visualAcuityNear = [
    { "id": 1, "name": "NPL", "status": "active" },
    { "id": 2, "name": "PL", "status": "active" },
    { "id": 3, "name": "HM", "status": "active" },
    { "id": 4, "name": "6/60", "status": "active" },
    { "id": 5, "name": "6/36", "status": "active" },
    { "id": 6, "name": "6/24", "status": "active" },
    { "id": 7, "name": "6/18", "status": "active" },
    { "id": 8, "name": "6/12", "status": "active" },
    { "id": 9, "name": "6/9",  "status": "active" },
    { "id": 10, "name": "6/6", "status": "active" },
    { "id": 11, "name": "6/5", "status": "active" },
    { "id": 12, "name": "6/4", "status": "active" }
];


const refractionAxis = [
    { "id": 1, "name": "0<sup>0</sup>", "status": "active" },
    { "id": 2, "name": "1<sup>0</sup>", "status": "active" },
    { "id": 3, "name": "2<sup>0</sup>", "status": "active" },
    { "id": 4, "name": "3<sup>0</sup>", "status": "active" },
    { "id": 5, "name": "4<sup>0</sup>", "status": "active" },
    { "id": 6, "name": "5<sup>0</sup>", "status": "active" },
    { "id": 7, "name": "6<sup>0</sup>", "status": "active" },
    { "id": 8, "name": "7<sup>0</sup>", "status": "active" },
    { "id": 9, "name": "8<sup>0</sup>", "status": "active" },
    { "id": 10, "name": "9<sup>0</sup>", "status": "active" },
    { "id": 11, "name": "10<sup>0</sup>", "status": "active" },
    { "id": 12, "name": "11<sup>0</sup>", "status": "active" },
    { "id": 13, "name": "12<sup>0</sup>", "status": "active" },
    { "id": 14, "name": "13<sup>0</sup>", "status": "active" },
    { "id": 15, "name": "14<sup>0</sup>", "status": "active" },
    { "id": 16, "name": "15<sup>0</sup>", "status": "active" },
    { "id": 17, "name": "16<sup>0</sup>", "status": "active" },
    { "id": 18, "name": "17<sup>0</sup>", "status": "active" },
    { "id": 19, "name": "18<sup>0</sup>", "status": "active" },
    { "id": 20, "name": "19<sup>0</sup>", "status": "active" },
    { "id": 21, "name": "20<sup>0</sup>", "status": "active" },
    { "id": 22, "name": "21<sup>0</sup>", "status": "active" },
    { "id": 23, "name": "22<sup>0</sup>", "status": "active" },
    { "id": 24, "name": "23<sup>0</sup>", "status": "active" },
    { "id": 25, "name": "24<sup>0</sup>", "status": "active" },
    { "id": 26, "name": "25<sup>0</sup>", "status": "active" },
    { "id": 27, "name": "26<sup>0</sup>", "status": "active" },
    { "id": 28, "name": "27<sup>0</sup>", "status": "active" },
    { "id": 29, "name": "28<sup>0</sup>", "status": "active" },
    { "id": 30, "name": "29<sup>0</sup>", "status": "active" },
    { "id": 31, "name": "30<sup>0</sup>", "status": "active" },
    { "id": 32, "name": "31<sup>0</sup>", "status": "active" },
    { "id": 33, "name": "32<sup>0</sup>", "status": "active" },
    { "id": 34, "name": "33<sup>0</sup>", "status": "active" },
    { "id": 35, "name": "34<sup>0</sup>", "status": "active" },
    { "id": 36, "name": "35<sup>0</sup>", "status": "active" },
    { "id": 37, "name": "36<sup>0</sup>", "status": "active" },
    { "id": 38, "name": "37<sup>0</sup>", "status": "active" },
    { "id": 39, "name": "38<sup>0</sup>", "status": "active" },
    { "id": 40, "name": "39<sup>0</sup>", "status": "active" },
    { "id": 41, "name": "40<sup>0</sup>", "status": "active" },
    { "id": 42, "name": "41<sup>0</sup>", "status": "active" },
    { "id": 43, "name": "42<sup>0</sup>", "status": "active" },
    { "id": 44, "name": "43<sup>0</sup>", "status": "active" },
    { "id": 45, "name": "44<sup>0</sup>", "status": "active" },
    { "id": 46, "name": "45<sup>0</sup>", "status": "active" },
    { "id": 47, "name": "46<sup>0</sup>", "status": "active" },
    { "id": 48, "name": "47<sup>0</sup>", "status": "active" },
    { "id": 49, "name": "48<sup>0</sup>", "status": "active" },
    { "id": 50, "name": "49<sup>0</sup>", "status": "active" },
    { "id": 51, "name": "50<sup>0</sup>", "status": "active" },
    { "id": 52, "name": "51<sup>0</sup>", "status": "active" },
    { "id": 53, "name": "52<sup>0</sup>", "status": "active" },
    { "id": 54, "name": "53<sup>0</sup>", "status": "active" },
    { "id": 55, "name": "54<sup>0</sup>", "status": "active" },
    { "id": 56, "name": "55<sup>0</sup>", "status": "active" },
    { "id": 57, "name": "56<sup>0</sup>", "status": "active" },
    { "id": 58, "name": "57<sup>0</sup>", "status": "active" },
    { "id": 59, "name": "58<sup>0</sup>", "status": "active" },
    { "id": 60, "name": "59<sup>0</sup>", "status": "active" },
    { "id": 61, "name": "60<sup>0</sup>", "status": "active" },
    { "id": 62, "name": "61<sup>0</sup>", "status": "active" },
    { "id": 63, "name": "62<sup>0</sup>", "status": "active" },
    { "id": 64, "name": "63<sup>0</sup>", "status": "active" },
    { "id": 65, "name": "64<sup>0</sup>", "status": "active" },
    { "id": 66, "name": "65<sup>0</sup>", "status": "active" },
    { "id": 67, "name": "66<sup>0</sup>", "status": "active" },
    { "id": 68, "name": "67<sup>0</sup>", "status": "active" },
    { "id": 69, "name": "68<sup>0</sup>", "status": "active" },
    { "id": 70, "name": "69<sup>0</sup>", "status": "active" },
    { "id": 71, "name": "70<sup>0</sup>", "status": "active" },
    { "id": 72, "name": "71<sup>0</sup>", "status": "active" },
    { "id": 73, "name": "72<sup>0</sup>", "status": "active" },
    { "id": 74, "name": "73<sup>0</sup>", "status": "active" },
    { "id": 75, "name": "74<sup>0</sup>", "status": "active" },
    { "id": 76, "name": "75<sup>0</sup>", "status": "active" },
    { "id": 77, "name": "76<sup>0</sup>", "status": "active" },
    { "id": 78, "name": "77<sup>0</sup>", "status": "active" },
    { "id": 79, "name": "78<sup>0</sup>", "status": "active" },
    { "id": 80, "name": "79<sup>0</sup>", "status": "active" },
    { "id": 81, "name": "80<sup>0</sup>", "status": "active" },
    { "id": 82, "name": "81<sup>0</sup>", "status": "active" },
    { "id": 83, "name": "82<sup>0</sup>", "status": "active" },
    { "id": 84, "name": "83<sup>0</sup>", "status": "active" },
    { "id": 85, "name": "84<sup>0</sup>", "status": "active" },
    { "id": 86, "name": "85<sup>0</sup>", "status": "active" },
    { "id": 87, "name": "86<sup>0</sup>", "status": "active" },
    { "id": 88, "name": "87<sup>0</sup>", "status": "active" },
    { "id": 89, "name": "88<sup>0</sup>", "status": "active" },
    { "id": 90, "name": "89<sup>0</sup>", "status": "active" },
    { "id": 91, "name": "90<sup>0</sup>", "status": "active" },
    { "id": 92, "name": "91<sup>0</sup>", "status": "active" },
    { "id": 93, "name": "92<sup>0</sup>", "status": "active" },
    { "id": 94, "name": "93<sup>0</sup>", "status": "active" },
    { "id": 95, "name": "94<sup>0</sup>", "status": "active" },
    { "id": 96, "name": "95<sup>0</sup>", "status": "active" },
    { "id": 97, "name": "96<sup>0</sup>", "status": "active" },
    { "id": 98, "name": "97<sup>0</sup>", "status": "active" },
    { "id": 99, "name": "98<sup>0</sup>", "status": "active" },
    { "id": 100, "name": "99<sup>0</sup>", "status": "active" },
    { "id": 101, "name": "100<sup>0</sup>", "status": "active" },
    { "id": 102, "name": "101<sup>0</sup>", "status": "active" },
    { "id": 103, "name": "102<sup>0</sup>", "status": "active" },
    { "id": 104, "name": "103<sup>0</sup>", "status": "active" },
    { "id": 105, "name": "104<sup>0</sup>", "status": "active" },
    { "id": 106, "name": "105<sup>0</sup>", "status": "active" },
    { "id": 107, "name": "106<sup>0</sup>", "status": "active" },
    { "id": 108, "name": "107<sup>0</sup>", "status": "active" },
    { "id": 109, "name": "108<sup>0</sup>", "status": "active" },
    { "id": 110, "name": "109<sup>0</sup>", "status": "active" },
    { "id": 111, "name": "110<sup>0</sup>", "status": "active" },
    { "id": 112, "name": "111<sup>0</sup>", "status": "active" },
    { "id": 113, "name": "112<sup>0</sup>", "status": "active" },
    { "id": 114, "name": "113<sup>0</sup>", "status": "active" },
    { "id": 115, "name": "114<sup>0</sup>", "status": "active" },
    { "id": 116, "name": "115<sup>0</sup>", "status": "active" },
    { "id": 117, "name": "116<sup>0</sup>", "status": "active" },
    { "id": 118, "name": "117<sup>0</sup>", "status": "active" },
    { "id": 119, "name": "118<sup>0</sup>", "status": "active" },
    { "id": 120, "name": "119<sup>0</sup>", "status": "active" },
    { "id": 121, "name": "120<sup>0</sup>", "status": "active" },
    { "id": 122, "name": "121<sup>0</sup>", "status": "active" },
    { "id": 123, "name": "122<sup>0</sup>", "status": "active" },
    { "id": 124, "name": "123<sup>0</sup>", "status": "active" },
    { "id": 125, "name": "124<sup>0</sup>", "status": "active" },
    { "id": 126, "name": "125<sup>0</sup>", "status": "active" },
    { "id": 127, "name": "126<sup>0</sup>", "status": "active" },
    { "id": 128, "name": "127<sup>0</sup>", "status": "active" },
    { "id": 129, "name": "128<sup>0</sup>", "status": "active" },
    { "id": 130, "name": "129<sup>0</sup>", "status": "active" },
    { "id": 131, "name": "130<sup>0</sup>", "status": "active" },
    { "id": 132, "name": "131<sup>0</sup>", "status": "active" },
    { "id": 133, "name": "132<sup>0</sup>", "status": "active" },
    { "id": 134, "name": "133<sup>0</sup>", "status": "active" },
    { "id": 135, "name": "134<sup>0</sup>", "status": "active" },
    { "id": 136, "name": "135<sup>0</sup>", "status": "active" },
    { "id": 137, "name": "136<sup>0</sup>", "status": "active" },
    { "id": 138, "name": "137<sup>0</sup>", "status": "active" },
    { "id": 139, "name": "138<sup>0</sup>", "status": "active" },
    { "id": 140, "name": "139<sup>0</sup>", "status": "active" },
    { "id": 141, "name": "140<sup>0</sup>", "status": "active" },
    { "id": 142, "name": "141<sup>0</sup>", "status": "active" },
    { "id": 143, "name": "142<sup>0</sup>", "status": "active" },
    { "id": 144, "name": "143<sup>0</sup>", "status": "active" },
    { "id": 145, "name": "144<sup>0</sup>", "status": "active" },
    { "id": 146, "name": "145<sup>0</sup>", "status": "active" },
    { "id": 147, "name": "146<sup>0</sup>", "status": "active" },
    { "id": 148, "name": "147<sup>0</sup>", "status": "active" },
    { "id": 149, "name": "148<sup>0</sup>", "status": "active" },
    { "id": 150, "name": "149<sup>0</sup>", "status": "active" },
    { "id": 151, "name": "150<sup>0</sup>", "status": "active" },
    { "id": 152, "name": "151<sup>0</sup>", "status": "active" },
    { "id": 153, "name": "152<sup>0</sup>", "status": "active" },
    { "id": 154, "name": "153<sup>0</sup>", "status": "active" },
    { "id": 155, "name": "154<sup>0</sup>", "status": "active" },
    { "id": 156, "name": "155<sup>0</sup>", "status": "active" },
    { "id": 157, "name": "156<sup>0</sup>", "status": "active" },
    { "id": 158, "name": "157<sup>0</sup>", "status": "active" },
    { "id": 159, "name": "158<sup>0</sup>", "status": "active" },
    { "id": 160, "name": "159<sup>0</sup>", "status": "active" },
    { "id": 161, "name": "160<sup>0</sup>", "status": "active" },
    { "id": 162, "name": "161<sup>0</sup>", "status": "active" },
    { "id": 163, "name": "162<sup>0</sup>", "status": "active" },
    { "id": 164, "name": "163<sup>0</sup>", "status": "active" },
    { "id": 165, "name": "164<sup>0</sup>", "status": "active" },
    { "id": 166, "name": "165<sup>0</sup>", "status": "active" },
    { "id": 167, "name": "166<sup>0</sup>", "status": "active" },
    { "id": 168, "name": "167<sup>0</sup>", "status": "active" },
    { "id": 169, "name": "168<sup>0</sup>", "status": "active" },
    { "id": 170, "name": "169<sup>0</sup>", "status": "active" },
    { "id": 171, "name": "170<sup>0</sup>", "status": "active" },
    { "id": 172, "name": "171<sup>0</sup>", "status": "active" },
    { "id": 173, "name": "172<sup>0</sup>", "status": "active" },
    { "id": 174, "name": "173<sup>0</sup>", "status": "active" },
    { "id": 175, "name": "174<sup>0</sup>", "status": "active" },
    { "id": 176, "name": "175<sup>0</sup>", "status": "active" },
    { "id": 177, "name": "176<sup>0</sup>", "status": "active" },
    { "id": 178, "name": "177<sup>0</sup>", "status": "active" },
    { "id": 179, "name": "178<sup>0</sup>", "status": "active" },
    { "id": 180, "name": "179<sup>0</sup>", "status": "active" },
    { "id": 181, "name": "180<sup>0</sup>", "status": "active" }
];

const diagnosisList = [
    { "id": 1, "name": "Myopia (Near sightedness" },
    { "id": 2, "name": "Hyperopia (Farsightedness)" },
    { "id": 3, "name": "Astigmatism" },
    { "id": 4, "name": "Presbyopia" },
    { "id": 5, "name": "Cataracts" },
    { "id": 6, "name": "Glaucoma" },
    { "id": 7, "name": "Macular Degeneration (MD)" },
    { "id": 8, "name": "Diabetic Retinopathy" },
    { "id": 9, "name": "Retinal Detachment" },
    { "id": 10, "name": "Conjuctivitis (Pink Eye)" },
    { "id": 11, "name": "Keratos" },
    { "id": 12, "name": "Stratismus (Crossed Eyes)" },
    { "id": 13, "name": "Amblyopia (Lazy Eye)" },
    { "id": 14, "name": "Uveitis" },
    { "id": 15, "name": "Blepharitis" },
    { "id": 16, "name": "Corneal Ulcer" },
    { "id": 17, "name": "Pinguecula" },
    { "id": 18, "name": "Pterygium" },
    { "id": 19, "name": "Dry Eye Syndrome" },
    { "id": 20, "name": "Chalazion" }
];

const nearAdd = [
  { "id": 1, "name": "+0.75" },
  { "id": 2, "name": "+1.00" },
  { "id": 3, "name": "+1.25" },
  { "id": 4, "name": "+1.50" },
  { "id": 5, "name": "+1.75" },
  { "id": 6, "name": "+2.00" },
  { "id": 7, "name": "+2.25" },
  { "id": 8, "name": "+2.50" },
  { "id": 9, "name": "+2.75" },
  { "id": 10, "name": "+3.00" },
  { "id": 11, "name": "+3.25" },
  { "id": 12, "name": "+3.50" }
];


  const dosageOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', '2 hourly', 'Nocte', 'When necessary'];
  const quantityOptions = Array.from({ length: 150 }, (_, i) => (i + 1).toString());

  // Fetch data for options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicineRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/visual_acuity_far`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/visual_acuity_near`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/chief_complaint`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/diagnosis_list`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_axis`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_sphere`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_cylinder`),
          // axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refractionogram`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`),
        ]);
      
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
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleStep = (step) => () => {
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

    const sketches = activeStep === 4 ? {
      rightEyeFront: rightEyeRef.current?.getSaveData() || null,
      rightEyeBack: rightEyeBackRef.current?.getSaveData() || null,
      leftEyeFront: leftEyeRef.current?.getSaveData() || null,
      leftEyeBack: leftEyeBackRef.current?.getSaveData() || null,
    } : {};

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
                <RemoveCircle />
                Remove
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
            {['findings', 'eyelid', 'conjunctiva', 'cornea', 'AC', 'iris', 'lens', 'vitreous', 'retina', 'OCT', 'FFA', 'fundusPhotography', 'pachymetry', 'CVFT', 'CVFTKinetic', 'otherFindings'].map((field) =>
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
            {/* {[
              'OCT', 'FFA', 'fundusPhotography', 'pachymetry', 'CVFT', 'CVFTKinetic', 'pupil'
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
            )} */}
            {['nearAdd', 'refractionSphere', 'refractionCylinder', 'refractionAxis', 'refractionPrism'].map((field) =>
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
                      : field === 'refractionPrism'
                      ? refractionPrism
                      : nearAdd
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
                  ref={rightEyeRef}
                  brushColor={brushColor}
                  brushRadius={1}
                  lazyRadius={0}
                  catenaryColor="rgba(0,0,0,0)"
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                />
                <Button variant="contained" color="secondary" onClick={() => rightEyeRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Right Eye Back</Typography>
                <CanvasDraw
                  ref={rightEyeBackRef}
                  brushColor={brushColor}
                  brushRadius={1}
                  lazyRadius={0}
                  catenaryColor="rgba(0,0,0,0)"
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                />
                <Button variant="contained" color="secondary" onClick={() => rightEyeBackRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Left Eye Front</Typography>
                <CanvasDraw
                  ref={leftEyeRef}
                  brushColor={brushColor}
                  brushRadius={1}
                  lazyRadius={0}
                  catenaryColor="rgba(0,0,0,0)"
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
                />
                <Button variant="contained" color="secondary" onClick={() => leftEyeRef.current?.clear()} className="mt-2 bg-red-500 hover:bg-red-600">
                  Clear
                </Button>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="subtitle1" className="text-gray-600 mb-2">Left Eye Back</Typography>
                <CanvasDraw
                  ref={leftEyeBackRef}
                  brushColor={brushColor}
                  brushRadius={1}
                  lazyRadius={0}
                  catenaryColor="rgba(0,0,0,0)"
                  canvasWidth={300}
                  canvasHeight={300}
                  className="border border-gray-300 rounded-lg"
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