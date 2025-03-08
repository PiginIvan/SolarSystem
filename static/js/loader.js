async function loadHtml(planetName) {
    const descriptionDiv = document.getElementById('description');
    const discoverDiv = document.getElementById('planet');
    try {
        descriptionDiv.innerHTML = await loadContent('/static/descriptions/' + planetName + '.html');

        discoverDiv.innerHTML = await loadContent('/static/discovers/' + planetName + 'Discover.html');
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
