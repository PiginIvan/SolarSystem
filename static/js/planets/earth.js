import { Planet } from './planet.js';

export const Earth = new Planet({
    name: 'Earth', // Имя планеты
    texturePath: '/static/img/planetMaps/earth-map.jpg', // Путь к текстуре
    mass: 3.003e-6, // Масса
    radius: 2, // Радиус
    position: [0, 0, 35], // Начальное положение
    velocity: [1.1, 0, 0] // Скорость
});