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


// Функция для создания карточки планеты
function createPlanetCard(planetName) {
    const li = document.createElement("li");
    li.classList.add("planet-card");

    li.setAttribute("data-name-rus", getPlanetNameRus(planetName));
    li.setAttribute("data-name-eng", planetName);

    const img = document.createElement("img");
    img.src = `/static/img/discoverButton-icons/${planetName.toLowerCase()}.png`;
    img.classList.add("planet-card-img");

    const textDiv = document.createElement("div");
    textDiv.classList.add("planet-card-text");
    textDiv.textContent = getPlanetNameRus(planetName);

    li.appendChild(img);
    li.appendChild(textDiv);

    li.addEventListener("click", () => moveCameraToPlanet(planetName));

    return li;
}

// Функция для отображения всех карточек
function showAllPlanets() {
    searchResults.innerHTML = "";

    Object.keys(planets).forEach(planetName => {
        const card = createPlanetCard(planetName);
        searchResults.appendChild(card);
    });
}

// Функция для поиска планет
function searchPlanets(query) {
    searchResults.innerHTML = "";

    Object.keys(planets).forEach(planetName => {
        const planetNameLower = planetName.toLowerCase();
        const planetNameRus = getPlanetNameRus(planetName).toLowerCase();

        if (query === "" || planetNameLower.includes(query) || planetNameRus.includes(query)) {
            const card = createPlanetCard(planetName);
            searchResults.appendChild(card);
        }
    });
}

// Обработчик ввода в поле поиска
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    searchPlanets(query);
});

showAllPlanets();

// Функция для получения русского названия планеты
function getPlanetNameRus(planetNameEng) {
    const planetNames = {
        "Mercury": "Меркурий",
        "Venus": "Венера",
        "Earth": "Земля",
        "Mars": "Марс",
        "Jupiter": "Юпитер",
        "Saturn": "Сатурн",
        "Uranus": "Уран",
        "Neptune": "Нептун",
        "Pluto": "Плутон"
    };

    return planetNames[planetNameEng] || planetNameEng;
}

function moveCameraToPlanet(planetName) {
    console.log(planetName);
    const planetMesh = planets[planetName];
    if (!planetMesh) return;

    const planetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(planetPosition);

    const targetPosition = planetPosition.clone().add(new THREE.Vector3(0, 10, 30));

    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(controls.target)
        .to({ x: planetPosition.x, y: planetPosition.y, z: planetPosition.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    searchMenu.classList.add("hidden");
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update(); 
    updatePositions();
    updatePlanetTraces(); 
    renderer.render(scene, camera);
}

animate();