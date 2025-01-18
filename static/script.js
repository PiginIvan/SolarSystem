function toggleVisibility() {
  var element = document.getElementById("description-wrapper");
  var element1 = document.getElementById("navbar");

  if (element.style.display === "none" || element.style.display === "") {
      element.style.display = "flex";
  } else {
      element.style.display = "none";
  }

  if (element1.style.display === "flex" || element1.style.display === "") {
        element1.style.display = "none";
    } else {
        element1.style.display = "flex";
    }

  var element2 = document.getElementById("showDescriptionButton");

  if (element2.style.display === "none") {
      element2.style.display = "block"; 
  } else {
      element2.style.display = "none";
  }
    stopPropagation();
}


document.addEventListener('click', function(event) {
    var descriptionBox = document.getElementById("description-wrapper");
    var button = document.getElementById("showDescriptionButton");

    if (!descriptionBox.contains(event.target) && !button.contains(event.target)) {
        descriptionBox.style.display = "none";
    }
});