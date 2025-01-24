import { Planet } from './planet.js';

export const Neptune = new Planet({
    name: 'Neptune', // Имя планеты
    texturePath: '/static/img/planetMaps/neptune-map.jpg', // Путь к текстуре
    mass: 5.15e-5, // Масса
    radius: 5.3, // Радиус
    position: [0, 0, 150], // Начальное положение
    velocity: [0.5, 0, 0] // Скорость
});
