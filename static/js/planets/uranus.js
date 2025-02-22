import { PlanetWithRings } from './planetWithRings.js';

export const Uranus = new PlanetWithRings({
    name: 'Uranus', // Имя планеты
    texturePath: '/static/img/planetMaps/uranus-map.jpg', // Путь к текстуре
    mass: 4.766e-5, // Масса
    radius: 5, // Радиус
    position: [0, 0, 120], // Начальное положение
    velocity: [0.6, 0, 0], // Скорость
    rings: {
        innerRadius: 5, // Внутренний радиус кольца
        outerRadius: 7, // Внешний радиус кольца
        texturePath: '/static/img/planetMaps/uranus-rings.png', // Путь к текстуре кольца
        inclination: Math.PI / 2 // Наклон кольца
    }
});