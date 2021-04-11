import {EventDispatcher, Scene, MeshPhongMaterial, Mesh, Color, Vector3, Matrix4, PlaneBufferGeometry,
    ShadowMaterial, PerspectiveCamera, GridHelper, HemisphereLight, DirectionalLight, SpotLight} from "./vendor/three.js/build/three.module.js";
import {divGeometry, computeCameraDistance} from "./SceneHelpers.js";
import {TrackballControls} from "./vendor/three.js/examples/jsm/controls/TrackballControls.js";
import {ScenePositionHelper} from "./ScenePositionHelper.js";
import {GUI} from "./vendor/three.js/examples/jsm/libs/dat.gui.module.js";
import {createSpotLightFolder, createDirectionalLightFolder, createHemisphereLightFolder} from "./GUIHelpers.js";

export class BoneScene {
    static BONE_COLOR = 0xe3dac9;
    static BONE_MATERIAL = new MeshPhongMaterial({color: BoneScene.BONE_COLOR, opacity: 0.8, transparent: true});
    static MAIN_VIEW_COLOR =  0xDCDCDC;

    static setTrackballControls(trackBallControl) {
        trackBallControl.rotateSpeed = 3.0;
        trackBallControl.zoomSpeed = 1.2;
        trackBallControl.panSpeed = 0.8;
        //65:A - orbiting operations
        //83:S - zooming operations
        //68:D - panning operations
        trackBallControl.keys = [65, 83, 68];
    }

