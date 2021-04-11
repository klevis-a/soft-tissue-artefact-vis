'use strict';

import {AnimationHelper} from "./AnimationHelper.js";
import {BoneSceneDebug} from "./BoneSceneDebug.js";
import {HumerusLandmarks, MarkerTrajectories, ScapulaLandmarks, Trajectory} from "./Csv_Processor.js";
import {promiseLoadSTL} from "./MiscThreeHelpers.js";
import {WebGLRenderer} from "./vendor/three.js/build/three.module.js";
import {divGeometry} from "./SceneHelpers.js";
import {addCommonMarkerFields, enableMarkerGUI} from "./BoneScene_MarkerCommon.js";
import {enableLandmarks} from "./BoneScene_Landmarks.js";
import {enableViconMarkers} from "./BoneScene_ViconMarkers.js";
import {enableNoSTAMarkers} from "./BoneScene_NoSTAMarkers.js";
import {enableMarkerTracesGUI} from "./BoneScene_MarkerTracesCommon.js";
import {enableViconMarkerTraces} from "./BoneScene_ViconMarkerTraces.js";
import {enableNoSTAMarkerTraces} from "./BoneScene_NoSTAMarkerTraces.js";
import {enableMarkerClusters, enableMarkerClusterGUI} from "./BoneScene_MarkerCluster.js";
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
        containerView: document.getElementById('topContainer'),
        mainView: document.getElementById('mainView'),
        debugView: document.getElementById('debugView'),
        analysisGuiElement: document.getElementById('datGUIAnalysis'),
        sceneGuiElement: document.getElementById('datGUIScene'),
        debugGuiElement: document.getElementById('datGUIDebug'),
        statsElement: document.getElementById('statsContainer')
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

    let {canvas, containerView, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement} = getBoneSceneElements();
    let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

    const humerusLandmarks = new HumerusLandmarks(humerusLandmarksCsv.data);
    const scapulaLandmarks = new ScapulaLandmarks(scapulaLandmarksCsv.data);
    const biplaneTrajectory = new Trajectory(biplaneTrajectoryCsv.data);
    const markerTrajectories = new MarkerTrajectories(markerTrajectoriesCsv.data);

    const renderer = new WebGLRenderer({canvas});
    const {contentWidth, contentHeight} = divGeometry(containerView);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(contentWidth, contentHeight);

    boneScene = new BoneSceneDebug(containerView, renderer, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement,
        statsElement, humerusLandmarks, scapulaLandmarks, biplaneTrajectory, markerTrajectories, humerusGeometry, scapulaGeometry);

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
