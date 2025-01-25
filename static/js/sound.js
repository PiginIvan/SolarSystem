function playClickSound() {
  const clickSound = document.getElementById('click-sound');
  const isChecked = document.getElementById('checkbox-sound').checked; // Проверяем, включен ли переключатель
  
  clickSound.volume = 0.1;
  
  if (isChecked) {
      clickSound.play(); // Воспроизводим звук, если переключатель включен
  }
}