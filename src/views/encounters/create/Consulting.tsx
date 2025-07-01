'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import CanvasDraw from 'react-canvas-draw';
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
import RemoveCircle from '@mui/icons-material/RemoveCircle';
import Swal from 'sweetalert2';
import { StepLabel } from '@mui/material';



// Investigations Done in Clinic options


 const fields = [
    { key: 'problemsRight', label: 'Problems Identified (Right)' },
    { key: 'problemsLeft', label: 'Problems Identified (Left)' },
    { key: 'overallDiagnosisRight', label: 'Overall Diagnosis (Right)' },
    { key: 'overallDiagnosisLeft', label: 'Overall Diagnosis (Left)' },
  ];

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

const refractionCylinder = [
    {"id":1,"name":"-10.75D"},
    {"id":2,"name":"-10.50D"},
    {"id":3,"name":"-10.25D"},
    {"id":4,"name":"-10.00D"},
    {"id":5,"name":"-9.75D"},
    {"id":6,"name":"-9.50D"},
    {"id":7,"name":"-9.25D"},
    {"id":8,"name":"-9.00D"},
    {"id":9,"name":"-8.75D"},
    {"id":10,"name":"-8.50D"},
    {"id":11,"name":"-8.25D"},
    {"id":12,"name":"-8.00D"},
    {"id":13,"name":"-7.75D"},
    {"id":14,"name":"-7.50D"},
    {"id":15,"name":"-7.25D"},
    {"id":16,"name":"-7.00D"},
    {"id":17,"name":"-6.75D"},
    {"id":18,"name":"-6.50D"},
    {"id":19,"name":"-6.25D"},
    {"id":20,"name":"-6.00D"},
    {"id":21,"name":"-5.75D"},
    {"id":22,"name":"-5.50D"},
    {"id":23,"name":"-5.25D"},
    {"id":24,"name":"-5.00D"},
    {"id":25,"name":"-4.75D"},
    {"id":26,"name":"-4.50D"},
    {"id":27,"name":"-4.25D"},
    {"id":28,"name":"-4.00D"},
    {"id":29,"name":"-3.75D"},
    {"id":30,"name":"-3.50D"},
    {"id":31,"name":"-3.25D"},
    {"id":32,"name":"-3.00D"},
    {"id":33,"name":"-2.75D"},
    {"id":34,"name":"-2.50D"},
    {"id":35,"name":"-2.25D"},
    {"id":36,"name":"-2.00D"},
    {"id":37,"name":"-1.75D"},
    {"id":38,"name":"-1.50D"},
    {"id":39,"name":"-1.25D"},
    {"id":40,"name":"-1.00D"},
    {"id":41,"name":"-0.75D"},
    {"id":42,"name":"-0.50D"},
    {"id":43,"name":"-0.25D"},
    {"id":44,"name":"0.00D"},
    {"id":45,"name":"+0.25D"},
    {"id":46,"name":"+0.50D"},
    {"id":47,"name":"+0.75D"},
    {"id":48,"name":"+1.00D"},
    {"id":49,"name":"+1.25D"},
    {"id":50,"name":"+1.50D"},
    {"id":51,"name":"+1.75D"},
    {"id":52,"name":"+2.00D"},
    {"id":53,"name":"+2.25D"},
    {"id":54,"name":"+2.50D"},
    {"id":55,"name":"+2.75D"},
    {"id":56,"name":"+3.00D"},
    {"id":57,"name":"+3.25D"},
    {"id":58,"name":"+3.50D"},
    {"id":59,"name":"+3.75D"},
    {"id":60,"name":"+4.00D"},
    {"id":61,"name":"+4.25D"},
    {"id":62,"name":"+4.50D"},
    {"id":63,"name":"+4.75D"},
    {"id":64,"name":"+5.00D"},
    {"id":65,"name":"+5.25D"},
    {"id":66,"name":"+5.50D"},
    {"id":67,"name":"+5.75D"},
    {"id":68,"name":"+6.00D"},
    {"id":69,"name":"+6.25D"},
    {"id":70,"name":"+6.50D"},
    {"id":71,"name":"+6.75D"},
    {"id":72,"name":"+7.00D"},
    {"id":73,"name":"+7.25D"},
    {"id":74,"name":"+7.50D"},
    {"id":75,"name":"+7.75D"},
    {"id":76,"name":"+8.00D"},
    {"id":77,"name":"+8.25D"},
    {"id":78,"name":"+8.50D"},
    {"id":79,"name":"+8.75D"},
    {"id":80,"name":"+9.00D"},
    {"id":81,"name":"+9.25D"},
    {"id":82,"name":"+9.50D"},
    {"id":83,"name":"+9.75D"},
    {"id":84,"name":"+10.00D"},
    {"id":85,"name":"+10.25D"},
    {"id":86,"name":"+10.50D"},
    {"id":87,"name":"+10.75D"}
];


