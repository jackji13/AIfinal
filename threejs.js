// Select the container element
const container = document.getElementById('threejs-container');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Add a rotating cube to represent the "black box"
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Resize the renderer on window resize
window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// GSAP scroll animation
gsap.to(cube.rotation, {
    x: Math.PI * 4, // Rotate 4 full turns on the X-axis
    y: Math.PI * 4, // Rotate 4 full turns on the Y-axis
    scrollTrigger: {
        trigger: '#visualization',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true, // Smooth animation tied to scroll progress
    },
});

// Add lighting for better visuals
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);
