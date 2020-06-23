'use strict';

import {CSVLoader} from "./CSVLoader.js";
import {AnimationHelper} from "./AnimationHelper.js";
import {BoneSceneDebug} from "./BoneSceneDebug.js";
import {LandmarksInfo, StaticSTAInfo, TimeSeriesSTAInfo} from "./STA_CSV_Processor.js";
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

let animationHelper;
let boneScene;

function loadPapaParse() {
    return new Promise(function (resolve, reject) {
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
        containerView: document.getElementById('topContainer'),
        mainView: document.getElementById('mainView'),
        debugView: document.getElementById('debugView'),
        analysisGuiElement: document.getElementById('datGUIAnalysis'),
        sceneGuiElement: document.getElementById('datGUIScene'),
        debugGuiElement: document.getElementById('datGUIDebug'),
        statsElement: document.getElementById('statsContainer')
    }
}

const csvLoaderInit = loadPapaParse().then(papa => new CSVLoader(papa));
const landmarkInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CTdata_Input_for_mtwtesla.csv'));
const staticCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01_static.csv'));
const timeSeriesCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01.csv'));
const humerusLoader = promiseLoadSTL('./models/humerus.stl');
const scapulaLoader = promiseLoadSTL('./models/scapula.stl');

Promise.all([humerusLoader, scapulaLoader, landmarkInit, staticCsvInit, timeSeriesCsvInit]).then(([humerusGeometry, scapulaGeometry, landmarkResults, staticResults, timeSeriesResults]) => {
    let {canvas, containerView, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement} = getBoneSceneElements();
    let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

    const landmarksInfo = new LandmarksInfo(landmarkResults.data);
    const staticInfo = new StaticSTAInfo(staticResults);
    const timeSeriesInfo = new TimeSeriesSTAInfo(timeSeriesResults);

    const renderer = new WebGLRenderer({canvas});
    const {contentWidth, contentHeight} = divGeometry(containerView);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(contentWidth, contentHeight);

    boneScene = new BoneSceneDebug(containerView, renderer, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement, landmarksInfo, staticInfo, timeSeriesInfo, humerusGeometry, scapulaGeometry);
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
    animationHelper = new AnimationHelper(boneScene, timeSeriesInfo.NumFrames, playBtn, timeline, frameNumLbl);

    window.addEventListener('resize', () => boneScene.resizeScene());
});
