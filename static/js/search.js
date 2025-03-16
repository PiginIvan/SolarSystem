import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { controls, camera, planets } from '../main.js';

const search = document.getElementById("search-wrapper");
const searchInput = document.getElementById("search__input");
const searchResults = document.getElementById("search__results");

let followingPlanet = null; 
let offset = new THREE.Vector3(0, 10, 30);

export function showAllPlanetsSearch() {
    searchResults.innerHTML = "";
    Object.keys(planets).forEach(planetName => {
        const card = createPlanetCard(planetName);
        searchResults.appendChild(card);
    });
}

export function getPlanetNameRus(planetNameEng) {
    const planetNames = {
        "Sun": "Солнце",
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

export function moveCameraToPlanet(planetName) {
    const planetMesh = planets[planetName];
    if (!planetMesh) return;
    followingPlanet = planetMesh; 
    const planetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(planetPosition);
    const targetPosition = planetPosition.clone().add(offset);
    new TWEEN.Tween(camera.position)
        .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            controls.enabled = false; 
        })
        .start();

    new TWEEN.Tween(controls.target)
        .to({ x: planetPosition.x, y: planetPosition.y, z: planetPosition.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

export function stopFollowingPlanet() {
    followingPlanet = null;
    controls.enabled = true;
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
