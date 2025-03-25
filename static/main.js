import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { onMouseClick, updatePositions, addPlanets, addStars, configureControls, updatePlanetTraces } from './js/objectsFunctions.js';
import { Mercury } from './js/planets/mercury.js'; import { Venus } from './js/planets/venus.js'; import { Earth } from './js/planets/earth.js'; import { Mars } from './js/planets/mars.js';
import { Jupiter } from './js/planets/jupiter.js'; import { Saturn } from './js/planets/saturn.js'; import { Uranus } from './js/planets/uranus.js'; import { Neptune } from './js/planets/neptune.js'; import { Pluto } from './js/planets/pluto.js';
import { Sun } from './js/planets/sun.js';
import { showAllPlanetsSearch, updateCameraFollow } from './js/search.js'; import { showAllPlanetsEditor } from './js/editor.js';

export const planets = {
    "Sun": [Sun.mesh, Sun],
    "Mercury": [Mercury.mesh, Mercury],
    "Venus": [Venus.mesh, Venus],
    "Earth": [Earth.mesh, Earth],
    "Mars": [Mars.mesh, Mars],
    "Jupiter": [Jupiter.mesh, Jupiter],
    "Saturn": [Saturn.mesh, Saturn],
    "Uranus": [Uranus.mesh, Uranus],
    "Neptune": [Neptune.mesh, Neptune],
    "Pluto": [Pluto.mesh, Pluto]
};
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const controls = new OrbitControls(camera, renderer.domElement);

const scene = new THREE.Scene();
const lightAmbient = new THREE.AmbientLight(0x222222, 2); 

let isPaused = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.y = 50;
camera.position.z = 150;
window.addEventListener('click', onMouseClick, false);
scene.add(lightAmbient);

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    if (!isPaused) {
        updatePositions();
        updatePlanetTraces(); 
        updateCameraFollow();
    } 
    renderer.render(scene, camera);
}

configureControls(scene);
addStars(scene);
addPlanets(scene);
showAllPlanetsSearch();
showAllPlanetsEditor();
animate();
let currentLanguage = 'ru'; // Default language is Russian
let translations = {}; // Cache for translations

// Load translations only once and store them in a variable
async function loadTranslations(lang) {
    if (translations[lang]) {
        return translations[lang]; // Return cached translations if already loaded
    }

    try {
        const response = await fetch(`../${lang}.json`);
        if (!response.ok) {
            throw new Error('Failed to load translations');
        }
        translations[lang] = await response.json(); // Store translations in cache
        return translations[lang];
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}

// Update localized text for all elements
async function updateLocalizedText(lang) {
    // Load translations and cache them
    const currentTranslations = await loadTranslations(lang);
    console.log('Loaded translations:', currentTranslations);

    // Update text for elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentTranslations[key]) {
            element.textContent = currentTranslations[key];
        }
    });

    // Update placeholders for specific inputs
    updatePlaceholder('search__input', currentTranslations);
    updatePlaceholder('editor__input', currentTranslations);

    // Update planet cards with names
    document.querySelectorAll('.planet-card').forEach(card => {
        const planetNameEng = card.getAttribute('data-name_eng');
        const planetNameKey = planetNameEng.toLowerCase();
        const planetName = currentTranslations[planetNameKey] || planetNameEng;
        const textDiv = card.querySelector('.planet-card__text');
        if (textDiv) {
            textDiv.textContent = planetName;
        }
    });
}

// Helper function to update placeholder text
function updatePlaceholder(inputId, translations) {
    const input = document.getElementById(inputId);
    if (input && translations['search_placeholder']) {
        input.setAttribute('placeholder', translations['search_placeholder']);
    }
}

// Event listener for language change
document.getElementById('checkbox-language').addEventListener('change', async (event) => {
    currentLanguage = event.target.checked ? 'en' : 'ru';
    await updateLocalizedText(currentLanguage);
});

// Initialize the page with the default language
document.addEventListener('DOMContentLoaded', () => {
    updateLocalizedText(currentLanguage);
});

// Function to load planet HTML content
export async function loadHtml(planetName) {
    const descriptionDiv = document.getElementById('description');
    const discoverDiv = document.getElementById('planet');
    const lang = currentLanguage === 'ru' ? 'ru' : 'en';
    const descriptionFile = `/static/descriptions/${lang}/${planetName}.html`;

    try {
        descriptionDiv.innerHTML = await loadContent(descriptionFile);
        discoverDiv.innerHTML = await loadContent(`/static/explore-button__content/${planetName}.html`);
        await updateLocalizedText(currentLanguage);
    } catch (error) {
        console.error('Error loading content:', error);
        descriptionDiv.innerHTML = '<p>Failed to load the content.</p>';
        discoverDiv.innerHTML = '<p>Failed to load the content.</p>';
    }
}

// Helper function to load content (HTML)
async function loadContent(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    return await response.text();
}

// Function to load editor content for a planet
export function loadEditor(planetName) {
    const editorWrapper = document.getElementById("editor__menu-wrapper");
    editorWrapper.innerHTML = "";

    const planetNameKey = planetName.toLowerCase();

    // Use loaded translations for the editor content
    const currentTranslations = translations[currentLanguage] || {};

    const h1 = document.createElement("h1");
    h1.classList.add("h1");
    h1.setAttribute("data-i18n", planetNameKey);
    h1.textContent = currentTranslations[planetNameKey] || planetName;

    const editor__menu = document.createElement("div");
    editor__menu.classList.add("editor__menu");
    editor__menu.id = "editor__menu";

    editorWrapper.appendChild(h1);
    editorWrapper.appendChild(editor__menu);

    // Add editor blocks using translated labels
    editor__menu.appendChild(createEditorBlock(currentTranslations["mass"] || "Масса:", planetName + "mass"));
    editor__menu.appendChild(createEditorBlock(currentTranslations["velocity"] || "Скорость:", planetName + "velocity"));
    editor__menu.appendChild(createEditorBlock(currentTranslations["radius"] || "Радиус:", planetName + "radius"));
}

// Helper function to create editor blocks
function createEditorBlock(labelText, inputId) {
    const block = document.createElement("div");
    block.classList.add("editor__block");

    const label = document.createElement("label");
    label.classList.add("editor__label");
    label.textContent = labelText;
    label.setAttribute("for", inputId);

    const input = document.createElement("input");
    input.classList.add("editor__input");
    input.type = "range";
    input.id = inputId;
    input.min = 0;
    input.max = 10;
    input.step = 0.01;

    block.appendChild(label);
    block.appendChild(input);

    return block;
}
