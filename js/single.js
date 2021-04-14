import {STAAnimator} from "./STAAnimator.js";
import {promiseLoadSTL} from "./MiscThreeHelpers.js";
import {loadCsv} from "./JSHelpers.js";

const humerusStlFile = './csv/O45_001_F_47_R/O45_001_F_47_R_Humerus_smooth.stl';
const scapulaStlFile = './csv/O45_001_F_47_R/O45_001_F_47_R_Scapula_smooth.stl';
const humerusLandmarksFile = './csv/O45_001_F_47_R/O45_001_F_47_R_humerus_landmarks.csv';
const scapulaLandmarksFile = './csv/O45_001_F_47_R/O45_001_F_47_R_scapula_landmarks.csv';
const biplaneTrajectoryFile = './csv/O45_001_F_47_R/O45_001_CA_t01.csv';
const markerTrajectoryFile = './csv/O45_001_F_47_R/O45_001_CA_t01_markers.csv';

Promise.all([promiseLoadSTL(humerusStlFile), promiseLoadSTL(scapulaStlFile), loadCsv(humerusLandmarksFile),
    loadCsv(scapulaLandmarksFile), loadCsv(biplaneTrajectoryFile), loadCsv(markerTrajectoryFile)])
    .then(([humerusGeometry, scapulaGeometry, humerusLandmarksData, scapulaLandmarksData, biplaneTrajectoryData, markerTrajectoriesData]) =>
            new STAAnimator(humerusGeometry, scapulaGeometry, humerusLandmarksData, scapulaLandmarksData, biplaneTrajectoryData, markerTrajectoriesData));

const closeBtn = document.getElementById('help-close-btn');
const helpDiv = document.getElementById('help-div');
const helpBtn = document.getElementById('help-btn');
closeBtn.addEventListener('click', () => helpDiv.style.display = 'none');
helpBtn.addEventListener('click', () => helpDiv.style.display = 'block');
