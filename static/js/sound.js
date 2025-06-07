// звук клика при нажатии на планету
function playClickSound() {
  const clickSound = document.getElementById('click-sound');
  const isChecked = document.getElementById('checkbox-sound').checked; 
  
  clickSound.volume = 0.1;
  
  if (isChecked) {
      clickSound.play();
  }
}
