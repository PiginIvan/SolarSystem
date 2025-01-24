import { Planet } from './planet.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

export class PlanetWithRings extends Planet {
    constructor({ name, texturePath, mass, radius, position, velocity, rings }) {
        super({ name, texturePath, mass, radius, position, velocity });
        this.rings = rings;
    }

    createRings() {
        const { innerRadius, outerRadius, texturePath, inclination } = this.rings;
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        const ringTexture = new THREE.TextureLoader().load(texturePath);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true
        });
        const ringsMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringsMesh.rotation.x = inclination;
        return ringsMesh;
    }
}