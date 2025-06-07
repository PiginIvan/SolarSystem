import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Earth } from './planets/earth.js';
import { Jupiter } from './planets/jupiter.js';
import { Mars } from './planets/mars.js';
import { Mercury } from './planets/mercury.js';
import { Neptune } from './planets/neptune.js';
import { Pluto } from './planets/pluto.js';
import { Saturn } from './planets/saturn.js';
import { Sun } from './planets/sun.js';
import { Uranus } from './planets/uranus.js';
import { Venus } from './planets/venus.js';

import { loadHtml } from './loader.js';
import { stopFollowingPlanet } from './search.js';
import { showButton } from './visibility.js';
import { camera, renderer, controls, removedPlanets, scene } from '../main.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const search = document.getElementById("search-wrapper");
const saturnRings = Saturn.createRings();
const uranusRings = Uranus.createRings(); 
const traces = {};  
const Moon = {
    radius: 0.3, 
    distanceFromEarth: 4, 
    orbitSpeed: 0.03, 
    mesh: new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0x888888 }) 
    ),
    updatePosition: function (earthPosition, angle) {
        this.mesh.position.x = earthPosition.x + Math.cos(angle) * this.distanceFromEarth;
        this.mesh.position.y = earthPosition.y + Math.sin(angle) * this.distanceFromEarth;
        this.mesh.position.z = earthPosition.z;
    }
};
const MarsMoons = [
    { name: 'Phobos', distance: 2.5, speed: 0.05, color: 0xaaaaaa },
    { name: 'Deimos', distance: 6.5, speed: 0.02, color: 0xbbbbbb }
].map(moon => ({
    ...moon,
    mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({ color: moon.color })
    ),
    updatePosition: function (planetPosition, angle) {
        this.mesh.position.x = planetPosition.x + Math.cos(angle) * this.distance;
        this.mesh.position.y = planetPosition.y + Math.sin(angle) * this.distance;
        this.mesh.position.z = planetPosition.z;
    }
}));

const JupiterMoons = [
    { name: 'Io', distance: 8, speed: 0.03, color: 0xffa500 },
    { name: 'Europa', distance: 12, speed: 0.025, color: 0xffffff },
    { name: 'Ganymede', distance: 16, speed: 0.02, color: 0xcccccc },
    { name: 'Callisto', distance: 20, speed: 0.015, color: 0x999999 }
].map(moon => ({
    ...moon,
    mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshStandardMaterial({ color: moon.color })
    ),
    updatePosition: function (planetPosition, angle) {
        this.mesh.position.x = planetPosition.x + Math.cos(angle) * this.distance;
        this.mesh.position.y = planetPosition.y + Math.sin(angle) * this.distance;
        this.mesh.position.z = planetPosition.z;
    }
}));
const rotationSpeeds = {
    Mercury: 6.138e-2,
    Venus: -2.99e-2,
    Earth: 4.2921159e-2,
    Mars: 7.088e-2,
    Jupiter: 1.76e-2,
    Saturn: 1.64e-2,
    Uranus: -1.012e-2,
    Neptune: 1.083e-2,
    Pluto: -1.138e-2
};
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
    scene.add(Moon.mesh);
    scene.add(Pluto.mesh);

    MarsMoons.forEach(moon => scene.add(moon.mesh));
    JupiterMoons.forEach(moon => scene.add(moon.mesh));

    const whiteMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff,
        transparent: true,  
        opacity: 0.3,
        
    });
    traces.Mercury = createTrace(whiteMaterial);
    scene.add(traces.Mercury);

    traces.Venus = createTrace(whiteMaterial);
    scene.add(traces.Venus);

    traces.Earth = createTrace(whiteMaterial);
    scene.add(traces.Earth);

    traces.Mars = createTrace(whiteMaterial);
    scene.add(traces.Mars);

    traces.Jupiter = createTrace(whiteMaterial);
    scene.add(traces.Jupiter);

    traces.Saturn = createTrace(whiteMaterial);
    scene.add(traces.Saturn);

    traces.Uranus = createTrace(whiteMaterial);
    scene.add(traces.Uranus);

    traces.Neptune = createTrace(whiteMaterial);
    scene.add(traces.Neptune);

    traces.Pluto = createTrace(whiteMaterial);
    scene.add(traces.Pluto);

}

export function updatePlanetTraces() {
    updateTrace('Mercury', Mercury.mesh.position);
    updateTrace('Venus', Venus.mesh.position);
    updateTrace('Earth', Earth.mesh.position);
    updateTrace('Mars', Mars.mesh.position);
    updateTrace('Jupiter', Jupiter.mesh.position);
    updateTrace('Saturn', Saturn.mesh.position);
    updateTrace('Uranus', Uranus.mesh.position);
    updateTrace('Neptune', Neptune.mesh.position);
    updateTrace('Pluto', Pluto.mesh.position);
    
    if (!removedPlanets.has("Earth")) {
        const earthPosition = Earth.mesh.position;
        const moonAngle = Date.now() * Moon.orbitSpeed * 0.05; 
        Moon.updatePosition(earthPosition, moonAngle);
    }

    if (!removedPlanets.has("Mars")) {
        MarsMoons.forEach((moon, i) => {
            const angle = Date.now() * moon.speed * 0.05;
            moon.updatePosition(Mars.mesh.position, angle);
        });
    }
    
    if (!removedPlanets.has("Jupiter")) {
        JupiterMoons.forEach((moon, i) => {
            const angle = Date.now() * moon.speed * 0.05;
            moon.updatePosition(Jupiter.mesh.position, angle);
        });
    }
   
}

