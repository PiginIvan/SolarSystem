import { startAnimation, stopAnimation } from "./2d.js";

export let isPaused = false;

const elements = {
    navbar: document.getElementById("navbar"),
    settingsIcon: document.getElementById("settings-icon"),
    searchButton: document.getElementById("search-icon"),
    editorButton: document.getElementById("editor-icon"),
    discover: document.getElementById("explore-button"),
    descriptionWrapper: document.getElementById("description-wrapper"),
    settings: document.getElementById("settings-wrapper"),
    search: document.getElementById("search-wrapper"),
    editor: document.getElementById("editor-wrapper"),
    editorWindow: document.getElementById("editor__menu-wrapper"),
    searchCardsArea: document.getElementById("search-scroll"),
    editorCardsArea: document.getElementById("editor-scroll"),
    descriptionArea: document.getElementById("description"),
    searchInput: document.getElementById("search__input")
};

function toggleVisibility(...keys) {
    keys.map(key => elements[key]).forEach(element => {
        element.classList.toggle("hidden");
        if (!element.classList.contains("hidden")) {
            elements.searchCardsArea.scrollTop = 0; 
            elements.editorCardsArea.scrollTop = 0;
            elements.descriptionArea.scrollTop = 0; 
        }
    });
}

document.addEventListener('click', (event) => {
    const elementsToHide = [
        { wrapper: elements.descriptionWrapper, trigger: elements.discover },
        { wrapper: elements.settings, trigger: elements.settingsIcon },
        { wrapper: elements.search, trigger: elements.searchButton },
        { wrapper: elements.editor, trigger: elements.editorButton },
        { wrapper: elements.editorWindow, trigger: elements.editor },
        { wrapper: elements.discover, trigger: elements.discover }
    ];
    
    elementsToHide.forEach(({ wrapper, trigger }) => {
        if (!wrapper.contains(event.target) && !trigger.contains(event.target)) {
            wrapper.classList.add("hidden");
        }
    });

    const isAnyVisible = elementsToHide.some(({ wrapper }) => !wrapper.classList.contains("hidden"));
    elements.navbar.classList.toggle("hidden", isAnyVisible);
});

export function showButton() {
    elements.discover.classList.toggle("hidden");
}

document.getElementById("search-icon").addEventListener("click", () => toggleVisibility("search", "navbar"));
document.getElementById("settings-icon").addEventListener("click", () => toggleVisibility("settings", "navbar"));
document.getElementById("editor-icon").addEventListener("click", () => toggleVisibility("editor", "navbar"));
document.getElementById("explore-button").addEventListener("click", () => toggleVisibility("descriptionWrapper", "navbar", "discover"));
document.addEventListener("click", (event) => {
    const planetCard = event.target.closest(".editor-card");
    if (planetCard) {
        elements.editor.classList.add("hidden");
        elements.editorWindow.classList.remove("hidden");
    }
});

document.getElementById('view-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("view_3d").style.display = "block";
        document.getElementById("view_2d").style.display = "none";
        stopAnimation();
        isPaused = false; 
    } else {
        document.getElementById("view_3d").style.display = "none";
        document.getElementById("view_2d").style.display = "block";
        startAnimation();
        isPaused = true; 
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const viewToggle = document.getElementById('view-toggle');
    viewToggle.checked = true; 
    
    if (document.getElementById("view_2d").style.display === "block") {
        viewToggle.checked = false;
    }
});