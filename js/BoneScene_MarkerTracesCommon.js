export function enableMarkerTracesGUI(boneScene) {
    boneScene.addEventListener('gui', function (event) {
        const scene = event.target;
        const gui = event.gui;

        const viconMarkerTracesFolder = gui.addFolder('Vicon Marker Traces Visibility');
        for (const segmentName in scene.viconMarkerTraces.Lines) {
            for (const markerName in scene.viconMarkerTraces.Lines[segmentName]) {
                viconMarkerTracesFolder.add(scene.viconMarkerTraces.Lines[segmentName][markerName],'visible').name(markerName).onChange((val) => {
                    scene.noSTAMarkerTraces.Lines[segmentName][markerName].visible = val;
                })
            }
        }
    });
}
