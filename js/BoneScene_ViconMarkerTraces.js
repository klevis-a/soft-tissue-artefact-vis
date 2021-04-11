import {BoneScene} from "./BoneScene.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";
import {LineGeometry} from "./vendor/three.js/examples/jsm/lines/LineGeometry.js";
import {Line2} from "./vendor/three.js/examples/jsm/lines/Line2.js";

BoneScene.SegmentLineMaterials = new Map([
    ['RUPAA', 'RED_LINE_MATERIAL'],
    ['RUPAB', 'GREEN_LINE_MATERIAL'],
    ['RUPAC', 'BLUE_LINE_MATERIAL'],
    ['RUPAD', 'YELLOW_LINE_MATERIAL'],
    ['RSH0', 'RED_LINE_MATERIAL'],
    ['RACRM', 'GREEN_LINE_MATERIAL'],
    ['RSPIN', 'BLUE_LINE_MATERIAL'],
    ['RANGL', 'YELLOW_LINE_MATERIAL'],
]);

BoneScene.prototype.addViconMarkerTrace = function(markerName, segmentName, material) {
    if (this.viconMarkerTraces.Lines[segmentName] === undefined) {
        this.viconMarkerTraces.Lines[segmentName] = {};
    }
    if (this.viconMarkerTraces.NumSegments[segmentName] === undefined) {
        this.viconMarkerTraces.NumSegments[segmentName] = {};
    }
    this.viconMarkerTraces.NumSegments[segmentName][markerName] = new Array(this.markerTrajectories.NumFrames);
    const positions = [];
    let numSegments = -1;
    for (let i=0; i<this.markerTrajectories.NumFrames; i++) {
        const markerPosition = this.markerTrajectories.markerPosVector(markerName, i);
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
    this.viconMarkerTraces.Lines[segmentName][markerName].visible = true;
    this.scene.add(this.viconMarkerTraces.Lines[segmentName][markerName]);
    this.viconMarkerTraces.Lines[segmentName][markerName].geometry.maxInstancedCount = this.viconMarkerTraces.NumSegments[segmentName][markerName][0];
};

BoneScene.prototype.addViconMarkerTraces = function() {
    this.addViconMarkerTrace('RUPAA', 'humerus', this[BoneScene.SegmentLineMaterials.get('RUPAA')]);
    this.addViconMarkerTrace('RUPAB', 'humerus', this[BoneScene.SegmentLineMaterials.get('RUPAB')]);
    this.addViconMarkerTrace('RUPAC', 'humerus', this[BoneScene.SegmentLineMaterials.get('RUPAC')]);
    this.addViconMarkerTrace('RUPAD', 'humerus', this[BoneScene.SegmentLineMaterials.get('RUPAD')]);

    this.addViconMarkerTrace('RSH0', 'scapula', this[BoneScene.SegmentLineMaterials.get('RSH0')]);
    this.addViconMarkerTrace('RACRM', 'scapula', this[BoneScene.SegmentLineMaterials.get('RACRM')]);
    this.addViconMarkerTrace('RSPIN', 'scapula', this[BoneScene.SegmentLineMaterials.get('RSPIN')]);
    this.addViconMarkerTrace('RANGL', 'scapula', this[BoneScene.SegmentLineMaterials.get('RANGL')]);
};

export function enableViconMarkerTraces(boneScene) {
    boneScene.viconMarkerTraces = {};
    boneScene.viconMarkerTraces.Lines = {};
    boneScene.viconMarkerTraces.NumSegments = {};

    // These are not static because a resolution needs to be set on them.
    // If there are multiple scenes these may have potentially different resolutions in each scene.
    boneScene.RED_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3});
    boneScene.GREEN_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3});
    boneScene.BLUE_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3});
    boneScene.YELLOW_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3});

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addViconMarkerTraces();
    });

    boneScene.addEventListener('frame', function (event) {
        const currentFrame = event.currentFrame;
        const scene = event.target;

        for (const segmentName in scene.viconMarkerTraces.Lines) {
            for (const markerName in scene.viconMarkerTraces.Lines[segmentName]) {
                this.viconMarkerTraces.Lines[segmentName][markerName].geometry.maxInstancedCount = scene.viconMarkerTraces.NumSegments[segmentName][markerName][currentFrame];
            }
        }
    });

    boneScene.addEventListener('preRender', function (event) {
        const scene = event.target;
        const contentWidth = event.contentWidth;
        const contentHeight = event.contentHeight;
        scene.RED_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        scene.GREEN_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        scene.BLUE_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        scene.YELLOW_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
    });
}