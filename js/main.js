'use strict';

import {CSVLoader} from "./CSVLoader.js";
import {AnimationHelper} from "./AnimationHelper.js";
import {LandmarksInfo, StaticSTAInfo, TimeSeriesSTAInfo, BasisVectorsInfo} from "./STA_CSV_Processor.js";
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
import {enableMarkerClusters, enableMarkerClusterGUI} from "./BoneScene_MarkerCluster.js";
import {enableBasisVectors, enableBasisVectorsGUI} from "./BoneScene_BasisVectors.js";

let animationHelper;
let boneScene;

function loadPapaParse() {
    return new Promise(function (resolve) {
        require(['./js/vendor/papaparse.js'], papa => resolve(papa));
    });
}

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

const csvLoaderInit = loadPapaParse().then(papa => new CSVLoader(papa));
const landmarkInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CTdata_Input_for_mtwtesla.csv'));
const staticCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01_static.csv'));
const timeSeriesCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01.csv'));
const humerusBVCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01_humerus_BV_QR.csv'));
const scapulaBVCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01_scapula_BV_QR.csv'));
const humerusLoader = promiseLoadSTL('./models/humerus.stl');
const scapulaLoader = promiseLoadSTL('./models/scapula.stl');

Promise.all([humerusLoader, scapulaLoader, landmarkInit, staticCsvInit, timeSeriesCsvInit, humerusBVCsvInit, scapulaBVCsvInit])
    .then(([humerusGeometry, scapulaGeometry, landmarkResults, staticResults, timeSeriesResults, humerusBVCsvResults, scapulaBVCsvResults]) => {
    let {canvas, mainView, analysisGuiElement, sceneGuiElement} = getBoneSceneElements();
    let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

    const landmarksInfo = new LandmarksInfo(landmarkResults.data);
    const staticInfo = new StaticSTAInfo(staticResults);
    const timeSeriesInfo = new TimeSeriesSTAInfo(timeSeriesResults);
    const humerusBVInfo = new BasisVectorsInfo(humerusBVCsvResults, BasisVectorsInfo.HumerusMarkerOrder);
    const scapulaBVInfo = new BasisVectorsInfo(scapulaBVCsvResults, BasisVectorsInfo.ScapulaMarkerOrder);

    const renderer = new WebGLRenderer({canvas});
    const {contentWidth, contentHeight} = divGeometry(mainView);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(contentWidth, contentHeight);

    boneScene = new BoneScene(renderer, mainView, analysisGuiElement, sceneGuiElement, landmarksInfo, staticInfo, timeSeriesInfo, humerusGeometry, scapulaGeometry);
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
    enableBasisVectors(boneScene, humerusBVInfo, scapulaBVInfo);
    enableBasisVectorsGUI(boneScene);
    boneScene.initScene();
    boneScene.createSceneGraph();
    boneScene.repositionSceneGraphs();
    boneScene.createGUI();
    animationHelper = new AnimationHelper(boneScene, timeSeriesInfo.NumFrames, playBtn, timeline, frameNumLbl);

    window.addEventListener('resize', () => boneScene.resizeScene());
});

// close button
const closeBtn = document.getElementById('help-close-btn');
const helpDiv = document.getElementById('help-div');
const helpBtn = document.getElementById('help-btn');
closeBtn.onclick = () => helpDiv.style.display = "none";
helpBtn.onclick = () => helpDiv.style.display = "block";
