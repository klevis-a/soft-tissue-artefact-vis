import {BoneScene} from "./BoneScene.js";
import {Mesh, SphereBufferGeometry} from "./vendor/three.js/build/three.module.js";

BoneScene.LANDMARK_GEOMETRY = new SphereBufferGeometry(3.5, 10, 10);

BoneScene.createLandmark = function (material, position) {
    const mesh = new Mesh(BoneScene.LANDMARK_GEOMETRY, material);
    mesh.position.copy(position);
    return mesh;
};

BoneScene.prototype.addLandmark = function (name, segment, material) {
    this.landmarks[segment][name] = BoneScene.createLandmark(material, this.landmarksInfo_Segment[segment][name]);
    this[segment].add(this.landmarks[segment][name]);
};

BoneScene.prototype.addLandmarks = function() {
    this.addLandmark('hhc', 'humerus', BoneScene.BLACK_MARKER_MATERIAL);
    this.addLandmark('me', 'humerus', BoneScene.RED_MARKER_MATERIAL);
    this.addLandmark('le', 'humerus', BoneScene.GREEN_MARKER_MATERIAL);

    this.addLandmark('gc', 'scapula', BoneScene.BLACK_MARKER_MATERIAL);
    this.addLandmark('ac', 'scapula', BoneScene.RED_MARKER_MATERIAL);
    this.addLandmark('pla', 'scapula', BoneScene.GREEN_MARKER_MATERIAL);
    this.addLandmark('ts', 'scapula', BoneScene.BLUE_MARKER_MATERIAL);
    this.addLandmark('ia', 'scapula', BoneScene.YELLOW_MARKER_MATERIAL);
};

export function enableLandmarks(boneScene) {
    boneScene.landmarks = {};
    boneScene.landmarks.humerus = {};
    boneScene.landmarks.scapula = {};
    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addLandmarks();
    });
}