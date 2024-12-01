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
    const x = (Math.random() - 0.5) * 10; // x coordinate
    const y = (Math.random() - 0.5) * 10; // y coordinate
    const z = (Math.random() - 0.5) * 10; // z coordinate

    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;

    positions[i * 3] = x * 0.1; // Initially scale down positions
    positions[i * 3 + 1] = y * 0.1;
    positions[i * 3 + 2] = z * 0.1;
}

// Create a buffer geometry to hold the points
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Load textures from assets
const circleTexture = new THREE.TextureLoader().load('assets/circle.png'); // Circle texture
const squareTexture = new THREE.TextureLoader().load('assets/square.png'); // Square texture

// Create a material for the points (circles by default)
const material = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x0077ff,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    map: circleTexture, // Start with the circle texture
});
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
let rotationSpeedY = 0.001; // Initial Y-axis rotation speed
let rotationSpeedX = 0.0005; // Initial X-axis rotation speed

function animate() {
    requestAnimationFrame(animate);

    pointCloud.rotation.y += rotationSpeedY; // Rotate on Y-axis
    pointCloud.rotation.x += rotationSpeedX; // Slight rotation on X-axis

    renderer.render(scene, camera);
}
animate();

// GSAP animation to toggle between circle and square textures
gsap.to({}, {
    scrollTrigger: {
        trigger: '#training', // Trigger on the training section
        start: 'top 75%', // Start when #training is 75% in the viewport
        end: 'top 25%', // End when #training is 25% in the viewport
        scrub: true, // Smoothly ties animation to scroll progress
        onUpdate: (self) => {
            const progress = self.progress; // Scroll progress between 0 and 1
            if (progress > 0.5) {
                material.color.set(0x00ff00); // Change color to green
                material.map = squareTexture; // Use square texture
            } else {
                material.color.set(0x0077ff); // Change color back to blue
                material.map = circleTexture; // Use circle texture
            }
            material.needsUpdate = true; // Ensure material updates in the scene
        },
    },
});

// GSAP animation for point cloud spread
gsap.to(geometry.attributes.position.array, {
    endArray: originalPositions,
    onUpdate: () => {
        geometry.attributes.position.needsUpdate = true; // Notify Three.js of position updates
    },
    ease: 'power2.out',
    duration: 2,
    scrollTrigger: {
        trigger: '#info',
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: true,
    },
});

// GSAP scroll animation for the point cloud's spin speed
gsap.to({}, {
    ease: 'power2.out',
    duration: 1,
    scrollTrigger: {
        trigger: '#info',
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            rotationSpeedY = 0.0016 - progress * 0.0015;
            rotationSpeedX = 0.001 - progress * 0.00085;
        },
    },
});

// GSAP camera zoom animation
gsap.to(camera.position, {
    z: 2,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#info',
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: true,
    },
});
