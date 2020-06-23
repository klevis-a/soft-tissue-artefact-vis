import {BoxHelper, CameraHelper, PerspectiveCamera, HemisphereLightHelper, DirectionalLightHelper, SpotLightHelper, AxesHelper, Vector3} from "./vendor/three.js/build/three.module.js";
import {BoneScene} from "./BoneScene.js";
import {divGeometry} from "./SceneHelpers.js";
import {TrackballControls} from "./vendor/three.js/examples/jsm/controls/TrackballControls.js";
import {GUI} from "./vendor/three.js/examples/jsm/libs/dat.gui.module.js";
import Stats from "./vendor/three.js/examples/jsm/libs/stats.module.js"

export class BoneSceneDebug extends BoneScene{
    static DEBUG_VIEW_COLOR = 0x74c28a;
    static HELPER_VISIBLE = 'HelperVisible';

    constructor(containerView, renderer, mainView, debugView, analysisGuiElement, sceneGuiElement, debugGuiElement, statsElement, landmarksInfo, staticInfo, timeSeriesInfo, humerusGeometry, scapulaGeometry) {
        super(renderer, mainView, analysisGuiElement, sceneGuiElement, landmarksInfo, staticInfo, timeSeriesInfo, humerusGeometry, scapulaGeometry);
        this.containerView = containerView;
        this.debugView = debugView;
        this.debugGuiElement = debugGuiElement;
        this.sceneHelpers = {};
        this.stats = new Stats();
        this.statsElement = statsElement;
        this.statsElement.appendChild(this.stats.domElement);
    }

    get debugViewGeometry() {
        return divGeometry(this.debugView);
    }

    get containerViewGeometry() {
        return divGeometry(this.containerView);
    }

    addSTLsToScene() {
        super.addSTLsToScene();
        this.sceneHelpers.humerusBoundingBox = new BoxHelper(this.humerus, 0xffffff);
        this.sceneHelpers.scapulaBoundingBox = new BoxHelper(this.scapula, 0xffffff);
        this.scene.add(this.sceneHelpers.humerusBoundingBox);
        this.scene.add(this.sceneHelpers.scapulaBoundingBox);
    }

    renderSceneGraph() {
        this.renderer.setScissorTest(true);
        this.renderMainView();
        this.renderDebugView();
        this.stats.update();
    }

    renderMainView() {
        const {contentLeft: left, contentTop: top, contentWidth: width, contentHeight: height} = this.viewGeometry;
        this.renderer.setScissor(left, top, width, height);
        this.renderer.setViewport(left, top, width, height);
        this.debugHelperVisibility(false);
        this.scene.background.set(BoneScene.MAIN_VIEW_COLOR);
        this.controls.update();
        this.dispatchEvent({type: 'preRender', contentWidth: width, contentHeight: height});
        this.renderer.render(this.scene, this.camera);
    }

    renderDebugView() {
        const {contentLeft: left, contentTop: top, contentWidth: width, contentHeight: height} = this.debugViewGeometry;
        this.renderer.setScissor(left, top, width, height);
        this.renderer.setViewport(left, top, width, height);
        this.debugHelperVisibility(true);
        this.sceneHelpers.humerusBoundingBox.update();
        this.sceneHelpers.scapulaBoundingBox.update();
        this.scene.background.set(BoneSceneDebug.DEBUG_VIEW_COLOR);
        this.debugControls.update();
        this.dispatchEvent({type: 'preRender', contentWidth: width, contentHeight: height});
        this.renderer.render(this.scene, this.debugCamera);
    }

    resizeScene() {
        const {contentWidth, contentHeight} = this.containerViewGeometry;
        this.renderer.setSize(contentWidth, contentHeight);

        const {aspectRatio: aspectRatioMain} = this.viewGeometry;
        this.camera.aspect = aspectRatioMain;
        this.camera.updateProjectionMatrix();

        const {aspectRatio: aspectRatioDebug} = this.viewGeometry;
        this.debugCamera.aspect = aspectRatioDebug;
        this.debugCamera.updateProjectionMatrix();
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
        this.sceneHelpers.mainCameraHelper = new CameraHelper(this.camera);
        this.scene.add(this.sceneHelpers.mainCameraHelper);
    }

    createDebugCamera() {
        const fov = 75;
        const aspectRatio = this.debugViewGeometry.aspectRatio;
        this.debugCamera =
            new PerspectiveCamera(fov, aspectRatio, this._mainCameraDistance / 10, this._mainCameraDistance * 10);
    }

    createDebugControls() {
        this.debugControls = new TrackballControls(this.debugCamera, this.debugView);
        BoneScene.setTrackballControls(this.debugControls);
    }

    createHemisphereLightHelper() {
        this.sceneHelpers.hemisphereLightHelper = new HemisphereLightHelper(this.hemisphereLight, 50);
        this.scene.add(this.sceneHelpers.hemisphereLightHelper);
    }

    createDirectionalLightHelper() {
        this.sceneHelpers.directionalLightHelper = new DirectionalLightHelper(this.directionalLight,50);
        this.scene.add(this.sceneHelpers.directionalLightHelper);

        this.sceneHelpers.directionalLightCameraHelper = new CameraHelper(this.directionalLight.shadow.camera);
        this.scene.add(this.sceneHelpers.directionalLightCameraHelper);
    }

    createSpotLightAboveHelper() {
        this.sceneHelpers.spotLightAboveHelper = new SpotLightHelper(this.spotLightAbove);
        this.scene.add(this.sceneHelpers.spotLightAboveHelper);
    }

    createSpotLightBelowHelper() {
        this.sceneHelpers.spotLightBelowHelper = new SpotLightHelper(this.spotLightBelow);
        this.scene.add(this.sceneHelpers.spotLightBelowHelper);
    }

    createSceneAxesHelper() {
        this.sceneHelpers.sceneAxesHelper = new AxesHelper(this.humerusLength);
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
            new Vector3().copy(this.frontVector).multiplyScalar(this._mainCameraDistance).multiplyScalar(-3))
            .add(new Vector3().copy(this.staticInfo.upVector()).multiplyScalar(this.humerusLength*2));
        this.debugCamera.up.copy(this.staticInfo.upVector());
        this.debugCamera.updateProjectionMatrix();
    }

    repositionDebugControls() {
        this.debugControls.target.copy(this.grid.position);
        this.debugControls.maxDistance = this._mainCameraDistance * 10;
        this.debugControls.update();
    }

    repositionCamera(scenePosHelper) {
        super.repositionCamera(scenePosHelper);
        this.sceneHelpers.mainCameraHelper.update();
        this.repositionDebugCamera();
    }

    repositionControls(scenePosHelper) {
        super.repositionControls(scenePosHelper);
        this.repositionDebugControls();
    }

    repositionHemisphereLight(scenePosHelper) {
        super.repositionHemisphereLight(scenePosHelper);
        this.sceneHelpers.hemisphereLightHelper.update();
    }

    repositionDirectionalLight(scenePosHelper) {
        super.repositionDirectionalLight(scenePosHelper);
        this.sceneHelpers.directionalLightHelper.updateMatrixWorld();
        this.sceneHelpers.directionalLightHelper.update();
        this.sceneHelpers.directionalLightCameraHelper.update();
    }

    repositionSpotlightAbove(scenePosHelper) {
        super.repositionSpotlightAbove(scenePosHelper);
        this.sceneHelpers.spotLightAboveHelper.update();
    }

    repositionSpotlightBelow(scenePosHelper) {
        super.repositionSpotlightBelow(scenePosHelper);
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