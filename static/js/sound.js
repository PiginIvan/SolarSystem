function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    const isChecked = document.getElementById('click-sound-checkbox').checked;
    clickSound.volume = 0.1;
    
    if (isChecked) { // Если чекбокс отмечен, проигрываем звук
      clickSound.play();
    }
}

document.querySelector('button').addEventListener('click', playClickSound);