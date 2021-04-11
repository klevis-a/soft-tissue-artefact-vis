'use strict';

import {AnimationHelper} from "./AnimationHelper.js";
import {promiseLoadSTL} from "./MiscThreeHelpers.js";
import {BoneScene} from "./BoneScene.js";
import {WebGLRenderer} from "./vendor/three.js/build/three.module.js";
import {divGeometry} from "./SceneHelpers.js";
import {addCommonMarkerFields, enableMarkerGUI} from "./BoneScene_MarkerCommon.js";
import {enableLandmarks} from "./BoneScene_Landmarks.js";
import {enableViconMarkers} from "./BoneScene_ViconMarkers.js";
import {enableNoSTAMarkers} from "./BoneScene_NoSTAMarkers.js";
import {enableMarkerTracesGUI} from "./BoneScene_MarkerTracesCommon.js";
import {enableViconMarkerTraces} from "./BoneScene_ViconMarkerTraces.js";
import {enableNoSTAMarkerTraces} from "./BoneScene_NoSTAMarkerTraces.js";
import {enableMarkerClusterGUI, enableMarkerClusters} from "./BoneScene_MarkerCluster.js";
import {HumerusLandmarks, MarkerTrajectories, ScapulaLandmarks, Trajectory} from "./Csv_Processor.js";
import {loadCsv} from "./JSHelpers.js";

let animationHelper;
let boneScene;

function getTimelineCtrlElements() {
    return {
        playBtn: document.getElementById('playPauseCtrl'),
        timeline: document.getElementById('timeline'),
        frameNumLbl: document.getElementById('frameNum')
    }
}

function getBoneSceneElements() {
    return {
        canvas: document.getElementById('canvas'),
        mainView: document.getElementById('mainView'),
        analysisGuiElement: document.getElementById('datGUIAnalysis'),
        sceneGuiElement: document.getElementById('datGUIScene')
    }
}

const humerusStlFile = './csv/O45_001_F_47_R/O45_001_F_47_R_Humerus_smooth.stl';
const scapulaStlFile = './csv/O45_001_F_47_R/O45_001_F_47_R_Scapula_smooth.stl';
const humerusLandmarksFile = './csv/O45_001_F_47_R/O45_001_F_47_R_humerus_landmarks.csv';
const scapulaLandmarksFile = './csv/O45_001_F_47_R/O45_001_F_47_R_scapula_landmarks.csv';
const biplaneTrajectoryFile = './csv/O45_001_F_47_R/O45_001_CA_t01.csv';
const markerTrajectoryFile = './csv/O45_001_F_47_R/O45_001_CA_t01_markers.csv';

Promise.all([promiseLoadSTL(humerusStlFile), promiseLoadSTL(scapulaStlFile), loadCsv(humerusLandmarksFile),
    loadCsv(scapulaLandmarksFile), loadCsv(biplaneTrajectoryFile), loadCsv(markerTrajectoryFile)])
    .then(([humerusGeometry, scapulaGeometry, humerusLandmarksCsv, scapulaLandmarksCsv, biplaneTrajectoryCsv, markerTrajectoriesCsv]) => {
    let {canvas, mainView, analysisGuiElement, sceneGuiElement} = getBoneSceneElements();
    let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

    const humerusLandmarks = new HumerusLandmarks(humerusLandmarksCsv.data);
    const scapulaLandmarks = new ScapulaLandmarks(scapulaLandmarksCsv.data);
    const biplaneTrajectory = new Trajectory(biplaneTrajectoryCsv.data);
    const markerTrajectories = new MarkerTrajectories(markerTrajectoriesCsv.data);

    const renderer = new WebGLRenderer({canvas});
    const {contentWidth, contentHeight} = divGeometry(mainView);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(contentWidth, contentHeight);

    boneScene = new BoneScene(renderer, mainView, analysisGuiElement, sceneGuiElement, humerusLandmarks, scapulaLandmarks,
        biplaneTrajectory, markerTrajectories, humerusGeometry, scapulaGeometry);
    addCommonMarkerFields(boneScene);
    enableLandmarks(boneScene);
    enableViconMarkers(boneScene);
    enableNoSTAMarkers(boneScene);
    enableViconMarkerTraces(boneScene);
    enableNoSTAMarkerTraces(boneScene);
    enableMarkerClusters(boneScene);
    enableMarkerGUI(boneScene);
    enableMarkerTracesGUI(boneScene);
    enableMarkerClusterGUI(boneScene);
    boneScene.initScene();
    boneScene.createSceneGraph();
    boneScene.repositionSceneGraphs();
    boneScene.createGUI();
    animationHelper = new AnimationHelper(boneScene, biplaneTrajectory.NumFrames, playBtn, timeline, frameNumLbl);

    window.addEventListener('resize', () => boneScene.resizeScene());
});

// close button
const closeBtn = document.getElementById('help-close-btn');
const helpDiv = document.getElementById('help-div');
const helpBtn = document.getElementById('help-btn');
closeBtn.onclick = () => helpDiv.style.display = "none";
helpBtn.onclick = () => helpDiv.style.display = "block";
