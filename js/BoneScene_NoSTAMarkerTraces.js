import {BoneScene} from "./BoneScene.js";
import {Vector3} from "./vendor/three.js/build/three.module.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";
import {LineGeometry} from "./vendor/three.js/examples/jsm/lines/LineGeometry.js";
import {Line2} from "./vendor/three.js/examples/jsm/lines/Line2.js";

BoneScene.SegmentNoSTALineMaterials = new Map([
    ['RUPAA', 'RED_NOSTA_LINE_MATERIAL'],
    ['RUPAB', 'GREEN_NOSTA_LINE_MATERIAL'],
    ['RUPAC', 'BLUE_NOSTA_LINE_MATERIAL'],
    ['RUPAD', 'YELLOW_NOSTA_LINE_MATERIAL'],
    ['RSH0', 'RED_NOSTA_LINE_MATERIAL'],
    ['RACRM', 'GREEN_NOSTA_LINE_MATERIAL'],
    ['RSPIN', 'BLUE_NOSTA_LINE_MATERIAL'],
    ['RANGL', 'YELLOW_NOSTA_LINE_MATERIAL'],
]);

BoneScene.prototype.addNoSTAMarkerTrace = function(markerName, segmentName, material) {
    if (this.noSTAMarkerTraces.Lines[segmentName] === undefined) {
        this.noSTAMarkerTraces.Lines[segmentName] = {};
    }
    if (this.noSTAMarkerTraces.NumSegments[segmentName] === undefined) {
        this.noSTAMarkerTraces.NumSegments[segmentName] = {};
    }
    let posFnc;
    let quatFnc;

    if (segmentName==='humerus') {
        posFnc = (frameNum) => this.timeSeriesInfo.humPosVector(frameNum);
        quatFnc = (frameNum) => this.timeSeriesInfo.humOrientQuat(frameNum);
    }
    else if (segmentName==='scapula') {
        posFnc = (frameNum) => this.timeSeriesInfo.scapPosVector(frameNum);
        quatFnc = (frameNum) => this.timeSeriesInfo.scapOrientQuat(frameNum);
    }
    else {
        return;
    }
    const markerRelPos = this.staticInfo.markerPosVector(markerName);

    this.noSTAMarkerTraces.NumSegments[segmentName][markerName] = new Array(this.timeSeriesInfo.NumFrames);
    const positions = [];
    let numSegments = -1;
    for (let i=0; i<this.timeSeriesInfo.NumFrames; i++) {
        const segmentPos = posFnc(i);
        const segmentQuat = quatFnc(i);
        if (segmentPos !== null && segmentQuat !== null) {
            const markerPosition = new Vector3().copy(markerRelPos).applyQuaternion(segmentQuat).add(segmentPos);
            positions.push(markerPosition.x, markerPosition.y, markerPosition.z);
            numSegments++;
        }
        this.noSTAMarkerTraces.NumSegments[segmentName][markerName][i] = numSegments < 0 ? 0 : numSegments;
    }
    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);
    this.noSTAMarkerTraces.Lines[segmentName][markerName] = new Line2(lineGeometry, material);
    this.noSTAMarkerTraces.Lines[segmentName][markerName].computeLineDistances();
    this.noSTAMarkerTraces.Lines[segmentName][markerName].scale.set(1,1,1);
    this.noSTAMarkerTraces.Lines[segmentName][markerName].visible = true;
    this.scene.add(this.noSTAMarkerTraces.Lines[segmentName][markerName]);
    this.noSTAMarkerTraces.Lines[segmentName][markerName].geometry.maxInstancedCount = this.noSTAMarkerTraces.NumSegments[segmentName][markerName][0];
};

BoneScene.prototype.addNoSTAMarkerTraces = function () {
    this.addNoSTAMarkerTrace('RUPAA', 'humerus', this[BoneScene.SegmentNoSTALineMaterials.get('RUPAA')]);
    this.addNoSTAMarkerTrace('RUPAB', 'humerus', this[BoneScene.SegmentNoSTALineMaterials.get('RUPAB')]);
    this.addNoSTAMarkerTrace('RUPAC', 'humerus', this[BoneScene.SegmentNoSTALineMaterials.get('RUPAC')]);
    this.addNoSTAMarkerTrace('RUPAD', 'humerus', this[BoneScene.SegmentNoSTALineMaterials.get('RUPAD')]);

    this.addNoSTAMarkerTrace('RSH0', 'scapula', this[BoneScene.SegmentNoSTALineMaterials.get('RSH0')]);
    this.addNoSTAMarkerTrace('RACRM', 'scapula', this[BoneScene.SegmentNoSTALineMaterials.get('RACRM')]);
    this.addNoSTAMarkerTrace('RSPIN', 'scapula', this[BoneScene.SegmentNoSTALineMaterials.get('RSPIN')]);
    this.addNoSTAMarkerTrace('RANGL', 'scapula', this[BoneScene.SegmentNoSTALineMaterials.get('RANGL')]);
};

export function enableNoSTAMarkerTraces(boneScene) {
    boneScene.noSTAMarkerTraces = {};
    boneScene.noSTAMarkerTraces.Lines = {};
    boneScene.noSTAMarkerTraces.NumSegments = {};

    // These are not static because a resolution needs to be set on them.
    // If there are multiple scenes these may have potentially different resolutions in each scene.
    boneScene.RED_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    boneScene.GREEN_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    boneScene.BLUE_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    boneScene.YELLOW_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
    boneScene.RED_NOSTA_LINE_MATERIAL.defines.USE_DASH="";
    boneScene.GREEN_NOSTA_LINE_MATERIAL.defines.USE_DASH="";
    boneScene.BLUE_NOSTA_LINE_MATERIAL.defines.USE_DASH="";
    boneScene.YELLOW_NOSTA_LINE_MATERIAL.defines.USE_DASH="";

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addNoSTAMarkerTraces();
    });

    boneScene.addEventListener('frame', function (event) {
        const currentFrame = event.currentFrame;
        const scene = event.target;

        for (const segmentName in scene.noSTAMarkerTraces.Lines) {
            for (const markerName in scene.noSTAMarkerTraces.Lines[segmentName]) {
                this.noSTAMarkerTraces.Lines[segmentName][markerName].geometry.maxInstancedCount = scene.noSTAMarkerTraces.NumSegments[segmentName][markerName][currentFrame];
            }
        }
    });

    boneScene.addEventListener('preRender', function (event) {
        const scene = event.target;
        const contentWidth = event.contentWidth;
        const contentHeight = event.contentHeight;
        scene.RED_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        scene.GREEN_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        scene.BLUE_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
        scene.YELLOW_NOSTA_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
    });
}