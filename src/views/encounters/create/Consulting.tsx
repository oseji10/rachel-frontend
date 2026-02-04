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
import api from '@/app/utils/api';

const chiefComplaintOptions = [
    {"id": 1, "name": "Pain"},
    {"id": 2, "name": "Watering"},
    {"id": 3, "name": "Loss of vision"},
    {"id": 4, "name": "Redness"},
    {"id": 5, "name": "Swelling", "status": "active"},
    {"id": 6, "name": "Other", "status": "active"}
];

const visualAcuityFar = [
    {"id": 1, "name": "NPL", "status": "active"},
    {"id": 2, "name": "PL", "status": "active"},
    {"id": 3, "name": "HM", "status": "active"},
    {"id": 4, "name": "6/60", "status": "active"},
    {"id": 5, "name": "6/36", "status": "active"},
    {"id": 6, "name": "6/24", "status": "active"},
    {"id": 7, "name": "6/18", "status": "active"},
    {"id": 8, "name": "6/12", "status": "active"},
    {"id": 9, "name": "6/9", "status": "active"},
    {"id": 10, "name": "6/6", "status": "active"},
    {"id": 11, "name": "6/5", "status": "active"},
    {"id": 12, "name": "6/4", "status": "active"}
];

const visualAcuityNear = [
    {"id": 1, "name": "NPL", "status": "active"},
    {"id": 2, "name": "PL", "status": "active"},
    {"id": 3, "name": "HM", "status": "active"},
    {"id": 4, "name": "6/60", "status": "active"},
    {"id": 5, "name": "6/36", "status": "active"},
    {"id": 6, "name": "6/24", "status": "active"},
    {"id": 7, "name": "6/18", "status": "active"},
    {"id": 8, "name": "6/12", "status": "active"},
    {"id": 9, "name": "6/9", "status": "active"},
    {"id": 10, "name": "6/6", "status": "active"},
    {"id": 11, "name": "6/5", "status": "active"},
    {"id": 12, "name": "6/4", "status": "active"}
];

