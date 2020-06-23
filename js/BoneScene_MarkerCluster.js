import {BoneSceneFnc} from "./BoneSceneFnc.js";
import {LineGeometry} from "./vendor/three.js/examples/jsm/lines/LineGeometry.js";
import {Line2} from "./vendor/three.js/examples/jsm/lines/Line2.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";

BoneSceneFnc.HumerusMarkerOrder = ['RUPAA', 'RUPAB', 'RUPAC', 'RUPAD', 'RUPAA'];
BoneSceneFnc.ScapulaMarkerOrder = ['RACRM', 'RSPIN', 'RANGL', 'RACRM', 'RSH0'];

BoneSceneFnc.prototype.addScapulaHumerusClusterNoSTA = function() {
    const humPositions = [];
    for (const markerName of BoneSceneFnc.HumerusMarkerOrder) {
        const markerPosition = this.noSTAMarkers.humerus[markerName].position;
        humPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
    }
    const lineGeometryHum = new LineGeometry();
    lineGeometryHum.setPositions(humPositions);
    this.humerusClusterNoSTA = new Line2(lineGeometryHum, this.BLACK_LINE_MATERIAL);
    this.humerus.add(this.humerusClusterNoSTA);


    const scapPositions = [];
    for (const markerName of BoneSceneFnc.ScapulaMarkerOrder) {
        const markerPosition = this.noSTAMarkers.scapula[markerName].position;
        scapPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
    }
    const lineGeometryScap = new LineGeometry();
    lineGeometryScap.setPositions(scapPositions);
    this.scapulaClusterNoSTA = new Line2(lineGeometryScap, this.BLACK_LINE_MATERIAL);
    this.scapula.add(this.scapulaClusterNoSTA);
};

BoneSceneFnc.prototype.addScapulaHumerusCluster = function() {
    const humPositions = [];
    for (const markerName of BoneSceneFnc.HumerusMarkerOrder) {
        const markerPosition = this.viconMarkers.humerus[markerName].position;
        humPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
    }
    const lineGeometryHum = new LineGeometry();
    lineGeometryHum.setPositions(humPositions);
    this.humerusCluster = new Line2(lineGeometryHum, this.BLACK_LINE_MATERIAL);
    this.scene.add(this.humerusCluster);

    const scapPositions = [];
    for (const markerName of BoneSceneFnc.ScapulaMarkerOrder) {
        const markerPosition = this.viconMarkers.scapula[markerName].position;
        scapPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
    }

    const lineGeometryScap = new LineGeometry();
    lineGeometryScap.setPositions(scapPositions);
    this.scapulaCluster = new Line2(lineGeometryScap, this.BLACK_LINE_MATERIAL);
    this.scene.add(this.scapulaCluster);
};

export function enableMarkerClusters(boneScene) {
    // These are not static because a resolution needs to be set on them.
    // If there are multiple scenes these may have potentially different resolutions in each scene.
    boneScene.BLACK_LINE_MATERIAL = new LineMaterial({color:0x000000, linewidth:3});

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addScapulaHumerusClusterNoSTA();
        scene.addScapulaHumerusCluster();
    });

    boneScene.addEventListener('frame', function (event) {
        const scene = event.target;

        const humPositions = [];
        for (const markerName of BoneSceneFnc.HumerusMarkerOrder) {
            const markerPosition = scene.viconMarkers.humerus[markerName].position;
            humPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        scene.humerusCluster.geometry.setPositions(humPositions);
        scene.humerusCluster.geometry.attributes.instanceStart.data.needsUpdate = true;

        const scapPositions = [];
        for (const markerName of BoneSceneFnc.ScapulaMarkerOrder) {
            const markerPosition = scene.viconMarkers.scapula[markerName].position;
            scapPositions.push(markerPosition.x, markerPosition.y, markerPosition.z);
        }
        scene.scapulaCluster.geometry.setPositions(scapPositions);
        scene.scapulaCluster.geometry.attributes.instanceStart.data.needsUpdate = true;
    });

    boneScene.addEventListener('preRender', function (event) {
        const scene = event.target;
        const contentWidth = event.contentWidth;
        const contentHeight = event.contentHeight;
        scene.BLACK_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
    });
}