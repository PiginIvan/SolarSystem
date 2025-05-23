import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js';
import { onMouseClick, updatePositions, addPlanets, addStars, configureControls, updatePlanetTraces } from './js/objectsFunctions.js';
import { Mercury } from './js/planets/mercury.js'; import { Venus } from './js/planets/venus.js'; import { Earth } from './js/planets/earth.js'; import { Mars } from './js/planets/mars.js';
import { Jupiter } from './js/planets/jupiter.js'; import { Saturn } from './js/planets/saturn.js'; import { Uranus } from './js/planets/uranus.js'; import { Neptune } from './js/planets/neptune.js'; import { Pluto } from './js/planets/pluto.js';
import { Sun } from './js/planets/sun.js';
import { showAllPlanetsSearch, updateCameraFollow } from './js/search.js'; import { showAllPlanetsEditor } from './js/editor.js';
import { startAnimation, stopAnimation } from './js/2d.js';

export const removedPlanets = new Set();
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

export const scene = new THREE.Scene();
const lightAmbient = new THREE.AmbientLight(0x222222, 2); 

export let isPaused = false;

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("view_3d").appendChild(renderer.domElement);
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

export let currentLanguage = 'ru'; // Default language is Russian
let translations = {}; // Cache for translations

// Load translations only once and store them in a variable
async function loadTranslations(lang) {
    if (translations[lang]) {
        return translations[lang]; // Возвращаем кешированные переводы
    }

    try {
        const response = await fetch(`../static/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error('Failed to load translations');
        }
        translations[lang] = await response.json(); // Кешируем переводы
        return translations[lang];
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}

// Update localized text for all elements
export async function updateLocalizedText(lang) {
    const currentTranslations = await loadTranslations(lang);

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (currentTranslations[key]) {
            element.textContent = currentTranslations[key];
        }
    });

    updatePlaceholder('search__input', currentTranslations);
    updatePlaceholder('editor__input', currentTranslations);

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
document.getElementById('language-select').addEventListener('change', async (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem('selectedLanguage', currentLanguage); // Сохраняем выбор
    await updateLocalizedText(currentLanguage);
});

// Initialize the page with the default language
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ru';
    currentLanguage = savedLanguage;
    
    // Устанавливаем выбранный язык в `select`
    document.getElementById('language-select').value = savedLanguage;
    
    updateLocalizedText(currentLanguage);
});

// Function to load planet HTML content
export async function loadHtml(planetName) {
    const descriptionDiv = document.getElementById('description');
    const discoverDiv = document.getElementById('planet');
    const descriptionFile = `/static/descriptions/${currentLanguage}/${planetName.toLowerCase()}.html`;

    try {
        descriptionDiv.innerHTML = await loadContent(descriptionFile);
        discoverDiv.innerHTML = await loadContent(`/static/explore-button__content/${planetName.toLowerCase()}.html`);
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
    editor__menu.appendChild(createTextureUploadBlock(currentTranslations["texture"] || "Текстура:", planetName));
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
    input.max = 1;
    input.step = 0.0001;

    block.appendChild(label);
    block.appendChild(input);

    return block;
}

// Функция для создания блока загрузки текстуры
function createTextureUploadBlock(label, planetName) {
    const block = document.createElement("div");
    block.classList.add("editor__block");
    block.classList.add("editor__block-buttons");

    // Create container for the file input
    const fileContainer = document.createElement("div");
    
    // Create the actual file input (hidden)
    const input = document.createElement("input");
    input.type = "file";
    input.id = planetName + "-texture";
    input.accept = "image/*";
    input.classList.add("editor__file-input");
    
    // Create custom label for the file input
    const inputLabel = document.createElement("label");
    inputLabel.htmlFor = planetName + "-texture";
    inputLabel.classList.add("editor__file-label");
    
    // Create elements for the label
    const fileNameSpan = document.createElement("span");
    fileNameSpan.classList.add("editor__file-name");
    fileNameSpan.textContent = label;
    
    inputLabel.appendChild(fileNameSpan);
    
    // Create reset button with translation attribute
    const resetButton = document.createElement("button");
    resetButton.setAttribute("data-i18n", "reset_texture");
    resetButton.textContent = "X";
    resetButton.classList.add("reset-texture-button");
    
    // Update file name when file is selected
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileNameSpan.textContent = file.name;
            
            // Handle the file upload
            const reader = new FileReader();
            reader.onload = function(e) {
                const textureURL = e.target.result;
                updatePlanetTexture(planetName, textureURL);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Reset functionality
    resetButton.addEventListener('click', () => {
        const defaultTexturePath = `/static/img/planetMaps/${planetName.toLowerCase()}-map.jpg`;
        updatePlanetTexture(planetName, defaultTexturePath);
        input.value = "";
        fileNameSpan.textContent = label;
    });
    
    // Assemble the block
    block.appendChild(input);
    block.appendChild(inputLabel);
    block.appendChild(resetButton);
    
    return block;
}

// Функция для обновления текстуры планеты
function updatePlanetTexture(planetName, textureURL) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureURL, (texture) => {
        planets[planetName][0].material.map = texture;
        planets[planetName][0].material.needsUpdate = true;
    });
}

document.getElementById('view-toggle').addEventListener('change', function() {
    if (this.checked) {
        // Switch to 3D view
        document.getElementById("view_3d").style.display = "block";
        document.getElementById("view_2d").style.display = "none";
        stopAnimation();
        isPaused = false; // Resume 3D animation
    } else {
        // Switch to 2D view
        document.getElementById("view_3d").style.display = "none";
        document.getElementById("view_2d").style.display = "block";
        startAnimation();
        isPaused = true; // Pause 3D animation
    }
});

// Initialize the toggle state based on current view
document.addEventListener('DOMContentLoaded', function() {
    const viewToggle = document.getElementById('view-toggle');
    viewToggle.checked = true; // Default to 3D view
    
    // Update the toggle if coming from 2D view
    if (document.getElementById("view_2d").style.display === "block") {
        viewToggle.checked = false;
    }
});
