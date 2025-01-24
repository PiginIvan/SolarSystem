const descriptionWrapper = document.getElementById("description-wrapper");
const navbar = document.getElementById("navbar");
const discover = document.getElementById("showDescriptionButton");
const settings = document.getElementById("settings-wrapper");
const settingsIcon = document.getElementById("settings-icon");

document.addEventListener('click', function(event) {
    // Закрытие descriptionWrapper и скрытие discover при клике вне их области
    if (!descriptionWrapper.contains(event.target) && !discover.contains(event.target)) {
        descriptionWrapper.classList.add("hidden");
        discover.classList.add("hidden");  
    }
    
    // Закрытие настроек при клике вне области настроек и иконки
    if (!settings.contains(event.target) && !settingsIcon.contains(event.target)) {
        settings.classList.add("hidden");
    }

    // Скрытие navbar, если descriptionWrapper открыт
    navbar.classList.toggle("hidden", (!descriptionWrapper.classList.contains("hidden") || !settings.classList.contains("hidden")));
});


// Функция для переключения видимости элементов
function toggleVisibility() {
    descriptionWrapper.classList.toggle("hidden");
    navbar.classList.toggle("hidden");
    discover.classList.toggle("hidden");
}

function showButton() {
    discover.classList.toggle("hidden");
}

function toggleVisibilitySettings() {
    settings.classList.toggle("hidden");
    navbar.classList.toggle("hidden");
}
