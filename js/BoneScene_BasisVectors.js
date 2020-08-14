import {BoneScene} from "./BoneScene.js";
import {FatArrow} from "./EulerGeometry.js";
import {BasisVectorsInfo} from "./STA_CSV_Processor.js";
import {Vector3} from "./vendor/three.js/build/three.module.js";

BoneScene.BasicVecDimColorMap = [0xff0000, 0x00ff00, 0x0000ff];

BoneScene.prototype.addSegmentBasisVectors = function(segment) {
    const bvInfo = this.bvInfo[segment];
    bvInfo.forEach((modeBasisVec, mode) => {
        modeBasisVec.forEach((dimBasisVec, dim) => {
            dimBasisVec.forEach((markerBasisVec, marker) => {
                const arrow = new FatArrow(this.humerusLength/100, this.humerusLength/10, this.humerusLength/100*2, this.humerusLength/100*2, BoneScene.BasicVecDimColorMap[dim]);
                arrow.setDirection(new Vector3().copy(markerBasisVec).normalize());
                arrow.visible=false;
                this.noSTAMarkers[segment][marker].add(arrow);

                if (this.basisVectors[segment][mode] == null) {
                    this.basisVectors[segment][mode] = {};
                }
                if (this.basisVectors[segment][mode][dim] == null) {
                    this.basisVectors[segment][mode][dim] = {};
                }
                this.basisVectors[segment][mode][dim][marker] = arrow;
            });
        });
    });
};

BoneScene.prototype.addClusterCS = function(segment) {
    const clusterCenter = new Vector3();
    let numMarkers = 0;
    for(const marker in this.noSTAMarkers[segment]) {
        clusterCenter.add(this.noSTAMarkers[segment][marker].position);
        numMarkers++;
    }
    clusterCenter.multiplyScalar(1/numMarkers);

    const arrow_x = new FatArrow(this.humerusLength/100, this.humerusLength/10, this.humerusLength/100*2, this.humerusLength/100*2, BoneScene.BasicVecDimColorMap[0]);
    arrow_x.setDirection(new Vector3(1, 0, 0));
    arrow_x.setPosition(clusterCenter);
    this[segment].add(arrow_x);

    const arrow_y = new FatArrow(this.humerusLength/100, this.humerusLength/10, this.humerusLength/100*2, this.humerusLength/100*2, BoneScene.BasicVecDimColorMap[1]);
    arrow_y.setDirection(new Vector3(0, 1, 0));
    arrow_y.setPosition(clusterCenter);
    this[segment].add(arrow_y);

    const arrow_z = new FatArrow(this.humerusLength/100, this.humerusLength/10, this.humerusLength/100*2, this.humerusLength/100*2, BoneScene.BasicVecDimColorMap[2]);
    arrow_z.setDirection(new Vector3(0, 0, 1));
    arrow_z.setPosition(clusterCenter);
    this[segment].add(arrow_z);
};

BoneScene.prototype.addAllBasisVectors = function() {
    this.addSegmentBasisVectors('humerus');
    this.addSegmentBasisVectors('scapula');
    this.addClusterCS('humerus');
    this.addClusterCS('scapula');
};

export function enableBasisVectors(boneScene, humerusBVInfo, scapulaBVInfo) {
    boneScene.bvInfo = {};
    boneScene.bvInfo.humerus = humerusBVInfo.BasisVectors;
    boneScene.bvInfo.scapula = scapulaBVInfo.BasisVectors;
    boneScene.basisVectors = {};
    boneScene.basisVectors.humerus = {};
    boneScene.basisVectors.scapula = {};

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addAllBasisVectors();
    });
}

export function enableBasisVectorsGUI(boneScene) {
    boneScene.addEventListener('gui', function (event) {
        const scene = event.target;
        const gui = event.gui;

        const basisVectorsFolder = gui.addFolder('Basis Vectors Visibility');

        addBasisVectorsSegmentGUI('humerus');
        addBasisVectorsSegmentGUI('scapula');

        function addBasisVectorsSegmentGUI(segment) {
            const segmentBasisVectorsFolder = basisVectorsFolder.addFolder(segment.charAt(0).toUpperCase() + segment.slice(1));
            const basisVectorsGUI = {};
            BasisVectorsInfo.Mode_Indices.forEach((modeIdx,mode) => {
                BasisVectorsInfo.DimNames.forEach((dim,dimIdx) => {
                    const propName = mode + '_' + dim;
                    basisVectorsGUI[propName] = false;
                    segmentBasisVectorsFolder.add(basisVectorsGUI, propName).onChange((val) => {
                        for(const marker in scene.basisVectors[segment][mode][dimIdx]) {
                            scene.basisVectors[segment][mode][dimIdx][marker].visible = val;
                        }
                    })
                })
            });
        }
    });
}