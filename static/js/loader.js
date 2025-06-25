import { updatePlanetTexture, setPlanetData, editorSearchResult } from './editor.js'
import { getPlanetNameRus, moveCameraToPlanet, searchResults } from './search.js';
import { currentLanguage, updateLocalizedText, translations } from './translate.js';
import { planets } from '../main.js';

// рендер html для окон
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

async function loadContent(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    return await response.text();
}

// рендер меню эдитора
export function loadEditor(planetName) {
    const editorWrapper = document.getElementById("editor__menu-wrapper");
    editorWrapper.innerHTML = "";

    const planetNameKey = planetName.toLowerCase();
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

    editor__menu.appendChild(createEditorBlock(currentTranslations["mass"] || "Масса:", planetName + "mass"));
    editor__menu.appendChild(createEditorBlock(currentTranslations["velocity"] || "Скорость:", planetName + "velocity"));
    editor__menu.appendChild(createEditorBlock(currentTranslations["radius"] || "Радиус:", planetName + "radius"));
    editor__menu.appendChild(createTextureUploadBlock(currentTranslations["texture"] || "Текстура:", planetName));
}


// рендер основных блоков эдитора
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

    if (inputId.includes("mass")) {
        input.min = 1.e-10;
        input.max = 1.e-1;
        input.step = 1e-10;
    } else if (inputId.includes("velocity")) {
        input.min = -2;
        input.max = 2;
        input.step = 0.01;
    } else if (inputId.includes("radius")) {
        input.min = 0;
        input.max = 15; 
        input.step = 1;
    } 

    block.appendChild(label);
    block.appendChild(input);

    return block;
}


// рендер текстурного блока эдитора
function createTextureUploadBlock(label, planetName) {
    const block = document.createElement("div");
    block.classList.add("editor__block");
    block.classList.add("editor__block-buttons");

    const fileContainer = document.createElement("div");
    
    const input = document.createElement("input");
    input.type = "file";
    input.id = planetName + "-texture";
    input.accept = "image/*";
    input.classList.add("editor__file-input");

    const inputLabel = document.createElement("label");
    inputLabel.htmlFor = planetName + "-texture";
    inputLabel.classList.add("editor__file-label");

    const fileNameSpan = document.createElement("span");
    fileNameSpan.classList.add("editor__file-name");
    fileNameSpan.textContent = label;
    
    inputLabel.appendChild(fileNameSpan);
    
    const resetButton = document.createElement("button");
    resetButton.setAttribute("data-i18n", "reset_texture");
    resetButton.textContent = "X";
    resetButton.classList.add("reset-texture-button");
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileNameSpan.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const textureURL = e.target.result;
                updatePlanetTexture(planetName, textureURL);
            };
            reader.readAsDataURL(file);
        }
    });
    
    resetButton.addEventListener('click', () => {
        const defaultTexturePath = `/static/img/planetMaps/${planetName.toLowerCase()}-map.jpg`;
        updatePlanetTexture(planetName, defaultTexturePath);
        input.value = "";
        fileNameSpan.textContent = label;
    });

    block.appendChild(input);
    block.appendChild(inputLabel);
    block.appendChild(resetButton);
    
    return block;
}

// создание карточки планеты
export function createPlanetCard(planetName, option) {
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
    if (option == "search") {
        li.addEventListener("click", () => moveCameraToPlanet(planetName));
    } else {
        li.addEventListener("click", () => {
            loadEditor(planetName);
            document.getElementById("editor-wrapper").classList.toggle("hidden");
            document.getElementById("editor__menu-wrapper").classList.toggle("hidden");
            setPlanetData(planetName);
        });
    }
    return li;
}

// показ все планеты по умолчанию
export function showAllPlanets(option) {
    Object.keys(planets).forEach(planetName => {
        const card = createPlanetCard(planetName, option);
        if (option == "search") {
            searchResults.appendChild(card);
        } else {
            editorSearchResult.appendChild(card);
        }
    });
}