var container;
var camera, scene, renderer;
var controller;

var matrix, ray, reticle;
// * setup the scene.
init();

// * render loop.
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // * create a scene
    scene = new THREE.Scene();

    // * create a Perspective Camera.
    // TODO we need to know about params.
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    // * create a lite.
    // TODO we need to know about params and about this kind of lites.
    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // *******

    // * The WebGL renderer displays the scene using WebGL.
    // TODO we need to know about params and this settings.
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // *****
    // * add ARButton to the screen.
    document.body.appendChild(ARButton.createButton(renderer));

    // *******

    // * create Cylinder to the scene.
    // TODO we need to know about params.
    //var geometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
    var geometry = new THREE.SphereBufferGeometry( 0.1, 3, 3 ).translate(0, 0.1, 0);

    // * this function related to the ring.
    // TODO learn more about that and test it.
    function onSelect() {

        if (reticle.visible) {
            // * THREE.MeshPhongMaterial is a material for shiny surfaces with specular highlights.
            var material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.setFromMatrixPosition(reticle.matrix);
            mesh.scale.y = Math.random() * 2 + 1;
            scene.add(mesh);

        }

    }

    // * .xr provides access to the WebXR related interface of the renderer.
    // TODO test this on mobile phone and log the resulte.
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // * a class representing a 4x4 matrix.
    matrix = new THREE.Matrix4();

    // * a ray that emits from an origin in a certain direction.
    ray = new THREE.Ray();

    // * the ring.
    // * THREE.Mesh is class representing triangular polygon mesh based objects.
    // * create the ring.
    // * THREE.MeshBasicMaterial is a material for drawing geometries in a simple shaded (flat or wireframe) way.
    // TODO we need to know about params.
    reticle = new THREE.Mesh(
        new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
        new THREE.MeshBasicMaterial()
    );

    // ! I did not see any thike about .matrixAutoUpdate.
    reticle.matrixAutoUpdate = false; 
    reticle.visible = false;
    scene.add(reticle);

    // ******

    // TODO know more about third param.
    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
    // * update every thike on resize.
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function animate() {
    // * the function will be called every available frame. If `null` is passed it will stop any already ongoing animation.
    // * a built in function that can be used instead of requestAnimationFrame. For WebXR projects this function must be used.
    // * it is a render loop.
    renderer.setAnimationLoop(render);

}
// * function to render evrythink to the scene.
function render(timestamp, frame) {

    // * the code here is from webXR device API.
    if (frame) {

        var referenceSpace = renderer.xr.getReferenceSpace();
        var session = renderer.xr.getSession();
        var pose = frame.getViewerPose(referenceSpace);

        if (pose) {

            matrix.fromArray(pose.transform.matrix);

            ray.origin.set(0, 0, 0);
            ray.direction.set(0, 0, - 1);
            ray.applyMatrix4(matrix);

            var xrRay = new XRRay(ray.origin, ray.direction);

            session.requestHitTest(xrRay, referenceSpace)
                .then(function (results) {

                    if (results.length) {

                        var hitResult = results[0];

                        reticle.visible = true;
                        reticle.matrix.fromArray(hitResult.hitMatrix);

                    } else {

                        reticle.visible = false;

                    }

                });

        }

    }

    // * very first render.
    renderer.render(scene, camera);

}