const refractionSphere = [
    {"id":1,"name":"-10.75D"},
    {"id":2,"name":"-10.50D"},
    {"id":3,"name":"-10.25D"},
    {"id":4,"name":"-10.00D"},
    {"id":5,"name":"-9.75D"},
    {"id":6,"name":"-9.50D"},
    {"id":7,"name":"-9.25D"},
    {"id":8,"name":"-9.00D"},
    {"id":9,"name":"-8.75D"},
    {"id":10,"name":"-8.50D"},
    {"id":11,"name":"-8.25D"},
    {"id":12,"name":"-8.00D"},
    {"id":13,"name":"-7.75D"},
    {"id":14,"name":"-7.50D"},
    {"id":15,"name":"-7.25D"},
    {"id":16,"name":"-7.00D"},
    {"id":17,"name":"-6.75D"},
    {"id":18,"name":"-6.50D"},
    {"id":19,"name":"-6.25D"},
    {"id":20,"name":"-6.00D"},
    {"id":21,"name":"-5.75D"},
    {"id":22,"name":"-5.50D"},
    {"id":23,"name":"-5.25D"},
    {"id":24,"name":"-5.00D"},
    {"id":25,"name":"-4.75D"},
    {"id":26,"name":"-4.50D"},
    {"id":27,"name":"-4.25D"},
    {"id":28,"name":"-4.00D"},
    {"id":29,"name":"-3.75D"},
    {"id":30,"name":"-3.50D"},
    {"id":31,"name":"-3.25D"},
    {"id":32,"name":"-3.00D"},
    {"id":33,"name":"-2.75D"},
    {"id":34,"name":"-2.50D"},
    {"id":35,"name":"-2.25D"},
    {"id":36,"name":"-2.00D"},
    {"id":37,"name":"-1.75D"},
    {"id":38,"name":"-1.50D"},
    {"id":39,"name":"-1.25D"},
    {"id":40,"name":"-1.00D"},
    {"id":41,"name":"-0.75D"},
    {"id":42,"name":"-0.50D"},
    {"id":43,"name":"-0.25D"},
    {"id":44,"name":"0.00D"},
    {"id":45,"name":"+0.25D"},
    {"id":46,"name":"+0.50D"},
    {"id":47,"name":"+0.75D"},
    {"id":48,"name":"+1.00D"},
    {"id":49,"name":"+1.25D"},
    {"id":50,"name":"+1.50D"},
    {"id":51,"name":"+1.75D"},
    {"id":52,"name":"+2.00D"},
    {"id":53,"name":"+2.25D"},
    {"id":54,"name":"+2.50D"},
    {"id":55,"name":"+2.75D"},
    {"id":56,"name":"+3.00D"},
    {"id":57,"name":"+3.25D"},
    {"id":58,"name":"+3.50D"},
    {"id":59,"name":"+3.75D"},
    {"id":60,"name":"+4.00D"},
    {"id":61,"name":"+4.25D"},
    {"id":62,"name":"+4.50D"},
    {"id":63,"name":"+4.75D"},
    {"id":64,"name":"+5.00D"},
    {"id":65,"name":"+5.25D"},
    {"id":66,"name":"+5.50D"},
    {"id":67,"name":"+5.75D"},
    {"id":68,"name":"+6.00D"},
    {"id":69,"name":"+6.25D"},
    {"id":70,"name":"+6.50D"},
    {"id":71,"name":"+6.75D"},
    {"id":72,"name":"+7.00D"},
    {"id":73,"name":"+7.25D"},
    {"id":74,"name":"+7.50D"},
    {"id":75,"name":"+7.75D"},
    {"id":76,"name":"+8.00D"},
    {"id":77,"name":"+8.25D"},
    {"id":78,"name":"+8.50D"},
    {"id":79,"name":"+8.75D"},
    {"id":80,"name":"+9.00D"},
    {"id":81,"name":"+9.25D"},
    {"id":82,"name":"+9.50D"},
    {"id":83,"name":"+9.75D"},
    {"id":84,"name":"+10.00D"},
    {"id":85,"name":"+10.25D"},
    {"id":86,"name":"+10.50D"},
    {"id":87,"name":"+10.75D"}
];

