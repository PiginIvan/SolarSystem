import { Star } from './star.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

export const Sun = new Star({
    name: 'Sun', // Имя звезды
    texturePath: '/static/img/planetMaps/sun-map.jpg', // Путь к текстуре
    mass: 1.0, // Масса
    radius: 10, // Радиус
    position: [0, 0, 0], // Начальное положение
    velocity: [0, 0, 0], // Скорость
    emissive: new THREE.Color('#FFA500'), // Излучаемый цвет
    emissiveIntensity: 0.8 // Интенсивность излучаемого цвета
});