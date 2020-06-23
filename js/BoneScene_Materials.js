import {BoneSceneFnc} from "./BoneSceneFnc.js";
import {MeshPhongMaterial} from "./vendor/three.js/build/three.module.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";

BoneSceneFnc.BLACK_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x000000});
BoneSceneFnc.RED_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xff0000, opacity: 0.7, transparent: true});
BoneSceneFnc.GREEN_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x00ff00, opacity: 0.7, transparent: true});
BoneSceneFnc.BLUE_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x0000ff, opacity: 0.7, transparent: true});
BoneSceneFnc.YELLOW_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xffff00, opacity: 0.7, transparent: true});
BoneSceneFnc.GRAY_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x787878});

BoneSceneFnc.RED_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xff0000, wireframe: true});
BoneSceneFnc.GREEN_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x00ff00, wireframe: true});
BoneSceneFnc.BLUE_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0x0000ff, wireframe: true});
BoneSceneFnc.YELLOW_NOSTA_MARKER_MATERIAL = new MeshPhongMaterial({color: 0xffff00, wireframe: true});

BoneSceneFnc.RED_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3});
BoneSceneFnc.GREEN_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3});
BoneSceneFnc.BLUE_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3});
BoneSceneFnc.YELLOW_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3});
BoneSceneFnc.BLACK_LINE_MATERIAL = new LineMaterial({color:0x000000, linewidth:3});

BoneSceneFnc.RED_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
BoneSceneFnc.GREEN_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
BoneSceneFnc.BLUE_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
BoneSceneFnc.YELLOW_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});