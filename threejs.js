// Ensure GSAP's ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

// Select the container element
const container = document.getElementById('threejs-container');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable transparency
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio); // For high-resolution displays
renderer.setClearColor(0x000000, 0); // Transparent background
container.appendChild(renderer.domElement);

// Create a point cloud
const pointCount = 1000; // Number of points in the cloud
const positions = new Float32Array(pointCount * 3); // Array to hold x, y, z coordinates
const originalPositions = new Float32Array(pointCount * 3); // To save original positions for animation

for (let i = 0; i < pointCount; i++) {
    // Randomly spread points across a large space
    const x = (Math.random() - 0.5) * 10; // x coordinate
    const y = (Math.random() - 0.5) * 10; // y coordinate
    const z = (Math.random() - 0.5) * 10; // z coordinate

    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;

    // Start with points clustered at the center
    positions[i * 3] = x * 0.1; // Initially scale down positions
    positions[i * 3 + 1] = y * 0.1;
    positions[i * 3 + 2] = z * 0.1;
}

// Create a buffer geometry to hold the points
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create a material for the points (circles)
const material = new THREE.PointsMaterial({
    size: 0.1, // Size of each point
    color: 0x0077ff,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true, // Enables size attenuation for perspective
});
material.map = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/circle.png');
material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
material.map.repeat.set(1, 1);
material.alphaTest = 0.5; // Avoid transparency issues

// Create the point cloud
const pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);

// Position the camera
camera.position.z = 5;

// Handle window resizing
function onWindowResize() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize);

// Animation loop
// Define rotation speed variables
let rotationSpeedY = 0.001; // Initial Y-axis rotation speed
let rotationSpeedX = 0.0005; // Initial X-axis rotation speed

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Apply dynamic rotation speeds
    pointCloud.rotation.y += rotationSpeedY; // Rotate on Y-axis
    pointCloud.rotation.x += rotationSpeedX; // Slight rotation on X-axis

    renderer.render(scene, camera);
}
animate();

// GSAP scroll animation for the point cloud's spin speed
gsap.to({}, {
    ease: 'power2.out', // Smooth easing effect
    duration: 1, // Adjustable duration for smoother transition
    onUpdate: function () {
        // Dynamically update rotation speeds
        rotationSpeedY = gsap.getProperty(this.targets()[0], "rotationSpeedY");
        rotationSpeedX = gsap.getProperty(this.targets()[0], "rotationSpeedX");
    },
    scrollTrigger: {
        trigger: '#info', // Trigger animation on the intro section
        start: 'top 80%', // Start when the intro's top reaches near the bottom of the viewport
        end: 'top 40%', // End when the intro is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
        onUpdate: (self) => {
            // Map scroll progress to rotation speed values
            const progress = self.progress; // Progress is between 0 and 1
            rotationSpeedY = 0.0016 - progress * 0.0014; // Decrease speed along Y-axis
            rotationSpeedX = 0.001 - progress * 0.0008; // Decrease speed along X-axis
        },
    },
});

// GSAP scroll animation for the point cloud, controlling point distance
gsap.to(geometry.attributes.position.array, {
    endArray: originalPositions, // End positions: spread out points
    onUpdate: () => {
        geometry.attributes.position.needsUpdate = true; // Notify Three.js of position updates
    },
    ease: 'power2.out', // Smooth easing effect
    duration: 2, // Duration of the transition
    scrollTrigger: {
        trigger: '#info', // Trigger animation on the intro section
        start: 'top 80%', // Start when the intro's top reaches near the bottom of the viewport
        end: 'bottom bottom', // End when the intro is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});

// GSAP camera zoom animation
gsap.to(camera.position, {
    z: 2, // Zoom in closer to the point cloud
    ease: 'power2.out', // Smooth easing effect
    scrollTrigger: {
        trigger: '#info', // Trigger animation on the intro section
        start: 'top 80%', // Start when the intro's top reaches near the bottom of the viewport
        end: 'bottom bottom', // End when the intro is fully out of view
        scrub: true, // Smooth animation tied to scroll progress
    },
});
