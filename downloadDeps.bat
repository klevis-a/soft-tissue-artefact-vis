mkdir js\vendor
mkdir js\vendor\three.js
mkdir js\vendor\three.js\build
mkdir js\vendor\three.js\examples
mkdir js\vendor\three.js\examples\jsm
mkdir js\vendor\three.js\examples\jsm\controls
mkdir js\vendor\three.js\examples\jsm\lines
mkdir js\vendor\three.js\examples\jsm\loaders
mkdir js\vendor\three.js\examples\jsm\libs
curl https://cdn.jsdelivr.net/npm/papaparse@5.3.0/papaparse.min.js --output js\vendor\papaparse.min.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/build/three.module.js --output js\vendor\three.js\build\three.module.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/controls/TrackballControls.js --output js\vendor\three.js\examples\jsm\controls\TrackballControls.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/lines/LineGeometry.js --output js\vendor\three.js\examples\jsm\lines\LineGeometry.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/lines/LineSegmentsGeometry.js --output js\vendor\three.js\examples\jsm\lines\LineSegmentsGeometry.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/lines/Line2.js --output js\vendor\three.js\examples\jsm\lines\Line2.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/lines/LineSegments2.js --output js\vendor\three.js\examples\jsm\lines\LineSegments2.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/lines/LineMaterial.js --output js\vendor\three.js\examples\jsm\lines\LineMaterial.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/loaders/STLLoader.js --output js\vendor\three.js\examples\jsm\loaders\STLLoader.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/libs/dat.gui.module.js --output js\vendor\three.js\examples\jsm\libs\dat.gui.module.js
curl https://cdn.jsdelivr.net/npm/three@0.116.0/examples/jsm/libs/stats.module.js --output js\vendor\three.js\examples\jsm\libs\stats.module.js
