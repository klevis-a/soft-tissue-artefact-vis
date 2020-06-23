'use strict';

import {updateSpotLight, updateDirectionalLight} from "./SceneHelpers.js";

export function createSpotLightFolder(gui, spotLightName, spotlight, spotlightHelper) {
    const spotlightUpdater = updateSpotLight.bind(null, spotlight, spotlightHelper);
    const spotlightFolder = gui.addFolder(spotLightName);
    spotlightFolder.add(spotlight, 'visible');
    spotlightFolder.add(spotlight, 'intensity', 0, 2);
    spotlightFolder.add(spotlight, 'distance', spotlight.distance - Math.abs(spotlight.distance/2),
        spotlight.distance + Math.abs(spotlight.distance/2)).onChange(spotlightUpdater);
    spotlightFolder.add(spotlight, 'angle', 0, Math.PI/2).onChange(spotlightUpdater);
    spotlightFolder.add(spotlight, 'penumbra', 0, 1);
    spotlightFolder.add(spotlight, 'decay', 0, 2);
    const spotlightFolderPos = spotlightFolder.addFolder('Position');
    addVectorGUI(spotlightFolderPos, spotlight.position, spotlightUpdater);
    const spotlightFolderTarget = spotlightFolder.addFolder('Target');
    addVectorGUI(spotlightFolderTarget, spotlight.target.position, spotlightUpdater);
}

export function createDirectionalLightFolder(gui, directionalLightName, directionalLight, directionalLightHelper) {
    const directionalLightUpdater = updateDirectionalLight.bind(null, directionalLight, directionalLightHelper);
    const directionalLightFolder = gui.addFolder(directionalLightName);
    directionalLightFolder.add(directionalLight, 'visible');
    directionalLightFolder.add(directionalLight, 'intensity', 0, 2);
    const directionalLightFolderPos = directionalLightFolder.addFolder('Position');
    addVectorGUI(directionalLightFolderPos, directionalLight.position, directionalLightUpdater);
    const directionalLightFolderTarget = directionalLightFolder.addFolder('Target');
    addVectorGUI(directionalLightFolderTarget, directionalLight.target.position, directionalLightUpdater);
}

export function createHemisphereLightFolder(gui, hemisphereLightName, hemisphereLight) {
    const hemisphereLightFolder = gui.addFolder(hemisphereLightName);
    hemisphereLightFolder.add(hemisphereLight, 'visible');
    hemisphereLightFolder.add(hemisphereLight, 'intensity', 0, 2);
}

export function addVectorGUI(gui, vector3, onChangeFn)
{
    gui.add(vector3, 'x', vector3.x - Math.abs(vector3.x/2), vector3.x + Math.abs(vector3.x/2)).onChange(onChangeFn);
    gui.add(vector3, 'y', vector3.y - Math.abs(vector3.y/2), vector3.y + Math.abs(vector3.y/2)).onChange(onChangeFn);
    gui.add(vector3, 'z', vector3.z - Math.abs(vector3.z/2), vector3.z + Math.abs(vector3.z/2)).onChange(onChangeFn);
}
