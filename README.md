# 🌌 SolarSystem — 3D модель Солнечной системы  

*Исследуйте космос в реальном времени!*  

### 📚 Стек технологий

<div align="center">
  
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?logo=json&logoColor=white)
![Docker](https://img.shields.io/badge/docker-257bd6?logo=docker&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=Flask&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?logo=python&logoColor=ffdd54)
![Figma](https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white)

</div>
 
---
## ✨ Особенности  

- 🪐 **Реалистичные планеты** с текстурами и орбитами  
- 🎮 **Полноценное управление камерой** (приближение, вращение, свободное перемещение)  
- ⏱️ **Настраиваемые параметры** скорость, масса, радиус планет 
- ℹ️ **Информационная панель** с данными о выбранной планете  
- ℹ️ **На разных языках** для большинства пользователей по всему миру

---

## 🛠 Установка и запуск  

### Требования:
- numpy == 1.26.2
- Flask == 3.1.0  

### Инструкция:  
```bash
git clone https://github.com/PiginIvan/SolarSystem.git
```
```bash
pip install -r requirements.txt
```
```bash
python server.py
```

### Для запуска в Docker:
```bash
git clone https://github.com/PiginIvan/SolarSystem.git
```
```bash
docker build -t flask-solar-system .
```
```bash
docker run -p 5000:5000 flask-solar-system
```
Приложение будет работать по адресу: **http://127.0.0.1:5000/** 

### 🎮 Инструкция:

| Действие | Комбинация |
|:--------------|---------------:|
| Вращение камеры | ЛКМ + движение мыши |
| Движение камеры | ПКМ + движение мыши |
| Приближение/отдаление | Колесо мыши |
| Выбор планеты | Клик по объекту |

### Скриншоты

![](/Assets/solar_sistem.png)
![](/Assets/sun.png)
![](/Assets/options.png)
![](/Assets/search.png)
![](/Assets/editor.png)