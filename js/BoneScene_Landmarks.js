import {Mesh, SphereBufferGeometry} from "./vendor/three.js/build/three.module.js";

export function landmarks_decorator(BoneSceneFnc) {
    BoneSceneFnc.LANDMARK_GEOMETRY = new SphereBufferGeometry(3.5, 10, 10);

    BoneSceneFnc.createLandmark = function (material, position) {
        const mesh = new Mesh(BoneSceneFnc.LANDMARK_GEOMETRY, material);
        mesh.position.copy(position);
        return mesh;
    };

    BoneSceneFnc.prototype.addLandmark = function (name, segment, material) {
        this.landmarks[segment][name] = BoneSceneFnc.createLandmark(material, this.landmarksInfo_Segment[segment][name]);
        this[segment].add(this.landmarks[segment][name]);
    };

    BoneSceneFnc.prototype.addLandmarks = function() {
        this.addLandmark('hhc', 'humerus', BoneSceneFnc.BLACK_MARKER_MATERIAL);
        this.addLandmark('me', 'humerus', BoneSceneFnc.RED_MARKER_MATERIAL);
        this.addLandmark('le', 'humerus', BoneSceneFnc.GREEN_MARKER_MATERIAL);

        this.addLandmark('gc', 'scapula', BoneSceneFnc.BLACK_MARKER_MATERIAL);
        this.addLandmark('ac', 'scapula', BoneSceneFnc.RED_MARKER_MATERIAL);
        this.addLandmark('pla', 'scapula', BoneSceneFnc.GREEN_MARKER_MATERIAL);
        this.addLandmark('ts', 'scapula', BoneSceneFnc.BLUE_MARKER_MATERIAL);
        this.addLandmark('ia', 'scapula', BoneSceneFnc.YELLOW_MARKER_MATERIAL);
    };
}

export function addLandmarks(boneScene) {
    boneScene.landmarks = {};
    boneScene.landmarks.humerus = {};
    boneScene.landmarks.scapula = {};
    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addLandmarks();
    });
}