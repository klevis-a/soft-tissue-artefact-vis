import {Mesh, Vector3, SphereBufferGeometry} from "./vendor/three.js/build/three.module.js";

export function viconMarkers_decorator(BoneSceneFnc) {
    BoneSceneFnc.MARKER_GEOMETRY = new SphereBufferGeometry(7, 10, 10);

    BoneSceneFnc.MarkerSegmentMap = new Map([
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

    BoneSceneFnc.SegmentMarkerMaterials = new Map([
        ['RUPAA', BoneSceneFnc.RED_MARKER_MATERIAL],
        ['RUPAB', BoneSceneFnc.GREEN_MARKER_MATERIAL],
        ['RUPAC', BoneSceneFnc.BLUE_MARKER_MATERIAL],
        ['RUPAD', BoneSceneFnc.YELLOW_MARKER_MATERIAL],
        ['RSH0', BoneSceneFnc.RED_MARKER_MATERIAL],
        ['RACRM', BoneSceneFnc.GREEN_MARKER_MATERIAL],
        ['RSPIN', BoneSceneFnc.BLUE_MARKER_MATERIAL],
        ['RANGL', BoneSceneFnc.YELLOW_MARKER_MATERIAL],
    ]);

    BoneSceneFnc.createMarker = function(material, position) {
        const mesh = new Mesh(BoneSceneFnc.MARKER_GEOMETRY, material);
        mesh.position.copy(position);
        return mesh;
    };

    BoneSceneFnc.prototype.addViconMarker = function (name, segmentName, material) {
        if (this.viconMarkers[segmentName] == null) {
            this.viconMarkers[segmentName] = {};
        }
        const markerPos = this.timeSeriesInfo.markerPosVector(name, 0);
        if (markerPos == null) {
            this.viconMarkers[segmentName][name] = BoneSceneFnc.createMarker(material, new Vector3());
            this.viconMarkers[segmentName][name].visible = false;
        }
        else {
            this.viconMarkers[segmentName][name] = BoneSceneFnc.createMarker(material, markerPos);
            this.viconMarkers[segmentName][name].visible = this.markerSegmentVisibility[segmentName];
        }
        this.scene.add(this.viconMarkers[segmentName][name]);
    };

    BoneSceneFnc.prototype.addViconMarkers = function () {
        for (const markerName of this.timeSeriesInfo.Markers.keys()) {
            const markerMaterial = BoneSceneFnc.SegmentMarkerMaterials.get(markerName) || BoneSceneFnc.GRAY_MARKER_MATERIAL;
            this.addViconMarker(markerName, BoneSceneFnc.MarkerSegmentMap.get(markerName), markerMaterial);
        }
    };
}

export function addViconMarkers(boneScene) {
    boneScene.viconMarkers = {};

    boneScene.markerSegmentVisibility = {
        'thorax': true,
        'clavicle': true,
        'leftScapula': true,
        'scapula': true,
        'humerus': true,
        'rightForearmWrist': false,
        'rightHand': false
    };

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addViconMarkers();
    });

    boneScene.addEventListener('frame', function (event) {
        const currentFrame = event.currentFrame;
        const nextFrame = event.nextFrame;
        const interpFactor = event.interpFactor;
        const scene = event.target;

        if (interpFactor) {
            for (const segmentName in scene.viconMarkers) {
                const currentSegment = scene.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    const markerPosCurrent = scene.timeSeriesInfo.markerPosVector(markerName, currentFrame);
                    const markerPosNext = scene.timeSeriesInfo.markerPosVector(markerName, nextFrame);

                    if (markerPosCurrent === null) {
                        currentSegment[markerName].visible = false;
                    }
                    else {
                        if (markerPosNext === null) {
                            currentSegment[markerName].position.copy(markerPosCurrent);
                        }
                        else {
                            currentSegment[markerName].position.copy(markerPosCurrent.lerp(markerPosNext, interpFactor));
                        }
                        currentSegment[markerName].visible = this.markerSegmentVisibility[segmentName];
                    }
                }
            }
        } else {
            for (const segmentName in scene.viconMarkers) {
                const currentSegment = scene.viconMarkers[segmentName];
                for (const markerName in currentSegment) {
                    const markerPos = scene.timeSeriesInfo.markerPosVector(markerName, this.timeSeriesInfo.NumFrames-1);
                    if (markerPos === null) {
                        currentSegment[markerName].visible = false;
                    }
                    else {
                        currentSegment[markerName].visible = scene.markerSegmentVisibility[segmentName];
                        currentSegment[markerName].position.copy(markerPos);
                    }
                }
            }
        }
    });
}