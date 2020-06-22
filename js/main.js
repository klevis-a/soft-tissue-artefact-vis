'use strict';

import {CSVLoader} from "./CSVLoader.js";
import {AnimationHelper} from "./AnimationHelper.js";
import * as STA_CSV_Processor from "./STA_CSV_Processor.js";
import {promiseLoadSTL} from "./MiscThreeHelpers.js";
import {BoneSceneFnc} from "./BoneSceneFnc.js";
import {WebGLRenderer} from "./vendor/three.js/build/three.module.js";
import {divGeometry} from "./SceneHelpers.js";

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
const humerusLoader = promiseLoadSTL('./models/humerus.stl');
const scapulaLoader = promiseLoadSTL('./models/scapula.stl');

Promise.all([humerusLoader, scapulaLoader, landmarkInit, staticCsvInit, timeSeriesCsvInit]).then(([humerusGeometry, scapulaGeometry, landmarkResults, staticResults, timeSeriesResults]) => {
    let {canvas, mainView, analysisGuiElement, sceneGuiElement} = getBoneSceneElements();
    let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

    const landmarksInfo = new STA_CSV_Processor.LandmarksInfo(landmarkResults.data);
    const staticInfo = new STA_CSV_Processor.StaticSTAInfo(staticResults);
    const timeSeriesInfo = new STA_CSV_Processor.TimeSeriesSTAInfo(timeSeriesResults);

    const renderer = new WebGLRenderer({canvas});
    const {contentWidth, contentHeight} = divGeometry(mainView);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(contentWidth, contentHeight);
    boneScene = new BoneSceneFnc(renderer, mainView, analysisGuiElement, sceneGuiElement, landmarksInfo, staticInfo, timeSeriesInfo, humerusGeometry, scapulaGeometry);
    boneScene.initScene();
    boneScene.createSceneGraph();
    boneScene.repositionSceneGraphs();
    //boneScene.createGUI();
    animationHelper = new AnimationHelper(boneScene, timeSeriesInfo.NumFrames, playBtn, timeline, frameNumLbl);

    window.addEventListener('resize', () => boneScene.resizeScene());
});

