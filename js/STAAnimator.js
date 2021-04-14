'use strict';

import {AnimationHelper} from "./AnimationHelper.js";
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

export class STAAnimator {
    constructor(humerusGeometry, scapulaGeometry, humerusLandmarksData, scapulaLandmarksData, biplaneTrajectoryData, markerTrajectoriesData) {
        let {canvas, mainView, analysisGuiElement, sceneGuiElement} = getBoneSceneElements();
        let {playBtn, timeline, frameNumLbl} = getTimelineCtrlElements();

        const humerusLandmarks = new HumerusLandmarks(humerusLandmarksData.data);
        const scapulaLandmarks = new ScapulaLandmarks(scapulaLandmarksData.data);
        const biplaneTrajectory = new Trajectory(biplaneTrajectoryData.data);
        const markerTrajectories = new MarkerTrajectories(markerTrajectoriesData.data);

        this.renderer = new WebGLRenderer({canvas});
        const {contentWidth, contentHeight} = divGeometry(mainView);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(contentWidth, contentHeight);

        this.boneScene = new BoneScene(this.renderer, mainView, analysisGuiElement, sceneGuiElement, humerusLandmarks, scapulaLandmarks,
            biplaneTrajectory, markerTrajectories, humerusGeometry, scapulaGeometry);
        addCommonMarkerFields(this.boneScene);
        enableLandmarks(this.boneScene);
        enableViconMarkers(this.boneScene);
        enableNoSTAMarkers(this.boneScene);
        enableViconMarkerTraces(this.boneScene);
        enableNoSTAMarkerTraces(this.boneScene);
        enableMarkerClusters(this.boneScene);
        enableMarkerGUI(this.boneScene);
        enableMarkerTracesGUI(this.boneScene);
        enableMarkerClusterGUI(this.boneScene);
        this.boneScene.initScene();
        this.boneScene.createSceneGraph();
        this.boneScene.repositionSceneGraphs();
        this.boneScene.createGUI();
        this.animationHelper = new AnimationHelper(this.boneScene, biplaneTrajectory.NumFrames, playBtn, timeline, frameNumLbl);
        this.resizeListener = () => this.boneScene.resizeScene();
        window.addEventListener('resize', this.resizeListener);
    }

    dispose() {
        this.animationHelper.dispose();
        this.boneScene.dispose();
        window.removeEventListener('resize', this.resizeListener);
        this.renderer.dispose();
    }
}
