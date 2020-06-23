import {BoneSceneFnc} from "./BoneSceneFnc.js";
import {MeshPhongMaterial} from "./vendor/three.js/build/three.module.js";

BoneSceneFnc.RED_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xff0000, wireframe: true});
BoneSceneFnc.GREEN_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x00ff00, wireframe: true});
BoneSceneFnc.BLUE_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x0000ff, wireframe: true});
BoneSceneFnc.YELLOW_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xffff00, wireframe: true});

BoneSceneFnc.SegmentNoSTAMarkerMaterials = new Map([
    ['RUPAA', BoneSceneFnc.RED_NOSTA_MARKER_MATERIAL],
    ['RUPAB', BoneSceneFnc.GREEN_NOSTA_MARKER_MATERIAL],
    ['RUPAC', BoneSceneFnc.BLUE_NOSTA_MARKER_MATERIAL],
    ['RUPAD', BoneSceneFnc.YELLOW_NOSTA_MARKER_MATERIAL],
    ['RSH0', BoneSceneFnc.RED_NOSTA_MARKER_MATERIAL],
    ['RACRM', BoneSceneFnc.GREEN_NOSTA_MARKER_MATERIAL],
    ['RSPIN', BoneSceneFnc.BLUE_NOSTA_MARKER_MATERIAL],
    ['RANGL', BoneSceneFnc.YELLOW_NOSTA_MARKER_MATERIAL],
]);

BoneSceneFnc.prototype.addNoSTAMarker = function(name, segment, material) {
    this.noSTAMarkers[segment][name] = BoneSceneFnc.createMarker(material, this.staticInfo.markerPosVector(name));
    this[segment].add(this.noSTAMarkers[segment][name]);
};

BoneSceneFnc.prototype.addNoSTAMarkers = function() {
    this.addNoSTAMarker('RUPAA', 'humerus', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RUPAA'));
    this.addNoSTAMarker('RUPAB', 'humerus', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RUPAB'));
    this.addNoSTAMarker('RUPAC', 'humerus', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RUPAC'));
    this.addNoSTAMarker('RUPAD', 'humerus', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RUPAD'));

    this.addNoSTAMarker('RSH0', 'scapula', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RSH0'));
    this.addNoSTAMarker('RACRM', 'scapula', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RACRM'));
    this.addNoSTAMarker('RSPIN', 'scapula', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RSPIN'));
    this.addNoSTAMarker('RANGL', 'scapula', BoneSceneFnc.SegmentNoSTAMarkerMaterials.get('RANGL'));
};

export function enableNoSTAMarkers(boneScene) {
    boneScene.noSTAMarkers = {};
    boneScene.noSTAMarkers.humerus = {};
    boneScene.noSTAMarkers.scapula = {};

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addNoSTAMarkers();
    });
}