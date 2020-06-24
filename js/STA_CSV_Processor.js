import {Vector3, Quaternion} from "./vendor/three.js/build/three.module.js";
import {range} from "./JSHelpers.js";

export class LandmarksInfo {
    static HUMERUS_COLS = [3, 6];
    static SCAPULA_COLS = [6, 9];

    static HUMERUS_HHC = {row: 12, col: LandmarksInfo.HUMERUS_COLS};
    static HUMERUS_LE = {row: 13, col: LandmarksInfo.HUMERUS_COLS};
    static HUMERUS_ME = {row: 14, col: LandmarksInfo.HUMERUS_COLS};

    static SCAPULA_GC = {row: 12, col: LandmarksInfo.SCAPULA_COLS};
    static SCAPULA_IA = {row: 13, col: LandmarksInfo.SCAPULA_COLS};
    static SCAPULA_TS = {row: 14, col: LandmarksInfo.SCAPULA_COLS};
    static SCAPULA_PLA = {row: 15, col: LandmarksInfo.SCAPULA_COLS};
    static SCAPULA_AC = {row: 16, col: LandmarksInfo.SCAPULA_COLS};

    constructor(landmarksData) {
        this.LandmarksData = landmarksData;
        this.humerus = {};
        this.scapula = {};

        this.humerus.hhc = new Vector3(...this.LandmarksData[LandmarksInfo.HUMERUS_HHC.row].slice(...LandmarksInfo.HUMERUS_HHC.col));
        this.humerus.le = new Vector3(...this.LandmarksData[LandmarksInfo.HUMERUS_LE.row].slice(...LandmarksInfo.HUMERUS_LE.col));
        this.humerus.me = new Vector3(...this.LandmarksData[LandmarksInfo.HUMERUS_ME.row].slice(...LandmarksInfo.HUMERUS_ME.col));

        this.scapula.gc = new Vector3(...this.LandmarksData[LandmarksInfo.SCAPULA_GC.row].slice(...LandmarksInfo.SCAPULA_GC.col));
        this.scapula.ia = new Vector3(...this.LandmarksData[LandmarksInfo.SCAPULA_IA.row].slice(...LandmarksInfo.SCAPULA_IA.col));
        this.scapula.ts = new Vector3(...this.LandmarksData[LandmarksInfo.SCAPULA_TS.row].slice(...LandmarksInfo.SCAPULA_TS.col));
        this.scapula.pla = new Vector3(...this.LandmarksData[LandmarksInfo.SCAPULA_PLA.row].slice(...LandmarksInfo.SCAPULA_PLA.col));
        this.scapula.ac = new Vector3(...this.LandmarksData[LandmarksInfo.SCAPULA_AC.row].slice(...LandmarksInfo.SCAPULA_AC.col));
    }
}

export class StaticSTAInfo {
    static UP = [0, 3];

    constructor(csvResults) {
        this.StaticData = csvResults.data[1];
        this.Markers = new Map();
        processMarkerData(this.Markers, csvResults.data[0], 3);
        this.upVector = new Vector3(...this.StaticData.slice(...StaticSTAInfo.UP));
        this.MarkerPos = new Map();
        this.Markers.forEach((markerIdx, markerName) => this.MarkerPos.set(markerName, new Vector3(...this.StaticData.slice(...markerIdx))));
    }

    markerPosVector(markerName) {
        return this.MarkerPos.get(markerName);
    }
}

export class TimeSeriesSTAInfo {
    static FRAME_PERIOD = 10;
    static TORSO_POS = [0, 3];
    static TORSO_ORIENT = [3, 7];
    static SCAP_POS = [7, 10];
    static SCAP_ORIENT = [10, 14];
    static HUM_POS = [14, 17];
    static HUM_ORIENT = [17, 21];

    constructor(csvResults) {
        this.TimeSeries = csvResults.data.slice(1);
        this.NumFrames = this.TimeSeries.length;
        this.Markers = new Map();
        processMarkerData(this.Markers, csvResults.data[0], 14);

        const framesArray = range(this.NumFrames);
        this.TorsoPos = framesArray.map(frameNum => new Vector3(...this.torsoPos(frameNum)));
        this.TorsoOrient = framesArray.map(frameNum => new Quaternion(...this.torsoOrient(frameNum)));
        this.ScapulaPos = framesArray.map(frameNum => new Vector3(...this.scapPos(frameNum)));
        this.ScapulaOrient = framesArray.map(frameNum => new Quaternion(...this.scapOrient(frameNum)));
        this.HumerusPos = framesArray.map(frameNum => new Vector3(...this.humPos(frameNum)));
        this.HumerusOrient = framesArray.map(frameNum => new Quaternion(...this.humOrient(frameNum)));


        this.MarkerPos = new Map();
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
            }, this);
            this.MarkerPos.set(markerName, posForMarker);
        }, this);
    }

    markerPos(markerName, frameNum) {
        return this.TimeSeries[frameNum].slice(...this.Markers.get(markerName));
    }

    torsoPos(frameNum) {
        return this.TimeSeries[frameNum].slice(...TimeSeriesSTAInfo.TORSO_POS);
    }

    torsoOrient(frameNum) {
        return this.TimeSeries[frameNum].slice(...TimeSeriesSTAInfo.TORSO_ORIENT);
    }

    scapPos(frameNum) {
        return this.TimeSeries[frameNum].slice(...TimeSeriesSTAInfo.SCAP_POS);
    }

    scapOrient(frameNum) {
        return this.TimeSeries[frameNum].slice(...TimeSeriesSTAInfo.SCAP_ORIENT);
    }

    humPos(frameNum) {
        return this.TimeSeries[frameNum].slice(...TimeSeriesSTAInfo.HUM_POS);
    }

    humOrient(frameNum) {
        return this.TimeSeries[frameNum].slice(...TimeSeriesSTAInfo.HUM_ORIENT);
    }

    markerPosVector(markerName, frameNum) {
        return this.MarkerPos.get(markerName)[frameNum];
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