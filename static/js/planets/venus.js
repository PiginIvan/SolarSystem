import { Planet } from './planet.js';

export const Venus = new Planet({
    name: 'Venus', // Имя планеты
    texturePath: '/static/img/planetMaps/venus-map.jpg', // Путь к текстуре
    mass: 2.447e-6, // Масса
    radius: 1.3, // Радиус
    position: [0, 0, 25], // Начальное положение
    velocity: [1.2, 0, 0] // Скорость
});