import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; 
controls.dampingFactor = 0.05; 
controls.enablePan = true; 
controls.enableZoom = true; 
controls.minDistance = 20; 
controls.maxDistance = 200; 
controls.maxPolarAngle = Math.PI; 
controls.minPolarAngle = 0; 

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);


const numStars = 1000;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array(numStars * 3);
const starsColors = new Float32Array(numStars * 3);

for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    const size = Math.random() * 2 + 0.5;

    starsPositions.set([x, y, z], i * 3);

    const color = new THREE.Color(0xffffff);
    starsColors.set([color.r, color.g, color.b], i * 3);

}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

const starsMaterial = new THREE.PointsMaterial({ size: 2, vertexColors: true });
const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

const sunGeometry = new THREE.SphereGeometry(10, 32, 16); // РАДИУС СОЛНЦА
const textureLoader = new TextureLoader();

const sunTexture = textureLoader.load('/static/img/planetMaps/sun-map.jpg'); 
const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    emissive: new THREE.Color('#FFA500'), 
    emissiveIntensity: 0.3,           
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0); 
scene.add(sun);


camera.position.y = 100;

const earthGeometry = new THREE.SphereGeometry(2, 32, 16); // РАДИУС ЗЕМЛИ

const earthTexture = textureLoader.load('/static/img/planetMaps/earth-map.jpg'); 
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.name = 'Earth';
earth.position.set(30, 0, 0); // ПОЗИЦИЯ ЗЕМЛИ
scene.add(earth);

let earthVelocity = new THREE.Vector3(0, 1.25, 0); // СКОРОСТЬ ЗЕМЛИ


// Юпитер
const jupiterGeometry = new THREE.SphereGeometry(5, 32, 16); // РАДИУС ЮПИТЕРА
const jupiterTexture = textureLoader.load('/static/img/planetMaps/jupiter-map.jpg');

const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.name = 'Jupiter';
jupiter.position.set(50, 0, 0); // ПОЗИЦИЯ ЮПИТЕРА
scene.add(jupiter);

let jupiterVelocity = new THREE.Vector3(0, 0.88, 0); // СКОРОСТЬ ЮПИТЕРА

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const selectedObjectInfo = document.getElementById('planet-info');

function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([earth, jupiter]);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;


        showButton();
        loadHtml(selectedObject.name);
    }

    
}

window.addEventListener('click', onMouseClick, false);

function updatePositions() {
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bodies: [
                { mass: 1.0, position: [0, 0, 0], velocity: [0, 0, 0] },
                // МАССА ЗЕМЛИ
                { mass: 3.003e-6, position: [earth.position.x, earth.position.y, earth.position.z], velocity: [earthVelocity.x, earthVelocity.y, earthVelocity.z] },
                // МАССА ЮПИТЕРА
                { mass: 9.546e-4, position: [jupiter.position.x, jupiter.position.y, jupiter.position.z], velocity: [jupiterVelocity.x, jupiterVelocity.y, jupiterVelocity.z] }
            ],
            time_step: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        const updatedBodies = data.bodies;
        const updatedEarth = updatedBodies[1];
        const updatedJupiter = updatedBodies[2];
        earth.position.set(updatedEarth.position[0], updatedEarth.position[1], updatedEarth.position[2]);
        earthVelocity.set(updatedEarth.velocity[0], updatedEarth.velocity[1], updatedEarth.velocity[2]);
        jupiter.position.set(updatedJupiter.position[0], updatedJupiter.position[1], updatedJupiter.position[2]);
        jupiterVelocity.set(updatedJupiter.velocity[0], updatedJupiter.velocity[1], updatedJupiter.velocity[2]);
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    updatePositions();
    renderer.render(scene, camera);
}

animate();
