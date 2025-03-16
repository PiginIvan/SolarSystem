async function loadHtml(planetName) {
    const descriptionDiv = document.getElementById('description');
    const discoverDiv = document.getElementById('planet');
    try {
        descriptionDiv.innerHTML = await loadContent('/static/descriptions/' + planetName + '.html');
        discoverDiv.innerHTML = await loadContent('/static/explore-button__content/' + planetName + '.html');
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

function getPlanetNameRus(planetNameEng) {
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

function loadEditor(planetName) {
    const editorWrapper = document.getElementById("editor__menu-wrapper");
    editorWrapper.innerHTML = "";
    
    const h1 = document.createElement("h1");
    h1.classList.add("h1");
    h1.textContent = getPlanetNameRus(planetName);

    const editor__menu = document.createElement("div");
    editor__menu.classList.add("editor__menu");
    editor__menu.id = "editor__menu";

    editorWrapper.appendChild(h1);
    editorWrapper.appendChild(editor__menu);

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
    
    editor__menu.appendChild(createEditorBlock("Масса:", planetName + "mass"));
    editor__menu.appendChild(createEditorBlock("Скорость:", planetName + "velocity"));
    editor__menu.appendChild(createEditorBlock("Радиус:", planetName + "radius"));
}
