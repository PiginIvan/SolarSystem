function toggleVisibility() {
    var descriptionWrapper = document.getElementById("description-wrapper");
    var navbar = document.getElementById("navbar");
    var discover = document.getElementById("showDescriptionButton");

    descriptionWrapper.classList.toggle("hidden");
    navbar.classList.toggle("hidden");
    discover.classList.toggle("hidden");

    stopPropagation();
}

function showButton() {
    var discover = document.getElementById("showDescriptionButton");
    discover.classList.toggle("hidden");
    
    stopPropagation();
  }

  document.addEventListener('click', function(event) {
    var descriptionBox = document.getElementById("description-wrapper");
    var discover = document.getElementById("showDescriptionButton");
    var navbar = document.getElementById("navbar");

    // Закрытие descriptionWrapper и скрытие discover при клике вне их области
    if (!descriptionBox.contains(event.target) && !discover.contains(event.target)) {
        descriptionBox.classList.add("hidden");
        if (!discover.classList.contains("hidden")) {
            discover.classList.add("hidden"); // Скрываем discover, если он открыт
        }
    }

    // Скрытие navbar, если descriptionBox открыт
    if (!descriptionBox.classList.contains("hidden")) {
        navbar.classList.add("hidden");
    } else {
        navbar.classList.remove("hidden");
    }
});

function stopPropagation() {
    event.stopPropagation();
}