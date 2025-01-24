import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

export class Star {
    constructor({name, texturePath, mass, radius, position, velocity, emissive, emissiveIntensity}) {
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.position = position; 
        this.velocity = velocity; 

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        const geometry = new THREE.SphereGeometry(radius, 32, 16);
        const material = new THREE.MeshStandardMaterial({ map: texture, emissive: emissive, emissiveIntensity: emissiveIntensity});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = name;
        this.mesh.position.set(position[0], position[1], position[2]);
    }
}