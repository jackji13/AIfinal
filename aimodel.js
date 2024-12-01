document.addEventListener('DOMContentLoaded', () => {
    const sceneContainer = document.getElementById('aimodel-container');

    // Create a scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Create an orthographic camera
    const aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
    const frustumSize = 25;
    const camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, frustumSize * aspect / 2,
        frustumSize / 2, frustumSize / -2,
        0.1, 1000
    );
    camera.position.set(-80, 50, 100);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    sceneContainer.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;

    // Set the target for the camera and OrbitControls
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(defaultTarget);
    controls.target.copy(defaultTarget);

    // Create a shared material for boxes
    const sharedMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0077ff),
        metalness: 0,
        roughness: 0.1,
        transmission: 0.5,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0,
        reflectivity: 3,
        depthWrite: false
    });

    // Create a grid of boxes
    const rows = 4;
    const cols = 1;
    const boxWidth = 0;
    const boxHeight = 10;
    const boxDepth = 10;
    const spacingRow = 3;
    const spacingColumn = 12;

    const boxes = [];
    const textureLoader = new THREE.TextureLoader();
    const texturePaths = ['assets/gpt.png', 'assets/gemini.png', 'assets/stable.png', 'assets/runway.png'];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
            const material = sharedMaterial.clone();

            const box = new THREE.Mesh(geometry, material);

            // Load texture and apply as an overlay to a different face of the box
            textureLoader.load(texturePaths[i], (tex) => {
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.center.set(0.5, 0.5);
                tex.repeat.set(1, 1);

                const overlayMaterial = new THREE.MeshBasicMaterial({
                    map: tex,
                    transparent: true,
                    depthTest: false
                });

                // Set uniform height for all textures and calculate width based on aspect ratio
                const uniformHeight = 3.6;
                const aspectRatio = tex.image.width / tex.image.height;
                const overlayWidth = uniformHeight * aspectRatio;
                const overlayHeight = uniformHeight;

                const overlayGeometry = new THREE.PlaneGeometry(overlayWidth, overlayHeight);
                const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
                overlayMesh.position.set(boxWidth / 2 + 0.02, 0, 0);
                overlayMesh.rotation.y = -Math.PI / 2;
                box.add(overlayMesh);
            });

            // Position the boxes in a grid
            box.position.set(
                i * spacingRow - (rows * spacingRow) / 2 + spacingRow / 2,
                0,
                j * spacingColumn - (cols * spacingColumn) / 2 + spacingColumn / 2
            );

            scene.add(box);
            boxes.push(box);
        }
    }

    // Add an area light on top of the boxes
    const lightWidth = rows * spacingRow + 50;
    const lightHeight = cols * spacingColumn + 50;
    const areaLight = new THREE.RectAreaLight(0xffffff, 15, lightWidth, lightHeight);
    areaLight.position.set(0, 60, 0);
    areaLight.lookAt(0, 0, 0);
    scene.add(areaLight);

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedBox = null;
    let previousIntersectedBox = null;
    let resetCameraTimeout = null;

    function resetCameraToDefault() {
        if (!intersectedBox) {
            gsap.to(controls.target, {
                x: defaultTarget.x,
                y: defaultTarget.y,
                z: defaultTarget.z,
                duration: 1,
                ease: "power1.out",
                onUpdate: () => {
                    camera.lookAt(controls.target);
                    controls.update();
                }
            });
        }
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(boxes);

        intersectedBox = intersects.length > 0 ? intersects[0].object : null;

        if (intersectedBox !== previousIntersectedBox) {
            if (resetCameraTimeout) clearTimeout(resetCameraTimeout);

            boxes.forEach(box => {
                gsap.to(box.position, { y: 0, duration: 0.5, ease: "power1.out" });
            });

            if (intersectedBox) {
                const hoveredBoxIndex = boxes.indexOf(intersectedBox);

                gsap.to(intersectedBox.position, {
                    y: 9,
                    duration: 0.5,
                    ease: "power1.out",
                    onComplete: () => {
                        if (intersectedBox) {
                            gsap.to(controls.target, {
                                x: intersectedBox.position.x,
                                y: 8,
                                z: intersectedBox.position.z,
                                duration: 0.5,
                                ease: "power1.out",
                                onUpdate: () => {
                                    camera.lookAt(controls.target);
                                    controls.update();
                                }
                            });
                        }
                    }
                });

                if (hoveredBoxIndex >= 0) {
                    const { firstLevelNeighbors, secondLevelNeighbors } = getTopBottomNeighborsAndNext(hoveredBoxIndex, rows, cols);

                    firstLevelNeighbors.forEach(index => {
                        gsap.to(boxes[index].position, { y: 4, duration: 0.5, ease: "power1.out" });
                    });

                    secondLevelNeighbors.forEach(index => {
                        gsap.to(boxes[index].position, { y: 2, duration: 0.5, ease: "power1.out" });
                    });
                }
            }

            previousIntersectedBox = intersectedBox;
            resetCameraTimeout = setTimeout(resetCameraToDefault, 1000);
        }
    }

    function getTopBottomNeighborsAndNext(index, rows, cols) {
        const firstLevelNeighbors = [];
        const secondLevelNeighbors = [];
        const row = Math.floor(index / cols);

        if (row > 0) {
            firstLevelNeighbors.push(index - cols);
            if (row > 1) {
                secondLevelNeighbors.push(index - 2 * cols);
            }
        }

        if (row < rows - 1) {
            firstLevelNeighbors.push(index + cols);
            if (row < rows - 2) {
                secondLevelNeighbors.push(index + 2 * cols);
            }
        }

        return { firstLevelNeighbors, secondLevelNeighbors };
    }

    window.addEventListener('mousemove', onMouseMove, false);

    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;

        camera.left = (frustumSize * aspect) / -2;
        camera.right = (frustumSize * aspect) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });
});
