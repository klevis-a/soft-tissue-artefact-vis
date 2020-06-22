import * as THREE from "./vendor/three.js/build/three.module.js";
import * as JSHelpers from "./JSHelpers.js";

export class BoneGeometryInfo {

    constructor(boneBB) {
        this.boundingBox = boneBB;
        this.sizeArray = this.boundingBox.getSize(new THREE.Vector3()).toArray();
    }

    get maxDim() {
        if (this._maxDim === undefined) {
            this._maxDim = this.sizeArray.indexOf(Math.max(...this.sizeArray));
        }
        return this._maxDim;
    }

    get maxDimVector() {
        if (this._maxDimVector === undefined) {
            this._maxDimVector = new THREE.Vector3();
            this._maxDimVector.setComponent(this.maxDim, 1);
        }
        return this._maxDimVector;
    }

    get minDim() {
        if (this._minDim === undefined) {
            this._minDim = this.sizeArray.indexOf(Math.min(...this.sizeArray));
        }

        return this._minDim;
    }

    get minDimVector() {
        if (this._minDimVector === undefined) {
            this._minDimVector = new THREE.Vector3();
            this._minDimVector.setComponent(this.minDim, 1);
        }

        return this._minDimVector;
    }

    get remainingDim() {
        if (this._remainingDim === undefined) {
            this._remainingDim = JSHelpers.range(this.sizeArray.length)
                .filter(x => (x !== this.maxDim && x !== this.minDim))[0];
        }

        return this._remainingDim;
    }

    get remainingDimVector() {
        if (this._remainingDimVector === undefined) {
            this._remainingDimVector = new THREE.Vector3();
            this._remainingDimVector.setComponent(this.remainingDim, 1);
        }

        return this._remainingDimVector;
    }
}