const refractionAxis = [
  {"id": 1, "name": "0<sup>o</sup>", "status": "active"},
  {"id": 2, "name": "1<sup>o</sup>", "status": "active"},
  {"id": 3, "name": "2<sup>o</sup>", "status": "active"},
  {"id": 4, "name": "3<sup>o</sup>", "status": "active"},
  {"id": 5, "name": "4<sup>o</sup>", "status": "active"},
  {"id": 6, "name": "5<sup>o</sup>", "status": "active"},
  {"id": 7, "name": "6<sup>o</sup>", "status": "active"},
  {"id": 8, "name": "7<sup>o</sup>", "status": "active"},
  {"id": 9, "name": "8<sup>o</sup>", "status": "active"},
  {"id": 10, "name": "9<sup>o</sup>", "status": "active"},
  {"id": 11, "name": "10<sup>o</sup>", "status": "active"},
  {"id": 12, "name": "11<sup>o</sup>", "status": "active"},
  {"id": 13, "name": "12<sup>o</sup>", "status": "active"},
  {"id": 14, "name": "13<sup>o</sup>", "status": "active"},
  {"id": 15, "name": "14<sup>o</sup>", "status": "active"},
  {"id": 16, "name": "15<sup>o</sup>", "status": "active"},
  {"id": 17, "name": "16<sup>o</sup>", "status": "active"},
  {"id": 18, "name": "17<sup>o</sup>", "status": "active"},
  {"id": 19, "name": "18<sup>o</sup>", "status": "active"},
  {"id": 20, "name": "19<sup>o</sup>", "status": "active"},
  {"id": 21, "name": "20<sup>o</sup>", "status": "active"},
  {"id": 22, "name": "21<sup>o</sup>", "status": "active"},
  {"id": 23, "name": "22<sup>o</sup>", "status": "active"},
  {"id": 24, "name": "23<sup>o</sup>", "status": "active"},
  {"id": 25, "name": "24<sup>o</sup>", "status": "active"},
  {"id": 26, "name": "25<sup>o</sup>", "status": "active"},
  {"id": 27, "name": "26<sup>o</sup>", "status": "active"},
  {"id": 28, "name": "27<sup>o</sup>", "status": "active"},
  {"id": 29, "name": "28<sup>o</sup>", "status": "active"},
  {"id": 30, "name": "29<sup>o</sup>", "status": "active"},
  {"id": 31, "name": "30<sup>o</sup>", "status": "active"},
  {"id": 32, "name": "31<sup>o</sup>", "status": "active"},
  {"id": 33, "name": "32<sup>o</sup>", "status": "active"},
  {"id": 34, "name": "33<sup>o</sup>", "status": "active"},
  {"id": 35, "name": "34<sup>o</sup>", "status": "active"},
  {"id": 36, "name": "35<sup>o</sup>", "status": "active"},
  {"id": 37, "name": "36<sup>o</sup>", "status": "active"},
  {"id": 38, "name": "37<sup>o</sup>", "status": "active"},
  {"id": 39, "name": "38<sup>o</sup>", "status": "active"},
  {"id": 40, "name": "39<sup>o</sup>", "status": "active"},
  {"id": 41, "name": "40<sup>o</sup>", "status": "active"},
  {"id": 42, "name": "41<sup>o</sup>", "status": "active"},
  {"id": 43, "name": "42<sup>o</sup>", "status": "active"},
  {"id": 44, "name": "43<sup>o</sup>", "status": "active"},
  {"id": 45, "name": "44<sup>o</sup>", "status": "active"},
  {"id": 46, "name": "45<sup>o</sup>", "status": "active"},
  {"id": 47, "name": "46<sup>o</sup>", "status": "active"},
  {"id": 48, "name": "47<sup>o</sup>", "status": "active"},
  {"id": 49, "name": "48<sup>o</sup>", "status": "active"},
  {"id": 50, "name": "49<sup>o</sup>", "status": "active"},
  {"id": 51, "name": "50<sup>o</sup>", "status": "active"},
  {"id": 52, "name": "51<sup>o</sup>", "status": "active"},
  {"id": 53, "name": "52<sup>o</sup>", "status": "active"},
  {"id": 54, "name": "53<sup>o</sup>", "status": "active"},
  {"id": 55, "name": "54<sup>o</sup>", "status": "active"},
  {"id": 56, "name": "55<sup>o</sup>", "status": "active"},
  {"id": 57, "name": "56<sup>o</sup>", "status": "active"},
  {"id": 58, "name": "57<sup>o</sup>", "status": "active"},
  {"id": 59, "name": "58<sup>o</sup>", "status": "active"},
  {"id": 60, "name": "59<sup>o</sup>", "status": "active"},
  {"id": 61, "name": "60<sup>o</sup>", "status": "active"},
  {"id": 62, "name": "61<sup>o</sup>", "status": "active"},
  {"id": 63, "name": "62<sup>o</sup>", "status": "active"},
  {"id": 64, "name": "63<sup>o</sup>", "status": "active"},
  {"id": 65, "name": "64<sup>o</sup>", "status": "active"},
  {"id": 66, "name": "65<sup>o</sup>", "status": "active"},
  {"id": 67, "name": "66<sup>o</sup>", "status": "active"},
  {"id": 68, "name": "67<sup>o</sup>", "status": "active"},
  {"id": 69, "name": "68<sup>o</sup>", "status": "active"},
  {"id": 70, "name": "69<sup>o</sup>", "status": "active"},
  {"id": 71, "name": "70<sup>o</sup>", "status": "active"},
  {"id": 72, "name": "71<sup>o</sup>", "status": "active"},
  {"id": 73, "name": "72<sup>o</sup>", "status": "active"},
  {"id": 74, "name": "73<sup>o</sup>", "status": "active"},
  {"id": 75, "name": "74<sup>o</sup>", "status": "active"},
  {"id": 76, "name": "75<sup>o</sup>", "status": "active"},
  {"id": 77, "name": "76<sup>o</sup>", "status": "active"},
  {"id": 78, "name": "77<sup>o</sup>", "status": "active"},
  {"id": 79, "name": "78<sup>o</sup>", "status": "active"},
  {"id": 80, "name": "79<sup>o</sup>", "status": "active"},
  {"id": 81, "name": "80<sup>o</sup>", "status": "active"},
  {"id": 82, "name": "81<sup>o</sup>", "status": "active"},
  {"id": 83, "name": "82<sup>o</sup>", "status": "active"},
  {"id": 84, "name": "83<sup>o</sup>", "status": "active"},
  {"id": 85, "name": "84<sup>o</sup>", "status": "active"},
  {"id": 86, "name": "85<sup>o</sup>", "status": "active"},
  {"id": 87, "name": "86<sup>o</sup>", "status": "active"},
  {"id": 88, "name": "87<sup>o</sup>", "status": "active"},
  {"id": 89, "name": "88<sup>o</sup>", "status": "active"},
  {"id": 90, "name": "89<sup>o</sup>", "status": "active"},
  {"id": 91, "name": "90<sup>o</sup>", "status": "active"},
  {"id": 92, "name": "91<sup>o</sup>", "status": "active"},
  {"id": 93, "name": "92<sup>o</sup>", "status": "active"},
  {"id": 94, "name": "93<sup>o</sup>", "status": "active"},
  {"id": 95, "name": "94<sup>o</sup>", "status": "active"},
  {"id": 96, "name": "95<sup>o</sup>", "status": "active"},
  {"id": 97, "name": "96<sup>o</sup>", "status": "active"},
  {"id": 98, "name": "97<sup>o</sup>", "status": "active"},
  {"id": 99, "name": "98<sup>o</sup>", "status": "active"},
  {"id": 100, "name": "99<sup>o</sup>", "status": "active"},
  {"id": 101, "name": "100<sup>o</sup>", "status": "active"},
  {"id": 102, "name": "101<sup>o</sup>", "status": "active"},
  {"id": 103, "name": "102<sup>o</sup>", "status": "active"},
  {"id": 104, "name": "103<sup>o</sup>", "status": "active"},
  {"id": 105, "name": "104<sup>o</sup>", "status": "active"},
  {"id": 106, "name": "105<sup>o</sup>", "status": "active"},
  {"id": 107, "name": "106<sup>o</sup>", "status": "active"},
  {"id": 108, "name": "107<sup>o</sup>", "status": "active"},
  {"id": 109, "name": "108<sup>o</sup>", "status": "active"},
  {"id": 110, "name": "109<sup>o</sup>", "status": "active"},
  {"id": 111, "name": "110<sup>o</sup>", "status": "active"},
  {"id": 112, "name": "111<sup>o</sup>", "status": "active"},
  {"id": 113, "name": "112<sup>o</sup>", "status": "active"},
  {"id": 114, "name": "113<sup>o</sup>", "status": "active"},
  {"id": 115, "name": "114<sup>o</sup>", "status": "active"},
  {"id": 116, "name": "115<sup>o</sup>", "status": "active"},
  {"id": 117, "name": "116<sup>o</sup>", "status": "active"},
  {"id": 118, "name": "117<sup>o</sup>", "status": "active"},
  {"id": 119, "name": "118<sup>o</sup>", "status": "active"},
  {"id": 120, "name": "119<sup>o</sup>", "status": "active"},
  {"id": 121, "name": "120<sup>o</sup>", "status": "active"},
  {"id": 122, "name": "121<sup>o</sup>", "status": "active"},
  {"id": 123, "name": "122<sup>o</sup>", "status": "active"},
  {"id": 124, "name": "123<sup>o</sup>", "status": "active"},
  {"id": 125, "name": "124<sup>o</sup>", "status": "active"},
  {"id": 126, "name": "125<sup>o</sup>", "status": "active"},
  {"id": 127, "name": "126<sup>o</sup>", "status": "active"},
  {"id": 128, "name": "127<sup>o</sup>", "status": "active"},
  {"id": 129, "name": "128<sup>o</sup>", "status": "active"},
  {"id": 130, "name": "129<sup>o</sup>", "status": "active"},
  {"id": 131, "name": "130<sup>o</sup>", "status": "active"},
  {"id": 132, "name": "131<sup>o</sup>", "status": "active"},
  {"id": 133, "name": "132<sup>o</sup>", "status": "active"},
  {"id": 134, "name": "133<sup>o</sup>", "status": "active"},
  {"id": 135, "name": "134<sup>o</sup>", "status": "active"},
  {"id": 136, "name": "135<sup>o</sup>", "status": "active"},
  {"id": 137, "name": "136<sup>o</sup>", "status": "active"},
  {"id": 138, "name": "137<sup>o</sup>", "status": "active"},
  {"id": 139, "name": "138<sup>o</sup>", "status": "active"},
  {"id": 140, "name": "139<sup>o</sup>", "status": "active"},
  {"id": 141, "name": "140<sup>o</sup>", "status": "active"},
  {"id": 142, "name": "141<sup>o</sup>", "status": "active"},
  {"id": 143, "name": "142<sup>o</sup>", "status": "active"},
  {"id": 144, "name": "143<sup>o</sup>", "status": "active"},
  {"id": 145, "name": "144<sup>o</sup>", "status": "active"},
  {"id": 146, "name": "145<sup>o</sup>", "status": "active"},
  {"id": 147, "name": "146<sup>o</sup>", "status": "active"},
  {"id": 148, "name": "147<sup>o</sup>", "status": "active"},
  {"id": 149, "name": "148<sup>o</sup>", "status": "active"},
  {"id": 150, "name": "149<sup>o</sup>", "status": "active"},
  {"id": 151, "name": "150<sup>o</sup>", "status": "active"},
  {"id": 152, "name": "151<sup>o</sup>", "status": "active"},
  {"id": 153, "name": "152<sup>o</sup>", "status": "active"},
  {"id": 154, "name": "153<sup>o</sup>", "status": "active"},
  {"id": 155, "name": "154<sup>o</sup>", "status": "active"},
  {"id": 156, "name": "155<sup>o</sup>", "status": "active"},
  {"id": 157, "name": "156<sup>o</sup>", "status": "active"},
  {"id": 158, "name": "157<sup>o</sup>", "status": "active"},
  {"id": 159, "name": "158<sup>o</sup>", "status": "active"},
  {"id": 160, "name": "159<sup>o</sup>", "status": "active"},
  {"id": 161, "name": "160<sup>o</sup>", "status": "active"},
  {"id": 162, "name": "161<sup>o</sup>", "status": "active"},
  {"id": 163, "name": "162<sup>o</sup>", "status": "active"},
  {"id": 164, "name": "163<sup>o</sup>", "status": "active"},
  {"id": 165, "name": "164<sup>o</sup>", "status": "active"},
  {"id": 166, "name": "165<sup>o</sup>", "status": "active"},
  {"id": 167, "name": "166<sup>o</sup>", "status": "active"},
  {"id": 168, "name": "167<sup>o</sup>", "status": "active"},
  {"id": 169, "name": "168<sup>o</sup>", "status": "active"},
  {"id": 170, "name": "169<sup>o</sup>", "status": "active"},
  {"id": 171, "name": "170<sup>o</sup>", "status": "active"},
  {"id": 172, "name": "171<sup>o</sup>", "status": "active"},
  {"id": 173, "name": "172<sup>o</sup>", "status": "active"},
  {"id": 174, "name": "173<sup>o</sup>", "status": "active"},
  {"id": 175, "name": "174<sup>o</sup>", "status": "active"},
  {"id": 176, "name": "175<sup>o</sup>", "status": "active"},
  {"id": 177, "name": "176<sup>o</sup>", "status": "active"},
  {"id": 178, "name": "177<sup>o</sup>", "status": "active"},
  {"id": 179, "name": "178<sup>o</sup>", "status": "active"},
  {"id": 180, "name": "179<sup>o</sup>", "status": "active"},
  {"id": 181, "name": "180<sup>o</sup>", "status": "active"}

];

