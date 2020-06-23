import {BoneSceneFnc} from "./BoneSceneFnc.js";
import {MeshPhongMaterial, Mesh, SphereBufferGeometry} from "./vendor/three.js/build/three.module.js";

BoneSceneFnc.BLACK_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x000000});
BoneSceneFnc.RED_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xff0000, opacity: 0.7, transparent: true});
BoneSceneFnc.GREEN_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x00ff00, opacity: 0.7, transparent: true});
BoneSceneFnc.BLUE_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x0000ff, opacity: 0.7, transparent: true});
BoneSceneFnc.YELLOW_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xffff00, opacity: 0.7, transparent: true});
BoneSceneFnc.GRAY_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x787878});
BoneSceneFnc.MARKER_GEOMETRY = new SphereBufferGeometry(7, 10, 10);

BoneSceneFnc.createMarker = function(material, position) {
    const mesh = new Mesh(BoneSceneFnc.MARKER_GEOMETRY, material);
    mesh.position.copy(position);
    return mesh;
};

export function addCommonMarkerFields(boneScene) {
    boneScene.markerSegmentVisibility = {
        'thorax': true,
        'clavicle': true,
        'leftScapula': true,
        'scapula': true,
        'humerus': true,
        'rightForearmWrist': false,
        'rightHand': false
    };
}
