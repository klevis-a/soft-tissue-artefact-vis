import {BoneScene} from "./BoneScene.js";
import * as SceneHelpers from "./SceneHelpers.js";
import * as THREE from "./vendor/three.js/build/three.module.js";
import {TrackballControls} from "./vendor/three.js/examples/jsm/controls/TrackballControls.js";
import {GUI} from "./vendor/three.js/examples/jsm/libs/dat.gui.module.js";
import Stats from "./vendor/three.js/examples/jsm/libs/stats.module.js"

export class BoneSceneDebug extends BoneScene{
    static DEBUG_VIEW_COLOR = 0x74c28a;
    static HELPER_VISIBLE = 'HelperVisible';

    constructor(canvas, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement, loadedSTLs, landmarksInfo, staticInfo, timeSeriesInfo) {
        super(canvas, mainView, analysisGuiElement, sceneGuiElement, loadedSTLs, landmarksInfo, staticInfo, timeSeriesInfo);
        this.debugView = debugView;
        this.debugGuiElement = debugGuiElement;
        this.sceneHelpers = {};
        this.stats = new Stats();
        this.statsElement = statsElement;
        this.statsElement.appendChild(this.stats.domElement);
    }

    get debugViewGeometry() {
        return SceneHelpers.divGeometry(this.debugView);
    }

    addSTLsToScene() {
        super.addSTLsToScene();
        this.sceneHelpers.humerusBoundingBox = new THREE.BoxHelper(this.humerus, 0xffffff);
        this.sceneHelpers.scapulaBoundingBox = new THREE.BoxHelper(this.scapula, 0xffffff);
        this.scene.add(this.sceneHelpers.humerusBoundingBox);
        this.scene.add(this.sceneHelpers.scapulaBoundingBox);
    }

    renderSceneGraph() {
        this.resizeRendererToDisplaySize();
        this.renderer.setScissorTest(true);
        this.renderMainView();
        this.renderDebugView();
        this.stats.update();
    }

    renderMainView() {
        const {contentLeft: left, contentTop: top, contentWidth: width, contentHeight: height, aspectRatio} = this.viewGeometry;
        BoneSceneDebug.RED_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.GREEN_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.BLUE_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.YELLOW_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.BLACK_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.RED_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.GREEN_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.BLUE_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.YELLOW_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        this.renderer.setScissor(left, top, width, height);
        this.renderer.setViewport(left, top, width, height);
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();
        this.sceneHelpers.mainCameraHelper.update();
        this.debugHelperVisibility(false);
        this.scene.background.set(BoneScene.MAIN_VIEW_COLOR);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    renderDebugView() {
        const {contentLeft: left, contentTop: top, contentWidth: width, contentHeight: height, aspectRatio} = this.debugViewGeometry;
        BoneSceneDebug.RED_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.GREEN_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.BLUE_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.YELLOW_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.BLACK_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.RED_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.GREEN_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.BLUE_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        BoneSceneDebug.YELLOW_NOSTA_LINE_MATERIAL.resolution.set(width, height);
        this.renderer.setScissor(left, top, width, height);
        this.renderer.setViewport(left, top, width, height);
        this.debugCamera.aspect = aspectRatio;
        this.debugCamera.updateProjectionMatrix();
        this.debugHelperVisibility(true);
        this.sceneHelpers.humerusBoundingBox.update();
        this.sceneHelpers.scapulaBoundingBox.update();
        this.scene.background.set(BoneSceneDebug.DEBUG_VIEW_COLOR);
        this.debugControls.update();
        this.renderer.render(this.scene, this.debugCamera);
    }

    createHelperVisibilitySymbol() {
        for (const helperName in this.sceneHelpers) {
            this.sceneHelpers[helperName][BoneScene.HELPER_VISIBLE] = false;
        }
    }

    debugHelperVisibility(flag) {
        for (const helperName in this.sceneHelpers) {
            this.sceneHelpers[helperName].visible = flag && this.sceneHelpers[helperName][BoneScene.HELPER_VISIBLE];
        }
    }

    createSceneGraph() {
        super.createSceneGraph();
        this.createSceneAxesHelper();
        this.createHelperVisibilitySymbol();
    }

    repositionSceneGraphs() {
        super.repositionSceneGraphs();
        this.repositionDebugCamera();
        this.repositionDebugControls();
    }

    createMainCameraHelper() {
        this.sceneHelpers.mainCameraHelper = new THREE.CameraHelper(this.camera);
        this.scene.add(this.sceneHelpers.mainCameraHelper);
    }

    createDebugCamera() {
        const fov = 75;
        const aspectRatio = this.debugViewGeometry.aspectRatio;
        this.debugCamera =
            new THREE.PerspectiveCamera(fov, aspectRatio, this._mainCameraDistance / 10, this._mainCameraDistance * 10);
    }

    createDebugControls() {
        this.debugControls = new TrackballControls(this.debugCamera, this.debugView);
        BoneScene.setTrackballControls(this.debugControls);
    }

    createHemisphereLightHelper() {
        this.sceneHelpers.hemisphereLightHelper = new THREE.HemisphereLightHelper(this.hemisphereLight, 50);
        this.scene.add(this.sceneHelpers.hemisphereLightHelper);
    }

    createDirectionalLightHelper() {
        this.sceneHelpers.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight,50);
        this.scene.add(this.sceneHelpers.directionalLightHelper);

        this.sceneHelpers.directionalLightCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        this.scene.add(this.sceneHelpers.directionalLightCameraHelper);
    }