    static createBoneMeshFromGeometry(geometry) {
        const mesh = new Mesh(geometry, BoneScene.BONE_MATERIAL);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    constructor(renderer, view, analysisGuiElement, sceneGuiElement, humerusLandmarks, scapulaLandmarks,
                biplaneTrajectory, markerTrajectories, humerusGeometry, scapulaGeometry)
    {
        this.view = view;
        this.sceneGuiElement = sceneGuiElement;
        this.analysisGuiElement = analysisGuiElement;
        this.renderer = renderer;
        this.renderer.shadowMap.enabled = true;
        this.scene = new Scene();
        this.scene.background = new Color(BoneScene.MAIN_VIEW_COLOR);
        this.humerusLandmarks = humerusLandmarks;
        this.scapulaLandmarks = scapulaLandmarks;
        this.landmarksInfo_Segment = {};
        this.biplaneTrajectory = biplaneTrajectory;
        this.markerTrajectories = markerTrajectories;
        this.humerus = BoneScene.createBoneMeshFromGeometry(humerusGeometry);
        this.scapula = BoneScene.createBoneMeshFromGeometry(scapulaGeometry);
        this.humerusGeometry = humerusGeometry;
        this.scapulaGeometry = scapulaGeometry;
        this.upVector = new Vector3(0, 0, 1);
        this.currentFrame = 0;

        this.normalizeHumerusGeometry();
        this.normalizeScapulaGeometry();
        this.computeHumerusLength();
    }

    get viewGeometry() {
        return divGeometry(this.view);
    }

    addSTLsToScene() {
        this.scene.add(this.humerus);
        this.scene.add(this.scapula);
    }

    normalizeHumerusGeometry() {
        const hhc = this.humerusLandmarks.hhc;
        const le = this.humerusLandmarks.le;
        const me = this.humerusLandmarks.me;
        const y_axis = new Vector3().addVectors(me, le).multiplyScalar(0.5).multiplyScalar(-1).add(hhc);
        const x_axis = new Vector3().subVectors(me, le).cross(y_axis);
        const z_axis = new Vector3().crossVectors(x_axis, y_axis);
        x_axis.normalize();
        y_axis.normalize();
        z_axis.normalize();
        const BB_T_H = new Matrix4().makeBasis(x_axis, y_axis, z_axis).setPosition(hhc);
        const H_T_BB = new Matrix4().getInverse(BB_T_H);
        this.humerusGeometry.applyMatrix4(H_T_BB);

        this.landmarksInfo_Segment.humerus = {};
        this.landmarksInfo_Segment.humerus.hhc = new Vector3().copy(hhc).applyMatrix4(H_T_BB);
        this.landmarksInfo_Segment.humerus.le = new Vector3().copy(le).applyMatrix4(H_T_BB);
        this.landmarksInfo_Segment.humerus.me = new Vector3().copy(me).applyMatrix4(H_T_BB);
    }

    normalizeScapulaGeometry() {
        const gc = this.scapulaLandmarks.gc;
        const ia = this.scapulaLandmarks.ia;
        const ts = this.scapulaLandmarks.ts;
        const pla = this.scapulaLandmarks.pla;
        const ac = this.scapulaLandmarks.ac;

        const z_axis = new Vector3().subVectors(gc, ts);
        const x_axis = new Vector3().crossVectors(z_axis, new Vector3().subVectors(ia, ts));
        const y_axis = new Vector3().crossVectors(z_axis, x_axis);
        x_axis.normalize();
        y_axis.normalize();
        z_axis.normalize();
        const BB_T_S = new Matrix4().makeBasis(x_axis, y_axis, z_axis).setPosition(gc);
        const S_T_BB = new Matrix4().getInverse(BB_T_S);
        this.scapulaGeometry.applyMatrix4(S_T_BB);

        this.landmarksInfo_Segment.scapula = {};
        this.landmarksInfo_Segment.scapula.gc = new Vector3().copy(gc).applyMatrix4(S_T_BB);
        this.landmarksInfo_Segment.scapula.ia = new Vector3().copy(ia).applyMatrix4(S_T_BB);
        this.landmarksInfo_Segment.scapula.ts = new Vector3().copy(ts).applyMatrix4(S_T_BB);
        this.landmarksInfo_Segment.scapula.pla = new Vector3().copy(pla).applyMatrix4(S_T_BB);
        this.landmarksInfo_Segment.scapula.ac = new Vector3().copy(ac).applyMatrix4(S_T_BB);
    }

    computeHumerusLength() {
        const hhc = this.humerusLandmarks.hhc;
        const le = this.humerusLandmarks.le;
        const me = this.humerusLandmarks.me;
        this.humerusLength = new Vector3().addVectors(me, le).multiplyScalar(0.5).sub(hhc).length();
    }

    computeCameraDistance() {
        const fov = 75;
        const aspectRatio = this.viewGeometry.aspectRatio;
        this._mainCameraDistance = computeCameraDistance(new Vector3(1.5 * this.humerusLength, 0, 0), aspectRatio, fov);
    }

    updateToFrame(frameNum, sendEvent=true) {
        let currentFrame = Math.floor(frameNum);
        this.currentFrame = currentFrame;
        let nextFrame = null;
        let interpFactor = null;
        if (currentFrame>=(this.biplaneTrajectory.NumFrames-1)) {
            currentFrame = this.biplaneTrajectory.NumFrames-1;
            this.humerus.position.copy(this.biplaneTrajectory.humPosVector(currentFrame));
            this.scapula.position.copy(this.biplaneTrajectory.scapPosVector(currentFrame));
            this.humerus.quaternion.copy(this.biplaneTrajectory.humOrientQuat(currentFrame));
            this.scapula.quaternion.copy(this.biplaneTrajectory.scapOrientQuat(currentFrame));
        }
        else {
            nextFrame = Math.ceil(frameNum);
            interpFactor = frameNum - currentFrame;
            this.humerus.position.copy(this.biplaneTrajectory.humPosVector(currentFrame).lerp(this.biplaneTrajectory.humPosVector(nextFrame), interpFactor));
            this.scapula.position.copy(this.biplaneTrajectory.scapPosVector(currentFrame).lerp(this.biplaneTrajectory.scapPosVector(nextFrame), interpFactor));
            this.humerus.quaternion.copy(this.biplaneTrajectory.humOrientQuat(currentFrame).slerp(this.biplaneTrajectory.humOrientQuat(nextFrame),interpFactor));
            this.scapula.quaternion.copy(this.biplaneTrajectory.scapOrientQuat(currentFrame).slerp(this.biplaneTrajectory.scapOrientQuat(nextFrame),interpFactor));
        }
        if (sendEvent) {
            this.dispatchEvent({type: 'frame', currentFrame: currentFrame, nextFrame: nextFrame, interpFactor: interpFactor});
        }
    }

    renderSceneGraph() {
        this.scene.background.set(BoneScene.MAIN_VIEW_COLOR);
        this.controls.update();
        const {contentWidth, contentHeight} = this.viewGeometry;
        this.dispatchEvent({type: 'preRender', contentWidth: contentWidth, contentHeight: contentHeight});
        this.renderer.render(this.scene, this.camera);
    }

    resizeScene() {
        const {contentWidth, contentHeight, aspectRatio} = this.viewGeometry;
        this.renderer.setSize(contentWidth, contentHeight);
        this.camera.aspect = aspectRatio;
        this.camera.updateProjectionMatrix();
    }

    initScene() {
        this.addSTLsToScene();
        this.updateToFrame(0, false);
        this.computeCameraDistance();
        this.dispatchEvent({type: 'init'});
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
        const scenePosHelper = new ScenePositionHelper(this.humerus, this.scapula, this.landmarksInfo_Segment,
            this.biplaneTrajectory.torsoOrientQuat(this.currentFrame));
        this.computeCameraDistance();

        this.repositionCamera(scenePosHelper);
        this.repositionControls(scenePosHelper);
        this.repositionGrid(scenePosHelper);
        this.repositionHemisphereLight(scenePosHelper);
        this.repositionDirectionalLight(scenePosHelper);
        this.repositionSpotlightAbove(scenePosHelper);
        this.repositionSpotlightBelow(scenePosHelper);
    }

    createCamera() {
        const fov = 75;
        const aspectRatio = this.viewGeometry.aspectRatio;
        this.camera =
            new PerspectiveCamera(fov, aspectRatio, 0, this._mainCameraDistance * 10);
    }

    createControls() {
        this.controls = new TrackballControls(this.camera, this.view);
        BoneScene.setTrackballControls(this.controls);
    }

    createGrid() {
        // for the PlaneBufferGeometry the z-axis is already perpendicular to the plane
        // for the GridHelper the y-axis is perpendicular to the grid, that is why we rotate the geometry about the x-axis,
        // so that the z-axis is perpendicular to the grid so that we can orient using lookAt
        const planeGeometry = new PlaneBufferGeometry(this.humerusLength * 4, this.humerusLength * 4);
        const planeMaterial = new ShadowMaterial({opacity: 0.5});
        this.shadowPlane = new Mesh(planeGeometry, planeMaterial);
        this.shadowPlane.receiveShadow = true;
        this.scene.add(this.shadowPlane);

        this.grid = new GridHelper(this.humerusLength * 4, 50, 0x000000, 0x707070);
        this.grid.geometry.rotateX(Math.PI / 2); //now the z axis is perpendicular to the grid
        this.grid.material.opacity = 0.25;
        this.grid.material.transparent = true;
        this.scene.add(this.grid);
    }

    createHemisphereLight() {
        this.hemisphereLight = new HemisphereLight(
            0xffffff, // sky color
            0x000000, // ground color
            0.65, // intensity
        );
        this.scene.add(this.hemisphereLight);
    }

    createDirectionalLight() {
        this.directionalLight = new DirectionalLight(0xffffff, 0.5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(this.directionalLight);
        this.scene.add(this.directionalLight.target);

        this.directionalLight.shadow.camera.left = -1 * this.humerusLength;
        this.directionalLight.shadow.camera.right = this.humerusLength;
        this.directionalLight.shadow.camera.bottom = -1 * this.humerusLength;
        this.directionalLight.shadow.camera.top = this.humerusLength;
        this.directionalLight.shadow.camera.near = 0;
        this.directionalLight.shadow.camera.far = 6 * this.humerusLength;
        this.directionalLight.shadow.camera.updateProjectionMatrix();
    }

    createSpotlightAbove() {
        this.spotLightAbove = new SpotLight(0xffffff, 0.5, 0, Math.PI / 4, 1, 1);
        this.spotLightAbove.visible = false;
        this.spotLightAbove.castShadow = true;
        this.spotLightAbove.shadow.mapSize.width = 2048;
        this.spotLightAbove.shadow.mapSize.height = 2048;
        this.scene.add(this.spotLightAbove);
        this.scene.add(this.spotLightAbove.target);
    }

    createSpotlightBelow() {
        this.spotLightBelow = new SpotLight(0xffffff, 0.5, 0, Math.PI / 4, 1, 1);
        this.spotLightBelow.visible = false;
        this.spotLightBelow.castShadow = true;
        this.scene.add(this.spotLightBelow);
        this.scene.add(this.spotLightBelow.target);
    }

    repositionCamera(scenePosHelper) {
        const ia = scenePosHelper.ia;
        const hhc = scenePosHelper.hhc;
        this.camera.near = this._mainCameraDistance / 10;
        this.camera.far = this._mainCameraDistance * 5;
        this.camera.position.addVectors(new Vector3().addVectors(ia, hhc).multiplyScalar(0.5),
            new Vector3().copy(scenePosHelper.anterior).multiplyScalar(this._mainCameraDistance).multiplyScalar(-1.5))
            .add(new Vector3().copy(this.upVector).multiplyScalar(this.humerusLength * 0.3));
        this.camera.up.copy(this.upVector);
        this.camera.updateProjectionMatrix();
    }

    repositionControls(scenePosHelper) {
        const ia = scenePosHelper.ia;
        const hhc = scenePosHelper.hhc;
        this.controls.target.addVectors(ia, hhc).multiplyScalar(0.5);
        this.controls.maxDistance = this._mainCameraDistance * 10;
        this.controls.update();
    }

    repositionGrid(scenePosHelper) {
        const me = scenePosHelper.me;
        this.shadowPlane.lookAt(this.shadowPlane.getWorldPosition(new Vector3()).add(this.upVector));
        this.shadowPlane.position.addVectors(me, new Vector3().copy(this.upVector).multiplyScalar(0.5 * this.humerusLength).multiplyScalar(-1));

        this.grid.lookAt(this.grid.getWorldPosition(new Vector3()).add(this.upVector));
        this.grid.position.addVectors(me, new Vector3().copy(this.upVector).multiplyScalar(0.5 * this.humerusLength).multiplyScalar(-1))
            .add(new Vector3().copy(this.upVector).multiplyScalar(-1).multiplyScalar(2));
        this.grid.updateMatrixWorld();
    }

    repositionHemisphereLight() {
        this.hemisphereLight.position.copy(this.upVector);
        this.hemisphereLight.updateMatrixWorld();
    }

    repositionDirectionalLight(scenePosHelper) {
        const hhc = scenePosHelper.hhc;
        const ia = scenePosHelper.ia;
        this.directionalLight.position.addVectors(hhc, new Vector3().copy(this.upVector).multiplyScalar(2 * this.humerusLength))
            .add(new Vector3().copy(scenePosHelper.lateral).multiplyScalar(2 * this.humerusLength).multiplyScalar(-1));
        this.directionalLight.target.position.copy(ia);
        this.directionalLight.updateMatrixWorld();
        this.directionalLight.target.updateMatrixWorld();
    }

    repositionSpotlightAbove(scenePosHelper) {
        const hhc = scenePosHelper.hhc;
        const me = scenePosHelper.me;
        const ia = scenePosHelper.ia;
        const ts = scenePosHelper.ts;
        const pla = scenePosHelper.pla;
        this.spotLightAbove.position.addVectors(hhc, new Vector3().subVectors(hhc, me))
            .add(new Vector3().subVectors(pla, ts));
        this.spotLightAbove.distance = this.humerusLength * 2;
        this.spotLightAbove.updateMatrixWorld();
        this.spotLightAbove.target.position.copy(ia);
        this.spotLightAbove.target.updateMatrixWorld();
    }

    repositionSpotlightBelow(scenePosHelper) {
        const hhc = scenePosHelper.hhc;
        const me = scenePosHelper.me;
        const ts = scenePosHelper.ts;
        const pla = scenePosHelper.pla;
        this.spotLightBelow.position.addVectors(me, new Vector3().subVectors(me, hhc).multiplyScalar(0.2)).add(new Vector3().subVectors(ts, pla));
        this.spotLightBelow.distance = this.humerusLength * 2;
        this.spotLightBelow.updateMatrixWorld();
        this.spotLightBelow.target.position.copy(hhc);
        this.spotLightBelow.target.updateMatrixWorld();
    }

    createGUI(spotLightAboveHelper=null, spotLightBelowHelper=null, directionalLightHelper=null) {
        // this.sceneGui  = new GUI({resizable : false, name: 'sceneGUI', closeOnTop: true});
        // createSpotLightFolder(this.sceneGui, 'Spotlight Above', this.spotLightAbove, spotLightAboveHelper);
        // createSpotLightFolder(this.sceneGui, 'Spotlight Below', this.spotLightBelow, spotLightBelowHelper);
        // createDirectionalLightFolder(this.sceneGui, 'Directional Light', this.directionalLight, directionalLightHelper);
        // createHemisphereLightFolder(this.sceneGui, 'Hemisphere Light', this.hemisphereLight);
        // this.sceneGuiElement.appendChild(this.sceneGui.domElement);
        // this.sceneGui.close();

        this.analysisGui = new GUI({resizable : false, name: 'analysisGUI', closeOnTop: true});
        this.dispatchEvent({type: 'gui', gui: this.analysisGui});
        this.analysisGuiElement.appendChild(this.analysisGui.domElement);
        this.analysisGui.close();
    }
}

Object.assign(BoneScene.prototype, EventDispatcher.prototype);
