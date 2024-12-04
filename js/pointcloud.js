gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('threejs-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

const pointCount = 1000;
const positions = new Float32Array(pointCount * 3);
const originalPositions = new Float32Array(pointCount * 3);

for (let i = 0; i < pointCount; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;

    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;

    positions[i * 3] = x * 0.1;
    positions[i * 3 + 1] = y * 0.1;
    positions[i * 3 + 2] = z * 0.1;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const circleTexture = new THREE.TextureLoader().load('assets/circle.png');
const squareTexture = new THREE.TextureLoader().load('assets/square.png');

const material = new THREE.PointsMaterial({
    size: 0.1,
    color: new THREE.Color(0x0077ff),
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    map: circleTexture,
});
material.alphaTest = 0.5;

const pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);

camera.position.z = 5;

function onWindowResize() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onWindowResize);

let rotationSpeedY = 0.001;
let rotationSpeedX = 0.0005;

function animate() {
    requestAnimationFrame(animate);

    pointCloud.rotation.y += rotationSpeedY;
    pointCloud.rotation.x += rotationSpeedX;

    renderer.render(scene, camera);
}
animate();

gsap.to(material.color, {
    r: 0.3,
    g: 1,
    b: 0,
    scrollTrigger: {
        trigger: '#training',
        start: 'top 75%',
        end: 'top 25%',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            if (progress > 0.5) {
                material.map = squareTexture;
            } else {
                material.map = circleTexture;
            }
            material.needsUpdate = true;
        },
    },
});

gsap.to(geometry.attributes.position.array, {
    endArray: originalPositions,
    onUpdate: () => {
        geometry.attributes.position.needsUpdate = true;
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