const refractionPrism = [
    {"id":1,"name":"-20.0Δ"},
    {"id":2,"name":"-19.0Δ"},
    {"id":3,"name":"-18.0Δ"},
    {"id":4,"name":"-17.0Δ"},
    {"id":5,"name":"-16.0Δ"},
    {"id":6,"name":"-15.0Δ"},
    {"id":7,"name":"-14.0Δ"},
    {"id":8,"name":"-13.0Δ"},
    {"id":9,"name":"-12.0Δ"},
    {"id":10,"name":"-11.0Δ"},
    {"id":11,"name":"-10.0Δ"},
    {"id":12,"name":"-9.0Δ"},
    {"id":13,"name":"-8.0Δ"},
    {"id":14,"name":"-7.0Δ"},
    {"id":15,"name":"-6.0Δ"},
    {"id":16,"name":"-5.0Δ"},
    {"id":17,"name":"-4.0Δ"},
    {"id":18,"name":"-3.0Δ"},
    {"id":19,"name":"-2.0Δ"},
    {"id":20,"name":"-1.0Δ"},
    {"id":21,"name":"0.0Δ"},
    {"id":22,"name":"1.0Δ"},
    {"id":23,"name":"2.0Δ"},
    {"id":24,"name":"3.0Δ"},
    {"id":25,"name":"4.0Δ"},
    {"id":26,"name":"5.0Δ"},
    {"id":27,"name":"6.0Δ"},
    {"id":28,"name":"7.0Δ"},
    {"id":29,"name":"8.0Δ"},
    {"id":30,"name":"9.0Δ"},
    {"id":31,"name":"10.0Δ"},
    {"id":32,"name":"11.0Δ"},
    {"id":33,"name":"12.0Δ"},
    {"id":34,"name":"13.0Δ"},
    {"id":35,"name":"14.0Δ"},
    {"id":36,"name":"15.0Δ"},
    {"id":37,"name":"16.0Δ"},
    {"id":38,"name":"17.0Δ"},
    {"id":39,"name":"18.0Δ"},
    {"id":40,"name":"19.0Δ"},
    {"id":41,"name":"20.0Δ"}
];

// Investigations Required options
const investigationsRequiredList = [
  { id: 1, name: 'Optical Coherence Tomography (OCT)' },
  { id: 2, name: 'Pachymetry' },
  { id: 3, name: 'Central Visual Field Test (CVFT)' },
  { id: 4, name: 'Fundus Photography (Plain)' },
  { id: 5, name: 'Fundus Fluorescence Angiography (FFA)' },
  { id: 6, name: 'A-Scan' },
  { id: 999, name: 'Other' }
];

