import { planets } from '../main.js';
import { loadEditor } from '../main.js';
import { getPlanetNameRus } from './search.js';
import { updateLocalizedText, currentLanguage } from '../main.js';


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
        document.getElementById("editor-wrapper").classList.toggle("hidden");
        document.getElementById("editor__menu-wrapper").classList.toggle("hidden");
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

    updateLocalizedText(currentLanguage);
}

<<<<<<< Updated upstream
function setPlanetData(planetName) {
=======
const originalRadii = {}; 

// установка данных для планет
export function setPlanetData(planetName) {
>>>>>>> Stashed changes
    const massInput = document.getElementById(planetName + "mass");
    const velocityInput = document.getElementById(planetName + "velocity");
    const radiusInput = document.getElementById(planetName + "radius");

    if (massInput && velocityInput && radiusInput) {
        const currentData = planets[planetName][1];
        const planetMesh = planets[planetName][0];

        if (!(planetName in originalRadii)) {
            originalRadii[planetName] = currentData.radius;
        }

        massInput.value = currentData.mass || 0;
        velocityInput.value = currentData.velocity[0] || 0;
        radiusInput.value = currentData.radius || 0;

        massInput.addEventListener("input", () => {
            currentData.mass = parseFloat(massInput.value);
        });

        velocityInput.addEventListener("input", () => {
            currentData.velocity[0] = parseFloat(velocityInput.value);
        });

        radiusInput.addEventListener("input", () => {
            const newRadius = parseFloat(radiusInput.value);
            const initialRadius = originalRadii[planetName];

            if (initialRadius > 0) {
                const scaleFactor = newRadius / initialRadius;
                planetMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                currentData.radius = newRadius;
            }
        });

    } else {
        console.error('Error: One or more input elements not found.');
    }
}