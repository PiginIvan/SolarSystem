import { Planet } from './planet.js';

export const Mars = new Planet({
    name: 'Mars', // Имя планеты
    texturePath: '/static/img/planetMaps/mars-map.jpg', // Путь к текстуре
    mass: 3.427e-7, // Масса
    radius: 1.5, // Радиус
    position: [0, 0, 45], // Начальное положение
    velocity: [1.0, 0, 0] // Скорость
});
