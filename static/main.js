import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { onMouseClick, updatePositions, addPlanets, addStars, configureControls, updatePlanetTraces } from './js/objectsFunctions.js'

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
export const controls = new OrbitControls(camera, renderer.domElement);

camera.position.y = 50;
camera.position.z = 150;
configureControls(scene);
addStars(scene);
addPlanets(scene);
window.addEventListener('click', onMouseClick, false);
const lightAmbient = new THREE.AmbientLight(0x222222, 2); 
scene.add(lightAmbient);

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    updatePositions();
    updatePlanetTraces();  // Обновляем следы планет
    renderer.render(scene, camera);
}

animate();
