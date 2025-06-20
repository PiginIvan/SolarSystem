const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const BLACK = '#000000';
const WHITE = '#FFFFFF';
const YELLOW = '#FFFF00';
const MOON_COLOR = '#C8C8FF';
const ASTEROID_COLOR = 'rgba(150, 150, 150, 0.7)';
const KUIPER_COLOR = 'rgba(120, 120, 120, 0.8)';

const COLORS = [
    '#C86464',  // Mercury
    '#C89664',  // Venus
    '#6464C8',  // Earth
    '#C83232',  // Mars
    '#C89664',  // Jupiter
    '#C8C864',  // Saturn
    '#64C8C8',  // Uranus
    '#3232C8',  // Neptune
    '#966464'   // Pluto
];

const sunRadius = 20;
const planetData = [
    {name: "Mercury", radius: 4, orbitRadius: 75, speed: 4.74, color: COLORS[0]},
    {name: "Venus", radius: 5, orbitRadius: 120, speed: 3.50, color: COLORS[1]},
    {name: "Earth", radius: 6, orbitRadius: 200, speed: 2.98, color: COLORS[2]},
    {name: "Mars", radius: 3, orbitRadius: 250, speed: 2.41, color: COLORS[3]},
    {name: "Jupiter", radius: 10, orbitRadius: 340, speed: 1.31, color: COLORS[4]},
    {name: "Saturn", radius: 7, orbitRadius: 380, speed: 0.97, color: COLORS[5]},
    {name: "Uranus", radius: 6, orbitRadius: 400, speed: 0.68, color: COLORS[6]},
    {name: "Neptune", radius: 7, orbitRadius: 500, speed: 0.54, color: COLORS[7]},
    {name: "Pluto", radius: 3, orbitRadius: 570, speed: 0.5, color: COLORS[8], eccentricity: 0.25, inclination: 0.3}
];

const debrisBelts = [
    {innerRadius: 280, outerRadius: 320, density: 500, color: ASTEROID_COLOR}, 
    {innerRadius: 600, outerRadius: 700, density: 300, color: KUIPER_COLOR}    
];

const moonRadius = 2;
const moonOrbitRadius = 15;
const moonSpeed = 20.0;

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.scale = 1.0;
        this.dragging = false;
        this.lastPos = {x: 0, y: 0};
    }
    
    toScreen(x, y) {
        return {
            x: (x - this.x) * this.scale + canvas.width / 2,
            y: (y - this.y) * this.scale + canvas.height / 2
        };
    }
    
    toWorld(x, y) {
        return {
            x: (x - canvas.width / 2) / this.scale + this.x,
            y: (y - canvas.height / 2) / this.scale + this.y
        };
    }
    
    handleMouseDown(event) {
        if (event.button === 0) { 
            this.dragging = true;
            const worldPos = this.toWorld(event.clientX, event.clientY);
            this.lastPos = {x: worldPos.x, y: worldPos.y};
        }
    }
    
    handleMouseUp() {
        this.dragging = false;
    }
    
    handleMouseMove(event) {
        if (this.dragging) {
            const worldPos = this.toWorld(event.clientX, event.clientY);
            this.x -= (worldPos.x - this.lastPos.x);
            this.y -= (worldPos.y - this.lastPos.y);
            this.lastPos = this.toWorld(event.clientX, event.clientY);
        }
    }
    
    handleWheel(event) {
        event.preventDefault();
        const zoomFactor = 1.1;
        
        const worldPos = this.toWorld(event.clientX, event.clientY);
        
        if (event.deltaY < 0) {
            this.scale *= zoomFactor;
        } else {
            this.scale /= zoomFactor;
            if (this.scale < 0.1) this.scale = 0.1;
        }
        
        const newWorldPos = this.toWorld(event.clientX, event.clientY);

        this.x += (worldPos.x - newWorldPos.x);
        this.y += (worldPos.y - newWorldPos.y);
    }
}

