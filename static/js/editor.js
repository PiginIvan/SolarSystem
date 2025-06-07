import { createPlanetCard } from './loader.js';
import { getPlanetNameRus } from './search.js';
import { updateLocalizedText, currentLanguage } from './translate.js';
import { planets } from '../main.js';

const editorSearchInput = document.getElementById("editor__input");
export const editorSearchResult = document.getElementById("editor__results");

editorSearchInput.addEventListener("input", () => {
    const query = editorSearchInput.value.toLowerCase();
    searchPlanetsEditor(query);
});

// функция поиска в эдиторе
function searchPlanetsEditor(query) {
    editorSearchResult.innerHTML = "";
    Object.keys(planets).forEach(planetName => {
        const planetNameLower = planetName.toLowerCase();
        const planetNameRus = getPlanetNameRus(planetName).toLowerCase();

        if (query === "" || planetNameLower.includes(query) || planetNameRus.includes(query)) {
            const card = createPlanetCard(planetName, "editor");
            editorSearchResult.appendChild(card);
        }
    });

    updateLocalizedText(currentLanguage);
}

// установка данных для планет
export function setPlanetData(planetName) {
    const massInput = document.getElementById(planetName + "mass");
    const velocityInput = document.getElementById(planetName + "velocity");
    const radiusInput = document.getElementById(planetName + "radius");

    if (massInput && velocityInput && radiusInput) {
        massInput.value = planets[planetName][1].mass || 0; 
        velocityInput.value = planets[planetName][1].velocity || 0;
        radiusInput.value = planets[planetName][1].radius || 0;

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


    } else {
        console.error('Error: One or more input elements not found.');
    }
}

// обновление текстуры
export function updatePlanetTexture(planetName, textureURL) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureURL, (texture) => {
        planets[planetName][0].material.map = texture;
        planets[planetName][0].material.needsUpdate = true;
    });
}