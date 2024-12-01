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
    camera.position.z = 100;
    camera.position.y = 50;
    camera.position.x = -80; // Start position for animation

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
    const targetX = 0;
    const targetY = 0;
    const targetZ = 0;
    camera.lookAt(targetX, targetY, targetZ);
    controls.target.set(targetX, targetY, targetZ);

    // Create a shared material for boxes
    const sharedMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0077ff), // Blue color
        metalness: 0,
        roughness: 0.1,
        transmission: 0.5, // Add transparency
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0,
        reflectivity: 3,
        depthWrite: false, // Prevent writing to the depth buffer
    });
    

    // Create a grid of boxes
    const rows = 5;
    const cols = 1;
    const boxWidth = 0;
    const boxHeight = 10;
    const boxDepth = 10;
    const spacingRow = 1.4;
    const spacingColumn = 12;

    const boxes = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
            const box = new THREE.Mesh(geometry, sharedMaterial.clone());

            // Position the boxes in a grid
            box.position.x = i * spacingRow - (rows * spacingRow) / 2 + spacingRow / 2;
            box.position.y = 0;
            box.position.z = j * spacingColumn - (cols * spacingColumn) / 2 + spacingColumn / 2;

            scene.add(box);
            boxes.push(box);
        }
    }

    // Add an area light on top of the boxes
    const lightWidth = (rows * spacingRow + 50);
    const lightHeight = (cols * spacingColumn + 50);
    const areaLight = new THREE.RectAreaLight(0xffffff, 15, lightWidth, lightHeight);
    areaLight.position.set(0, 60, 0);
    areaLight.lookAt(0, 0, 0);
    scene.add(areaLight);

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedBox = null;
    let previousIntersectedBox = null;

    function onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(boxes);

        if (intersects.length > 0) {
            intersectedBox = intersects[0].object;
        } else {
            intersectedBox = null;
        }

        // Only update animations if the intersected box has changed
        if (intersectedBox !== previousIntersectedBox) {
            // Reset previous animations
            boxes.forEach(box => {
                gsap.to(box.position, { y: 0, duration: 0.5, ease: "power1.out" });
            });

            if (intersectedBox) {
                const hoveredBoxIndex = boxes.indexOf(intersectedBox);

                // Move the hovered box up
                gsap.to(intersectedBox.position, { y: 9, duration: 0.5, ease: "power1.out", onComplete: () => {
                    if (intersectedBox) {
                        // Make the camera look at the hovered box with a fixed Y position
                        gsap.to(controls.target, { 
                            x: intersectedBox.position.x, 
                            y: 8, // Fixed Y position
                            z: intersectedBox.position.z, 
                            duration: 0.5, 
                            ease: "power1.out", 
                            onUpdate: () => {
                                camera.lookAt(controls.target);
                                controls.update();
                            }
                        });
                    }
                }});

                // Move top and bottom neighboring boxes up slightly
                if (hoveredBoxIndex >= 0) {
                    const { firstLevelNeighbors, secondLevelNeighbors } = getTopBottomNeighborsAndNext(hoveredBoxIndex, rows, cols);

                    firstLevelNeighbors.forEach(index => {
                        gsap.to(boxes[index].position, { y: 3, duration: 0.5, ease: "power1.out" });
                    });

                    secondLevelNeighbors.forEach(index => {
                        gsap.to(boxes[index].position, { y: 2, duration: 0.5, ease: "power1.out" });
                    });
                }
            }

            previousIntersectedBox = intersectedBox;
        }
    }

    function getTopBottomNeighborsAndNext(index, rows, cols) {
        const firstLevelNeighbors = [];
        const secondLevelNeighbors = [];
        const row = Math.floor(index / cols);

        // Check top neighbor
        if (row > 0) {
            firstLevelNeighbors.push(index - cols);
            if (row > 1) {
                secondLevelNeighbors.push(index - 2 * cols);
            }
        }

        // Check bottom neighbor
        if (row < rows - 1) {
            firstLevelNeighbors.push(index + cols);
            if (row < rows - 2) {
                secondLevelNeighbors.push(index + 2 * cols);
            }
        }

        return { firstLevelNeighbors, secondLevelNeighbors };
    }

    window.addEventListener('mousemove', onMouseMove, false);

    // Render loop
    const animate = function () {
        requestAnimationFrame(animate);

        // Update controls
        controls.update();

        renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;

        // Update camera parameters
        camera.left = (frustumSize * aspect) / -2;
        camera.right = (frustumSize * aspect) / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    });
});
