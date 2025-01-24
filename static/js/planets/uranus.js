import { PlanetWithRings } from './planetWithRings.js';

export const Uranus = new PlanetWithRings({
    name: 'Uranus', // Имя планеты
    texturePath: '/static/img/planetMaps/uranus-map.jpg', // Путь к текстуре
    mass: 4.366e-5, // Масса
    radius: 6, // Радиус
    position: [0, 0, 120], // Начальное положение
    velocity: [0.5, 0, 0], // Скорость
    rings: {
        innerRadius: 5, // Внутренний радиус кольца
        outerRadius: 7, // Внешний радиус кольца
        texturePath: '/static/img/planetMaps/uranus-rings.png', // Путь к текстуре кольца
        inclination: Math.PI / 2 // Наклон кольца
    }
});