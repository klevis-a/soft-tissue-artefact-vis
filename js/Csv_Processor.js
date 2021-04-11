'use strict';

import {Vector3, Quaternion} from "./vendor/three.js/build/three.module.js";
import {range} from "./JSHelpers.js";

export class HumerusLandmarks {
    static COLS = [1, 4];

    constructor(landmarksData) {
        this.LandmarksData = landmarksData;
        this.hhc = new Vector3(...this.LandmarksData[1].slice(...HumerusLandmarks.COLS));
        this.le = new Vector3(...this.LandmarksData[2].slice(...HumerusLandmarks.COLS));
        this.me = new Vector3(...this.LandmarksData[3].slice(...HumerusLandmarks.COLS));
    }
}

export class ScapulaLandmarks {
    static COLS = [1, 4];

    constructor(landmarksData) {
        this.LandmarksData = landmarksData;
        this.gc = new Vector3(...this.LandmarksData[1].slice(...ScapulaLandmarks.COLS));
        this.ia = new Vector3(...this.LandmarksData[2].slice(...ScapulaLandmarks.COLS));
        this.ts = new Vector3(...this.LandmarksData[3].slice(...ScapulaLandmarks.COLS));
        this.pla = new Vector3(...this.LandmarksData[4].slice(...ScapulaLandmarks.COLS));
        this.ac = new Vector3(...this.LandmarksData[5].slice(...ScapulaLandmarks.COLS));
    }
}

export class MarkerTrajectories {
    static FRAME_PERIOD = 0.01;

    constructor(csvResults) {
        this.TimeSeries = csvResults.slice(1);
        this.NumFrames = this.TimeSeries.length;
        this.Markers = new Map();
        processMarkerData(this.Markers, csvResults[0], 0);

        const framesArray = range(this.NumFrames);

        this.MarkerPos = new Map();
        this.MarkerFirstFrame = new Map();
        this.Markers.forEach((markerIdx, markerName) => {
            const posForMarker = framesArray.map(frameNum => {
                const markerPos = this.markerPos(markerName, frameNum);
                const markerPosNoNaN = markerPos.filter(x => !isNaN(x));
                if (markerPosNoNaN.length === markerPos.length) {
                    return new Vector3(...markerPos);
                }
                else {
                    return null;
                }
            });
            this.MarkerPos.set(markerName, posForMarker);
            this.MarkerFirstFrame.set(markerName, posForMarker.findIndex(val => val !== null))
        });
    }

    markerPos(markerName, frameNum) {
        return this.TimeSeries[frameNum].slice(...this.Markers.get(markerName));
    }

    markerPosVector(markerName, frameNum) {
        return this.MarkerPos.get(markerName)[frameNum];
    }
}


export class Trajectory {
    static FRAME_PERIOD = 0.01;
    static TORSO_POS = [0, 3];
    static TORSO_ORIENT = [3, 7];
    static SCAP_POS = [7, 10];
    static SCAP_ORIENT = [10, 14];
    static HUM_POS = [14, 17];
    static HUM_ORIENT = [17, 21];

    constructor(csvResults) {
        this.TimeSeries = csvResults.slice(1);
        this.NumFrames = this.TimeSeries.length;

        const framesArray = range(this.NumFrames);
        this.TorsoPos = framesArray.map(frameNum => new Vector3(...this.torsoPos(frameNum)));
        this.TorsoOrient = framesArray.map(frameNum => new Quaternion(...this.torsoOrient(frameNum)));
        this.ScapulaPos = framesArray.map(frameNum => new Vector3(...this.scapPos(frameNum)));
        this.ScapulaOrient = framesArray.map(frameNum => new Quaternion(...this.scapOrient(frameNum)));
        this.HumerusPos = framesArray.map(frameNum => new Vector3(...this.humPos(frameNum)));
        this.HumerusOrient = framesArray.map(frameNum => new Quaternion(...this.humOrient(frameNum)));
    }

    torsoPos(frameNum) {
        return this.TimeSeries[frameNum].slice(...Trajectory.TORSO_POS);
    }

    torsoOrient(frameNum) {
        return this.TimeSeries[frameNum].slice(...Trajectory.TORSO_ORIENT);
    }

    scapPos(frameNum) {
        return this.TimeSeries[frameNum].slice(...Trajectory.SCAP_POS);
    }

    scapOrient(frameNum) {
        return this.TimeSeries[frameNum].slice(...Trajectory.SCAP_ORIENT);
    }

    humPos(frameNum) {
        return this.TimeSeries[frameNum].slice(...Trajectory.HUM_POS);
    }

    humOrient(frameNum) {
        return this.TimeSeries[frameNum].slice(...Trajectory.HUM_ORIENT);
    }

    torsoPosVector(frameNum) {
        return this.TorsoPos[frameNum];
    }

    torsoOrientQuat(frameNum) {
        return this.TorsoOrient[frameNum];
    }

    scapPosVector(frameNum) {
        return this.ScapulaPos[frameNum];
    }

    scapOrientQuat(frameNum) {
        return this.ScapulaOrient[frameNum];
    }

    humPosVector(frameNum) {
        return this.HumerusPos[frameNum];
    }

    humOrientQuat(frameNum) {
        return this.HumerusOrient[frameNum];
    }
}

function processMarkerData(map, fields, startIdx) {
    const markerFields = fields.slice(startIdx);

    markerFields.forEach((item, index) => {
        const [currentMarker, currentDim] = item.split('_');
        if (currentDim === 'X') map.set(currentMarker, [startIdx+index]);
        if (currentDim === 'Z') map.get(currentMarker).push(startIdx+index+1);
    });
}