export function onMouseClick(event) {
    
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([Sun.mesh, Mercury.mesh, Venus.mesh, Earth.mesh, Mars.mesh, 
        Jupiter.mesh, Saturn.mesh, Uranus.mesh, Neptune.mesh, Pluto.mesh]);
    
    if (intersects.length > 0 && !event.target.closest(".wrapper")) {
        const selectedObject = intersects[0].object;
        showButton();
        loadHtml(selectedObject.name);
        playClickSound();
    }
    else {
        if (!search.contains(event.target)) {
            stopFollowingPlanet();
        }
    }
}

function createExplosion(position) {
    const group = new THREE.Group();
    group.position.copy(position);
    scene.add(group);

    const particleCount = 50;
    const particles = [];
    const geometry = new THREE.SphereGeometry(0.1, 4, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0xff5500 });

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material.clone());
        particle.position.set(0, 0, 0);
        const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ).normalize().multiplyScalar(0.5 + Math.random());

        particle.userData = { direction };
        group.add(particle);
        particles.push(particle);
    }

    const light = new THREE.PointLight(0xffaa33, 2, 10);
    group.add(light);

    const smokeMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 });
    const smoke = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), smokeMaterial);
    group.add(smoke);

    const listener = new THREE.AudioListener();
    camera.add(listener); 

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/static/sounds/explosion.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setVolume(0.1);
        sound.play();
    });

    const duration = 1000;
    const startTime = performance.now();

    function animateExplosion(time) {
        const elapsed = time - startTime;
        const t = elapsed / duration;

        if (t < 1) {
            const scale = 1 + t * 3;
            smoke.scale.set(scale, scale, scale);
            smokeMaterial.opacity = 0.5 * (1 - t);

            particles.forEach(p => {
                p.position.add(p.userData.direction);
                p.material.opacity = 1 - t;
            });

            light.intensity = 2 * (1 - t);

            requestAnimationFrame(animateExplosion);
        } else {
            scene.remove(group);
        }
    }

    requestAnimationFrame(animateExplosion);
}

