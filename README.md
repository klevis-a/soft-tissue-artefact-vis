This JavaScript application enables biomechanics researchers to visualize soft tissue artefact of the humerus and scapula. It is built on top of [three.js](https://threejs.org/), a JavaScript 3D library. Although presently this application is specialized for visualizing humerus and scapula soft tissue artefact, it should be easy to extend this functionality to other body segments.

Checkout the [live code demo](https://shouldervis.chpc.utah.edu/stavis/main.html) currently hosted at the [University of Utah Center for High Performance Computing](https://www.chpc.utah.edu/).

### Installation

##### Clone repository
```
git clone https://github.com/klevis-a/soft-tissue-artefact-vis.git
cd soft-tissue-artefact-vis
```

##### Download code dependencies and data repository

###### Windows
```
downloadDeps.bat
downloadData.bat
```

###### Linux
```
./downloadDeps.sh
./downloadData.sh
```

##### Start web server

The Python 3 Simple HTTP server is utilized below, but any web server will work.

###### Windows
```
python -m http.server
```

###### Linux
```
python3 -m http.server
```

##### Access web application

The main access point is: [http://localhost:8000/main.html](http://localhost:8000/main.html) - which presents an interface for selecting a trial to visualize.

[http://localhost:8000/single.html](http://localhost:8000/single.html) provides the same visualization as the main interface but the trial is hard-coded. This access point is largely superseded by the main interface above, but I left it here because it might be useful when extending this application to other body segments.

[http://localhost:8000/debug.html](http://localhost:8000/debug.html) provides visualization of a single hard-coded trial but also enables debugging of the three.js scene. This access points allows visualization of the three.js scene elements such as cameras, lights, and bounding boxes.