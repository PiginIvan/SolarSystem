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
    li.classList.add("editor-card");
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