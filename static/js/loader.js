function loadHtml(planetName) {
    const descriptionDiv = document.getElementById('description');
    const descriptionPath = '/static/descriptions/' + planetName + '.html';  // Динамическое создание имени файла
    
    // Загружаем файл
    fetch(descriptionPath)
        .then(response => response.text())
        .then(data => {
            descriptionDiv.innerHTML = data;
        })
        .catch(error => {
            console.error(`Error loading ${descriptionPath}:`, error);
            descriptionDiv.innerHTML = '<p>Failed to load the content.</p>';
        });


    const discoverDiv = document.getElementById('planet');
    const discoverPath = '/static/discovers/' + planetName + 'Discover.html';  // Динамическое создание имени файла

    // Загружаем файл
    fetch(discoverPath)
        .then(response => response.text())
        .then(data => {
            discoverDiv.innerHTML = data;
        })
        .catch(error => {
            console.error(`Error loading ${discoverPath}:`, error);
            discoverDiv.innerHTML = '<p>Failed to load the content.</p>';
        });
}