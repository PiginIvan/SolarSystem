import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { onMouseClick, updatePositions, addPlanets, addStars, configureControls, updatePlanetTraces } from './js/objectsFunctions.js'
import { Mercury } from './js/planets/mercury.js';
import { Venus } from './js/planets/venus.js';
import { Earth } from './js/planets/earth.js';
import { Mars } from './js/planets/mars.js';
import { Jupiter } from './js/planets/jupiter.js';
import { Saturn } from './js/planets/saturn.js';
import { Uranus } from './js/planets/uranus.js';
import { Neptune } from './js/planets/neptune.js';
import { Pluto } from './js/planets/pluto.js';


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
const searchIcon = document.getElementById("search-icon");
const searchMenu = document.getElementById("search-menu");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Список планет
const planets = {
    "Mercury": Mercury.mesh,
    "Venus": Venus.mesh,
    "Earth": Earth.mesh,
    "Mars": Mars.mesh,
    "Jupiter": Jupiter.mesh,
    "Saturn": Saturn.mesh,
    "Uranus": Uranus.mesh,
    "Neptune": Neptune.mesh,
    "Pluto": Pluto.mesh
};

// Показать/скрыть меню поиска
// searchIcon.addEventListener("click", () => {
//     console.log("1");
//     searchMenu.classList.toggle("hidden");
//     searchInput.value = "";
//     searchResults.innerHTML = "";
// });

// Поиск по названию планеты
// searchInput.addEventListener("input", () => {
//     const query = searchInput.value.toLowerCase();
//     searchResults.innerHTML = "";
    
//     if (query === "") return;

//     Object.keys(planets).forEach(planetName => {
//         if (planetName.toLowerCase().includes(query)) {
//             const li = document.createElement("li");
//             li.textContent = planetName;
//             li.addEventListener("click", () => moveCameraToPlanet(planetName));
//             searchResults.appendChild(li);
//         }
//     });
// });

// Функция перемещения камеры к планете
// function moveCameraToPlanet(planetName) {
//     const planetMesh = planets[planetName];
//     if (!planetMesh) return;

//     const planetPosition = new THREE.Vector3();
//     planetMesh.getWorldPosition(planetPosition);

//     const targetPosition = planetPosition.clone().add(new THREE.Vector3(0, 10, 30)); // Смещаем камеру вверх и назад

//     // Плавное движение камеры
//     new TWEEN.Tween(camera.position)
//         .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 2000)
//         .easing(TWEEN.Easing.Quadratic.Out)
//         .start();

//     // Направить камеру на планету
//     new TWEEN.Tween(controls.target)
//         .to({ x: planetPosition.x, y: planetPosition.y, z: planetPosition.z }, 2000)
//         .easing(TWEEN.Easing.Quadratic.Out)
//         .start();

//     searchMenu.classList.add("hidden"); // Скрываем меню поиска после выбора
// }



function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update(); 
    updatePositions();
    updatePlanetTraces(); 
    renderer.render(scene, camera);
}

animate();