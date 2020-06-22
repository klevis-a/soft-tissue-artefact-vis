'use strict';

import * as THREE from './vendor/three.js/build/three.module.js';
import {TrackballControls} from "./vendor/three.js/examples/jsm/controls/TrackballControls.js";
import { GUI } from './vendor/three.js/examples/jsm/libs/dat.gui.module.js';
import * as MiscThreeHelpers from './MiscThreeHelpers.js';
import * as SceneHelpers from './SceneHelpers.js';
import * as GUIHelpers from './GUIHelpers.js'
import SVD from './vendor/svd.js'
import {LineGeometry} from "./vendor/three.js/examples/jsm/lines/LineGeometry.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";
import {Line2} from "./vendor/three.js/examples/jsm/lines/Line2.js";

export class BoneScene {
    static BONE_COLOR = 0xe3dac9;
    static BONE_MATERIAL = new THREE.MeshPhongMaterial({color: BoneScene.BONE_COLOR, opacity: 0.8, transparent: true});
    static LANDMARK_GEOMETRY = new THREE.SphereBufferGeometry(3.5, 10, 10);
    static MARKER_GEOMETRY = new THREE.SphereBufferGeometry(7, 10, 10);

    static BLACK_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0x000000});
    static RED_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0xff0000, opacity: 0.7, transparent: true});
    static GREEN_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0x00ff00, opacity: 0.7, transparent: true});
    static BLUE_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0x0000ff, opacity: 0.7, transparent: true});
    static YELLOW_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0xffff00, opacity: 0.7, transparent: true});
    static GRAY_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0x787878});

    static RED_NOSTA_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0xff0000, wireframe: true});
    static GREEN_NOSTA_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0x00ff00, wireframe: true});
    static BLUE_NOSTA_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0x0000ff, wireframe: true});
    static YELLOW_NOSTA_MARKER_MATERIAL = new THREE.MeshPhongMaterial({color: 0xffff00, wireframe: true});

    static RED_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3});
    static GREEN_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3});
    static BLUE_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3});
    static YELLOW_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3});
    static BLACK_LINE_MATERIAL = new LineMaterial({color:0x000000, linewidth:3});

    static RED_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    static GREEN_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    static BLUE_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    static YELLOW_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});

    static MAIN_VIEW_COLOR =  0xDCDCDC;

    static SegmentMarkerMaterials = new Map([
        ['RUPAA', BoneScene.RED_MARKER_MATERIAL],
        ['RUPAB', BoneScene.GREEN_MARKER_MATERIAL],
        ['RUPAC', BoneScene.BLUE_MARKER_MATERIAL],
        ['RUPAD', BoneScene.YELLOW_MARKER_MATERIAL],
        ['RSH0', BoneScene.RED_MARKER_MATERIAL],
        ['RACRM', BoneScene.GREEN_MARKER_MATERIAL],
        ['RSPIN', BoneScene.BLUE_MARKER_MATERIAL],
        ['RANGL', BoneScene.YELLOW_MARKER_MATERIAL],
    ]);

    static SegmentLineMaterials = new Map([
        ['RUPAA', BoneScene.RED_LINE_MATERIAL],
        ['RUPAB', BoneScene.GREEN_LINE_MATERIAL],
        ['RUPAC', BoneScene.BLUE_LINE_MATERIAL],
        ['RUPAD', BoneScene.YELLOW_LINE_MATERIAL],
        ['RSH0', BoneScene.RED_LINE_MATERIAL],
        ['RACRM', BoneScene.GREEN_LINE_MATERIAL],
        ['RSPIN', BoneScene.BLUE_LINE_MATERIAL],
        ['RANGL', BoneScene.YELLOW_LINE_MATERIAL],
    ]);

    static SegmentNoSTAMarkerMaterials = new Map([
        ['RUPAA', BoneScene.RED_NOSTA_MARKER_MATERIAL],
        ['RUPAB', BoneScene.GREEN_NOSTA_MARKER_MATERIAL],
        ['RUPAC', BoneScene.BLUE_NOSTA_MARKER_MATERIAL],
        ['RUPAD', BoneScene.YELLOW_NOSTA_MARKER_MATERIAL],
        ['RSH0', BoneScene.RED_NOSTA_MARKER_MATERIAL],
        ['RACRM', BoneScene.GREEN_NOSTA_MARKER_MATERIAL],
        ['RSPIN', BoneScene.BLUE_NOSTA_MARKER_MATERIAL],
        ['RANGL', BoneScene.YELLOW_NOSTA_MARKER_MATERIAL],
    ]);

    static SegmentNoSTALineMaterials = new Map([
        ['RUPAA', BoneScene.RED_NOSTA_LINE_MATERIAL],
        ['RUPAB', BoneScene.GREEN_NOSTA_LINE_MATERIAL],
        ['RUPAC', BoneScene.BLUE_NOSTA_LINE_MATERIAL],
        ['RUPAD', BoneScene.YELLOW_NOSTA_LINE_MATERIAL],
        ['RSH0', BoneScene.RED_NOSTA_LINE_MATERIAL],
        ['RACRM', BoneScene.GREEN_NOSTA_LINE_MATERIAL],
        ['RSPIN', BoneScene.BLUE_NOSTA_LINE_MATERIAL],
        ['RANGL', BoneScene.YELLOW_NOSTA_LINE_MATERIAL],
    ]);

    static MarkerSegmentMap = new Map([
        ['T10','thorax'],
        ['T5','thorax'],
        ['C7','thorax'],
        ['STRN','thorax'],
        ['CLAV','clavicle'],
        ['LCLAV','clavicle'],
        ['LSHO','leftScapula'],
        ['RCLAV','clavicle'],
        ['RSH0','scapula'],
        ['RACRM','scapula'],
        ['RSPIN','scapula'],
        ['RANGL','scapula'],
        ['RUPAA','humerus'],
        ['RUPAB','humerus'],
        ['RUPAC','humerus'],
        ['RUPAD','humerus'],
        ['RELB','humerus'],
        ['RFRM','rightForearmWrist'],
        ['RWRA','rightForearmWrist'],
        ['RWRB','rightForearmWrist'],
        ['RHNDA','rightHand'],
        ['RHNDB','rightHand'],
        ['RHNDC','rightHand'],
        ['RHNDD','rightHand'],
    ]);

    static segmentFriendNameMap = new Map([
        ['thorax', 'Thorax'],
        ['clavicle', 'Clavicle'],
        ['leftScapula', 'Left Scapula'],
        ['scapula', 'Right Scapula'],
        ['humerus', 'Upper Arm'],
        ['rightForearmWrist', 'Forearm/Wrist'],
        ['rightHand', 'Hand'],
    ]);

    static HumerusMarkerOrder = ['RUPAA', 'RUPAB', 'RUPAC', 'RUPAD', 'RUPAA'];
    static ScapulaMarkerOrder = ['RACRM', 'RSPIN', 'RANGL', 'RACRM', 'RSH0'];

    static setTrackballControls(trackBallControl) {
        trackBallControl.rotateSpeed = 3.0;
        trackBallControl.zoomSpeed = 1.2;
        trackBallControl.panSpeed = 0.8;
        //65:A - orbiting operations
        //83:S - zooming operations
        //68:D - panning operations
        trackBallControl.keys = [65, 83, 68];
    }

    static createLandmark(material, position) {
        const mesh = new THREE.Mesh(BoneScene.LANDMARK_GEOMETRY, material);
        mesh.position.copy(position);
        return mesh;
    }

    static createMarker(material, position) {
        const mesh = new THREE.Mesh(BoneScene.MARKER_GEOMETRY, material);
        mesh.position.copy(position);
        return mesh;
    }

    static createBoneMeshFromGeometry(geometry) {
        const mesh = new THREE.Mesh(geometry, BoneScene.BONE_MATERIAL);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    static loadBone(stlPath) {
        return MiscThreeHelpers.promiseLoadSTL(stlPath)
            .then(geometry => this.createBoneMeshFromGeometry(geometry));
    }

    static loadHumerusScapula() {
        return Promise.all([BoneScene.loadBone('./models/humerus.stl'), BoneScene.loadBone('./models/scapula.stl')])
            .then(meshArray => new Map([['humerus', meshArray[0]], ['scapula', meshArray[1]]]));
    }

    constructor(canvas, view, analysisGuiElement, sceneGuiElement, loadedSTLs, landmarksInfo, staticInfo, timeSeriesInfo) {
        this.canvas = canvas;
        this.view = view;
        this.sceneGuiElement = sceneGuiElement;
        this.analysisGuiElement = analysisGuiElement;
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.shadowMap.enabled = true;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(BoneScene.MAIN_VIEW_COLOR);
        this.loadedSTLs = loadedSTLs;
        this.landmarksInfo = landmarksInfo;
        this.staticInfo = staticInfo;
        this.timeSeriesInfo = timeSeriesInfo;
        this.landmarks = {};
        this.landmarks.humerus = {};
        this.landmarks.scapula = {};
        this.noSTAMarkers = {};
        this.noSTAMarkers.humerus = {};
        this.noSTAMarkers.scapula = {};
        this.viconMarkers = {};
        this.viconMarkerTraces = {};
        this.viconMarkerTraces.Lines = {};
        this.viconMarkerTraces.NumSegments = {};
        this.noSTAMarkerTraces = {};
        this.noSTAMarkerTraces.Lines = {};
        this.noSTAMarkerTraces.NumSegments = {};
        this.humerusGeometry = {};
        this.scapulaGeometry = {};
        this.humerus = this.loadedSTLs.get('humerus');
        this.scapula = this.loadedSTLs.get('scapula');

        this.markerSegmentVisibility = {
            'thorax': true,
            'clavicle': true,
            'leftScapula': true,
            'scapula': true,
            'humerus': true,
            'rightForearmWrist': false,
            'rightHand': false};
    }

    updateToFrame(frameNum) {
        const currentFrame = Math.floor(frameNum);
        let modifiedFrameNum;
        if (currentFrame>=(this.timeSeriesInfo.NumFrames-1)) {
            modifiedFrameNum = this.timeSeriesInfo.NumFrames-1;
            this.humerus.position.copy(this.timeSeriesInfo.humPosVector(this.timeSeriesInfo.NumFrames-1));
            this.scapula.position.copy(this.timeSeriesInfo.scapPosVector(this.timeSeriesInfo.NumFrames-1));
            this.humerus.quaternion.copy(this.timeSeriesInfo.humOrientQuat(this.timeSeriesInfo.NumFrames-1));
            this.scapula.quaternion.copy(this.timeSeriesInfo.scapOrientQuat(this.timeSeriesInfo.NumFrames-1));

            for (const segmentName in this.viconMarkers) {
                const currentSegment = this.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    const markerPos = this.timeSeriesInfo.markerPosVector(markerName, this.timeSeriesInfo.NumFrames-1);
                    if (markerPos === null) {
                        currentSegment[markerName].visible = false;
                    }
                    else {
                        currentSegment[markerName].visible = this.markerSegmentVisibility[segmentName];
                        currentSegment[markerName].position.copy(markerPos);
                    }
                }
            }
        }
        else {
            modifiedFrameNum = currentFrame;
            const nextFrame = Math.ceil(frameNum);
            const interpFactor = frameNum - currentFrame;
            this.humerus.position.copy(this.timeSeriesInfo.humPosVector(currentFrame).lerp(this.timeSeriesInfo.humPosVector(nextFrame), interpFactor));
            this.scapula.position.copy(this.timeSeriesInfo.scapPosVector(currentFrame).lerp(this.timeSeriesInfo.scapPosVector(nextFrame), interpFactor));
            this.humerus.quaternion.copy(this.timeSeriesInfo.humOrientQuat(currentFrame).slerp(this.timeSeriesInfo.humOrientQuat(nextFrame),interpFactor));
            this.scapula.quaternion.copy(this.timeSeriesInfo.scapOrientQuat(currentFrame).slerp(this.timeSeriesInfo.scapOrientQuat(nextFrame),interpFactor));

            for (const segmentName in this.viconMarkers) {
                const currentSegment = this.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    const markerPosCurrent = this.timeSeriesInfo.markerPosVector(markerName, currentFrame);
                    const markerPosNext = this.timeSeriesInfo.markerPosVector(markerName, nextFrame);

                    if (markerPosCurrent === null) {
                        currentSegment[markerName].visible = false;
                    }
                    else {
                        if (markerPosNext === null) {
                            currentSegment[markerName].position.copy(markerPosCurrent);
                        }
                        else {
                            currentSegment[markerName].position.copy(markerPosCurrent.lerp(markerPosNext, interpFactor));
                        }
                        currentSegment[markerName].visible = this.markerSegmentVisibility[segmentName];
                    }
                }
            }
        }

        for (const segmentName in this.viconMarkerTraces.Lines) {
            for (const markerName in this.viconMarkerTraces.Lines[segmentName]) {
                this.viconMarkerTraces.Lines[segmentName][markerName].geometry.maxInstancedCount = this.viconMarkerTraces.NumSegments[segmentName][markerName][modifiedFrameNum];
            }
        }

        for (const segmentName in this.noSTAMarkerTraces.Lines) {
            for (const markerName in this.noSTAMarkerTraces.Lines[segmentName]) {
                this.noSTAMarkerTraces.Lines[segmentName][markerName].geometry.maxInstancedCount = this.noSTAMarkerTraces.NumSegments[segmentName][markerName][modifiedFrameNum];
            }
        }

        const humPositions = [];
        for (const markerName of BoneScene.HumerusMarkerOrder) {
            const markerPosition = this.viconMarkers.humerus[markerName].position;
            humPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        this.humerusCluster.geometry.setPositions(humPositions);
        this.humerusCluster.geometry.attributes.instanceStart.data.needsUpdate = true;

        const scapPositions = [];
        for (const markerName of BoneScene.ScapulaMarkerOrder) {
            const markerPosition = this.viconMarkers.scapula[markerName].position;
            scapPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        this.scapulaCluster.geometry.setPositions(scapPositions);
        this.scapulaCluster.geometry.attributes.instanceStart.data.needsUpdate = true;
    }

    resizeRendererToDisplaySize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        const needResize = this.renderer.width !== width || this.renderer.height !== height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }
        return needResize;
    }

    get viewGeometry() {
        return SceneHelpers.divGeometry(this.view);
    }

    renderSceneGraph() {
        this.resizeRendererToDisplaySize();
        const {contentWidth, contentHeight, aspectRatio} = this.viewGeometry;
        this.camera.aspect = aspectRatio;
        BoneScene.RED_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.GREEN_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.BLUE_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.YELLOW_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.BLACK_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.RED_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.GREEN_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.BLUE_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        BoneScene.YELLOW_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        this.camera.updateProjectionMatrix();
        this.scene.background.set(BoneScene.MAIN_VIEW_COLOR);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    initScene() {
        this.addSTLsToScene();
        this.addLandmarks();
        this.addNoSTAMarkers();
        this.addViconMarkers();
        this.addViconMarkerTraces();
        this.addNoSTAMarkerTraces();
        this.addScapulaHumerusClusterNoSTA();
        this.addScapulaHumerusCluster();
        this.updateToFrame(0);
        this.computeHumerusCS();
        this.computeScapulaCS();
        this.computeCameraDistance();
        this.computeThoraxGlobalCS();
    }

    addSTLsToScene() {
        this.scene.add(this.humerus);
        this.scene.add(this.scapula);
    }

    addLandmark(name, segment, material) {
        this.landmarks[segment][name] = BoneScene.createLandmark(material, this.landmarksInfo[segment][name]);
        this[segment].add(this.landmarks[segment][name]);
    }

    addLandmarks() {
        this.addLandmark('hhc', 'humerus', BoneScene.BLACK_MARKER_MATERIAL);
        this.addLandmark('me', 'humerus', BoneScene.RED_MARKER_MATERIAL);
        this.addLandmark('le', 'humerus', BoneScene.GREEN_MARKER_MATERIAL);

        this.addLandmark('gc', 'scapula', BoneScene.BLACK_MARKER_MATERIAL);
        this.addLandmark('ac', 'scapula', BoneScene.RED_MARKER_MATERIAL);
        this.addLandmark('pla', 'scapula', BoneScene.GREEN_MARKER_MATERIAL);
        this.addLandmark('ts', 'scapula', BoneScene.BLUE_MARKER_MATERIAL);
        this.addLandmark('ia', 'scapula', BoneScene.YELLOW_MARKER_MATERIAL);
    }

    addNoSTAMarker(name, segment, material) {
        this.noSTAMarkers[segment][name] = BoneScene.createMarker(material, this.staticInfo.markerPosVector(name));
        this[segment].add(this.noSTAMarkers[segment][name]);
    }

    addNoSTAMarkers() {
        this.addNoSTAMarker('RUPAA', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAA'));
        this.addNoSTAMarker('RUPAB', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAB'));
        this.addNoSTAMarker('RUPAC', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAC'));
        this.addNoSTAMarker('RUPAD', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAD'));

        this.addNoSTAMarker('RSH0', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RSH0'));
        this.addNoSTAMarker('RACRM', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RACRM'));
        this.addNoSTAMarker('RSPIN', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RSPIN'));
        this.addNoSTAMarker('RANGL', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RANGL'));
    }

    addViconMarker(name, segmentName, material) {
        if (this.viconMarkers[segmentName] === undefined) {
            this.viconMarkers[segmentName] = {};
        }
        const markerPos = this.timeSeriesInfo.markerPosVector(name, 0);
        if (markerPos === null) {
            this.viconMarkers[segmentName][name] = BoneScene.createMarker(material, new THREE.Vector3());
            this.viconMarkers[segmentName][name].visible = false;
        }
        else {
            this.viconMarkers[segmentName][name] = BoneScene.createMarker(material, markerPos);
            this.viconMarkers[segmentName][name].visible = this.markerSegmentVisibility[segmentName];
        }
        this.scene.add(this.viconMarkers[segmentName][name]);
    }

    addViconMarkers() {
        for (const markerName of this.timeSeriesInfo.Markers.keys()) {
            const markerMaterial = BoneScene.SegmentMarkerMaterials.get(markerName) || BoneScene.GRAY_MARKER_MATERIAL;
            this.addViconMarker(markerName, BoneScene.MarkerSegmentMap.get(markerName), markerMaterial);
        }
    }

    addViconMarkerTrace(markerName, segmentName, material) {
        if (this.viconMarkerTraces.Lines[segmentName] === undefined) {
            this.viconMarkerTraces.Lines[segmentName] = {};
        }
        if (this.viconMarkerTraces.NumSegments[segmentName] === undefined) {
            this.viconMarkerTraces.NumSegments[segmentName] = {};
        }
        this.viconMarkerTraces.NumSegments[segmentName][markerName] = new Array(this.timeSeriesInfo.NumFrames);
        const positions = [];
        let numSegments = -1;
        for (let i=0; i<this.timeSeriesInfo.NumFrames; i++) {
            const markerPosition = this.timeSeriesInfo.markerPosVector(markerName, i);
            if (markerPosition !== null) {
                positions.push(markerPosition.x, markerPosition.y, markerPosition.z);
                numSegments++;
            }
            this.viconMarkerTraces.NumSegments[segmentName][markerName][i] = numSegments < 0 ? 0 : numSegments;
        }
        const lineGeometry = new LineGeometry();
        lineGeometry.setPositions(positions);
        this.viconMarkerTraces.Lines[segmentName][markerName] = new Line2(lineGeometry, material);
        this.viconMarkerTraces.Lines[segmentName][markerName].computeLineDistances();
        this.viconMarkerTraces.Lines[segmentName][markerName].scale.set(1,1,1);
        this.viconMarkerTraces.Lines[segmentName][markerName].visible = false;
        this.scene.add(this.viconMarkerTraces.Lines[segmentName][markerName]);
    }

    addViconMarkerTraces() {
        this.addViconMarkerTrace('RUPAA', 'humerus', BoneScene.SegmentLineMaterials.get('RUPAA'));
        this.addViconMarkerTrace('RUPAB', 'humerus', BoneScene.SegmentLineMaterials.get('RUPAB'));
        this.addViconMarkerTrace('RUPAC', 'humerus', BoneScene.SegmentLineMaterials.get('RUPAC'));
        this.addViconMarkerTrace('RUPAD', 'humerus', BoneScene.SegmentLineMaterials.get('RUPAD'));

        this.addViconMarkerTrace('RSH0', 'scapula', BoneScene.SegmentLineMaterials.get('RSH0'));
        this.addViconMarkerTrace('RACRM', 'scapula', BoneScene.SegmentLineMaterials.get('RACRM'));
        this.addViconMarkerTrace('RSPIN', 'scapula', BoneScene.SegmentLineMaterials.get('RSPIN'));
        this.addViconMarkerTrace('RANGL', 'scapula', BoneScene.SegmentLineMaterials.get('RANGL'));
    }

    addNoSTAMarkerTrace(markerName, segmentName, material) {
        if (this.noSTAMarkerTraces.Lines[segmentName] === undefined) {
            this.noSTAMarkerTraces.Lines[segmentName] = {};
        }
        if (this.noSTAMarkerTraces.NumSegments[segmentName] === undefined) {
            this.noSTAMarkerTraces.NumSegments[segmentName] = {};
        }
        let posFnc;
        let quatFnc;

        if (segmentName==='humerus') {
            posFnc = (frameNum) => this.timeSeriesInfo.humPosVector(frameNum);
            quatFnc = (frameNum) => this.timeSeriesInfo.humOrientQuat(frameNum);
        }
        else if (segmentName==='scapula') {
            posFnc = (frameNum) => this.timeSeriesInfo.scapPosVector(frameNum);
            quatFnc = (frameNum) => this.timeSeriesInfo.scapOrientQuat(frameNum);
        }
        else {
            return;
        }
        const markerRelPos = this.staticInfo.markerPosVector(markerName);

        this.noSTAMarkerTraces.NumSegments[segmentName][markerName] = new Array(this.timeSeriesInfo.NumFrames);
        const positions = [];
        let numSegments = -1;
        for (let i=0; i<this.timeSeriesInfo.NumFrames; i++) {
            const segmentPos = posFnc(i);
            const segmentQuat = quatFnc(i);
            if (segmentPos !== null && segmentQuat !== null) {
                const markerPosition = new THREE.Vector3().copy(markerRelPos).applyQuaternion(segmentQuat).add(segmentPos);
                positions.push(markerPosition.x, markerPosition.y, markerPosition.z);
                numSegments++;
            }
            this.noSTAMarkerTraces.NumSegments[segmentName][markerName][i] = numSegments < 0 ? 0 : numSegments;
        }
        const lineGeometry = new LineGeometry();
        lineGeometry.setPositions(positions);
        this.noSTAMarkerTraces.Lines[segmentName][markerName] = new Line2(lineGeometry, material);
        this.noSTAMarkerTraces.Lines[segmentName][markerName].computeLineDistances();
        this.noSTAMarkerTraces.Lines[segmentName][markerName].scale.set(1,1,1);
        this.noSTAMarkerTraces.Lines[segmentName][markerName].visible = false;
        this.scene.add(this.noSTAMarkerTraces.Lines[segmentName][markerName]);
    }

    addNoSTAMarkerTraces() {
        this.addNoSTAMarkerTrace('RUPAA', 'humerus', BoneScene.SegmentNoSTALineMaterials.get('RUPAA'));
        this.addNoSTAMarkerTrace('RUPAB', 'humerus', BoneScene.SegmentNoSTALineMaterials.get('RUPAB'));
        this.addNoSTAMarkerTrace('RUPAC', 'humerus', BoneScene.SegmentNoSTALineMaterials.get('RUPAC'));
        this.addNoSTAMarkerTrace('RUPAD', 'humerus', BoneScene.SegmentNoSTALineMaterials.get('RUPAD'));

        this.addNoSTAMarkerTrace('RSH0', 'scapula', BoneScene.SegmentNoSTALineMaterials.get('RSH0'));
        this.addNoSTAMarkerTrace('RACRM', 'scapula', BoneScene.SegmentNoSTALineMaterials.get('RACRM'));
        this.addNoSTAMarkerTrace('RSPIN', 'scapula', BoneScene.SegmentNoSTALineMaterials.get('RSPIN'));
        this.addNoSTAMarkerTrace('RANGL', 'scapula', BoneScene.SegmentNoSTALineMaterials.get('RANGL'));
    }

    addScapulaHumerusClusterNoSTA() {
        const humPositions = [];
        for (const markerName of BoneScene.HumerusMarkerOrder) {
            const markerPosition = this.noSTAMarkers.humerus[markerName].position;
            humPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        const lineGeometryHum = new LineGeometry();
        lineGeometryHum.setPositions(humPositions);
        this.humerusClusterNoSTA = new Line2(lineGeometryHum, BoneScene.BLACK_LINE_MATERIAL);
        this.humerus.add(this.humerusClusterNoSTA);


        const scapPositions = [];
        for (const markerName of BoneScene.ScapulaMarkerOrder) {
            const markerPosition = this.noSTAMarkers.scapula[markerName].position;
            scapPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        const lineGeometryScap = new LineGeometry();
        lineGeometryScap.setPositions(scapPositions);
        this.scapulaClusterNoSTA = new Line2(lineGeometryScap, BoneScene.BLACK_LINE_MATERIAL);
        this.scapula.add(this.scapulaClusterNoSTA);
    }

    addScapulaHumerusCluster() {
        const humPositions = [];
        for (const markerName of BoneScene.HumerusMarkerOrder) {
            const markerPosition = this.viconMarkers.humerus[markerName].position;
            humPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        const lineGeometryHum = new LineGeometry();
        lineGeometryHum.setPositions(humPositions);
        this.humerusCluster = new Line2(lineGeometryHum, BoneScene.BLACK_LINE_MATERIAL);
        this.scene.add(this.humerusCluster);

        const scapPositions = [];
        for (const markerName of BoneScene.ScapulaMarkerOrder) {
            const markerPosition = this.viconMarkers.scapula[markerName].position;
            scapPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }

        const lineGeometryScap = new LineGeometry();
        lineGeometryScap.setPositions(scapPositions);
        this.scapulaCluster = new Line2(lineGeometryScap, BoneScene.BLACK_LINE_MATERIAL);
        this.scene.add(this.scapulaCluster);
    }

    computeThoraxGlobalCS(){
        const t10 = this.timeSeriesInfo.markerPosVector('T10', 0);
        const t5 = this.timeSeriesInfo.markerPosVector('T5', 0);
        const c7 = this.timeSeriesInfo.markerPosVector('C7', 0);
        const strn = this.timeSeriesInfo.markerPosVector('STRN', 0);
        const clav = this.timeSeriesInfo.markerPosVector('CLAV', 0);
        const thoraxMarkers = [t10, t5, c7, strn, clav];

        const presentMarkers = thoraxMarkers.filter(x => x!==null);
        const markerCoG = presentMarkers.reduce((accumulator, currentValue) => accumulator.add(currentValue),
            new THREE.Vector3()).multiplyScalar(1/presentMarkers.length);

        //to determine the lateral direction, the SVD is utilized to do a plane fit to the above markers
        const markerMatrix = [];
        presentMarkers.reduce((accumulator, currentValue) => {
            accumulator.push(currentValue.sub(markerCoG).toArray());
            return accumulator;
        }, markerMatrix);
        const {v,q} = SVD(markerMatrix,true,true);

        //the right vector corresponding to the smallest singular value is perpendicular to the plane that best fits the markers above
        const minDim = q.indexOf(Math.min(...q));
        this.lateralVector = new THREE.Vector3(v[0][minDim], v[1][minDim], v[2][minDim]);

        //we don't know if the lateralVector is pointing right or left and we want it to point right
        const ts = this.landmarks.scapula.ts.getWorldPosition(new THREE.Vector3());
        const gc = this.landmarks.scapula.gc.getWorldPosition(new THREE.Vector3());
        if (new THREE.Vector3().copy(this.lateralVector).dot(gc.sub(ts)) < 0)  this.lateralVector.multiplyScalar(-1);
        this.frontVector = new THREE.Vector3().crossVectors(this.staticInfo.upVector(), this.lateralVector);
    }

    computeHumerusCS() {
        const hhc = this.landmarks.humerus.hhc.getWorldPosition(new THREE.Vector3());
        const me = this.landmarks.humerus.me.getWorldPosition(new THREE.Vector3());
        const le =  this.landmarks.humerus.le.getWorldPosition(new THREE.Vector3());
        this.humerusGeometry.y_axis = new THREE.Vector3().addVectors(me, le).multiplyScalar(0.5).multiplyScalar(-1).add(hhc);
        this.humerusGeometry.x_axis = new THREE.Vector3().subVectors(me, le).cross(this.humerusGeometry.y_axis);
        this.humerusGeometry.z_axis = new THREE.Vector3().crossVectors(this.humerusGeometry.x_axis, this.humerusGeometry.y_axis);
        this.humerusGeometry.x_axis.normalize();
        this.humerusGeometry.y_axis.normalize();
        this.humerusGeometry.z_axis.normalize();
        this.humerusGeometry.length = new THREE.Vector3().addVectors(me, le).sub(hhc).length();
    }

    computeScapulaCS() {
        const gc = this.landmarks.scapula.gc.getWorldPosition(new THREE.Vector3());
        const ia = this.landmarks.scapula.ia.getWorldPosition(new THREE.Vector3());
        const ts = this.landmarks.scapula.ts.getWorldPosition(new THREE.Vector3());

        this.scapulaGeometry.z_axis = new THREE.Vector3().subVectors(gc, ts);
        this.scapulaGeometry.x_axis = new THREE.Vector3().crossVectors(this.scapulaGeometry.z_axis, new THREE.Vector3().subVectors(ia, ts));
        this.scapulaGeometry.y_axis = new THREE.Vector3().crossVectors(this.scapulaGeometry.z_axis, this.scapulaGeometry.x_axis);

        this.scapulaGeometry.x_axis.normalize();
        this.scapulaGeometry.y_axis.normalize();
        this.scapulaGeometry.z_axis.normalize();
    }

    computeCameraDistance() {
        const fov = 75;
        const aspectRatio = this.viewGeometry.aspectRatio;
        this._mainCameraDistance =
            SceneHelpers.computeCameraDistance(new THREE.Vector3(1.5 * this.humerusGeometry.length, 0, 0), aspectRatio, fov);
    }

    createSceneGraph() {
        this.createCamera();
        this.createControls();
        this.createGrid();
        this.createHemisphereLight();
        this.createDirectionalLight();
        this.createSpotlightAbove();
        this.createSpotlightBelow();
    }

    repositionSceneGraphs() {
        this.humerus.updateMatrixWorld();
        this.scapula.updateMatrixWorld();
        this.computeHumerusCS();
        this.computeScapulaCS();
        this.computeThoraxGlobalCS();
        this.computeCameraDistance();

        this.repositionCamera();
        this.repositionControls();
        this.repositionGrid();
        this.repositionHemisphereLight();
        this.repositionDirectionalLight();
        this.repositionSpotlightAbove();
        this.repositionSpotlightBelow();
    }

    createCamera() {
        const fov = 75;
        const aspectRatio = this.viewGeometry.aspectRatio;
        this.camera =
            new THREE.PerspectiveCamera(fov, aspectRatio, 0, this._mainCameraDistance * 10);
    }

    createControls() {
        this.controls = new TrackballControls(this.camera, this.view);
        BoneScene.setTrackballControls(this.controls);
    }

    createGrid() {
        // for the PlaneBufferGeometry the z-axis is already perpendicular to the plane
        // for the GridHelper the y-axis is perpendicular to the grid, that is why we rotate the geometry about the x-axis,
        // so that the z-axis is perpendicular to the grid so that we can orient using lookAt
        const planeGeometry = new THREE.PlaneBufferGeometry(this.humerusGeometry.length * 4, this.humerusGeometry.length * 4);
        const planeMaterial = new THREE.ShadowMaterial({opacity: 0.5});
        this.shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.shadowPlane.receiveShadow = true;
        this.scene.add(this.shadowPlane);

        this.grid = new THREE.GridHelper(this.humerusGeometry.length * 4, 50, 0x000000, 0x707070);
        this.grid.geometry.rotateX(Math.PI / 2); //now the z axis is perpendicular to the grid
        this.grid.material.opacity = 0.25;
        this.grid.material.transparent = true;
        this.scene.add(this.grid);
    }

    createHemisphereLight() {
        this.hemisphereLight = new THREE.HemisphereLight(
            0xffffff, // sky color
            0x000000, // ground color
            0.65, // intensity
        );
        this.scene.add(this.hemisphereLight);
    }

    createDirectionalLight() {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(this.directionalLight);
        this.scene.add(this.directionalLight.target);

        this.directionalLight.shadow.camera.left = -1 * this.humerusGeometry.length;
        this.directionalLight.shadow.camera.right = this.humerusGeometry.length;
        this.directionalLight.shadow.camera.bottom = -1 * this.humerusGeometry.length;
        this.directionalLight.shadow.camera.top = this.humerusGeometry.length;
        this.directionalLight.shadow.camera.near = 0;
        this.directionalLight.shadow.camera.far = 4 * this.humerusGeometry.length;
        this.directionalLight.shadow.camera.updateProjectionMatrix();
    }

    createSpotlightAbove() {
        this.spotLightAbove = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI / 4, 1, 1);
        this.spotLightAbove.visible = false;
        this.spotLightAbove.castShadow = true;
        this.spotLightAbove.shadow.mapSize.width = 2048;
        this.spotLightAbove.shadow.mapSize.height = 2048;
        this.scene.add(this.spotLightAbove);
        this.scene.add(this.spotLightAbove.target);
    }

    createSpotlightBelow() {
        this.spotLightBelow = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI / 8, 1, 1);
        this.spotLightBelow.visible = false;
        this.spotLightBelow.castShadow = true;
        this.scene.add(this.spotLightBelow);
        this.scene.add(this.spotLightBelow.target);
    }

    repositionCamera() {
        const ia = this.landmarks.scapula.ia.getWorldPosition(new THREE.Vector3());
        const hhc = this.landmarks.humerus.hhc.getWorldPosition(new THREE.Vector3());
        this.camera.near = this._mainCameraDistance / 10;
        this.camera.far = this._mainCameraDistance * 10;
        this.camera.position.addVectors(new THREE.Vector3().addVectors(ia, hhc).multiplyScalar(0.5),
            new THREE.Vector3().copy(this.frontVector).multiplyScalar(this._mainCameraDistance).multiplyScalar(-1))
            .add(new THREE.Vector3().copy(this.staticInfo.upVector()).multiplyScalar(this.humerusGeometry.length * 0.1));
        this.camera.up.copy(this.staticInfo.upVector());
        this.camera.updateProjectionMatrix();
    }

    repositionControls() {
        const ia = this.landmarks.scapula.ia.getWorldPosition(new THREE.Vector3());
        const hhc = this.landmarks.humerus.hhc.getWorldPosition(new THREE.Vector3());
        this.controls.target.addVectors(ia, hhc).multiplyScalar(0.5);
        this.controls.maxDistance = this._mainCameraDistance * 10;
        this.controls.update();
    }

    repositionGrid() {
        const me = this.landmarks.humerus.me.getWorldPosition(new THREE.Vector3());
        this.shadowPlane.lookAt(this.shadowPlane.getWorldPosition(new THREE.Vector3()).add(this.staticInfo.upVector()));
        this.shadowPlane.position.addVectors(me, new THREE.Vector3().copy(this.staticInfo.upVector()).multiplyScalar(0.5 * this.humerusGeometry.length).multiplyScalar(-1));

        this.grid.lookAt(this.grid.getWorldPosition(new THREE.Vector3()).add(this.staticInfo.upVector()));
        this.grid.position.addVectors(me, new THREE.Vector3().copy(this.staticInfo.upVector()).multiplyScalar(0.5 * this.humerusGeometry.length).multiplyScalar(-1))
            .add(new THREE.Vector3().copy(this.staticInfo.upVector()).multiplyScalar(-1).multiplyScalar(2));
        this.grid.updateMatrixWorld();
    }

    repositionHemisphereLight() {
        this.hemisphereLight.position.copy(this.staticInfo.upVector());
        this.hemisphereLight.updateMatrixWorld();
    }

    repositionDirectionalLight() {
        const hhc = this.landmarks.humerus.hhc.getWorldPosition(new THREE.Vector3());
        const ia = this.landmarks.scapula.ia.getWorldPosition(new THREE.Vector3());
        this.directionalLight.position.addVectors(hhc, new THREE.Vector3().copy(this.staticInfo.upVector()).multiplyScalar(2 * this.humerusGeometry.length))
            .add(new THREE.Vector3().copy(this.lateralVector).multiplyScalar(2 * this.humerusGeometry.length).multiplyScalar(-1));
        this.directionalLight.target.position.copy(ia);
        this.directionalLight.updateMatrixWorld();
        this.directionalLight.target.updateMatrixWorld();
    }

    repositionSpotlightAbove() {
        const hhc = this.landmarks.humerus.hhc.getWorldPosition(new THREE.Vector3());
        const me = this.landmarks.humerus.me.getWorldPosition(new THREE.Vector3());
        const ia = this.landmarks.scapula.ia.getWorldPosition(new THREE.Vector3());
        const ts = this.landmarks.scapula.ts.getWorldPosition(new THREE.Vector3());
        this.spotLightAbove.position.addVectors(hhc, new THREE.Vector3().subVectors(hhc, me))
            .add(new THREE.Vector3().subVectors(ts, ia).multiplyScalar(2));
        this.spotLightAbove.distance = this.humerusGeometry.length;
        this.spotLightAbove.updateMatrixWorld();
        this.spotLightAbove.target.position.copy(ia);
        this.spotLightAbove.target.updateMatrixWorld();
    }

    repositionSpotlightBelow() {
        const hhc = this.landmarks.humerus.hhc.getWorldPosition(new THREE.Vector3());
        const me = this.landmarks.humerus.me.getWorldPosition(new THREE.Vector3());
        const ia = this.landmarks.scapula.ia.getWorldPosition(new THREE.Vector3());
        const ts = this.landmarks.scapula.ts.getWorldPosition(new THREE.Vector3());
        this.spotLightBelow.position.addVectors(me, new THREE.Vector3().subVectors(me, hhc)).add(new THREE.Vector3().subVectors(ia, ts).multiplyScalar(2));
        this.spotLightBelow.distance = this.humerusGeometry.length;
        this.spotLightBelow.updateMatrixWorld();
        this.spotLightBelow.target.position.copy(ia);
        this.spotLightBelow.target.updateMatrixWorld();
    }

    createGUI(spotLightAboveHelper=null, spotLightBelowHelper=null, directionalLightHelper=null) {
        this.sceneGui  = new GUI({resizable : false, name: 'sceneGUI', closeOnTop: true});
        GUIHelpers.createSpotLightFolder(this.sceneGui, 'Spotlight Above', this.spotLightAbove, spotLightAboveHelper);
        GUIHelpers.createSpotLightFolder(this.sceneGui, 'Spotlight Below', this.spotLightBelow, spotLightBelowHelper);
        GUIHelpers.createDirectionalLightFolder(this.sceneGui, 'Directional Light', this.directionalLight, directionalLightHelper);
        GUIHelpers.createHemisphereLightFolder(this.sceneGui, 'Hemisphere Light', this.hemisphereLight);
        this.sceneGuiElement.appendChild(this.sceneGui.domElement);
        this.sceneGui.close();

        this.analysisGui = new GUI({resizable : false, name: 'analysisGUI', closeOnTop: true});
        const viconMarkerFolder = this.analysisGui.addFolder('Vicon Marker Visibility');
        for (const segmentName in this.markerSegmentVisibility) {
            viconMarkerFolder.add(this.markerSegmentVisibility, segmentName).name(BoneScene.segmentFriendNameMap.get(segmentName)).onChange(() => {
                const currentSegment = this.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    currentSegment[markerName].visible = this.markerSegmentVisibility[segmentName];
                }

                const currentSegmentNoSTA = this.noSTAMarkers[segmentName];
                for (const markerName in currentSegmentNoSTA) {
                    currentSegmentNoSTA[markerName].visible = this.markerSegmentVisibility[segmentName];
                }
            });
        }
        const viconMarkerTracesFolder = this.analysisGui.addFolder('Vicon Marker Traces Visibility');
        for (const segmentName in this.viconMarkerTraces.Lines) {
            for (const markerName in this.viconMarkerTraces.Lines[segmentName]) {
                viconMarkerTracesFolder.add(this.viconMarkerTraces.Lines[segmentName][markerName],'visible').name(markerName).onChange((val) => {
                    this.noSTAMarkerTraces.Lines[segmentName][markerName].visible = val;
                })
            }
        }
        const markerClustersFolder = this.analysisGui.addFolder('Marker Clusters');
        markerClustersFolder.add(this.humerusClusterNoSTA,'visible').name('No STA Humerus Cluster');
        markerClustersFolder.add(this.humerusCluster,'visible').name('Humerus Cluster');
        markerClustersFolder.add(this.scapulaClusterNoSTA,'visible').name('No STA Scapula Cluster');
        markerClustersFolder.add(this.scapulaCluster,'visible').name('Scapula Cluster');

        this.analysisGuiElement.appendChild(this.analysisGui.domElement);
        this.analysisGui.close();
    }
}

BoneScene.RED_NOSTA_LINE_MATERIAL.defines.USE_DASH="";
BoneScene.GREEN_NOSTA_LINE_MATERIAL.defines.USE_DASH="";
BoneScene.BLUE_NOSTA_LINE_MATERIAL.defines.USE_DASH="";
BoneScene.YELLOW_NOSTA_LINE_MATERIAL.defines.USE_DASH="";