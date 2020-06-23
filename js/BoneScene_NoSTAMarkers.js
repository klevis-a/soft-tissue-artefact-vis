import {BoneScene} from "./BoneScene.js";
import {MeshPhongMaterial} from "./vendor/three.js/build/three.module.js";

BoneScene.RED_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xff0000, wireframe: true});
BoneScene.GREEN_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x00ff00, wireframe: true});
BoneScene.BLUE_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x0000ff, wireframe: true});
BoneScene.YELLOW_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xffff00, wireframe: true});

BoneScene.SegmentNoSTAMarkerMaterials = new Map([
    ['RUPAA', BoneScene.RED_NOSTA_MARKER_MATERIAL],
    ['RUPAB', BoneScene.GREEN_NOSTA_MARKER_MATERIAL],
    ['RUPAC', BoneScene.BLUE_NOSTA_MARKER_MATERIAL],
    ['RUPAD', BoneScene.YELLOW_NOSTA_MARKER_MATERIAL],
    ['RSH0', BoneScene.RED_NOSTA_MARKER_MATERIAL],
    ['RACRM', BoneScene.GREEN_NOSTA_MARKER_MATERIAL],
    ['RSPIN', BoneScene.BLUE_NOSTA_MARKER_MATERIAL],
    ['RANGL', BoneScene.YELLOW_NOSTA_MARKER_MATERIAL],
]);

BoneScene.prototype.addNoSTAMarker = function(name, segment, material) {
    this.noSTAMarkers[segment][name] = BoneScene.createMarker(material, this.staticInfo.markerPosVector(name));
    this[segment].add(this.noSTAMarkers[segment][name]);
};

BoneScene.prototype.addNoSTAMarkers = function() {
    this.addNoSTAMarker('RUPAA', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAA'));
    this.addNoSTAMarker('RUPAB', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAB'));
    this.addNoSTAMarker('RUPAC', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAC'));
    this.addNoSTAMarker('RUPAD', 'humerus', BoneScene.SegmentNoSTAMarkerMaterials.get('RUPAD'));

    this.addNoSTAMarker('RSH0', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RSH0'));
    this.addNoSTAMarker('RACRM', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RACRM'));
    this.addNoSTAMarker('RSPIN', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RSPIN'));
    this.addNoSTAMarker('RANGL', 'scapula', BoneScene.SegmentNoSTAMarkerMaterials.get('RANGL'));
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