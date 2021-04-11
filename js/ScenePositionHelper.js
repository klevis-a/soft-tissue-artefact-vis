import {Matrix4, Vector3} from "./vendor/three.js/build/three.module.js";

export class ScenePositionHelper {
    constructor(humerus, scapula, landmarksInfo_Segment, torsoQuat) {
        this.humerus = humerus;
        this.scapula = scapula;
        this.landmarksInfo_Segment = landmarksInfo_Segment;

        this.hhc = new Vector3().copy(this.landmarksInfo_Segment.humerus.hhc).applyMatrix4(this.humerus.matrixWorld);
        this.me = new Vector3().copy(this.landmarksInfo_Segment.humerus.me).applyMatrix4(this.humerus.matrixWorld);
        this.le = new Vector3().copy(this.landmarksInfo_Segment.humerus.le).applyMatrix4(this.humerus.matrixWorld);

        this.gc = new Vector3().copy(this.landmarksInfo_Segment.scapula.gc).applyMatrix4(this.scapula.matrixWorld);
        this.ia = new Vector3().copy(this.landmarksInfo_Segment.scapula.ia).applyMatrix4(this.scapula.matrixWorld);
        this.ts = new Vector3().copy(this.landmarksInfo_Segment.scapula.ts).applyMatrix4(this.scapula.matrixWorld);
        this.pla = new Vector3().copy(this.landmarksInfo_Segment.scapula.pla).applyMatrix4(this.scapula.matrixWorld);

        this.lateral = new Vector3();
        this.anterior = new Vector3();

        new Matrix4().makeRotationFromQuaternion(torsoQuat).extractBasis(this.anterior, new Vector3(), this.lateral);
    }
}