import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Sun } from './planets/sun.js';
import { Mercury } from './planets/mercury.js';
import { Venus } from './planets/venus.js';
import { Earth } from './planets/earth.js';
import { Mars } from './planets/mars.js';
import { Jupiter } from './planets/jupiter.js';
import { Saturn } from './planets/saturn.js';
import { Uranus } from './planets/uranus.js';
import { Neptune } from './planets/neptune.js';
import { camera, renderer, controls } from '../main.js';

export function configureControls(scene) {
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05; 
    controls.enablePan = true; 
    controls.enableZoom = true; 
    controls.minDistance = 20; 
    controls.maxDistance = 200; 
    controls.maxPolarAngle = Math.PI; 
    controls.minPolarAngle = 0;
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}

export function addStars(scene) {
    const numStars = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(numStars * 3);
    const starsColors = new Float32Array(numStars * 3);

    for (let i = 0; i < numStars; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        const size = Math.random() * 2 + 0.5;

        starsPositions.set([x, y, z], i * 3);

        const color = new THREE.Color(0xffffff);
        starsColors.set([color.r, color.g, color.b], i * 3);

    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));

    const starsMaterial = new THREE.PointsMaterial({ size: 2, vertexColors: true });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);
}

const saturnRings = Saturn.createRings();
const uranusRings = Uranus.createRings(); 

export function addPlanets(scene) {
    scene.add(Sun.mesh);
    scene.add(Mercury.mesh);  
    scene.add(Venus.mesh);  
    scene.add(Earth.mesh);  
    scene.add(Mars.mesh);  
    scene.add(Jupiter.mesh);  
    scene.add(Saturn.mesh);  
    saturnRings.position.copy(Saturn.mesh.position);
    scene.add(saturnRings);
    scene.add(Uranus.mesh); 
    uranusRings.position.copy(Uranus.mesh.position);
    scene.add(uranusRings);
    scene.add(Neptune.mesh);  
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function onMouseClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([Sun.mesh, Mercury.mesh, Venus.mesh, Earth.mesh, Mars.mesh, Jupiter.mesh, Saturn.mesh, Uranus.mesh, Neptune.mesh]);

    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        showButton();
        console.log(selectedObject.name)
        loadHtml(selectedObject.name);
    }
}

export function updatePositions() {
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bodies: [
                { mass: Sun.mass, position: [Sun.mesh.position.x, Sun.mesh.position.y, Sun.mesh.position.z], velocity: Sun.velocity },
                { mass: Mercury.mass, position: [Mercury.mesh.position.x, Mercury.mesh.position.y, Mercury.mesh.position.z], velocity: Mercury.velocity },
                { mass: Venus.mass, position: [Venus.mesh.position.x, Venus.mesh.position.y, Venus.mesh.position.z], velocity: Venus.velocity }, 
                { mass: Earth.mass, position: [Earth.mesh.position.x, Earth.mesh.position.y, Earth.mesh.position.z], velocity: Earth.velocity },
                { mass: Mars.mass, position: [Mars.mesh.position.x, Mars.mesh.position.y, Mars.mesh.position.z], velocity: Mars.velocity },
                { mass: Jupiter.mass, position: [Jupiter.mesh.position.x, Jupiter.mesh.position.y, Jupiter.mesh.position.z], velocity: Jupiter.velocity },
                { mass: Saturn.mass, position: [Saturn.mesh.position.x, Saturn.mesh.position.y, Saturn.mesh.position.z], velocity: Saturn.velocity },
                { mass: Uranus.mass, position: [Uranus.mesh.position.x, Uranus.mesh.position.y, Uranus.mesh.position.z], velocity: Uranus.velocity },
                { mass: Neptune.mass, position: [Neptune.mesh.position.x, Neptune.mesh.position.y, Neptune.mesh.position.z], velocity: Neptune.velocity }
            ],
            time_step: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        Mercury.updatePosition(data.bodies[1].position, data.bodies[1].velocity);
        Venus.updatePosition(data.bodies[2].position, data.bodies[2].velocity);
        Earth.updatePosition(data.bodies[3].position, data.bodies[3].velocity);
        Mars.updatePosition(data.bodies[4].position, data.bodies[4].velocity);
        Jupiter.updatePosition(data.bodies[5].position, data.bodies[5].velocity);
        Saturn.updatePosition(data.bodies[6].position, data.bodies[6].velocity);
        saturnRings.position.copy(Saturn.mesh.position);
        Uranus.updatePosition(data.bodies[7].position, data.bodies[7].velocity);
        uranusRings.position.copy(Uranus.mesh.position);
        Neptune.updatePosition(data.bodies[8].position, data.bodies[8].velocity);
    });
}