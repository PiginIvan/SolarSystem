export function createPlanetCard(planetName, moveCameraToPlanet) {
    const li = document.createElement("li");
    li.classList.add("planet-card");

    li.setAttribute("data-name_rus", getPlanetNameRus(planetName));
    li.setAttribute("data-name_eng", planetName);

    const img = document.createElement("img");
    img.src = `/static/img/explore-button__imgs/${planetName.toLowerCase()}.png`;
    img.classList.add("planet-card__img");

    const textDiv = document.createElement("div");
    textDiv.classList.add("planet-card__text");
    textDiv.textContent = getPlanetNameRus(planetName);

    li.appendChild(img);
    li.appendChild(textDiv);

    li.addEventListener("click", () => moveCameraToPlanet(planetName));

    return li;
}