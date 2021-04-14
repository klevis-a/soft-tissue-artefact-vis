import {BoneScene} from "./BoneScene.js";
import {Vector3} from "./vendor/three.js/build/three.module.js";

BoneScene.MarkerSegmentMap = new Map([
    ['T10','thorax'],
    ['T5','thorax'],
    ['C7','thorax'],
    ['STRN','thorax'],
    ['CLAV','clavicle'],
    ['LCLAV','clavicle'],
    ['LSHO','leftScapula'],
    ['RCLAV','clavicle'],
    ['RSH0','scapula'],
    ['RACRM','scapula'],
    ['RSPIN','scapula'],
    ['RANGL','scapula'],
    ['RUPAA','humerus'],
    ['RUPAB','humerus'],
    ['RUPAC','humerus'],
    ['RUPAD','humerus'],
    ['RELB','humerus'],
    ['RFRM','rightForearmWrist'],
    ['RWRA','rightForearmWrist'],
    ['RWRB','rightForearmWrist'],
    ['RHNDA','rightHand'],
    ['RHNDB','rightHand'],
    ['RHNDC','rightHand'],
    ['RHNDD','rightHand'],
]);

BoneScene.SegmentMarkerMaterials = new Map([
    ['RUPAA', BoneScene.RED_MARKER_MATERIAL],
    ['RUPAB', BoneScene.GREEN_MARKER_MATERIAL],
    ['RUPAC', BoneScene.BLUE_MARKER_MATERIAL],
    ['RUPAD', BoneScene.YELLOW_MARKER_MATERIAL],
    ['RSH0', BoneScene.RED_MARKER_MATERIAL],
    ['RACRM', BoneScene.GREEN_MARKER_MATERIAL],
    ['RSPIN', BoneScene.BLUE_MARKER_MATERIAL],
    ['RANGL', BoneScene.YELLOW_MARKER_MATERIAL],
]);

BoneScene.prototype.addViconMarker = function (name, segmentName, material) {
    if (this.viconMarkers[segmentName] == null) {
        this.viconMarkers[segmentName] = {};
    }
    const markerPos = this.markerTrajectories.markerPosVector(name, 0);
    if (markerPos == null) {
        this.viconMarkers[segmentName][name] = BoneScene.createMarker(material, new Vector3());
        this.viconMarkers[segmentName][name].dataVisible = false;
        this.viconMarkers[segmentName][name].visible = false;
    }
    else {
        this.viconMarkers[segmentName][name] = BoneScene.createMarker(material, markerPos);
        this.viconMarkers[segmentName][name].dataVisible = true;
        this.viconMarkers[segmentName][name].visible = this.markerSegmentVisibility[segmentName];
    }
    this.scene.add(this.viconMarkers[segmentName][name]);
};

BoneScene.prototype.addViconMarkers = function () {
    for (const markerName of this.markerTrajectories.Markers.keys()) {
        const markerMaterial = BoneScene.SegmentMarkerMaterials.get(markerName) || BoneScene.GRAY_MARKER_MATERIAL;
        this.addViconMarker(markerName, BoneScene.MarkerSegmentMap.get(markerName), markerMaterial);
    }
};

export function enableViconMarkers(boneScene) {
    boneScene.viconMarkers = {};

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addViconMarkers();
    });

    boneScene.addEventListener('frame', function (event) {
        const currentFrame = event.currentFrame;
        const nextFrame = event.nextFrame;
        const interpFactor = event.interpFactor;
        const scene = event.target;

        if (interpFactor != null) {
            for (const segmentName in scene.viconMarkers) {
                const currentSegment = scene.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    const markerPosCurrent = scene.markerTrajectories.markerPosVector(markerName, currentFrame);
                    const markerPosNext = scene.markerTrajectories.markerPosVector(markerName, nextFrame);

                    if (markerPosCurrent === null) {
                        currentSegment[markerName].dataVisible = false;
                        currentSegment[markerName].visible = false;
                    }
                    else {
                        if (markerPosNext === null) {
                            currentSegment[markerName].position.copy(markerPosCurrent);
                        }
                        else {
                            currentSegment[markerName].position.copy(markerPosCurrent.lerp(markerPosNext, interpFactor));
                        }
                        currentSegment[markerName].dataVisible = true;
                        currentSegment[markerName].visible = this.markerSegmentVisibility[segmentName];
                    }
                }
            }
        } else {
            for (const segmentName in scene.viconMarkers) {
                const currentSegment = scene.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    const markerPos = scene.markerTrajectories.markerPosVector(markerName, this.markerTrajectories.NumFrames-1);
                    if (markerPos === null) {
                        currentSegment[markerName].dataVisible = false;
                        currentSegment[markerName].visible = false;
                    }
                    else {
                        currentSegment[markerName].dataVisible = true;
                        currentSegment[markerName].visible = scene.markerSegmentVisibility[segmentName];
                        currentSegment[markerName].position.copy(markerPos);
                    }
                }
            }
        }
    });
}