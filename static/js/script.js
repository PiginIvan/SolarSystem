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
};

function toggleVisibility(...keys) {
    keys.map(key => elements[key]).forEach(element => element.classList.toggle("hidden"));
}

document.addEventListener('click', (event) => {
    const elementsToHide = [
        { wrapper: elements.descriptionWrapper, trigger: elements.discover },
        { wrapper: elements.settings, trigger: elements.settingsIcon },
        { wrapper: elements.search, trigger: elements.searchButton },
        { wrapper: elements.editor, trigger: elements.editorButton },
        { wrapper: elements.editorWindow, trigger: elements.editor }
    ];
    
    elementsToHide.forEach(({ wrapper, trigger }) => {
        if (!wrapper.contains(event.target) && !trigger.contains(event.target)) {
            wrapper.classList.add("hidden");
        }
    });

    const isAnyVisible = elementsToHide.some(({ wrapper }) => !wrapper.classList.contains("hidden"));
    elements.navbar.classList.toggle("hidden", isAnyVisible);
    
    updateNavbarVisibility();
});

function showButton() {
    elements.discover.classList.toggle("hidden");
}

document.getElementById("search-icon").addEventListener("click", () => toggleVisibility("search", "navbar"));
document.getElementById("settings-icon").addEventListener("click", () => toggleVisibility("settings", "navbar"));
document.getElementById("editor-icon").addEventListener("click", () => toggleVisibility("editor", "navbar"));
document.getElementById("explore-button").addEventListener("click", () => toggleVisibility("descriptionWrapper", "navbar", "discover"));
document.getElementById("editor-wrapper").addEventListener("click", () => {
    elements.editor.classList.add("hidden");
    elements.editorWindow.classList.remove("hidden");
    updateNavbarVisibility();
});