const diagnosisList = [
    {"id": 1, "name": "Myopia (Near sightedness)"},
    {"id": 2, "name": "Hyperopia (Farsightedness)"},
    {"id": 3, "name": "Astigmatism"},
    {"id": 4, "name": "Presbyopia"},
    {"id": 5, "name": "Cataracts"},
    {"id": 6, "name": "Glaucoma"},
    {"id": 7, "name": "Diabetic Retinopathy"},
    {"id": 8, "name": "Macular Degeneration"},
    {"id": 9, "name": "Retinal Detachment"},
    {"id": 10, "name": "Amblyopia"},
    {"id": 11, "name": "Strabismus"},
    {"id": 12, "name": "Keratoconus"},
    {"id": 13, "name": "Pterygium"},
    {"id": 14, "name": "Pinguecula"},
    {"id": 15, "name": "Blepharitis"},
    {"id": 16, "name": "Conjunctivitis"},
    {"id": 17, "name": "Dry Eye Syndrome"},
    {"id": 18, "name": "Allergic Conjunctivitis"},
    {"id": 19, "name": "Uveitis"},
    {"id": 20, "name": "Chalazion"}
];

const nearAdd = [
    {"id": 1, "name": "+0.75"},
    {"id": 2, "name": "+1.00"},
    {"id": 3, "name": "+1.25"},
    {"id": 4, "name": "+1.50"},
    {"id": 5, "name": "+1.75"},
    {"id": 6, "name": "+2.00"},
    {"id": 7, "name": "+2.25"},
    {"id": 8, "name": "+2.50"},
    {"id": 9, "name": "+2.75"},
    {"id": 10, "name": "+3.00"},
    {"id": 11, "name": "+3.25"},
    {"id": 12, "name": "+3.50"},
    {"id": 13, "name": "+3.75"}
];

const nearReading = [
    {"id": 1, "name": "N5"},
    {"id": 2, "name": "N6"},
    {"id": 3, "name": "N8"},
    {"id": 4, "name": "N10"},
    {"id": 5, "name": "N12"},
    {"id": 6, "name": "N14"},
    {"id": 7, "name": "N16"},
    {"id": 8, "name": "N18"},
    {"id": 9, "name": "N24"},
    {"id": 10, "name": "N36"}
];

const refractionCylinder = [
    {"id": 1, "name": "-10.75D"},
    {"id": 2, "name": "-10.50D"},
    {"id": 3, "name": "-10.25D"},
    {"id": 4, "name": "-10.00D"},
    {"id": 5, "name": "-9.75D"},
    {"id": 6, "name": "-9.50D"},
    {"id": 7, "name": "-9.25D"},
    {"id": 8, "name": "-9.00D"},
    {"id": 9, "name": "-8.75D"},
    {"id": 10, "name": "-8.50D"},
    {"id": 1, "name": "-10.75D"},
    {"id": 2, "name": "-10.50D"},
    {"id": 3, "name": "-10.25D"},
    {"id": 4, "name": "-10.00D"},
    {"id": 5, "name": "-9.75D"},
    {"id": 6, "name": "-9.50D"},
    {"id": 7, "name": "-9.25D"},
    {"id": 8, "name": "-9.00D"},
    {"id": 9, "name": "-8.75D"},
    {"id": 10, "name": "-8.50D"},
    {"id": 11, "name": "-8.25D"},
    {"id": 12, "name": "-8.00D"},
    {"id": 13, "name": "-7.75D"},
    {"id": 14, "name": "-7.50D"},
    {"id": 15, "name": "-7.25D"},
    {"id": 16, "name": "-7.00D"},
    {"id": 17, "name": "-6.75D"},
    {"id": 18, "name": "-6.50D"},
    {"id": 19, "name": "-6.25D"},
    {"id": 20, "name": "-6.00D"},
    {"id": 21, "name": "-5.75D"},
    {"id": 22, "name": "-5.50D"},
    {"id": 23, "name": "-5.25D"},
    {"id": 24, "name": "-5.00D"},
    {"id": 25, "name": "-4.75D"},
    {"id": 26, "name": "-4.50D"},
    {"id": 27, "name": "-4.25D"},
    {"id": 28, "name": "-4.00D"},
    {"id": 29, "name": "-3.75D"},
    {"id": 30, "name": "-3.50D"},
    {"id": 31, "name": "-3.25D"},
    {"id": 32, "name": "-3.00D"},
    {"id": 33, "name": "-2.75D"},
    {"id": 34, "name": "-2.50D"},
    {"id": 35, "name": "-2.25D"},
    {"id": 36, "name": "-2.00D"},
    {"id": 37, "name": "-1.75D"},
    {"id": 38, "name": "-1.50D"},
    {"id": 39, "name": "-1.25D"},
    {"id": 40, "name": "-1.00D"},
    {"id": 41, "name": "-0.75D"},
    {"id": 42, "name": "-0.50D"},
    {"id": 43, "name": "-0.25D"},
    {"id": 44, "name": "0.00D"},
    {"id": 45, "name": "0.25D"},
    {"id": 46, "name": "0.50D"},
    {"id": 47, "name": "0.75D"},
    {"id": 48, "name": "1.00D"},
    {"id": 49, "name": "1.25D"},
    {"id": 50, "name": "1.50D"},
    {"id": 51, "name": "1.75D"},
    {"id": 52, "name": "2.00D"},
    {"id": 53, "name": "2.25D"},
    {"id": 54, "name": "2.50D"},
    {"id": 55, "name": "2.75D"},
    {"id": 56, "name": "3.00D"},
    {"id": 57, "name": "3.25D"},
    {"id": 58, "name": "3.50D"},
    {"id": 59, "name": "3.75D"},
    {"id": 60, "name": "4.00D"},
    {"id": 61, "name": "4.25D"},
    {"id": 62, "name": "4.50D"},
    {"id": 63, "name": "4.75D"},
    {"id": 64, "name": "5.00D"},
    {"id": 65, "name": "5.25D"},
    {"id": 66, "name": "5.50D"},
    {"id": 67, "name": "5.75D"},
    {"id": 68, "name": "6.00D"},
    {"id": 69, "name": "6.25D"},
    {"id": 70, "name": "6.50D"},
    {"id": 71, "name": "6.75D"},
    {"id": 72, "name": "7.00D"},
    {"id": 73, "name": "7.25D"},
    {"id": 74, "name": "7.50D"},
    {"id": 75, "name": "7.75D"},
    {"id": 76, "name": "8.00D"},
    {"id": 77, "name": "8.25D"},
    {"id": 78, "name": "8.50D"},
    {"id": 79, "name": "8.75D"},
    {"id": 80, "name": "9.00D"},
    {"id": 81, "name": "9.25D"},
    {"id": 82, "name": "9.50D"},
    {"id": 83, "name": "9.75D"},
    {"id": 84, "name": "10.00D"},
    {"id": 85, "name": "10.25D"},
    {"id": 86, "name": "10.50D"},
    {"id": 87, "name": "+10.75D"}
];

