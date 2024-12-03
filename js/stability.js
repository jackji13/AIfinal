document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('model-container');

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 0, 5); // Adjust camera position for a better view
    camera.lookAt(0, 0, 0);

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Create the material
    const sharedMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0077ff),
        metalness: 0,
        roughness: 0.1,
        transmission: 0.3,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0,
        reflectivity: 3,
        depthWrite: false
    });

    // Load the GLTF model
    const loader = new THREE.GLTFLoader();
    let mixer; // Animation mixer

    loader.load(
        './assets/stability.gltf',
        (gltf) => {
            const model = gltf.scene;

            // Apply the sharedMaterial to all meshes in the model
            model.traverse((node) => {
                if (node.isMesh) {
                    node.material = sharedMaterial;
                }
            });

            scene.add(model);

            // Check if the model has animations
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the GLTF model:', error);
        }
    );

    // Handle window resizing
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if (mixer) {
            mixer.update(delta); // Update animations
        }

        renderer.render(scene, camera);
    }

    animate();
});
