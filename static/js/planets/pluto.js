import { Planet } from './planet.js';

export const Pluto = new Planet({
    name: 'Pluto', // Имя планеты
    texturePath: '/static/img/planetMaps/pluto-map.jpg', // Путь к текстуре
    mass: 1.301e-6, // Масса
    radius: 1.3, // Радиус
    position: [30, 30, 180], // Начальное положение
    velocity: [0.5, 0, 0] // Скорость
});
