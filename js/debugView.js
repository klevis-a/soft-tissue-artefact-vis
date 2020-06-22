'use strict';

import {loadScript} from "./JSHelpers.js";
import {CSVLoader} from "./CSVLoader.js";
import {AnimationHelper} from "./AnimationHelper.js";
import {BoneSceneDebug} from "./BoneSceneDebug.js";
import * as STA_CSV_Processor from "./STA_CSV_Processor.js";

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
        mainView: document.getElementById('mainView'),
        debugView: document.getElementById('debugView'),
        analysisGuiElement: document.getElementById('datGUIAnalysis'),
        sceneGuiElement: document.getElementById('datGUIScene'),
        debugGuiElement: document.getElementById('datGUIDebug'),
        statsElement: document.getElementById('statsContainer')
    }
}

const csvLoaderInit = loadScript('./js/vendor/require.js').then(() => loadPapaParse()).then(papa => new CSVLoader(papa));
const landmarkInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CTdata_Input_for_mtwtesla.csv'));
const staticCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01_static.csv'));
const timeSeriesCsvInit = csvLoaderInit.then((csvLoader) => csvLoader.loadCsv('./csv/N005_CA_t01.csv'));

Promise.all([BoneSceneDebug.loadHumerusScapula(), landmarkInit, staticCsvInit, timeSeriesCsvInit]).then(([loadedSTLs, landmarkResults, staticResults, timeSeriesResults]) => {
    let {canvas, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement} = getBoneSceneElements();
    let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

    const landmarksInfo = new STA_CSV_Processor.LandmarksInfo(landmarkResults.data);
    const staticInfo = new STA_CSV_Processor.StaticSTAInfo(staticResults);
    const timeSeriesInfo = new STA_CSV_Processor.TimeSeriesSTAInfo(timeSeriesResults);

    boneScene = new BoneSceneDebug(canvas, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement, loadedSTLs, landmarksInfo, staticInfo, timeSeriesInfo);
    boneScene.initScene();
    boneScene.createSceneGraph();
    boneScene.repositionSceneGraphs();
    boneScene.createGUI();
    animationHelper = new AnimationHelper(boneScene, timeSeriesInfo.NumFrames, playBtn, timeline, frameNumLbl);
});
