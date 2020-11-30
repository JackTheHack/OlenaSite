$(document).ready(function () {
    console.log("Initializing 3D animation...");
    initializeAnimation();
    console.log("Started animation...");
});

function initializeAnimation() {
    var canvas = document.querySelector('#scene');
    var heroAreaSection = document.querySelector("#heroAreaSection")
    var width = heroAreaSection.clientHeight,
        height = heroAreaSection.clientHeight;

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0x41228e);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);

    if (heroAreaSection.clientWidth > 992) {
        camera.position.set(100, -100, 200);
    } else {
        camera.position.set(-100, 100, 200);
    }

    var light = new THREE.HemisphereLight(0xffffff, 0x301867, 0.6);
    scene.add(light);

    var light = new THREE.DirectionalLight(0x301867, 0.5);
    light.position.set(200, 300, 400);
    scene.add(light);
    var light2 = light.clone();
    light2.position.set(-200, 300, 400);
    scene.add(light2);

    var geometry = new THREE.IcosahedronGeometry(120, 6);
    for (var i = 0; i < geometry.vertices.length; i++) {
        var vector = geometry.vertices[i];
        vector._o = vector.clone();
    }
    var material = new THREE.MeshPhongMaterial({
        emissive: 0x1d4f96,
        emissiveIntensity: 0.4,
        shininess: 0
    });
    var shape = new THREE.Mesh(geometry, material);
    shape.position.set(0, 0, 0);
    scene.add(shape);

    function updateVertices(a) {
        for (var i = 0; i < geometry.vertices.length; i++) {
            var vector = geometry.vertices[i];
            vector.copy(vector._o);
            var perlin = noise.simplex3(
                (vector.x * 0.006) + (a * 0.0002),
                (vector.y * 0.006) + (a * 0.0003),
                (vector.z * 0.006)
            );
            var ratio = ((perlin * 0.4 * (mouse.y + 0.1)) + 0.8);
            vector.multiplyScalar(ratio);
        }
        geometry.verticesNeedUpdate = true;
    }

    function render(a) {
        requestAnimationFrame(render);
        updateVertices(a);
        renderer.render(scene, camera);
    }

    function onResize() {
        canvas.style.width = '';
        canvas.style.height = '';
        width = heroAreaSection.clientHeight;
        height = heroAreaSection.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        if (heroAreaSection.clientWidth > 992) {
            camera.position.set(100, -100, 200);
        } else {
            camera.position.set(-100, 100, 200);
        }


        renderer.setSize(width, height);
    }

    var mouse = new THREE.Vector2(0.8, 0.5);

    function onMouseMove(e) {
        TweenMax.to(mouse, 0.8, {
            y: (e.clientY / height),
            x: (e.clientX / width),
            ease: Power1.easeOut
        });
    }

    requestAnimationFrame(render);
    window.addEventListener("mousemove", onMouseMove);
    var resizeTm;
    window.addEventListener("resize", function () {
        resizeTm = clearTimeout(resizeTm);
        resizeTm = setTimeout(onResize, 200);
    });
}