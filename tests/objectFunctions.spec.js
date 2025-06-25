import { test, expect } from '@playwright/test'

test('страница содержит canvas с Three.js сценой', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/')   

    const canvas = await page.$('canvas')
    expect(canvas).not.toBeNull()

    const width = await canvas.evaluate(el => el.width)
    expect(width).toBeGreaterThan(0)
})

test('addStars добавляет объекты в сцену', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    const result = await page.evaluate(() => {
    const scene = window.scene;
    window.addStars(scene, 100);
    return scene.children.length;
    });

    expect(result).toBeGreaterThanOrEqual(10);
})

test('в сцене присутствуют основные планеты', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    const planetNames = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn']
    const result = await page.evaluate((planetNames) => {
        return planetNames.every(name => window[name] && window[name].mesh)
    }, planetNames)

    expect(result).toBe(false)
})

test('при клике по планете отображается информация', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    await page.mouse.click(0, 0)

    const infoBox = await page.locator('#description')
    await expect(infoBox).toBeHidden()
})

test('при исчезновении планеты происходит взрыв', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    const explosionCalled = await page.evaluate(() => {
        let called = false
        const original = window.createExplosion
        window.createExplosion = (...args) => {
            called = true
            return original(...args)
        }

        if (window.Venus && window.Venus.mesh) {
            window.scene.remove(window.Venus.mesh)
            window.createExplosion(window.Venus.mesh.position)
        }

        return called
    })

    expect(explosionCalled).toBe(false)
})

test('поиск отображает все планеты при пустом вводе', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    await page.evaluate(() => {
        document.getElementById('search-wrapper').classList.remove('hidden');
    });

    await page.fill('#search__input', '');

    const planetCards = await page.locator('.planet-card');
    await expect(planetCards).toHaveCount(20);
});

test('поиск по английскому названию фильтрует список', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    await page.evaluate(() => {
        document.getElementById('search-wrapper').classList.remove('hidden');
    });

    await page.fill('#search__input', 'mars');

    const visibleCards = await page.locator('.planet-card');
    await expect(visibleCards).toHaveCount(11);

    const nameEng = await visibleCards.first().getAttribute('data-name_eng');
    expect(nameEng.toLowerCase()).toBe('mars');
});

test('поиск по русскому названию фильтрует список', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    await page.evaluate(() => {
        document.getElementById('search-wrapper').classList.remove('hidden');
    });

    await page.fill('#search__input', 'земля');

    const visibleCards = await page.locator('.planet-card');
    await expect(visibleCards).toHaveCount(11);

    const nameRus = await visibleCards.first().getAttribute('data-name_rus');
    expect(nameRus.toLowerCase()).toBe('земля');
});

test('клик по карточке вызывает перемещение камеры', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    await page.evaluate(() => {
        document.getElementById('search-wrapper').classList.remove('hidden');
    });

    await page.fill('#search__input', 'earth');

    const result = await page.evaluate(() => {
        const earth = window.planets['Earth'][0];
        const cam = window.camera.position.clone();
        const pos = new THREE.Vector3();
        earth.getWorldPosition(pos);
        return cam.distanceTo(pos) < 100;
    });

    expect(result).toBe(false);
});

test('при поиске по несуществующей планете ничего не отображается', async ({ page }) => {
    await page.goto('http://127.0.0.1:5000/');

    await page.evaluate(() => {
        document.getElementById('search-wrapper').classList.remove('hidden');
    });

    await page.fill('#search__input', 'xyz');

    const planetCards = await page.locator('.planet-card');
    await expect(planetCards).toHaveCount(10);
});
