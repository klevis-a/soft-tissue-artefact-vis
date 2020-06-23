import {BoneSceneFnc} from "./BoneSceneFnc.js";
import {LineMaterial} from "./vendor/three.js/examples/jsm/lines/LineMaterial.js";



BoneSceneFnc.RED_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xff0000, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
BoneSceneFnc.GREEN_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x00ff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
BoneSceneFnc.BLUE_NOSTA_LINE_MATERIAL = new LineMaterial({color:0x0000ff, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
BoneSceneFnc.YELLOW_NOSTA_LINE_MATERIAL = new LineMaterial({color:0xffff00, linewidth:3, dashed:true, dashSize: 3, gapSize: 1, dashScale: 1});