export function updatePositions() {
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bodies: [
                { 
                    mass: Sun.mass, 
                    position: [Sun.mesh.position.x, Sun.mesh.position.y, Sun.mesh.position.z], 
                    velocity: Sun.velocity, 
                    radius: Sun.radius 
                },
                { 
                    mass: Mercury.mass, 
                    position: [Mercury.mesh.position.x, Mercury.mesh.position.y, Mercury.mesh.position.z], 
                    velocity: Mercury.velocity, 
                    radius: Mercury.radius 
                },
                { 
                    mass: Venus.mass, 
                    position: [Venus.mesh.position.x, Venus.mesh.position.y, Venus.mesh.position.z], 
                    velocity: Venus.velocity, 
                    radius: Venus.radius 
                }, 
                { 
                    mass: Earth.mass, 
                    position: [Earth.mesh.position.x, Earth.mesh.position.y, Earth.mesh.position.z], 
                    velocity: Earth.velocity, 
                    radius: Earth.radius 
                },
                { 
                    mass: Mars.mass, 
                    position: [Mars.mesh.position.x, Mars.mesh.position.y, Mars.mesh.position.z], 
                    velocity: Mars.velocity, 
                    radius: Mars.radius 
                },
                { 
                    mass: Jupiter.mass, 
                    position: [Jupiter.mesh.position.x, Jupiter.mesh.position.y, Jupiter.mesh.position.z], 
                    velocity: Jupiter.velocity, 
                    radius: Jupiter.radius 
                },
                { 
                    mass: Saturn.mass, 
                    position: [Saturn.mesh.position.x, Saturn.mesh.position.y, Saturn.mesh.position.z], 
                    velocity: Saturn.velocity, 
                    radius: Saturn.radius 
                },
                { 
                    mass: Uranus.mass, 
                    position: [Uranus.mesh.position.x, Uranus.mesh.position.y, Uranus.mesh.position.z], 
                    velocity: Uranus.velocity, 
                    radius: Uranus.radius 
                },
                { 
                    mass: Neptune.mass, 
                    position: [Neptune.mesh.position.x, Neptune.mesh.position.y, Neptune.mesh.position.z], 
                    velocity: Neptune.velocity, 
                    radius: Neptune.radius 
                },
                { 
                    mass: Pluto.mass, 
                    position: [Pluto.mesh.position.x, Pluto.mesh.position.y, Pluto.mesh.position.z], 
                    velocity: Pluto.velocity, 
                    radius: Pluto.radius 
                }
            ],
            time_step: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.bodies[1]) {
            Mercury.updatePosition(data.bodies[1].position, data.bodies[1].velocity);
            Mercury.mesh.rotation.y += rotationSpeeds.Mercury;
        } else if (Mercury.mesh.parent) {
            scene.remove(Mercury.mesh);
            scene.remove(traces.Mercury);
            createExplosion(Mercury.mesh.position);
            removedPlanets.add("Mercury");
        }
        if (data.bodies[2]) {
            Venus.updatePosition(data.bodies[2].position, data.bodies[2].velocity);
            Venus.mesh.rotation.y += rotationSpeeds.Venus;
        } else if (Venus.mesh.parent) {
            scene.remove(Venus.mesh);
            scene.remove(traces.Venus);
            createExplosion(Venus.mesh.position);
            removedPlanets.add("Venus");
        }
        if (data.bodies[3]) {
            Earth.updatePosition(data.bodies[3].position, data.bodies[3].velocity);
            Earth.mesh.rotation.y += rotationSpeeds.Earth;
        } else if (Earth.mesh.parent) {
            scene.remove(Earth.mesh);
            scene.remove(traces.Earth);
            createExplosion(Earth.mesh.position);
            scene.remove(Moon.mesh);
            removedPlanets.add("Earth");
        }
        if (data.bodies[4]) {
            Mars.updatePosition(data.bodies[4].position, data.bodies[4].velocity);
            Mars.mesh.rotation.y += rotationSpeeds.Mars;
        } else if (Mars.mesh.parent) {
            scene.remove(Mars.mesh);
            scene.remove(traces.Mars);
            createExplosion(Mars.mesh.position);
            MarsMoons.forEach(moon => scene.remove(moon.mesh));
            removedPlanets.add("Mars");
        }
        if (data.bodies[5]) {
            Jupiter.updatePosition(data.bodies[5].position, data.bodies[5].velocity);
            Jupiter.mesh.rotation.y += rotationSpeeds.Jupiter;
        } else if (Jupiter.mesh.parent) {
            scene.remove(Jupiter.mesh);
            scene.remove(traces.Jupiter);
            createExplosion(Jupiter.mesh.position);
            JupiterMoons.forEach(moon => scene.remove(moon.mesh));
            removedPlanets.add("Jupiter");
        }
        if (data.bodies[6]) {
            Saturn.updatePosition(data.bodies[6].position, data.bodies[6].velocity);
            Saturn.mesh.rotation.y += rotationSpeeds.Saturn;
            saturnRings.position.copy(Saturn.mesh.position);
        } else if (Saturn.mesh.parent) {
            scene.remove(Saturn.mesh);
            scene.remove(traces.Saturn);
            createExplosion(Saturn.mesh.position);
            scene.remove(saturnRings);
            removedPlanets.add("Saturn");
        }
        if (data.bodies[7]) {
            Uranus.updatePosition(data.bodies[7].position, data.bodies[7].velocity);
            Uranus.mesh.rotation.y += rotationSpeeds.Uranus;
            uranusRings.position.copy(Uranus.mesh.position);
        } else if (Uranus.mesh.parent) {
            scene.remove(Uranus.mesh);
            scene.remove(traces.Uranus);
            createExplosion(Uranus.mesh.position);
            scene.remove(uranusRings);
            removedPlanets.add("Uranus");
        }
        if (data.bodies[8]) {
            Neptune.updatePosition(data.bodies[8].position, data.bodies[8].velocity);
            Neptune.mesh.rotation.y += rotationSpeeds.Neptune;
        } else if (Neptune.mesh.parent) {
            scene.remove(Neptune.mesh);
            scene.remove(traces.Neptune);
            createExplosion(Neptune.mesh.position);
            removedPlanets.add("Neptune");
        }
        if (data.bodies[9]) {
            Pluto.updatePosition(data.bodies[9].position, data.bodies[9].velocity);
            Pluto.mesh.rotation.y += rotationSpeeds.Pluto;
        } else if (Pluto.mesh.parent) {
            scene.remove(Pluto.mesh);
            scene.remove(traces.Pluto);
            createExplosion(Pluto.mesh.position);
            removedPlanets.add("Pluto");
        }
    });
}

function createTrace(material) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(0);  
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(geometry, material);
    line.geometry.computeBoundingSphere();
    line.frustumCulled = false;
    return line;
}

function updateTrace(planetName, position) {
    const trace = traces[planetName];
    const geometry = trace.geometry;
    const positions = geometry.attributes.position.array;

    const maxPoints = {'Mercury': 30, 'Venus': 80, 'Earth': 150, 'Mars': 270, 'Jupiter': 500, 'Saturn': 600, 'Uranus': 750, 'Neptune': 900, 'Pluto': 1400};

    const newPositions = new Float32Array(positions.length + 3);
    newPositions.set(positions);  
    newPositions.set([position.x, position.y, position.z], positions.length);

    if (newPositions.length / 3 > maxPoints[planetName]) {
        const newArray = new Float32Array(maxPoints[planetName] * 3);
        newArray.set(newPositions.slice(3), 0);
        geometry.setAttribute('position', new THREE.BufferAttribute(newArray, 3));
    } else {
        geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    }
    geometry.attributes.position.needsUpdate = true;  
}
