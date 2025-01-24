import { Planet } from './planet.js';

export const Mercury = new Planet({
    name: 'Mercury', // Имя планеты
    texturePath: '/static/img/planetMaps/mercury-map.jpg', // Путь к текстуре
    mass: 1.301e-6, // Масса
    radius: 1, // Радиус
    position: [0, 0, 15], // Начальное положение
    velocity: [1.5, 0, 0] // Скорость
});