const refractionPrism = [
    {"id": 1, "name": "-20.0Δ"},
    {"id": 2, "name": "-19.0Δ"},
    {"id": 3, "name": "-18.0Δ"},
    {"id": 4, "name": "-17.0Δ"},
    {"id": 5, "name": "-16.0Δ"},
    {"id": 6, "name": "-15.0Δ"},
    {"id": 7, "name": "-14.0Δ"},
    {"id": 8, "name": "-13.0Δ"},
    {"id": 9, "name": "-12.0Δ"},
    {"id": 10, "name": "-11.0Δ"},
    {"id": 11, "name": "-10.0Δ"},
    {"id": 12, "name": "-9.0Δ"},
    {"id": 13, "name": "-8.0Δ"},
    {"id": 14, "name": "-7.0Δ"},
    {"id": 15, "name": "-6.0Δ"},
    {"id": 16, "name": "-5.0Δ"},
    {"id": 17, "name": "-4.0Δ"},
    {"id": 18, "name": "-3.0Δ"},
    {"id": 19, "name": "-2.0Δ"},
    {"id": 20, "name": "-1.0Δ"},
    {"id": 21, "name": "0.0Δ"},
    {"id": 22, "name": "1.0Δ"},
    {"id": 23, "name": "2.0Δ"},
    {"id": 24, "name": "3.0Δ"},
    {"id": 25, "name": "4.0Δ"},
    {"id": 26, "name": "5.0Δ"},
    {"id": 27, "name": "6.0Δ"},
    {"id": 28, "name": "7.0Δ"},
    {"id": 29, "name": "8.0Δ"},
    {"id": 30, "name": "9.0Δ"},
    {"id": 31, "name": "10.0Δ"},
    {"id": 32, "name": "11.0Δ"},
    {"id": 33, "name": "12.0Δ"},
    {"id": 34, "name": "13.0Δ"},
    {"id": 35, "name": "14.0Δ"},
    {"id": 36, "name": "15.0Δ"},
    {"id": 37, "name": "16.0Δ"},
    {"id": 38, "name": "17.0Δ"},
    {"id": 39, "name": "18.0Δ"},
    {"id": 40, "name": "19.0Δ"},
    {"id": 41, "name": "20.0Δ"}
];

const refractionSphere = [
       {"id": 1, "name": "-10.75D"},
    {"id": 2, "name": "-10.50D"},
    {"id": 3, "name": "-10.25D"},
    {"id": 4, "name": "-10.00D"},
    {"id": 5, "name": "-9.75D"},
    {"id": 6, "name": "-9.50D"},
    {"id": 7, "name": "-9.25D"},
    {"id": 8, "name": "-9.00D"},
    {"id": 9, "name": "-8.75D"},
    {"id": 10, "name": "-8.50D"},
    {"id": 1, "name": "-10.75D"},
    {"id": 2, "name": "-10.50D"},
    {"id": 3, "name": "-10.25D"},
    {"id": 4, "name": "-10.00D"},
    {"id": 5, "name": "-9.75D"},
    {"id": 6, "name": "-9.50D"},
    {"id": 7, "name": "-9.25D"},
    {"id": 8, "name": "-9.00D"},
    {"id": 9, "name": "-8.75D"},
    {"id": 10, "name": "-8.50D"},
    {"id": 11, "name": "-8.25D"},
    {"id": 12, "name": "-8.00D"},
    {"id": 13, "name": "-7.75D"},
    {"id": 14, "name": "-7.50D"},
    {"id": 15, "name": "-7.25D"},
    {"id": 16, "name": "-7.00D"},
    {"id": 17, "name": "-6.75D"},
    {"id": 18, "name": "-6.50D"},
    {"id": 19, "name": "-6.25D"},
    {"id": 20, "name": "-6.00D"},
    {"id": 21, "name": "-5.75D"},
    {"id": 22, "name": "-5.50D"},
    {"id": 23, "name": "-5.25D"},
    {"id": 24, "name": "-5.00D"},
    {"id": 25, "name": "-4.75D"},
    {"id": 26, "name": "-4.50D"},
    {"id": 27, "name": "-4.25D"},
    {"id": 28, "name": "-4.00D"},
    {"id": 29, "name": "-3.75D"},
    {"id": 30, "name": "-3.50D"},
    {"id": 31, "name": "-3.25D"},
    {"id": 32, "name": "-3.00D"},
    {"id": 33, "name": "-2.75D"},
    {"id": 34, "name": "-2.50D"},
    {"id": 35, "name": "-2.25D"},
    {"id": 36, "name": "-2.00D"},
    {"id": 37, "name": "-1.75D"},
    {"id": 38, "name": "-1.50D"},
    {"id": 39, "name": "-1.25D"},
    {"id": 40, "name": "-1.00D"},
    {"id": 41, "name": "-0.75D"},
    {"id": 42, "name": "-0.50D"},
    {"id": 43, "name": "-0.25D"},
    {"id": 44, "name": "0.00D"},
    {"id": 45, "name": "0.25D"},
    {"id": 46, "name": "0.50D"},
    {"id": 47, "name": "0.75D"},
    {"id": 48, "name": "1.00D"},
    {"id": 49, "name": "1.25D"},
    {"id": 50, "name": "1.50D"},
    {"id": 51, "name": "1.75D"},
    {"id": 52, "name": "2.00D"},
    {"id": 53, "name": "2.25D"},
    {"id": 54, "name": "2.50D"},
    {"id": 55, "name": "2.75D"},
    {"id": 56, "name": "3.00D"},
    {"id": 57, "name": "3.25D"},
    {"id": 58, "name": "3.50D"},
    {"id": 59, "name": "3.75D"},
    {"id": 60, "name": "4.00D"},
    {"id": 61, "name": "4.25D"},
    {"id": 62, "name": "4.50D"},
    {"id": 63, "name": "4.75D"},
    {"id": 64, "name": "5.00D"},
    {"id": 65, "name": "5.25D"},
    {"id": 66, "name": "5.50D"},
    {"id": 67, "name": "5.75D"},
    {"id": 68, "name": "6.00D"},
    {"id": 69, "name": "6.25D"},
    {"id": 70, "name": "6.50D"},
    {"id": 71, "name": "6.75D"},
    {"id": 72, "name": "7.00D"},
    {"id": 73, "name": "7.25D"},
    {"id": 74, "name": "7.50D"},
    {"id": 75, "name": "7.75D"},
    {"id": 76, "name": "8.00D"},
    {"id": 77, "name": "8.25D"},
    {"id": 78, "name": "8.50D"},
    {"id": 79, "name": "8.75D"},
    {"id": 80, "name": "9.00D"},
    {"id": 81, "name": "9.25D"},
    {"id": 82, "name": "9.50D"},
    {"id": 83, "name": "9.75D"},
    {"id": 84, "name": "10.00D"},
    {"id": 85, "name": "10.25D"},
    {"id": 86, "name": "10.50D"},
    {"id": 87, "name": "+10.75D"}
];

