export let currentLanguage = 'ru'; 
export let translations = {}; 

document.getElementById('language-select').addEventListener('change', async (event) => {
    currentLanguage = event.target.value;
    localStorage.setItem('selectedLanguage', currentLanguage); 
    await updateLocalizedText(currentLanguage);
});

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ru';
    currentLanguage = savedLanguage;

    document.getElementById('language-select').value = savedLanguage;
    
    updateLocalizedText(currentLanguage);
});

// обновление перевода в инпуте
export function updatePlaceholder(inputId, translations) {
    const input = document.getElementById(inputId);
    if (input && translations['search_placeholder']) {
        input.setAttribute('placeholder', translations['search_placeholder']);
    }
}

// загрузка перевода
export async function loadTranslations(lang) {
    if (translations[lang]) {
        return translations[lang]; 
    }

    try {
        const response = await fetch(`../static/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error('Failed to load translations');
        }
        translations[lang] = await response.json(); 
        return translations[lang];
    } catch (error) {
        console.error('Error loading translations:', error);
        return {};
    }
}

// обновление перевода во всех элементах
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