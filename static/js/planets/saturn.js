import { PlanetWithRings } from './planetWithRings.js';

export const Saturn = new PlanetWithRings({
    name: 'Saturn', // Имя планеты
    texturePath: '/static/img/planetMaps/saturn-map.jpg', // Путь к текстуре
    mass: 5.857e-4, // Масса
    radius: 7, // Радиус
    position: [0, 0, 90], // Начальное положение
    velocity: [0.7, 0, 0], // Скорость
    rings: {
        innerRadius: 5, // Внутренний радиус кольца
        outerRadius: 12, // Внешний радиус кольца
        texturePath: '/static/img/planetMaps/saturn-rings.png', // Путь к текстуре кольца
        inclination: Math.PI / 2 // Наклон кольца
    }
});