    createSpotLightAboveHelper() {
        this.sceneHelpers.spotLightAboveHelper = new THREE.SpotLightHelper(this.spotLightAbove);
        this.scene.add(this.sceneHelpers.spotLightAboveHelper);
    }

    createSpotLightBelowHelper() {
        this.sceneHelpers.spotLightBelowHelper = new THREE.SpotLightHelper(this.spotLightBelow);
        this.scene.add(this.sceneHelpers.spotLightBelowHelper);
    }

    createSceneAxesHelper() {
        this.sceneHelpers.sceneAxesHelper = new THREE.AxesHelper(50);
        this.scene.add(this.sceneHelpers.sceneAxesHelper);
    }

    createCamera() {
        super.createCamera();
        this.createMainCameraHelper();
        this.createDebugCamera();
    }

    createControls() {
        super.createControls();
        this.createDebugControls();
    }

    createHemisphereLight() {
        super.createHemisphereLight();
        this.createHemisphereLightHelper();
    }

    createDirectionalLight() {
        super.createDirectionalLight();
        this.createDirectionalLightHelper();
    }

    createSpotlightAbove() {
        super.createSpotlightAbove();
        this.createSpotLightAboveHelper();
    }

    createSpotlightBelow() {
        super.createSpotlightBelow();
        this.createSpotLightBelowHelper();
    }

    repositionDebugCamera() {
        this.debugCamera.position.addVectors(this.grid.position,
            new THREE.Vector3().copy(this.frontVector).multiplyScalar(this._mainCameraDistance).multiplyScalar(-1));
        this.debugCamera.up.copy(this.staticInfo.upVector());
        this.debugCamera.updateProjectionMatrix();
    }

    repositionDebugControls() {
        this.debugControls.target.copy(this.grid.position);
        this.debugControls.maxDistance = this._mainCameraDistance * 10;
        this.debugControls.update();
    }

    repositionCamera() {
        super.repositionCamera();
        this.sceneHelpers.mainCameraHelper.update();
        this.repositionDebugCamera();
    }

    repositionControls() {
        super.repositionControls();
        this.repositionDebugControls();
    }

    repositionHemisphereLight() {
        super.repositionHemisphereLight();
        this.sceneHelpers.hemisphereLightHelper.update();
    }

    repositionDirectionalLight() {
        super.repositionDirectionalLight();
        this.sceneHelpers.directionalLightHelper.updateMatrixWorld();
        this.sceneHelpers.directionalLightHelper.update();
        this.sceneHelpers.directionalLightCameraHelper.update();
    }

    repositionSpotlightAbove() {
        super.repositionSpotlightAbove();
        this.sceneHelpers.spotLightAboveHelper.update();
    }

    repositionSpotlightBelow() {
        super.repositionSpotlightBelow();
        this.sceneHelpers.spotLightBelowHelper.update();
    }

    createGUI() {
        super.createGUI(this.sceneHelpers.spotLightAboveHelper, this.sceneHelpers.spotLightBelowHelper, this.scene.directionalLightHelper);
        this.createDebugGUI();
    }

    createDebugGUI() {
        this.debugGUI  = new GUI({resizable : false, name: 'debugGUI', width: 300, closeOnTop: true});
        for (let helperName in this.sceneHelpers) {
            this.debugGUI.add(this.sceneHelpers[helperName],BoneScene.HELPER_VISIBLE).name(helperName);
        }
        this.debugGuiElement.appendChild(this.debugGUI.domElement);
        this.debugGUI.close();
    }
}