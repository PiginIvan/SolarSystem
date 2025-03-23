import { planets } from '../main.js';
import { getPlanetNameRus } from './search.js';

const editorSearchInput = document.getElementById("editor__input");
const editorSearchResult = document.getElementById("editor__results");

export function showAllPlanetsEditor() {
   editorSearchResult.innerHTML = "";
    Object.keys(planets).forEach(planetName => {
        const card = createPlanetCard(planetName);
        editorSearchResult.appendChild(card);
    });
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
    textDiv.textContent = planetName;
    li.appendChild(img);
    li.appendChild(textDiv);
    li.addEventListener("click", () => {
        loadEditor(planetName);
        setPlanetData(planetName);
    });
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
            const card = createPlanetCard(planetName);
            editorSearchResult.appendChild(card);
        }
    });
}

function setPlanetData(planetName) {
    const massInput = document.getElementById(planetName + "mass");
    const velocityInput = document.getElementById(planetName + "velocity");
    const radiusInput = document.getElementById(planetName + "radius");

    massInput.value = planets[planetName][1].mass;
    velocityInput.value = planets[planetName][1].velocity[0];
    radiusInput.value = planets[planetName][1].radius;

    massInput.addEventListener("input", () => {
        planets[planetName][1].mass = parseFloat(massInput.value);
    });

    velocityInput.addEventListener("input", () => {
        planets[planetName][1].velocity[0] = parseFloat(velocityInput.value); 
    });

    radiusInput.addEventListener("input", () => {
        planets[planetName][1].radius = parseFloat(radiusInput.value);
        planets[planetName][0].scale.set(parseFloat(radiusInput.value), parseFloat(radiusInput.value), parseFloat(radiusInput.value));
    });
    
}