const investigationsRequiredList = [
    {"id": 1, "name": "Optical Coherence Tomography (OCT)"},
    {"id": 2, "name": "Pachymetry"},
    {"id": 3, "name": "Fundus Fluorescein Angiography (FFA)"},
    {"id": 4, "name": "Fundus Photography"},
    {"id": 5, "name": "Corneal Topography"},
    {"id": 6, "name": "Anterior Segment Imaging"},
    {"id": 7, "name": "Visual Field Test (CVFT)"},
    {"id": 8, "name": "Ultrasound B-Scan"},
    {"id": 9, "name": "Ultrasound A-Scan"},
    {"id": 10, "name": "Electroretinography (ERG)"},
    {"id": 11, "name": "Visual Evoked Potential (VEP)"},
    {"id": 999, "name": "Other"}
];

const investigationsDoneList = [
    {"id": 1, "name": "Non-Contact Tonometry"},
    {"id": 2, "name": "Applanation Tonometry"},
    {"id": 3, "name": "Gonioscopy"},
    {"id": 4, "name": "Slit Lamp Examination"},
    {"id": 5, "name": "Retinoscopy"},
    {"id": 6, "name": "Direct Ophthalmoscopy"},
    {"id": 7, "name": "Indirect Ophthalmoscopy"},
    {"id": 8, "name": "Ultrasound B-Scan"},
    {"id": 9, "name": "Ultrasound A-Scan"},
    {"id": 10, "name": "Corneal Topography"},
    {"id": 11, "name": "Visual Field Test (CVFT)"},
    {"id": 12, "name": "Electroretinography (ERG)"},
    {"id": 13, "name": "Visual Evoked Potential (VEP)"},
    {"id": 999, "name": "Other"}
];

const frameTypeOptions = [
    {"id": 1, "name": "Own Frame Private"},
    {"id": 2, "name": "Rachel Frame Private"},
    {"id": 3, "name": "Own Frame Company"},
    {"id": 4, "name": "Rachel Frame Company"}
];

const frameColorOptions = [
    {"id": 1, "name": "Black"},
    {"id": 2, "name": "Silver"},
    {"id": 3, "name": "Gold"},
    {"id": 4, "name": "Blue"},
    {"id": 5, "name": "Red"}
];

const lensTypeOptions = [
    {"id": 1, "name": "Single Vision"},
    {"id": 2, "name": "Bifocal"},
    {"id": 3, "name": "Progressive"}
];

const lensColorOptions = [
    {"id": 1, "name": "White"},
    {"id": 2, "name": "White Ar"},
    {"id": 3, "name": "Photochromic"},
    {"id": 4, "name": "Photochromic Anti-reflective"}
];

const surfacingOptions = [
    {"id": 1, "name": "Standard"},
    {"id": 2, "name": "Anti-Reflective"},
    {"id": 3, "name": "Scratch-Resistant"},
    {"id": 4, "name": "UV Protection"}
];

const dosageOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', '2 hourly', 'Nocte', 'When necessary'];
const quantityOptions = Array.from({ length: 150 }, (_, i) => (i + 1).toString());
const doseDurationOptions = [
    '1/7', '2/7', '3/7', '4/7', '5/7', '6/7', '7/7', '8/7', '9/7', '10/7', '11/7', '12/7', '13/7', '14/7',
    '1/52', '2/52', '3/52', '4/52',
    '1/12', '2/12', '3/12', '4/12', '5/12', '6/12', '7/12', '8/12', '9/12', '10/12', '11/12', '12/12', '13/12', '14/12'
];

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

    const summaryRightEyeFrontRef = useRef(null);
    const summaryRightEyeBackRef = useRef(null);
    const summaryLeftEyeFrontRef = useRef(null);
    const summaryLeftEyeBackRef = useRef(null);

    const [rightEyeFrontData, setRightEyeFrontData] = useState(null);
    const [rightEyeBackData, setRightEyeBackData] = useState(null);
    const [leftEyeFrontData, setLeftEyeFrontData] = useState(null);
    const [leftEyeBackData, setLeftEyeBackData] = useState(null);

    const [medicineList, setMedicineList] = useState([]);
    const [eyeDropList, setEyeDropList] = useState([]);
    const [tabletList, setTabletList] = useState([]);
    const [ointmentList, setOintmentList] = useState([]);

    const formatArrayForDisplay = (arr: string[] | undefined): string => {
  if (!arr || arr.length === 0) return 'None selected';

  // Sort alphabetically (case-insensitive)
  const sorted = [...arr].sort((a, b) => a.localeCompare(b));

  const joined = sorted.join(', ');

  // Truncate if too long
  if (joined.length > 300) {
    return joined.slice(0, 297) + '...';
  }

  return joined;
};

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
        overallDiagnosisRight: '',
        overallDiagnosisLeft: '',
        otherProblemsRight: '',
        otherProblemsLeft: '',
        otherOverallDiagnosisRight: '',
        otherOverallDiagnosisLeft: '',
        investigationsRequired: [],
        otherInvestigationsRequired: '',
        externalInvestigationsRequired: '',
        investigationsDone: [],
        otherInvestigationsDone: '',
        HBP: '',
        diabetes: '',
        pregnancy: '',
        food: '',
        drugAllergy: '',
        currentMedication: '',
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
                const [medicineRes, eyeDropsRes, tabletRes, ointmentRes] = await Promise.all([
                    api.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`),
                    api.get(`${process.env.NEXT_PUBLIC_APP_URL}/eyedrops`),
                    api.get(`${process.env.NEXT_PUBLIC_APP_URL}/tablets`),
                    api.get(`${process.env.NEXT_PUBLIC_APP_URL}/ointments`),
                ]);
                setMedicineList(Array.isArray(medicineRes.data) ? medicineRes.data : []);
                setEyeDropList(Array.isArray(eyeDropsRes.data) ? eyeDropsRes.data : []);
                setTabletList(Array.isArray(tabletRes.data) ? tabletRes.data : []);
                setOintmentList(Array.isArray(ointmentRes.data) ? ointmentRes.data : []);
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
        if (activeStep === 3) {
            setRightEyeFrontData(rightEyeRef.current?.getSaveData());
            setRightEyeBackData(rightEyeBackRef.current?.getSaveData());
            setLeftEyeFrontData(leftEyeRef.current?.getSaveData());
            setLeftEyeBackData(leftEyeBackRef.current?.getSaveData());
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        if (activeStep === 3) {
            setRightEyeFrontData(rightEyeRef.current?.getSaveData());
            setRightEyeBackData(rightEyeBackRef.current?.getSaveData());
            setLeftEyeFrontData(leftEyeRef.current?.getSaveData());
            setLeftEyeBackData(leftEyeBackRef.current?.getSaveData());
        }
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleStep = (step) => () => {
        if (activeStep === 3) {
            setRightEyeFrontData(rightEyeRef.current?.getSaveData());
            setRightEyeBackData(rightEyeBackRef.current?.getSaveData());
            setLeftEyeFrontData(leftEyeRef.current?.getSaveData());
            setLeftEyeBackData(leftEyeBackRef.current?.getSaveData());
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

        const payload = {
            patientId,
            ...formData,
            investigationsRequired: formData.investigationsRequired.join(','),
            investigationsDone: formData.investigationsDone.join(','),
            problemsRight: formData.problemsRight.join(','),
            problemsLeft: formData.problemsLeft.join(','),
            rightEyeFront: rightEyeFrontData || null,
            rightEyeBack: rightEyeBackData || null,
            leftEyeFront: leftEyeFrontData || null,
            leftEyeBack: leftEyeBackData || null,
            eyeDrops: normalizeData(eyeDrops),
            tablets: normalizeData(tablets),
            ointments: normalizeData(ointments),
            prescriptionGlasses: normalizeData(prescriptionGlasses),
        };

        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_APP_URL}/consulting`, payload);
            const newEncounterId = response.data.data.encounter.encounterId;
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Consultation data submitted successfully!',
                timer: 3000,
                showConfirmButton: false,
            });
            router.push(
                `/dashboard/appointments/encounter-appointment?patientId=${patientId}&patientName=${encodeURIComponent(
                    patientName
                )}&encounterId=${encodeURIComponent(newEncounterId)}`
            );
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
            <Typography variant="h6" className="text-gray-700 dark:text-white mb-2">{title}</Typography>
            <Grid container spacing={2}>
                {data.map(({ label, value }) => (
                    <Grid item xs={12} sm={6} key={label}>
                        <Typography variant="body1" className="dark:text-white text-gray-600">
                            <strong>{label}:</strong> {value || 'Not provided'}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    useEffect(() => {
        if (activeStep === 3) {
            if (rightEyeFrontData && rightEyeRef.current)
                rightEyeRef.current.loadSaveData(rightEyeFrontData);
            if (rightEyeBackData && rightEyeBackRef.current)
                rightEyeBackRef.current.loadSaveData(rightEyeBackData);
            if (leftEyeFrontData && leftEyeRef.current)
                leftEyeRef.current.loadSaveData(leftEyeFrontData);
            if (leftEyeBackData && leftEyeBackRef.current)
                leftEyeBackRef.current.loadSaveData(leftEyeBackData);
        }
    }, [activeStep]);

    useEffect(() => {
        if (activeStep === 7) {
            if (rightEyeFrontData && summaryRightEyeFrontRef.current)
                summaryRightEyeFrontRef.current.loadSaveData(rightEyeFrontData);
            if (rightEyeBackData && summaryRightEyeBackRef.current)
                summaryRightEyeBackRef.current.loadSaveData(rightEyeBackData);
            if (leftEyeFrontData && summaryLeftEyeFrontRef.current)
                summaryLeftEyeFrontRef.current.loadSaveData(leftEyeFrontData);
            if (leftEyeBackData && summaryLeftEyeBackRef.current)
                summaryLeftEyeBackRef.current.loadSaveData(leftEyeBackData);
        }
    }, [activeStep, rightEyeFrontData, rightEyeBackData, leftEyeFrontData, leftEyeBackData]);

    const renderSummarySketches = () => (
        <Box mt={4}>
            <Typography variant="h6" className="text-gray-700 mb-4">Sketch Pad</Typography>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4} width="100%">
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="subtitle1" className="text-gray-600 mb-2">Right Eye Front</Typography>
                    {rightEyeFrontData ? (
                        <CanvasDraw
                            ref={summaryRightEyeFrontRef}
                            disabled={true}
                            hideGrid={true}
                            canvasWidth={300}
                            canvasHeight={300}
                            className="border border-gray-300 rounded-lg"
                        />
                    ) : (
                        <Typography variant="body2" className="text-gray-500">No drawing</Typography>
                    )}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="subtitle1" className="text-gray-600 mb-2">Right Eye Back</Typography>
                    {rightEyeBackData ? (
                        <CanvasDraw
                            ref={summaryRightEyeBackRef}
                            disabled={true}
                            hideGrid={true}
                            canvasWidth={300}
                            canvasHeight={300}
                            className="border border-gray-300 rounded-lg"
                        />
                    ) : (
                        <Typography variant="body2" className="text-gray-500">No drawing</Typography>
                    )}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="subtitle1" className="text-gray-600 mb-2">Left Eye Front</Typography>
                    {leftEyeFrontData ? (
                        <CanvasDraw
                            ref={summaryLeftEyeFrontRef}
                            disabled={true}
                            hideGrid={true}
                            canvasWidth={300}
                            canvasHeight={300}
                            className="border border-gray-300 rounded-lg"
                        />
                    ) : (
                        <Typography variant="body2" className="text-gray-500">No drawing</Typography>
                    )}
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="subtitle1" className="text-gray-600 mb-2">Left Eye Back</Typography>
                    {leftEyeBackData ? (
                        <CanvasDraw
                            ref={summaryLeftEyeBackRef}
                            disabled={true}
                            hideGrid={true}
                            canvasWidth={300}
                            canvasHeight={300}
                            className="border border-gray-300 rounded-lg"
                        />
                    ) : (
                        <Typography variant="body2" className="text-gray-500">No drawing</Typography>
                    )}
                </Box>
            </Box>
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
                        {['otherComplaints', 'detailedHistory'].map((field) =>
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

                         <Grid item xs={12}>
                            <Typography variant="h6" className="text-gray-700 dark:text-gray-300">Physical Information</Typography>
                        </Grid>
                        {[
                            { label: 'HBP', field: 'HBP' },
                            { label: 'Diabetes', field: 'diabetes' },
                            { label: 'Pregnancy', field: 'pregnancy' },
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
            case 1:
                return (
                    <Grid container spacing={4}>
                        {['intraOccularPressure', 'findings', 'eyelid', 'conjunctiva', 'cornea', 'AC', 'iris', 'lens', 'vitreous', 'retina', 'OCT', 'FFA', 'fundusPhotography', 'pachymetry', 'CVFT', 'CVFTKinetic', 'otherFindings'].map((field) =>
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
                                        {(field.includes('Near') ? nearReading : nearReading).map((option) => (
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
                        {[
                            { field: 'frameType', label: 'Frame Type', options: frameTypeOptions },
                            { field: 'frameColor', label: 'Frame Color', options: frameColorOptions },
                            { field: 'lensType', label: 'Lens Type', options: lensTypeOptions },
                            { field: 'lensColor', label: 'Lens Color', options: lensColorOptions },
                            { field: 'surfacing', label: 'Surfacing', options: surfacingOptions },
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
                                            <MenuItem key={option.id} value={option.name}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ))}
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
                                    onChange={() => setRightEyeFrontData(rightEyeRef.current?.getSaveData())}
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
                                    onChange={() => setRightEyeBackData(rightEyeBackRef.current?.getSaveData())}
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
                                    onChange={() => setLeftEyeFrontData(leftEyeRef.current?.getSaveData())}
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
                                    onChange={() => setLeftEyeBackData(leftEyeBackRef.current?.getSaveData())}
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
                        {fields.map((field) => {
                            if (field.key === 'overallDiagnosisRight' || field.key === 'overallDiagnosisLeft') {
                                return (
                                    <Grid item xs={12} sm={6} key={field.key}>
                                        <TextField
                                            label={field.label}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            variant="outlined"
                                            value={formData[field.key]}
                                            onChange={(e) => handleFormChange(field.key, e.target.value)}
                                            className="rounded-lg"
                                        />
                                    </Grid>
                                );
                            }
                            return (
                                <Grid item xs={12} sm={6} key={field.key}>
                                    <FormControl fullWidth>
                                        <InputLabel>{field.label}</InputLabel>
                                        {/* <Select
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
                                                <MenuItem key={option.id} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </Select> */}
                                        <Select
  multiple
  value={formData[field.key] || []}
  onChange={(e) => handleFormChange(field.key, e.target.value)}
  renderValue={(selected) => selected.join(', ')}   // ← change to this
>
  {diagnosisList.map((option) => (
    <MenuItem key={option.id} value={option.name}>
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
                            );
                        })}
                    </Grid>
                );
            case 5:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Investigations Required</InputLabel>
                                {/* <Select
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
                                        <MenuItem key={option.id} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select> */}
                                <Select
  multiple
  value={formData.investigationsRequired || []}
  onChange={(e) => handleFormChange('investigationsRequired', e.target.value)}
  renderValue={(selected) => selected.join(', ')}   // ← this is the key fix
>
  {investigationsRequiredList.map((option) => (
    <MenuItem key={option.id} value={option.name}>
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
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Investigations Done in Clinic</InputLabel>
                                {/* <Select
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
                                        <MenuItem key={option.id} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select> */}
                                <Select
  multiple
  value={formData.investigationsDone || []}
  onChange={(e) => handleFormChange('investigationsDone', e.target.value)}
  renderValue={(selected) => selected.join(', ')}
>
  {investigationsDoneList.map((option) => (
    <MenuItem key={option.id} value={option.name}>
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
                       
                    </Grid>
                );
            case 6:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            {renderTable('Eye Drops', eyeDrops, setEyeDrops, [
                                { name: 'medicine', label: 'Medicine', type: 'select', options: eyeDropList.map(m => m.productName) },
                                { name: 'dosage', label: 'Dosage', type: 'select', options: dosageOptions },
                                { name: 'doseDuration', label: 'Dosage Duration', type: 'select', options: doseDurationOptions },
                                { name: 'doseInterval', label: 'Quantity', type: 'select', options: quantityOptions },
                                { name: 'comment', label: 'Comment' },
                            ])}
                        </Grid>
                        <Grid item xs={12}>
                            {renderTable('Tablets', tablets, setTablets, [
                                { name: 'medicine', label: 'Medicine', type: 'select', options: tabletList.map(m => m.productName) },
                                { name: 'dosage', label: 'Dosage', type: 'select', options: dosageOptions },
                                { name: 'doseDuration', label: 'Dosage Duration', type: 'select', options: doseDurationOptions },
                                { name: 'doseInterval', label: 'Quantity', type: 'select', options: quantityOptions },
                                { name: 'comment', label: 'Comment' },
                            ])}
                        </Grid>
                        <Grid item xs={12}>
                            {renderTable('Ointments', ointments, setOintments, [
                                { name: 'medicine', label: 'Medicine', type: 'select', options: ointmentList.map(m => m.productName) },
                                { name: 'dosage', label: 'Dosage', type: 'select', options: dosageOptions },
                                { name: 'doseDuration', label: 'Dosage Duration', type: 'select', options: doseDurationOptions },
                                { name: 'doseInterval', label: 'Quantity', type: 'select', options: quantityOptions },
                                { name: 'comment', label: 'Comment' },
                            ])}
                        </Grid>
                        <Grid item xs={12}>
                            {renderTable('Prescription Glasses', prescriptionGlasses, setPrescriptionGlasses, [
                                { name: 'lensType', label: 'Lens Type' },
                            ])}
                        </Grid>
                    </Grid>
                );
            case 7:
                return (
                    <Box>
                        {renderSummaryTable('Consultation', [
                            { label: 'Chief Complaint (Right)', value: chiefComplaintOptions.find(opt => opt.id === formData.chiefComplaintRight)?.name },
                            { label: 'Chief Complaint (Left)', value: chiefComplaintOptions.find(opt => opt.id === formData.chiefComplaintLeft)?.name },
                            { label: 'Other Complaints (Right)', value: formData.otherComplaintsRight },
                            { label: 'Other Complaints (Left)', value: formData.otherComplaintsLeft },
                            { label: 'Detailed History (Right)', value: formData.detailedHistoryRight },
                            { label: 'Detailed History (Left)', value: formData.detailedHistoryLeft },
                            { label: 'High Blood Pressure', value: formData.HBP },
                            { label: 'Diabetes', value: formData.diabetes },
                            { label: 'Pregnancy', value: formData.pregnancy },
                            { label: 'Food Allergies', value: formData.food },
                            { label: 'Drug Allergies', value: formData.drugAllergy },
                            { label: 'Current Medication', value: formData.currentMedication },
                        ])}
                        {renderSummaryTable('Findings', [
                            { label: 'Intra-Occular Pressure (Right)', value: formData.intraOccularPressureRight },
                            { label: 'Intra-Occular Pressure (Left)', value: formData.intraOccularPressureLeft },
                            { label: 'Findings (Right)', value: formData.findingsRight },
                            { label: 'Findings (Left)', value: formData.findingsLeft },
                            { label: 'Eyelid (Right)', value: formData.eyelidRight },
                            { label: 'Eyelid (Left)', value: formData.eyelidLeft },
                            { label: 'Conjunctiva (Right)', value: formData.conjunctivaRight },
                            { label: 'Conjunctiva (Left)', value: formData.conjunctivaLeft },
                            { label: 'Cornea (Right)', value: formData.corneaRight },
                            { label: 'Cornea (Left)', value: formData.corneaLeft },
                            { label: 'Anterior Chamber (Right)', value: formData.ACRight },
                            { label: 'Anterior Chamber (Left)', value: formData.ACLeft },
                            { label: 'Iris (Right)', value: formData.irisRight },
                            { label: 'Iris (Left)', value: formData.irisLeft },
                            { label: 'Pupil (Right)', value: formData.pupilRight },
                            { label: 'Pupil (Left)', value: formData.pupilLeft },
                            { label: 'Lens (Right)', value: formData.lensRight },
                            { label: 'Lens (Left)', value: formData.lensLeft },
                            { label: 'Vitreous (Right)', value: formData.vitreousRight },
                            { label: 'Vitreous (Left)', value: formData.vitreousLeft },
                            { label: 'Retina (Right)', value: formData.retinaRight },
                            { label: 'Retina (Left)', value: formData.retinaLeft },
                            { label: 'OCT (Right)', value: formData.OCTRight },
                            { label: 'OCT (Left)', value: formData.OCTLeft },
                            { label: 'Fundus Fluorescence Angiography (Right)', value: formData.FFARight },
                            { label: 'Fundus Fluorescence Angiography (Left)', value: formData.FFALeft },
                            { label: 'Fundus Photography (Right)', value: formData.fundusPhotographyRight },
                            { label: 'Fundus Photography (Left)', value: formData.fundusPhotographyLeft },
                            { label: 'Pachymetry (Right)', value: formData.pachymetryRight },
                            { label: 'Pachymetry (Left)', value: formData.pachymetryLeft },
                            { label: 'Central Visual Field Test (Right)', value: formData.CVFTRight },
                            { label: 'Central Visual Field Test (Left)', value: formData.CVFTLeft },
                            { label: 'Central Visual Field Test Kinetic (Right)', value: formData.CVFTKineticRight },
                            { label: 'Central Visual Field Test Kinetic (Left)', value: formData.CVFTKineticLeft },
                            { label: 'Other Findings (Right)', value: formData.otherFindingsRight },
                            { label: 'Other Findings (Left)', value: formData.otherFindingsLeft },
                            { label: 'Visual Acuity Far Best Corrected (Right)', value: visualAcuityFar.find(opt => opt.id === formData.visualAcuityFarBestCorrectedRight)?.name },
                            { label: 'Visual Acuity Far Best Corrected (Left)', value: visualAcuityFar.find(opt => opt.id === formData.visualAcuityFarBestCorrectedLeft)?.name },
                            { label: 'Visual Acuity Far Presenting (Right)', value: visualAcuityFar.find(opt => opt.id === formData.visualAcuityFarPresentingRight)?.name },
                            { label: 'Visual Acuity Far Presenting (Left)', value: visualAcuityFar.find(opt => opt.id === formData.visualAcuityFarPresentingLeft)?.name },
                            { label: 'Visual Acuity Far Pinhole (Right)', value: visualAcuityFar.find(opt => opt.id === formData.visualAcuityFarPinholeRight)?.name },
                            { label: 'Visual Acuity Far Pinhole (Left)', value: visualAcuityFar.find(opt => opt.id === formData.visualAcuityFarPinholeLeft)?.name },
                            { label: 'Visual Acuity Near (Right)', value: visualAcuityNear.find(opt => opt.id === formData.visualAcuityNearRight)?.name },
                            { label: 'Visual Acuity Near (Left)', value: visualAcuityNear.find(opt => opt.id === formData.visualAcuityNearLeft)?.name },
                        ])}
                        {renderSummaryTable('Refraction', [
                            { label: 'Near Add (Right)', value: nearAdd.find(opt => opt.id === formData.nearAddRight)?.name },
                            { label: 'Near Add (Left)', value: nearAdd.find(opt => opt.id === formData.nearAddLeft)?.name },
                            { label: 'Refraction Sphere (Right)', value: refractionSphere.find(opt => opt.id === formData.refractionSphereRight)?.name },
                            { label: 'Refraction Sphere (Left)', value: refractionSphere.find(opt => opt.id === formData.refractionSphereLeft)?.name },
                            { label: 'Refraction Cylinder (Right)', value: refractionCylinder.find(opt => opt.id === formData.refractionCylinderRight)?.name },
                            { label: 'Refraction Cylinder (Left)', value: refractionCylinder.find(opt => opt.id === formData.refractionCylinderLeft)?.name },
                            { label: 'Refraction Axis (Right)', value: refractionAxis.find(opt => opt.id === formData.refractionAxisRight)?.name },
                            { label: 'Refraction Axis (Left)', value: refractionAxis.find(opt => opt.id === formData.refractionAxisLeft)?.name },
                            { label: 'Refraction Prism (Right)', value: refractionPrism.find(opt => opt.id === formData.refractionPrismRight)?.name },
                            { label: 'Refraction Prism (Left)', value: refractionPrism.find(opt => opt.id === formData.refractionPrismLeft)?.name },
                            { label: 'Pupillary Distance (PD)', value: formData.pd },
                            { label: 'Bridge', value: formData.bridge },
                            { label: 'Eye Size', value: formData.eyeSize },
                            { label: 'Temple', value: formData.temple },
                            { label: 'Decentration', value: formData.decentration },
                            { label: 'Segment Measurement', value: formData.segmentMeasurement },
                            { label: 'Case Size', value: formData.caseSize },
                            { label: 'Frame Type', value: frameTypeOptions.find(opt => opt.id === formData.frameType)?.name },
                            { label: 'Frame Color', value: frameColorOptions.find(opt => opt.id === formData.frameColor)?.name },
                            { label: 'Frame Cost', value: formData.frameCost },
                            { label: 'Lens Type', value: lensTypeOptions.find(opt => opt.id === formData.lensType)?.name },
                            { label: 'Lens Color', value: lensColorOptions.find(opt => opt.id === formData.lensColor)?.name },
                            { label: 'Lens Cost', value: formData.lensCost },
                            { label: 'Surfacing', value: surfacingOptions.find(opt => opt.id === formData.surfacing)?.name },
                            { label: 'Other Notes', value: formData.other },
                        ])}
                        {renderSummarySketches()}
                        {renderSummaryTable('Diagnosis', [
  {
    label: 'Problems Identified (Right)',
    value: formData.problemsRight?.length > 0
      ? formatArrayForDisplay(formData.problemsRight)
      : 'None selected'
  },
  {
    label: 'Problems Identified (Left)',
    value: formData.problemsLeft?.length > 0
      ? formatArrayForDisplay(formData.problemsLeft)
      : 'None selected'
  },
  { label: 'Other Problems (Right)', value: formData.otherProblemsRight || 'None' },
  { label: 'Other Problems (Left)', value: formData.otherProblemsLeft || 'None' },
  { label: 'Overall Diagnosis (Right)', value: formData.overallDiagnosisRight || 'None' },
  { label: 'Overall Diagnosis (Left)', value: formData.overallDiagnosisLeft || 'None' },
  { label: 'Other Overall Diagnosis (Right)', value: formData.otherOverallDiagnosisRight || 'None' },
  { label: 'Other Overall Diagnosis (Left)', value: formData.otherOverallDiagnosisLeft || 'None' },
])}
  
  {renderSummaryTable('Investigations', [
  {
    label: 'Investigations Required',
    value: formData.investigationsRequired?.length > 0
      ? formatArrayForDisplay(formData.investigationsRequired)
      : 'None selected'
  },
  { label: 'Other Investigations Required', value: formData.otherInvestigationsRequired || 'None' },
  { label: 'External Investigations Required', value: formData.externalInvestigationsRequired || 'None' },
  {
    label: 'Investigations Done in Clinic',
    value: formData.investigationsDone?.length > 0
      ? formatArrayForDisplay(formData.investigationsDone)
      : 'None selected'
  },
  { label: 'Other Investigations Done', value: formData.otherInvestigationsDone || 'None' },
])}
                        {renderSummaryTable('Treatment', [
                            { label: 'Eye Drops', value: eyeDrops.map(row => `${row.medicine} (${row.dosage}, ${row.doseDuration}, ${row.doseInterval}) - ${row.comment || 'No comment'}`).join('; ') },
                            { label: 'Tablets', value: tablets.map(row => `${row.medicine} (${row.dosage}, ${row.doseDuration}, ${row.doseInterval}) - ${row.comment || 'No comment'}`).join('; ') },
                            { label: 'Ointments', value: ointments.map(row => `${row.medicine} (${row.dosage}, ${row.doseDuration}, ${row.doseInterval}) - ${row.comment || 'No comment'}`).join('; ') },
                            { label: 'Prescription Glasses', value: prescriptionGlasses.map(row => `Lens Type: ${row.lensType || 'Not specified'}`).join('; ') },
                        ])}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="shadow-xl bg-white dark:bg-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-10">
                <Typography variant="h4" className="text-2xl font-bold text-gray-600 dark:text-white mb-4">
                    Eye Clinic Consultation
                </Typography>
                <Typography variant="h6" className="text-gray-600 dark:text-white mb-6">
                    Patient: {patientName}
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepButton 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleStep(index)();
                                }}
                            >
                                <StepLabel>{label}</StepLabel>
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <form 
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                            e.preventDefault();
                        }
                    }}
                >
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }}
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
