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

let currentLanguage = 'ru'; // По умолчанию русский язык

// Функция для загрузки переводов
async function updateLocalizedText(lang) {
    // Загружаем переводы
    const translations = await loadTranslations(lang);

    // Обновляем текст всех элементов с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Загружаем переводы
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/${lang}.json`);
        if (!response.ok) {
            throw new Error('Failed to load translations');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}

// Пример использования при переключении языка
document.getElementById('checkbox-language').addEventListener('change', async (event) => {
    const newLang = event.target.checked ? 'en' : 'ru';
    await updateLocalizedText(newLang);
});

// Обновляем текст при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateLocalizedText(currentLanguage);
});