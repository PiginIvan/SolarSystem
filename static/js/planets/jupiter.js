import { Planet } from './planet.js';

export const Jupiter = new Planet({
    name: 'Jupiter', // Имя планеты
    texturePath: '/static/img/planetMaps/jupiter-map.jpg', // Путь к текстуре
    mass: 9.546e-4, // Масса
    radius: 5, // Радиус
    position: [0, 0, 60], // Начальное положение
    velocity: [0.88, 0, 0] // Скорость
});
