'use strict';

import {MeshPhongMaterial, CylinderBufferGeometry, Mesh, Object3D, Quaternion, Vector3} from "./vendor/three.js/build/three.module.js";

export class FatArrow extends Object3D {
    constructor(lineWidth, lineLength, coneRadius, coneHeight, color) {
        super();
        this.lineWidth = lineWidth;
        this.lineLength = lineLength;
        this.coneRadius = coneRadius;
        this.coneHeight = coneHeight;

        this.arrowMaterial = new MeshPhongMaterial({color: color, opacity: 0.7, transparent: true});

        const lineGeometry = new CylinderBufferGeometry(this.lineWidth/2, this.lineWidth/2, this.lineLength, 10, 1);
        lineGeometry.translate(0, this.lineLength*0.5, 0);
        this.line = new Mesh(lineGeometry, this.arrowMaterial);
        this.add(this.line);

        const coneGeometry = new CylinderBufferGeometry(0, this.coneRadius, this.coneHeight, 20, 1);
        coneGeometry.translate(0, this.lineLength+0.5*this.coneHeight, 0);
        this.cone = new Mesh(coneGeometry, this.arrowMaterial);
        this.add(this.cone);
    }

    setDirection(direction) {
        this.setRotationFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction));
    }

    setPosition(pos) {
        this.position.copy(pos);
    }
}
