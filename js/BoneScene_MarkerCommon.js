import {BoneScene} from "./BoneScene.js";
import {MeshPhongMaterial, Mesh, SphereBufferGeometry} from "./vendor/three.js/build/three.module.js";

BoneScene.BLACK_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x000000});
BoneScene.RED_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xff0000, opacity: 0.7, transparent: true});
BoneScene.GREEN_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x00ff00, opacity: 0.7, transparent: true});
BoneScene.BLUE_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x0000ff, opacity: 0.7, transparent: true});
BoneScene.YELLOW_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xffff00, opacity: 0.7, transparent: true});
BoneScene.GRAY_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x787878});
BoneScene.MARKER_GEOMETRY = new SphereBufferGeometry(7, 10, 10);

BoneScene.segmentFriendNameMap = new Map([
    ['thorax', 'Thorax'],
    ['clavicle', 'Clavicle'],
    ['leftScapula', 'Left Scapula'],
    ['scapula', 'Right Scapula'],
    ['humerus', 'Upper Arm'],
    ['rightForearmWrist', 'Forearm/Wrist'],
    ['rightHand', 'Hand'],
]);

BoneScene.createMarker = function(material, position) {
    const mesh = new Mesh(BoneScene.MARKER_GEOMETRY, material);
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

export function enableMarkerGUI(boneScene) {
    boneScene.addEventListener('gui', function (event) {
        const scene = event.target;
        const gui = event.gui;

        const viconMarkerFolder = gui.addFolder('Vicon Marker Visibility');
        for (const segmentName in scene.markerSegmentVisibility) {
            viconMarkerFolder.add(scene.markerSegmentVisibility, segmentName).name(BoneScene.segmentFriendNameMap.get(segmentName)).onChange(() => {
                const currentSegment = scene.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    currentSegment[markerName].visible = currentSegment[markerName].dataVisible && scene.markerSegmentVisibility[segmentName];
                }

                const currentSegmentNoSTA = this.noSTAMarkers[segmentName];
                for (const markerName in currentSegmentNoSTA) {
                    currentSegmentNoSTA[markerName].visible = scene.markerSegmentVisibility[segmentName];
                }
            });
        }
    });
}