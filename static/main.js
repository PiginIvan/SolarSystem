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

const searchInput = document.getElementById("search__input");
const searchResults = document.getElementById("search__results");
const editorSearchInput = document.getElementById("editor__input");
const editorSearchResult = document.getElementById("editor__results");

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
export const controls = new OrbitControls(camera, renderer.domElement);

let followingPlanet = null; // Хранит текущую отслеживаемую планету
let offset = new THREE.Vector3(0, 10, 30); // Смещение камеры от планеты

camera.position.y = 50;
camera.position.z = 150;
configureControls(scene);
addStars(scene);
addPlanets(scene);
window.addEventListener('click', onMouseClick, false);
const lightAmbient = new THREE.AmbientLight(0x222222, 2); 
scene.add(lightAmbient);

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


// поиск---------------------------------------------------------------
function createPlanetCard(planetName) {
    const li = document.createElement("li");
    li.classList.add("planet-card");

    li.setAttribute("data-name_rus", getPlanetNameRus(planetName));
    li.setAttribute("data-name_eng", planetName);

    const img = document.createElement("img");
    img.src = `/static/img/explore-button__imgs/${planetName.toLowerCase()}.png`;
    img.classList.add("planet-card__img");

    const textDiv = document.createElement("div");
    textDiv.classList.add("planet-card__text");
    textDiv.textContent = getPlanetNameRus(planetName);

    li.appendChild(img);
    li.appendChild(textDiv);

    li.addEventListener("click", () => moveCameraToPlanet(planetName));

    return li;
}

function showAllPlanets() {
    searchResults.innerHTML = "";
    editorSearchResult.innerHTML = "";

    Object.keys(planets).forEach(planetName => {
        const card1 = createPlanetCard(planetName);
        const card2 = createPlanetCardEditor(planetName);
        searchResults.appendChild(card1);
        editorSearchResult.appendChild(card2);
    });
}

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

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    searchPlanets(query);
});

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

//камера---------------------------------------------------------------
export function moveCameraToPlanet(planetName) {

    const planetMesh = planets[planetName];
    if (!planetMesh) return;

    followingPlanet = planetMesh; // Устанавливаем текущую цель для слежения

    // Получаем текущую позицию планеты
    const planetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(planetPosition);


    // Вычисляем целевую позицию камеры
    const targetPosition = planetPosition.clone().add(offset);

    // Плавно перемещаем камеру в начальную точку слежения

    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            // Когда движение завершено, активируем слежение
            controls.enabled = false; // Отключаем ручное управление, чтобы камера следовала за планетой
        })
        .start();

    new TWEEN.Tween(controls.target)
        .to({ x: planetPosition.x, y: planetPosition.y, z: planetPosition.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

export function stopFollowingPlanet() {
    followingPlanet = null;
    controls.enabled = true; // Возвращаем управление пользователю
}

export function updateCameraFollow() {
    if (followingPlanet) {
        search.classList.add("hidden");
        const planetPosition = new THREE.Vector3();
        followingPlanet.getWorldPosition(planetPosition);
        camera.position.copy(planetPosition.clone().add(offset));
        controls.target.copy(planetPosition);
    }
}

//редактор---------------------------------------------------------------
function createPlanetCardEditor(planetName) {
    const li = document.createElement("li");
    li.classList.add("planet-card");

    li.setAttribute("data-name_rus", getPlanetNameRus(planetName));
    li.setAttribute("data-name_eng", planetName);

    const img = document.createElement("img");
    img.src = `/static/img/explore-button__imgs/${planetName.toLowerCase()}.png`;
    img.classList.add("planet-card__img");

    const textDiv = document.createElement("div");
    textDiv.classList.add("planet-card__text");
    textDiv.textContent = getPlanetNameRus(planetName);

    li.appendChild(img);
    li.appendChild(textDiv);

    li.addEventListener("click", () => toggleVisibilityEditorWindow());

    return li;
}

editorSearchInput.addEventListener("input", () => {
    const query = editorSearchInput.value.toLowerCase();
    searchPlanetsEditor(query);
});

function searchPlanetsEditor(query) {
    editorSearchResult.innerHTML = "";

    Object.keys(planets).forEach(planetName => {
        const planetNameLower = planetName.toLowerCase();
        const planetNameRus = getPlanetNameRus(planetName).toLowerCase();

        if (query === "" || planetNameLower.includes(query) || planetNameRus.includes(query)) {
            const card = createPlanetCardEditor(planetName);
            editorSearchResult.appendChild(card);
        }
    });
}

//чтобы работало---------------------------------------------------------------
function animate() {
    console.log(Earth.mass);
    // console.log(Mercury.velocity[0]);
    // console.log(Mercury.radius);
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    updatePositions(); //закомментить, когда буду делать редактор
    // if (!isPaused) {
    //     updatePositions();
    //     updatePlanetTraces(); 
    //     updateCameraFollow();
    // } 

    renderer.render(scene, camera);
}

showAllPlanets();
animate();
















// document.getElementById("toggle-editor").addEventListener("click", () => {
//     isPaused = !isPaused; 
//     const editorMenu = document.getElementById("editor-menu");
//     editorMenu.classList.toggle("hidden");

//     // Сбрасываем выбор планеты и очищаем поля ввода
//     document.getElementById("planet-select").value = "";
//     document.getElementById("mass-input").value = "";
//     document.getElementById("velocity-input").value = "";
//     document.getElementById("radius-input").value = "";
// });

// document.getElementById("editor__button").addEventListener("click", () => {
//     const planetName = document.getElementById("planet-select").value;
//     const mass = parseFloat(document.getElementById("mass-input").value);
//     const velocity = parseFloat(document.getElementById("velocity-input").value);
//     const radius = parseFloat(document.getElementById("radius-input").value);
  
//     if (planets[planetName]) {
//         Mercury.mass = mass;
//         Mercury.velocity[0] = velocity; 
//         Mercury.mesh.scale.set(radius, radius, radius);
//     }
// });

// document.getElementById("planet-select").addEventListener("change", (event) => {
//     const planetName = event.target.value;
//     if (planets[planetName]) {
//         document.getElementById("mass-input").value = Mercury.mass;
//         document.getElementById("velocity-input").value = Mercury.velocity[0];
//         document.getElementById("radius-input").value = Mercury.mesh.scale.x;
//     }
// });

// let isPaused = false;

// document.getElementById("pause-btn").addEventListener("click", () => {
//     isPaused = !isPaused; 
//     document.getElementById("pause-btn").innerText = isPaused ? "Resume" : "Pause";
// });