class Star {
    constructor(width, height) {
        this.x = Math.random() * width * 4 - width * 2;
        this.y = Math.random() * height * 4 - height * 2;
        this.brightness = Math.floor(Math.random() * 205) + 50;
        this.size = Math.random() * 1.5 + 0.5;
    }
    
    draw(ctx, camera) {
        const screenPos = camera.toScreen(this.x, this.y);
        if (screenPos.x > -10 && screenPos.x < canvas.width + 10 && 
            screenPos.y > -10 && screenPos.y < canvas.height + 10) {
            const brightness = this.brightness;
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            const size = Math.max(1, this.size * camera.scale);
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class Debris {
    constructor(belt) {
        const angle = Math.random() * Math.PI * 2;
        const distance = belt.innerRadius + Math.random() * (belt.outerRadius - belt.innerRadius);
        this.x = distance * Math.cos(angle);
        this.y = distance * Math.sin(angle);
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = 0.005 + Math.random() * 0.01;
        this.angle = angle;
        this.belt = belt;
    }

    update() {
        this.angle += this.speed;
        this.x = (this.belt.innerRadius + Math.random() * (this.belt.outerRadius - this.belt.innerRadius)) * Math.cos(this.angle);
        this.y = (this.belt.innerRadius + Math.random() * (this.belt.outerRadius - this.belt.innerRadius)) * Math.sin(this.angle);
    }
    
    draw(ctx, camera) {
        const screenPos = camera.toScreen(this.x, this.y);
        if (screenPos.x > -10 && screenPos.x < canvas.width + 10 && 
            screenPos.y > -10 && screenPos.y < canvas.height + 10) {
            ctx.fillStyle = this.belt.color;
            const size = Math.max(0.5, this.size * camera.scale * 0.5);
            ctx.beginPath();
            ctx.arc(screenPos.x, screenPos.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class Tail {
    constructor(maxLength = 50, color = WHITE) {
        this.points = [];
        this.maxLength = maxLength;
        this.color = color;
        this.maxAlpha = 200;
        this.minAlpha = 20;
    }
    
    addPoint(x, y) {
        this.points.push({x, y});
        if (this.points.length > this.maxLength) {
            this.points.shift();
        }
    }
    
    draw(ctx, camera) {
        if (this.points.length < 2) return;
        
        const pointsCount = this.points.length;
        
        for (let i = 1; i < pointsCount; i++) {
            const alpha = Math.floor(this.minAlpha + (this.maxAlpha - this.minAlpha) * (i / pointsCount));
            const rgba = hexToRgba(this.color, alpha / 255);
            
            const startPos = camera.toScreen(this.points[i-1].x, this.points[i-1].y);
            const endPos = camera.toScreen(this.points[i].x, this.points[i].y);
            
            const thickness = Math.max(1, Math.floor(2 * camera.scale));
            
            for (let j = 0; j < thickness; j++) {
                const offset = (j - thickness/2) * 0.3;
                ctx.strokeStyle = rgba;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(startPos.x + offset, startPos.y + offset);
                ctx.lineTo(endPos.x + offset, endPos.y + offset);
                ctx.stroke();
            }
        }
    }
}

function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getEllipticalPosition(angle, orbitRadius, eccentricity, inclination) {
    const r = orbitRadius * (1 - eccentricity**2) / (1 + eccentricity * Math.cos(angle));
    const orbitX = r * Math.cos(angle);
    const orbitY = r * Math.sin(angle);
    const planetY = orbitY * Math.cos(inclination);
    const planetZ = orbitY * Math.sin(inclination);
    return {
        x: orbitX,
        y: planetY,
        z: planetZ
    };
}

const camera = new Camera();

const stars = [];
for (let i = 0; i < 500; i++) {
    stars.push(new Star(canvas.width, canvas.height));
}

const asteroidBelt = [];
const kuiperBelt = [];

debrisBelts.forEach(belt => {
    for (let i = 0; i < belt.density; i++) {
        if (belt.innerRadius === 280) { 
            asteroidBelt.push(new Debris(belt));
        } else { 
            kuiperBelt.push(new Debris(belt));
        }
    }
});

const planetAngles = planetData.map(() => Math.random() * Math.PI * 2);
const planetTails = planetData.map(p => new Tail(100, p.color + '96'));

let moonAngle = 0;
const moonTail = new Tail(50, MOON_COLOR + '96');

canvas.addEventListener('mousedown', (e) => camera.handleMouseDown(e));
window.addEventListener('mouseup', () => camera.handleMouseUp());
window.addEventListener('mousemove', (e) => camera.handleMouseMove(e));
canvas.addEventListener('wheel', (e) => camera.handleWheel(e), { passive: false });

window.addEventListener('resize', () => {
    resizeCanvas();
});

let animationRunning = true;
let animationId = null;

export function stopAnimation() {
    if (animationRunning) {
        cancelAnimationFrame(animationId);
        animationRunning = false;
    }
}

export function startAnimation() {
    if (!animationRunning) {
        animationRunning = true;
        animate();
    }
}

function animate() {
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => star.draw(ctx, camera));
    
    const worldCenter = {x: 0, y: 0};
    
    const sunScreenPos = camera.toScreen(worldCenter.x, worldCenter.y);
    ctx.fillStyle = YELLOW;
    ctx.beginPath();
    ctx.arc(sunScreenPos.x, sunScreenPos.y, sunRadius * camera.scale, 0, Math.PI * 2);
    ctx.fill();
    
    for (let i = 10; i > 0; i--) {
        const alpha = i * 10;
        const glowRadius = sunRadius * camera.scale + i * 2;
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha/255})`;
        ctx.beginPath();
        ctx.arc(sunScreenPos.x, sunScreenPos.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    asteroidBelt.forEach(debris => {
        debris.update();
        debris.draw(ctx, camera);
    });
    
    kuiperBelt.forEach(debris => {
        debris.update();
        debris.draw(ctx, camera);
    });
    
    planetData.forEach((planet, i) => {
        let planetX, planetY;
        
        if (planet.name === "Pluto") {
            const pos = getEllipticalPosition(
                planetAngles[i], 
                planet.orbitRadius,
                planet.eccentricity,
                planet.inclination
            );
            planetX = pos.x;
            planetY = pos.y + pos.z * 0.5;
        } else {
            planetX = worldCenter.x + planet.orbitRadius * Math.cos(planetAngles[i]);
            planetY = worldCenter.y + planet.orbitRadius * Math.sin(planetAngles[i]);
        }
        
        planetAngles[i] += 0.005 * planet.speed;
        
        planetTails[i].addPoint(planetX, planetY);
        
        planetTails[i].draw(ctx, camera);
        
        const planetScreenPos = camera.toScreen(planetX, planetY);
        const planetRadius = Math.max(1, planet.radius * camera.scale);
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(planetScreenPos.x, planetScreenPos.y, planetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        if (planet.name === "Earth") {
            moonAngle += 0.005 * moonSpeed;
            
            const moonX = planetX + moonOrbitRadius * Math.cos(moonAngle);
            const moonY = planetY + moonOrbitRadius * Math.sin(moonAngle);
            
            moonTail.addPoint(moonX, moonY);
            moonTail.draw(ctx, camera);
            
            const moonScreenPos = camera.toScreen(moonX, moonY);
            const moonRadiusScaled = Math.max(1, moonRadius * camera.scale);
            ctx.fillStyle = MOON_COLOR;
            ctx.beginPath();
            ctx.arc(moonScreenPos.x, moonScreenPos.y, moonRadiusScaled, 0, Math.PI * 2);
            ctx.fill();
            
            if (camera.scale > 0.3) {
                ctx.fillStyle = WHITE;
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText("Moon", moonScreenPos.x, moonScreenPos.y - 10);
            }
        }
        
        if (camera.scale > 0.3) {
            ctx.fillStyle = WHITE;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(planet.name, planetScreenPos.x, planetScreenPos.y - 15);
        }
    });
    
    animationId = requestAnimationFrame(animate);
}

animate();
stopAnimation();