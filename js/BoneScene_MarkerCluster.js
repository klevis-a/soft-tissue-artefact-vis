import {BoneScene} from "./BoneScene.js";
import {LineGeometry} from "./vendor/three.js/examples/jsm/lines/LineGeometry.js";
import {Line2} from "./vendor/three.js/examples/jsm/lines/Line2.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";

BoneScene.HumerusMarkerOrder = ['RUPAA', 'RUPAB', 'RUPAC', 'RUPAD', 'RUPAA'];
BoneScene.ScapulaMarkerOrder = ['RACRM', 'RSPIN', 'RANGL', 'RACRM', 'RSH0'];

function getMarkerPositions(markerContainer, markerList, presentFnc) {
    const positions = [];
    positions.length = markerList.length * 3;
    positions.fill(0);

    let allPresent = true;
    markerList.forEach((markerName, i) => {
        if ((markerName in markerContainer) && markerContainer[markerName].dataVisible) {
            const markerPosition = markerContainer[markerName].position;
            positions[i*3] = markerPosition.x;
            positions[i*3 + 1] = markerPosition.y;
            positions[i*3 + 2] = markerPosition.z;
        }
        else {
            allPresent = false;
        }
    });

    return [positions, allPresent];
}

BoneScene.prototype.addScapulaHumerusClusterNoSTA = function() {
    const [humPositions, humAllPresent] = getMarkerPositions(this.noSTAMarkers.humerus, BoneScene.HumerusMarkerOrder);
    const lineGeometryHum = new LineGeometry();
    lineGeometryHum.setPositions(humPositions);
    this.humerusClusterNoSTA = new Line2(lineGeometryHum, this.BLACK_LINE_MATERIAL);
    this.humerus.add(this.humerusClusterNoSTA);
    this.humerusClusterNoSTA.dataVisible = humAllPresent;
    this.humerusClusterNoSTA.visible = humAllPresent && this.humerusClusterNoSTAVisible;


    const [scapPositions, scapAllPresent] = getMarkerPositions(this.noSTAMarkers.scapula, BoneScene.ScapulaMarkerOrder);
    const lineGeometryScap = new LineGeometry();
    lineGeometryScap.setPositions(scapPositions);
    this.scapulaClusterNoSTA = new Line2(lineGeometryScap, this.BLACK_LINE_MATERIAL);
    this.scapula.add(this.scapulaClusterNoSTA);
    this.scapulaClusterNoSTA.dataVisible = scapAllPresent;
    this.scapulaClusterNoSTA.visible = scapAllPresent && this.scapulaClusterNoSTAVisible;
};

BoneScene.prototype.addScapulaHumerusCluster = function() {
    const [humPositions, humAllPresent] = getMarkerPositions(this.viconMarkers.humerus, BoneScene.HumerusMarkerOrder);
    const lineGeometryHum = new LineGeometry();
    lineGeometryHum.setPositions(humPositions);
    this.humerusCluster = new Line2(lineGeometryHum, this.BLACK_LINE_MATERIAL);
    this.scene.add(this.humerusCluster);
    this.humerusCluster.dataVisible = humAllPresent;
    this.humerusCluster.visible = humAllPresent && this.humerusClusterVisible;

    const [scapPositions, scapAllPresent] = getMarkerPositions(this.viconMarkers.scapula, BoneScene.ScapulaMarkerOrder);

    const lineGeometryScap = new LineGeometry();
    lineGeometryScap.setPositions(scapPositions);
    this.scapulaCluster = new Line2(lineGeometryScap, this.BLACK_LINE_MATERIAL);
    this.scene.add(this.scapulaCluster);
    this.scapulaCluster.dataVisible = scapAllPresent;
    this.scapulaCluster.visible = scapAllPresent && this.scapulaClusterVisible;
};

BoneScene.prototype.markerClustersDispose = function () {
    this.humerusCluster.geometry.dispose();
    this.scapulaCluster.geometry.dispose();
    this.humerusClusterNoSTA.geometry.dispose();
    this.scapulaClusterNoSTA.geometry.dispose();
}

export function enableMarkerClusters(boneScene) {
    // These are not static because a resolution needs to be set on them.
    // If there are multiple scenes these may have potentially different resolutions in each scene.
    boneScene.BLACK_LINE_MATERIAL = new LineMaterial({color:0x000000, linewidth:3});

    boneScene.humerusClusterNoSTAVisible = true;
    boneScene.humerusClusterVisible = true;
    boneScene.scapulaClusterNoSTAVisible = true;
    boneScene.scapulaClusterVisible = true;

    boneScene.addEventListener('init', function (event) {
        const scene = event.target;
        scene.addScapulaHumerusClusterNoSTA();
        scene.addScapulaHumerusCluster();
    });

    boneScene.addEventListener('frame', function (event) {
        const scene = event.target;

        const [humPositions, humAllPresent] = getMarkerPositions(scene.viconMarkers.humerus, BoneScene.HumerusMarkerOrder);
        scene.humerusCluster.geometry.setPositions(humPositions);
        scene.humerusCluster.geometry.attributes.instanceStart.data.needsUpdate = true;
        this.humerusCluster.dataVisible = humAllPresent;
        this.humerusCluster.visible = humAllPresent && this.humerusClusterVisible;

        const [scapPositions, scapAllPresent] = getMarkerPositions(scene.viconMarkers.scapula, BoneScene.ScapulaMarkerOrder);
        scene.scapulaCluster.geometry.setPositions(scapPositions);
        scene.scapulaCluster.geometry.attributes.instanceStart.data.needsUpdate = true;
        this.scapulaCluster.dataVisible = scapAllPresent;
        this.scapulaCluster.visible = scapAllPresent && this.scapulaClusterVisible;
    });

    boneScene.addEventListener('preRender', function (event) {
        const scene = event.target;
        const contentWidth = event.contentWidth;
        const contentHeight = event.contentHeight;
        scene.BLACK_LINE_MATERIAL.resolution.set(contentWidth, contentHeight);
    });
}

export function enableMarkerClusterGUI(boneScene) {
    boneScene.addEventListener('gui', function (event) {
        const scene = event.target;
        const gui = event.gui;

        const markerClustersFolder = gui.addFolder('Marker Clusters');
        markerClustersFolder.add(scene,'humerusClusterNoSTAVisible').name('No STA Humerus Cluster').onChange(() => {
            scene.humerusClusterNoSTA.visible = scene.humerusClusterNoSTAVisible &&  scene.humerusClusterNoSTA.dataVisible;
        });
        markerClustersFolder.add(scene,'humerusClusterVisible').name('Humerus Cluster').onChange(() => {
            scene.humerusCluster.visible = scene.humerusClusterVisible &&  scene.humerusCluster.dataVisible;
        });
        markerClustersFolder.add(scene,'scapulaClusterNoSTAVisible').name('No STA Scapula Cluster').onChange(() => {
            scene.scapulaClusterNoSTA.visible = scene.scapulaClusterNoSTAVisible &&  scene.scapulaClusterNoSTA.dataVisible;
        });
        markerClustersFolder.add(scene,'scapulaClusterVisible').name('Scapula Cluster').onChange(() => {
            scene.scapulaCluster.visible = scene.scapulaClusterVisible &&  scene.scapulaCluster.dataVisible;
        });
    });
}