// Investigations Done in Clinic options
const investigationsDoneList = [
  { id: 1, name: 'Non-Contact Tonometry' },
  { id: 2, name: 'Applanation Tonometry' },
  { id: 3, name: 'Schiotz Tonometry' },
  { id: 4, name: 'Gonioscopy' },
  { id: 5, name: 'Slit Lamp Assessment' },
  { id: 6, name: 'Staining with Fluorescein' },
  { id: 7, name: 'Binocular Indirect Ophthalmoscopy' },
  { id: 8, name: 'Refraction' },
  { id: 9, name: '90D or 78D' },
  { id: 10, name: 'Professorial Consultation' },
  { id: 11, name: 'Ophthalmology Consultation' },
  { id: 12, name: 'Optometry Consultation Only' },
  { id: 13, name: 'B-Scan' },
  { id: 999, name: 'Other' }
];

// New options for refraction fields
const frameTypeOptions = [
  { id: 1, name: 'Full Rim' },
  { id: 2, name: 'Half Rim' },
  { id: 3, name: 'Rimless' }
];
const frameColorOptions = [
  { id: 1, name: 'Black' },
  { id: 2, name: 'Silver' },
  { id: 3, name: 'Gold' },
  { id: 4, name: 'Blue' },
  { id: 5, name: 'Red' }
];
const lensTypeOptions = [
  { id: 1, name: 'Single Vision' },
  { id: 2, name: 'Bifocal' },
  { id: 3, name: 'Progressive' },
  // { id: 4, name: 'Photochromic' }
];
const lensColorOptions = [
  { id: 1, name: 'White' },
  { id: 2, name: 'White Ar' },
  { id: 3, name: 'Photochromic' },
  { id: 4, name: 'Photochromic Anti-reflective' }
];

const surfacingOptions = [
  { id: 1, name: 'Standard' },
  { id: 2, name: 'Anti-Reflective' },
  { id: 3, name: 'Scratch-Resistant' },
  { id: 4, name: 'UV Protection' }
];

const dosageOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', '2 hourly', 'Nocte', 'When necessary'];
const quantityOptions = Array.from({ length: 150 }, (_, i) => (i + 1).toString());

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
    problemsRight: [],
    problemsLeft: [],
    overallDiagnosisRight: [],
    overallDiagnosisLeft: [],
    otherProblemsRight: '',
    otherProblemsLeft: '',
    otherOverallDiagnosisRight: '',
    otherOverallDiagnosisLeft: '',
    investigationsRequired: [], // Array for multi-select
    otherInvestigationsRequired: '',
    externalInvestigationsRequired: '',
    investigationsDone: [], // Array for multi-select
    otherInvestigationsDone: '',
    HBP: false,
    diabetes: false,
    pregnancy: false,
    food: '',
    drugAllergy: '',
    currentMedication: '',
    visualAcuityNear: '',

      pd: '',
    bridge: '',
    eyeSize: '',
    temple: '',
    decentration: '',
    segmentMeasurement: '',
    frameType: '',
    frameColor: '',
    frameCost: '',
    lensType: '',
    lensColor: '',
    lensCost: '',
    other: '',
    surfacing: '',
    caseSize: ''
  });

  const [eyeDrops, setEyeDrops] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [tablets, setTablets] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [ointments, setOintments] = useState([{ medicine: '', dosage: '', doseDuration: '', doseInterval: '', comment: '' }]);
  const [prescriptionGlasses, setPrescriptionGlasses] = useState([{ lensType: '' }]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const fields = [
    { key: 'problemsRight', label: 'Problems Identified (Right)' },
    { key: 'problemsLeft', label: 'Problems Identified (Left)' },
    { key: 'overallDiagnosisRight', label: 'Overall Diagnosis (Right)' },
    { key: 'overallDiagnosisLeft', label: 'Overall Diagnosis (Left)' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicineRes] = await Promise.all([
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

  const handleOtherChange = (field, value) => {
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

    // Convert investigations arrays to comma-separated strings
    const payload = {
      patientId,
      ...formData,
      investigationsRequired: formData.investigationsRequired.join(','),
      investigationsDone: formData.investigationsDone.join(','),
      problemsRight: formData.problemsRight.join(','),
      problemsLeft: formData.problemsLeft.join(','),
      overallDiagnosisRight: formData.overallDiagnosisRight.join(','),
      overallDiagnosisLeft: formData.overallDiagnosisLeft.join(','),
      rightEyeFront: rightEyeRef.current?.getSaveData() || null,
      rightEyeBack: rightEyeBackRef.current?.getSaveData() || null,
      leftEyeFront: leftEyeRef.current?.getSaveData() || null,
      leftEyeBack: leftEyeBackRef.current?.getSaveData() || null,
      eyeDrops: normalizeData(eyeDrops),
      tablets: normalizeData(tablets),
      ointments: normalizeData(ointments),
      prescriptionGlasses: normalizeData(prescriptionGlasses),
    };
    const sketches = activeStep === 4 ? {
      rightEyeFront: rightEyeRef.current?.getSaveData() || null,
      rightEyeBack: rightEyeBackRef.current?.getSaveData() || null,
      leftEyeFront: leftEyeRef.current?.getSaveData() || null,
      leftEyeBack: leftEyeBackRef.current?.getSaveData() || null,
    } : {};

    // const payload = {
    //   patientId,
    //   ...formData,
    //   ...sketches,
    //   eyeDrops: normalizeData(eyeDrops),
    //   tablets: normalizeData(tablets),
    //   ointments: normalizeData(ointments),
    //   prescriptionGlasses: normalizeData(prescriptionGlasses),
    // };

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

  const renderSummaryTable = (title, data) => (
    <Box mt={4}>
      <Typography variant="h6" className="text-gray-700 mb-2">{title}</Typography>
      <Grid container spacing={2}>
        {data.map(({ label, value }) => (
          <Grid item xs={12} sm={6} key={label}>
            <Typography variant="body1" className="text-gray-600">
              <strong>{label}:</strong> {value || 'Not provided'}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );


  const steps = ['Consultation', 'Findings', 'Refraction', 'Sketch Pad', 'Diagnosis', 'Investigations', 'Treatment', 'Summary'];

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
      // case 1:
      //   return (
      //     <Grid container spacing={4}>
      //       {[
      //         { label: 'Far Best Corrected Left', field: 'visualAcuityFarBestCorrectedLeft' },
      //         { label: 'Far Best Corrected Right', field: 'visualAcuityFarBestCorrectedRight' },
      //         { label: 'Far Presenting Left', field: 'visualAcuityFarPresentingLeft' },
      //         { label: 'Far Presenting Right', field: 'visualAcuityFarPresentingRight' },
      //         { label: 'Far Pinhole Right', field: 'visualAcuityFarPinholeRight' },
      //         { label: 'Far Pinhole Left', field: 'visualAcuityFarPinholeLeft' },
      //         { label: 'Near Left', field: 'visualAcuityNearLeft' },
      //         { label: 'Near Right', field: 'visualAcuityNearRight' },
      //       ].map(({ label, field }) => (
      //         <Grid item xs={12} sm={6} key={field}>
      //           <FormControl fullWidth>
      //             <InputLabel>{label}</InputLabel>
      //             <Select
      //               value={formData[field]}
      //               onChange={(e) => handleFormChange(field, e.target.value)}
      //               className="rounded-lg"
      //             >
      //               {(field.includes('Near') ? visualAcuityNear : visualAcuityFar).map((option) => (
      //                 <MenuItem key={option.id} value={option.id}>
      //                   {option.name}
      //                 </MenuItem>
      //               ))}
      //             </Select>
      //           </FormControl>
      //         </Grid>
      //       ))}
      //     </Grid>
      //   );
      case 1:
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
            {/* Refraction Measurements */}
            {[
              { field: 'nearAddRight', label: 'Near Add (Right)', options: nearAdd },
              { field: 'nearAddLeft', label: 'Near Add (Left)', options: nearAdd },
              { field: 'refractionSphereRight', label: 'Refraction Sphere (Right)', options: refractionSphere },
              { field: 'refractionSphereLeft', label: 'Refraction Sphere (Left)', options: refractionSphere },
              { field: 'refractionCylinderRight', label: 'Refraction Cylinder (Right)', options: refractionCylinder },
              { field: 'refractionCylinderLeft', label: 'Refraction Cylinder (Left)', options: refractionCylinder },
              { field: 'refractionAxisRight', label: 'Refraction Axis (Right)', options: refractionAxis },
              { field: 'refractionAxisLeft', label: 'Refraction Axis (Left)', options: refractionAxis },
              { field: 'refractionPrismRight', label: 'Refraction Prism (Right)', options: refractionPrism },
              { field: 'refractionPrismLeft', label: 'Refraction Prism (Left)', options: refractionPrism },
            ].map(({ field, label, options }) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    value={formData[field] || ''}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    className="rounded-lg"
                  >
                    {options.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        <span dangerouslySetInnerHTML={{ __html: option.name }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
            {/* Frame and Lens Measurements */}
            {[
              { field: 'pd', label: 'Pupillary Distance (PD)', type: 'number' },
              { field: 'bridge', label: 'Bridge', type: 'number' },
              { field: 'eyeSize', label: 'Eye Size', type: 'number' },
              { field: 'temple', label: 'Temple', type: 'number' },
              { field: 'decentration', label: 'Decentration', type: 'number' },
              { field: 'segmentMeasurement', label: 'Segment Measurement', type: 'number' },
              { field: 'caseSize', label: 'Case Size', type: 'number' },
              { field: 'frameCost', label: 'Frame Cost', type: 'number' },
              { field: 'lensCost', label: 'Lens Cost', type: 'number' },
              { field: 'other', label: 'Other Notes', multiline: true },
            ].map(({ field, label, type, multiline }) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={label}
                  type={type || 'text'}
                  multiline={multiline || false}
                  rows={multiline ? 3 : 1}
                  fullWidth
                  value={formData[field] || ''}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  className="rounded-lg"
                  variant="outlined"
                />
              </Grid>
            ))}
            {/* Frame and Lens Options */}
           {[
  { field: 'frameType', label: 'Frame Type', options: frameTypeOptions },
  { field: 'frameColor', label: 'Frame Color', options: frameColorOptions },
  { field: 'lensType', label: 'Lens Type', options: lensTypeOptions },
  { field: 'lensColor', label: 'Lens Color', options: lensColorOptions },
].map(({ field, label, options }) => (
  <Grid item xs={12} sm={6} key={field}>
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={formData[field] || ''}
        onChange={(e) => handleFormChange(field, e.target.value)}
        className="rounded-lg"
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
))}
<Grid item xs={12} sm={6} key="surfacing">
  <TextField
    label="Surfacing"
    fullWidth
    value={formData.surfacing || ''}
    onChange={(e) => handleFormChange('surfacing', e.target.value)}
    className="rounded-lg"
    variant="outlined"
  />
</Grid>
          </Grid>
        );
      case 3:
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
      case 4:
        return (
          <Grid container spacing={4}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.key}>
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    multiple
                    value={formData[field.key] || []}
                    onChange={(e) => handleFormChange(field.key, e.target.value)}
                    className="rounded-lg"
                    renderValue={(selected) => {
                      return selected
                        .map((id) => diagnosisList.find((option) => option.id === id)?.name)
                        .join(', ');
                    }}
                  >
                    {diagnosisList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData[field.key]?.includes(999) && (
                  <Box mt={2}>
                    <TextField
                      fullWidth
                      label={`${field.label} - Other (Specify)`}
                      value={formData[`other${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] || ''}
                      onChange={(e) => handleOtherChange(`other${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`, e.target.value)}
                      className="rounded-lg"
                    />
                  </Box>
                )}
              </Grid>
            ))}
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={4}>
            {/* Investigations Required */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Investigations Required</InputLabel>
                <Select
                  multiple
                  value={formData.investigationsRequired || []}
                  onChange={(e) => handleFormChange('investigationsRequired', e.target.value)}
                  className="rounded-lg"
                  renderValue={(selected) => {
                    return selected
                      .map((id) => investigationsRequiredList.find((option) => option.id === id)?.name)
                      .join(', ');
                  }}
                >
                  {investigationsRequiredList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.investigationsRequired?.includes(999) && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    label="Investigations Required - Other (Specify)"
                    value={formData.otherInvestigationsRequired || ''}
                    onChange={(e) => handleOtherChange('otherInvestigationsRequired', e.target.value)}
                    className="rounded-lg"
                    variant="outlined"
                  />
                </Box>
              )}
            </Grid>

            {/* External Investigations Required */}
            <Grid item xs={12}>
              <TextField
                label="External Investigations Required"
                multiline
                rows={3}
                fullWidth
                value={formData.externalInvestigationsRequired || ''}
                onChange={(e) => handleFormChange('externalInvestigationsRequired', e.target.value)}
                className="rounded-lg"
                variant="outlined"
              />
            </Grid>

            {/* Investigations Done in Clinic */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Investigations Done in Clinic</InputLabel>
                <Select
                  multiple
                  value={formData.investigationsDone || []}
                  onChange={(e) => handleFormChange('investigationsDone', e.target.value)}
                  className="rounded-lg"
                  renderValue={(selected) => {
                    return selected
                      .map((id) => investigationsDoneList.find((option) => option.id === id)?.name)
                      .join(', ');
                  }}
                >
                  {investigationsDoneList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.investigationsDone?.includes(999) && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    label="Investigations Done in Clinic - Other (Specify)"
                    value={formData.otherInvestigationsDone || ''}
                    onChange={(e) => handleOtherChange('otherInvestigationsDone', e.target.value)}
                    className="rounded-lg"
                    variant="outlined"
                  />
                </Box>
              )}
            </Grid>

            {/* Physical Information */}
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
                    checked={formData[field] || false}
                    onChange={(e) => handleFormChange(field, e.target.checked)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <Typography variant="body2" className="text-gray-700">{label}</Typography>
                </FormControl>
              </Grid>
            ))}

            {/* Other Text Fields */}
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
                  value={formData[field] || ''}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  className="rounded-lg"
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        );
      case 6:
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

        case 7:
        return (
          <Box>
            <Typography variant="h4" className="text-2xl font-bold text-gray-800 mb-4">
              Consultation Summary
            </Typography>
            {renderSummaryTable('Consultation', [
              { label: 'Chief Complaint (Right)', value: chiefComplaintOptions.find(o => o.id === formData.chiefComplaintRight)?.name },
              { label: 'Chief Complaint (Left)', value: chiefComplaintOptions.find(o => o.id === formData.chiefComplaintLeft)?.name },
              { label: 'Intra Occular Pressure (Right)', value: formData.intraOccularPressureRight },
              { label: 'Intra Occular Pressure (Left)', value: formData.intraOccularPressureLeft },
              { label: 'Other Complaints (Right)', value: formData.otherComplaintsRight },
              { label: 'Other Complaints (Left)', value: formData.otherComplaintsLeft },
              { label: 'Detailed History (Right)', value: formData.detailedHistoryRight },
              { label: 'Detailed History (Left)', value: formData.detailedHistoryLeft },
            ])}
            {renderSummaryTable('Findings', [
              { label: 'Findings (Right)', value: formData.findingsRight },
              { label: 'Findings (Left)', value: formData.findingsLeft },

              { label: 'Eyelid (Right)', value: formData.eyelidRight },
              { label: 'Eyelid (Left)', value: formData.eyelidLeft },
              { label: 'Conjunctiva (Right)', value: formData.conjunctivaRight },
              { label: 'Conjunctiva (Left)', value: formData.conjunctivaLeft },
              { label: 'Cornea (Right)', value: formData.corneaRight },
              { label: 'Cornea (Left)', value: formData.corneaLeft },
              { label: 'AC (Right)', value: formData.ACRight },
              { label: 'AC (Left)', value: formData.ACLeft },
              { label: 'Iris (Right)', value: formData.irisRight },
              { label: 'Iris (Left)', value: formData.irisLeft },
              { label: 'Lens (Right)', value: formData.lensRight },
              { label: 'Lens (Left)', value: formData.lensLeft },
              { label: 'Vitreous (Right)', value: formData.vitreousRight },
              { label: 'Vitreous (Left)', value: formData.vitreousLeft },
              { label: 'Retina (Right)', value: formData.retinaRight },
              { label: 'Retina (Left)', value: formData.retinaLeft },
              { label: 'OCT (Right)', value: formData.OCTRight },
              { label: 'OCT (Left)', value: formData.OCTLeft },
              { label: 'FFA (Right)', value: formData.FFARight },
              { label: 'FFA (Left)', value: formData.FFALeft },
              { label: 'Fundus Photography (Right)', value: formData.fundusPhotographyRight },
              { label: 'Fundus Photography (Left)', value: formData.fundusPhotographyLeft },
              { label: 'Pachymetry (Right)', value: formData.pachymetryRight },
              { label: 'Pachymetry (Left)', value: formData.pachymetryLeft },
              { label: 'CVFT (Right)', value: formData.CVFTRight },
              { label: 'CVFT (Left)', value: formData.CVFTLeft },
              { label: 'CVFT Kinetic (Right)', value: formData.CVFTKineticRight },
              { label: 'CVFT Kinetic (Left)', value: formData.CVFTKineticLeft },
              { label: 'Other Findings', value: formData.otherFindings },
            ])}
            {renderSummaryTable('Refraction', [
              { label: 'Near Add (Right)', value: nearAdd.find(o => o.id === formData.nearAddRight)?.name },
              { label: 'Near Add (Left)', value: nearAdd.find(o => o.id === formData.nearAddLeft)?.name },
              { label: 'Refraction Sphere (Right)', value: refractionSphere.find(o => o.id === formData.refractionSphereRight)?.name },
              { label: 'Refraction Sphere (Left)', value: refractionSphere.find(o => o.id === formData.refractionSphereLeft)?.name },
              { label: 'Refraction Cylinder (Right)', value: refractionCylinder.find(o => o.id === formData.refractionCylinderRight)?.name },
              { label: 'Refraction Cylinder (Left)', value: refractionCylinder.find(o => o.id === formData.refractionCylinderLeft)?.name },
              { label: 'Refraction Axis (Right)', value: refractionAxis.find(o => o.id === formData.refractionAxisRight)?.name },
              { label: 'Refraction Axis (Left)', value: refractionAxis.find(o => o.id === formData.refractionAxisLeft)?.name },
              { label: 'Refraction Prism (Right)', value: refractionPrism.find(o => o.id === formData.refractionPrismRight)?.name },
              { label: 'Refraction Prism (Left)', value: refractionPrism.find(o => o.id === formData.refractionPrismLeft)?.name },
            ])}
            {renderSummaryTable('Sketch Pad', [
              { label: 'Right Eye Front', value: rightEyeRef.current?.getSaveData() || 'No drawing' },
              { label: 'Right Eye Back', value: rightEyeBackRef.current?.getSaveData() || 'No drawing' },
              { label: 'Left Eye Front', value: leftEyeRef.current?.getSaveData() || 'No drawing' },
              { label: 'Left Eye Back', value: leftEyeBackRef.current?.getSaveData() || 'No drawing' },
            ])}
            {renderSummaryTable('Other Findings', [
              { label: 'Comments', value: formData.comments || 'No comments' },
            ])}
            {renderSummaryTable('Additional Information', [
              { label: 'Date of Exam', value: formData.dateOfExam || 'No date provided' },
              { label: 'Referring Physician', value: formData.referringPhysician || 'No physician provided' },
            ])}
          </Box>
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