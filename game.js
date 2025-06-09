// Game state
let gameState = {
    player: { x: 400, y: 300, radius: 8, speed: 2 },
    level: 1,
    xp: 0,
    xpNeeded: 100,
    skillPoints: 0,
            landmarksFound: 0,
        resourcesCollected: 0,
        inventory: {
            wood: 0,
            stone: 0,
            gold: 0,
            fish: 0,
            herbs: 0,
            sand_glass: 0,
            peat: 0
        },
    resourcesCollected: 0,
    inventory: {
        wood: 0,
        stone: 0,
        gold: 0,
        fish: 0,
        herbs: 0,
        sand_glass: 0,
        peat: 0
    },
    time: {
        gameHours: 6, // Start at 6 AM
        gameMinutes: 0,
        dayStartTime: Date.now(),
        realTimePerGameDay: 30 * 60 * 1000, // 30 minutes in milliseconds
        isPaused: false
    },
    cabin: {
        x: 400,
        y: 300,
        radius: 80, // Safe zone radius
        upgrades: {
            storage: 1,
            fireplace: 1,
            workbench: 1
        }
    },
    isInCabin: true,
    time: {
        gameHours: 6, // Start at 6 AM
        gameMinutes: 0,
        dayStartTime: Date.now(),
        realTimePerGameDay: 30 * 60 * 1000, // 30 minutes in milliseconds
        isPaused: false
    },
    cabin: {
        x: 400,
        y: 300,
        radius: 80, // Safe zone radius
        upgrades: {
            storage: 1,
            fireplace: 1,
            workbench: 1
        }
    },
    isInCabin: true,
    skills: {
        // Movement Skills
        speed1: { owned: false, cost: 1, name: "Swift Steps", desc: "Move 25% faster" },
        speed2: { owned: false, cost: 2, name: "Fleet Foot", desc: "Move 50% faster", requires: "speed1" },
        speed3: { owned: false, cost: 3, name: "Wind Walker", desc: "Move 100% faster", requires: "speed2" },
        
        // Vision Skills  
        vision1: { owned: false, cost: 1, name: "Sharp Eyes", desc: "See 25% further" },
        vision2: { owned: false, cost: 2, name: "Eagle Sight", desc: "See 50% further", requires: "vision1" },
        vision3: { owned: false, cost: 3, name: "Far Sight", desc: "See 100% further", requires: "vision2" },
        
        // Discovery Skills
        luck1: { owned: false, cost: 2, name: "Lucky Find", desc: "+25% XP from discoveries" },
        luck2: { owned: false, cost: 3, name: "Fortune's Favor", desc: "+50% XP from discoveries", requires: "luck1" },
        luck3: { owned: false, cost: 4, name: "Blessed Explorer", desc: "+100% XP from discoveries", requires: "luck2" },
        
        // Efficiency Skills
        stamina1: { owned: false, cost: 2, name: "Endurance", desc: "Explore tiles 25% faster" },
        stamina2: { owned: false, cost: 3, name: "Tireless", desc: "Explore tiles 50% faster", requires: "stamina1" },
        
        // Rare Skills
        treasure: { owned: false, cost: 5, name: "Treasure Hunter", desc: "Chance to find bonus XP caches" },
        pathfinder: { owned: false, cost: 4, name: "Pathfinder", desc: "Leave trails showing where you've been" },
        cartographer: { owned: false, cost: 6, name: "Master Cartographer", desc: "Reveal unexplored landmark locations", requires: "vision2" },
        
        // Legendary Skills
        teleport: { owned: false, cost: 8, name: "Mystic Step", desc: "Click anywhere to teleport there", requires: "speed3" },
        omniscient: { owned: false, cost: 10, name: "All-Seeing", desc: "Reveal entire map", requires: "cartographer" }
    },
    world: {
        width: 4000,
        height: 3000,
        tileSize: 20
    },
    camera: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 },
    isMouseDown: false
};

// World data
let exploredTiles = new Set();
let landmarks = [];
let discoveredLandmarks = new Set();
let terrainMap = new Map();
let resourceNodes = [];
let discoveredResources = new Set();

// Canvas and context
let canvas, ctx;

// Terrain types with properties
const terrainTypes = {
    grass: { color: "#4a7c3c", speedMod: 1.0, passable: true, name: "Grassland" },
    forest: { color: "#2d5a27", speedMod: 0.7, passable: true, name: "Dense Forest" },
    water: { color: "#1e6091", speedMod: 0.3, passable: true, name: "Water" },
    sand: { color: "#c2b280", speedMod: 0.6, passable: true, name: "Desert" },
    mud: { color: "#8b7355", speedMod: 0.4, passable: true, name: "Swampland" },
    mountain: { color: "#8c8c8c", speedMod: 0, passable: false, name: "Mountain" },
    hills: { color: "#a8a870", speedMod: 0.8, passable: true, name: "Hills" },
    stone: { color: "#6e6e6e", speedMod: 0.9, passable: true, name: "Rocky Ground" }
};

// Resource types that spawn on different terrains
const resourceTypes = {
    wood: { color: "#8b4513", terrains: ["forest"], xp: 15, name: "Wood" },
    stone: { color: "#696969", terrains: ["mountain", "hills", "stone"], xp: 20, name: "Stone" },
    gold: { color: "#ffd700", terrains: ["mountain", "hills"], xp: 50, name: "Gold Ore" },
    fish: { color: "#4682b4", terrains: ["water"], xp: 25, name: "Fish" },
    herbs: { color: "#32cd32", terrains: ["grass", "forest"], xp: 18, name: "Herbs" },
    sand_glass: { color: "#f5deb3", terrains: ["sand"], xp: 30, name: "Sand Glass" },
    peat: { color: "#654321", terrains: ["mud"], xp: 22, name: "Peat" }
};

// Landmark types for variety
const landmarkTypes = [
    { name: "Ancient Obelisk", xp: 50, color: "#dc3545" },
    { name: "Mystical Spring", xp: 75, color: "#17a2b8" },
    { name: "Old Watchtower", xp: 60, color: "#6c757d" },
    { name: "Crystal Formation", xp: 100, color: "#6f42c1" },
    { name: "Sacred Grove", xp: 80, color: "#28a745" },
    { name: "Forgotten Ruins", xp: 120, color: "#fd7e14" }
];

// Initialize game
function initGame() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Generate world terrain
    generateTerrain();
    
    // Find safe spawn location for player
    findSafeSpawnLocation();
    
    // Generate landmarks and resources
    generateLandmarks();
    generateResources();
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    // Start game loop
    gameLoop();
    updateUI();
}

function findSafeSpawnLocation() {
    // Always spawn at cabin - it's the home base!
    gameState.player.x = gameState.cabin.x;
    gameState.player.y = gameState.cabin.y;
    
    // Ensure cabin area is grass terrain
    const radius = 3; // Clear a small area around cabin
    const cabinTileX = Math.floor(gameState.cabin.x / gameState.world.tileSize);
    const cabinTileY = Math.floor(gameState.cabin.y / gameState.world.tileSize);
    
    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            const tileX = cabinTileX + dx;
            const tileY = cabinTileY + dy;
            terrainMap.set(`${tileX},${tileY}`, 'grass');
        }
    }
    
    gameState.isInCabin = true;
}

function generateTerrain() {
    terrainMap.clear();
    const tileSize = gameState.world.tileSize;
    const worldWidth = Math.ceil(gameState.world.width / tileSize);
    const worldHeight = Math.ceil(gameState.world.height / tileSize);
    
    // Create noise-like terrain generation
    for (let x = 0; x < worldWidth; x++) {
        for (let y = 0; y < worldHeight; y++) {
            const noise = (Math.sin(x * 0.1) + Math.cos(y * 0.1) + Math.sin((x + y) * 0.05)) / 3;
            const heightNoise = (Math.sin(x * 0.03) + Math.cos(y * 0.03)) / 2;
            
            let terrain = 'grass'; // default
            
            // Water bodies (low noise areas)
            if (noise < -0.4) {
                terrain = 'water';
            }
            // Mountains (high height + high noise)
            else if (heightNoise > 0.3 && noise > 0.2) {
                terrain = 'mountain';
            }
            // Hills (moderate height)
            else if (heightNoise > 0.1) {
                terrain = 'hills';
            }
            // Desert areas (specific noise pattern)
            else if (Math.sin(x * 0.07) + Math.cos(y * 0.09) > 0.5) {
                terrain = 'sand';
            }
            // Swamps (near water)
            else if (noise < -0.1 && heightNoise < 0.1) {
                terrain = 'mud';
            }
            // Forests (moderate noise)
            else if (noise > 0.1 && heightNoise < 0.2) {
                terrain = 'forest';
            }
            // Rocky areas
            else if (heightNoise > 0.05 && noise > 0.0) {
                terrain = 'stone';
            }
            
            terrainMap.set(`${x},${y}`, terrain);
        }
    }
}

function generateResources() {
    resourceNodes = [];
    const numResources = 200; // Lots of resources to find
    
    for (let i = 0; i < numResources; i++) {
        const x = Math.random() * (gameState.world.width - 40) + 20;
        const y = Math.random() * (gameState.world.height - 40) + 20;
        
        // Get terrain at this location
        const tileX = Math.floor(x / gameState.world.tileSize);
        const tileY = Math.floor(y / gameState.world.tileSize);
        const terrain = terrainMap.get(`${tileX},${tileY}`) || 'grass';
        
        // Find compatible resource types for this terrain
        const compatibleResources = Object.entries(resourceTypes).filter(
            ([_, resourceType]) => resourceType.terrains.includes(terrain)
        );
        
        if (compatibleResources.length > 0) {
            const [resourceKey, resourceType] = compatibleResources[
                Math.floor(Math.random() * compatibleResources.length)
            ];
            
            resourceNodes.push({
                x: x,
                y: y,
                radius: 6,
                type: resourceKey,
                resourceType: resourceType,
                id: i
            });
        }
    }
}

function generateLandmarks() {
    landmarks = [];
    const numLandmarks = 50; // More landmarks for bigger world
    const minDistance = 200; // Minimum distance between landmarks
    
    for (let i = 0; i < numLandmarks; i++) {
        let attempts = 0;
        let validPosition = false;
        let landmark;
        
        while (!validPosition && attempts < 100) {
            landmark = {
                x: Math.random() * (gameState.world.width - 200) + 100,
                y: Math.random() * (gameState.world.height - 200) + 100,
                radius: 15,
                type: landmarkTypes[Math.floor(Math.random() * landmarkTypes.length)],
                id: i
            };
            
            // Check distance from other landmarks
            validPosition = landmarks.every(existingLandmark => {
                const distance = Math.sqrt(
                    (landmark.x - existingLandmark.x) ** 2 + 
                    (landmark.y - existingLandmark.y) ** 2
                );
                return distance >= minDistance;
            });
            
            attempts++;
        }
        
        if (validPosition) {
            landmarks.push(landmark);
        }
    }
}

function handleMouseDown(e) {
    gameState.isMouseDown = true;
    updateMousePos(e);
}

function handleMouseUp(e) {
    gameState.isMouseDown = false;
}

function handleMouseMove(e) {
    updateMousePos(e);
}

function handleClick(e) {
    updateMousePos(e);
}

function updateMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    gameState.mousePos.x = e.clientX - rect.left;
    gameState.mousePos.y = e.clientY - rect.top;
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Move player towards mouse position if mouse is down
    if (gameState.isMouseDown) {
        const worldMouseX = gameState.mousePos.x + gameState.camera.x;
        const worldMouseY = gameState.mousePos.y + gameState.camera.y;
        
        const dx = worldMouseX - gameState.player.x;
        const dy = worldMouseY - gameState.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            // Check terrain at player position for movement speed
            const playerTileX = Math.floor(gameState.player.x / gameState.world.tileSize);
            const playerTileY = Math.floor(gameState.player.y / gameState.world.tileSize);
            const currentTerrain = terrainMap.get(`${playerTileX},${playerTileY}`) || 'grass';
            const terrainSpeed = terrainTypes[currentTerrain].speedMod;
            
            // Emergency check: if player is stuck in impassable terrain, move them to safety
            if (!terrainTypes[currentTerrain].passable) {
                // Find nearest passable tile
                for (let radius = 1; radius <= 5; radius++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        for (let dy = -radius; dy <= radius; dy++) {
                            const checkX = playerTileX + dx;
                            const checkY = playerTileY + dy;
                            const checkTerrain = terrainMap.get(`${checkX},${checkY}`) || 'grass';
                            
                            if (terrainTypes[checkTerrain].passable) {
                                gameState.player.x = (checkX * gameState.world.tileSize) + (gameState.world.tileSize / 2);
                                gameState.player.y = (checkY * gameState.world.tileSize) + (gameState.world.tileSize / 2);
                                return; // Exit early once we find safety
                            }
                        }
                    }
                }
            }
            
            // Check if destination terrain is passable
            const targetX = gameState.player.x + (dx / distance) * gameState.player.speed;
            const targetY = gameState.player.y + (dy / distance) * gameState.player.speed;
            const targetTileX = Math.floor(targetX / gameState.world.tileSize);
            const targetTileY = Math.floor(targetY / gameState.world.tileSize);
            const targetTerrain = terrainMap.get(`${targetTileX},${targetTileY}`) || 'grass';
            
            if (terrainTypes[targetTerrain].passable) {
                let speedMultiplier = 1;
                if (gameState.skills.speed1.owned) speedMultiplier += 0.25;
                if (gameState.skills.speed2.owned) speedMultiplier += 0.25;
                if (gameState.skills.speed3.owned) speedMultiplier += 0.5;
                
                const speed = gameState.player.speed * speedMultiplier * terrainSpeed;
                gameState.player.x += (dx / distance) * speed;
                gameState.player.y += (dy / distance) * speed;
            }
            
            // Keep player in bounds
            gameState.player.x = Math.max(gameState.player.radius, 
                Math.min(gameState.world.width - gameState.player.radius, gameState.player.x));
            gameState.player.y = Math.max(gameState.player.radius, 
                Math.min(gameState.world.height - gameState.player.radius, gameState.player.y));
        }
    }
    
    // Update camera to follow player
    gameState.camera.x = gameState.player.x - canvas.width / 2;
    gameState.camera.y = gameState.player.y - canvas.height / 2;
    
    // Keep camera in bounds
    gameState.camera.x = Math.max(0, Math.min(gameState.world.width - canvas.width, gameState.camera.x));
    gameState.camera.y = Math.max(0, Math.min(gameState.world.height - canvas.height, gameState.camera.y));
    
    // Update explored tiles
    updateExploredTiles();
    
    // Check for landmark discoveries
    checkLandmarkDiscoveries();
    
    // Check for resource collection
    checkResourceCollection();
    
    // Update game time
    updateGameTime();
    
    // Check cabin status
    checkCabinProximity();
}

function updateExploredTiles() {
    let visionRange = 60;
    if (gameState.skills.vision1.owned) visionRange += 15;
    if (gameState.skills.vision2.owned) visionRange += 15;
    if (gameState.skills.vision3.owned) visionRange += 30;
    
    const tileSize = gameState.world.tileSize;
    
    const startX = Math.floor((gameState.player.x - visionRange) / tileSize);
    const endX = Math.floor((gameState.player.x + visionRange) / tileSize);
    const startY = Math.floor((gameState.player.y - visionRange) / tileSize);
    const endY = Math.floor((gameState.player.y + visionRange) / tileSize);
    
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            const tileKey = `${x},${y}`;
            const tileCenterX = x * tileSize + tileSize / 2;
            const tileCenterY = y * tileSize + tileSize / 2;
            
            const distance = Math.sqrt(
                (tileCenterX - gameState.player.x) ** 2 + 
                (tileCenterY - gameState.player.y) ** 2
            );
            
            if (distance <= visionRange) {
                exploredTiles.add(tileKey);
            }
        }
    }
}

function checkLandmarkDiscoveries() {
    landmarks.forEach(landmark => {
        if (discoveredLandmarks.has(landmark.id)) return;
        
        const distance = Math.sqrt(
            (landmark.x - gameState.player.x) ** 2 + 
            (landmark.y - gameState.player.y) ** 2
        );
        
        if (distance <= gameState.player.radius + landmark.radius) {
            discoverLandmark(landmark);
        }
    });
}

function checkResourceCollection() {
    resourceNodes.forEach(resource => {
        if (discoveredResources.has(resource.id)) return;
        
        const distance = Math.sqrt(
            (resource.x - gameState.player.x) ** 2 + 
            (resource.y - gameState.player.y) ** 2
        );
        
        if (distance <= gameState.player.radius + resource.radius) {
            collectResource(resource);
        }
    });
}

function collectResource(resource) {
    discoveredResources.add(resource.id);
    gameState.resourcesCollected++;
    gameState.inventory[resource.type]++;
    
    let xpMultiplier = 1;
    if (gameState.skills.luck1.owned) xpMultiplier += 0.25;
    if (gameState.skills.luck2.owned) xpMultiplier += 0.25;
    if (gameState.skills.luck3.owned) xpMultiplier += 0.5;
    
    const xpGain = Math.floor(resource.resourceType.xp * xpMultiplier);
    gainXP(xpGain);
    
    showResourcePopup(resource, xpGain);
}

function updateGameTime() {
    if (gameState.time.isPaused) return;
    
    const now = Date.now();
    const elapsed = now - gameState.time.dayStartTime;
    const gameTimeElapsed = (elapsed / gameState.time.realTimePerGameDay) * 24 * 60; // minutes since start
    
    const totalGameMinutes = gameTimeElapsed;
    gameState.time.gameHours = Math.floor(totalGameMinutes / 60) % 24;
    gameState.time.gameMinutes = Math.floor(totalGameMinutes % 60);
    
    // If it's a new day, reset
    if (totalGameMinutes >= 24 * 60) {
        gameState.time.dayStartTime = now;
    }
}

function checkCabinProximity() {
    const distanceToCabin = Math.sqrt(
        (gameState.player.x - gameState.cabin.x) ** 2 + 
        (gameState.player.y - gameState.cabin.y) ** 2
    );
    
    const wasInCabin = gameState.isInCabin;
    gameState.isInCabin = distanceToCabin <= gameState.cabin.radius;
    
    // Show message when entering/leaving cabin
    if (!wasInCabin && gameState.isInCabin) {
        showCabinMessage("Welcome home! You're safe in your cabin.");
    } else if (wasInCabin && !gameState.isInCabin) {
        showCabinMessage("You've left the safety of your cabin. Be careful out there!");
    }
    
    // Pause time when in cabin (optional - makes it feel more like a base)
    gameState.time.isPaused = gameState.isInCabin;
}

function showCabinMessage(message) {
    // Create a simple message system for cabin enter/exit
    const existingMessage = document.getElementById('cabin-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.id = 'cabin-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 1001;
        text-align: center;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 2000);
}

function isNightTime() {
    return gameState.time.gameHours >= 20 || gameState.time.gameHours < 6;
}

function getDangerLevel() {
    if (gameState.isInCabin) return 0;
    if (isNightTime()) return 3; // High danger at night
    if (gameState.time.gameHours >= 18 || gameState.time.gameHours < 8) return 1; // Twilight danger
    return 0; // Safe during day
}

function discoverLandmark(landmark) {
    discoveredLandmarks.add(landmark.id);
    gameState.landmarksFound++;
    
    let xpMultiplier = 1;
    if (gameState.skills.luck1.owned) xpMultiplier += 0.25;
    if (gameState.skills.luck2.owned) xpMultiplier += 0.25;
    if (gameState.skills.luck3.owned) xpMultiplier += 0.5;
    
    const xpGain = Math.floor(landmark.type.xp * xpMultiplier);
    gainXP(xpGain);
    
    showDiscoveryPopup(landmark, xpGain);
}

function gainXP(amount) {
    gameState.xp += amount;
    
    while (gameState.xp >= gameState.xpNeeded) {
        levelUp();
    }
    
    updateUI();
}

function levelUp() {
    gameState.xp -= gameState.xpNeeded;
    gameState.level++;
    gameState.skillPoints++;
    gameState.xpNeeded = Math.floor(gameState.xpNeeded * 1.2);
    
    showLevelUpPopup();
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save context for camera transform
    ctx.save();
    ctx.translate(-gameState.camera.x, -gameState.camera.y);
    
    // Render terrain (background)
    renderTerrain();
    
    // Render explored areas overlay
    renderExploredAreas();
    
    // Render resources
    renderResources();
    
    // Render cabin
    renderCabin();
    
    // Render landmarks
    renderLandmarks();
    
    // Render player
    renderPlayer();
    
    // Render day/night overlay
    renderDayNightOverlay();
    
    // Restore context
    ctx.restore();
}

function renderTerrain() {
    const tileSize = gameState.world.tileSize;
    
    // Render all terrain (world background)
    terrainMap.forEach((terrainType, tileKey) => {
        const [x, y] = tileKey.split(',').map(Number);
        ctx.fillStyle = terrainTypes[terrainType].color;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
}

function renderExploredAreas() {
    const tileSize = gameState.world.tileSize;
    
    // Add a slight overlay to show explored vs unexplored
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Dark overlay for unexplored
    
    // Fill entire visible area with dark overlay
    ctx.fillRect(
        gameState.camera.x - 50, 
        gameState.camera.y - 50, 
        canvas.width + 100, 
        canvas.height + 100
    );
    
    // Clear overlay for explored tiles
    ctx.globalCompositeOperation = 'destination-out';
    exploredTiles.forEach(tileKey => {
        const [x, y] = tileKey.split(',').map(Number);
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
    ctx.globalCompositeOperation = 'source-over';
}

function renderResources() {
    resourceNodes.forEach(resource => {
        const tileKey = `${Math.floor(resource.x / gameState.world.tileSize)},${Math.floor(resource.y / gameState.world.tileSize)}`;
        
        if (exploredTiles.has(tileKey) && !discoveredResources.has(resource.id)) {
            ctx.fillStyle = resource.resourceType.color;
            ctx.beginPath();
            ctx.arc(resource.x, resource.y, resource.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add a white outline
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

function renderLandmarks() {
    landmarks.forEach(landmark => {
        const tileKey = `${Math.floor(landmark.x / gameState.world.tileSize)},${Math.floor(landmark.y / gameState.world.tileSize)}`;
        
        if (exploredTiles.has(tileKey)) {
            ctx.fillStyle = discoveredLandmarks.has(landmark.id) 
                ? '#666' 
                : landmark.type.color;
            ctx.beginPath();
            ctx.arc(landmark.x, landmark.y, landmark.radius, 0, Math.PI * 2);
            ctx.fill();
            
            if (!discoveredLandmarks.has(landmark.id)) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    });
}

function renderPlayer() {
    ctx.fillStyle = '#007bff';
    ctx.beginPath();
    ctx.arc(gameState.player.x, gameState.player.y, gameState.player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function renderCabin() {
    // Cabin building
    ctx.fillStyle = '#8b4513'; // Brown wood
    ctx.fillRect(gameState.cabin.x - 25, gameState.cabin.y - 20, 50, 40);
    
    // Cabin roof
    ctx.fillStyle = '#654321'; // Darker brown
    ctx.beginPath();
    ctx.moveTo(gameState.cabin.x - 30, gameState.cabin.y - 20);
    ctx.lineTo(gameState.cabin.x, gameState.cabin.y - 35);
    ctx.lineTo(gameState.cabin.x + 30, gameState.cabin.y - 20);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(gameState.cabin.x - 5, gameState.cabin.y + 5, 10, 15);
    
    // Fireplace (outside)
    ctx.fillStyle = '#666';
    ctx.fillRect(gameState.cabin.x + 35, gameState.cabin.y - 5, 15, 10);
    
    // Fire effect (if player is in cabin)
    if (gameState.isInCabin) {
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.arc(gameState.cabin.x + 42, gameState.cabin.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Safe zone circle (subtle)
    ctx.strokeStyle = gameState.isInCabin ? '#28a745' : 'rgba(40, 167, 69, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(gameState.cabin.x, gameState.cabin.y, gameState.cabin.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function renderDayNightOverlay() {
    const dangerLevel = getDangerLevel();
    
    if (dangerLevel > 0) {
        let alpha = 0;
        if (dangerLevel === 1) alpha = 0.2; // Twilight
        if (dangerLevel === 3) alpha = 0.5; // Night
        
        ctx.fillStyle = `rgba(0, 0, 40, ${alpha})`;
        ctx.fillRect(
            gameState.camera.x, 
            gameState.camera.y, 
            canvas.width, 
            canvas.height
        );
    }
}

function updateUI() {
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('xp').textContent = gameState.xp;
    document.getElementById('xp-needed').textContent = gameState.xpNeeded;
    document.getElementById('landmarks-found').textContent = gameState.landmarksFound;
    document.getElementById('resources-collected').textContent = gameState.resourcesCollected;
    document.getElementById('skill-points').textContent = gameState.skillPoints;
    
    // Update time display
    const timeString = `${gameState.time.gameHours.toString().padStart(2, '0')}:${gameState.time.gameMinutes.toString().padStart(2, '0')}`;
    document.getElementById('game-time').textContent = timeString;
    
    // Update location status
    const locationElement = document.getElementById('location-status');
    if (gameState.isInCabin) {
        locationElement.textContent = 'At Cabin (Safe)';
        locationElement.style.color = '#28a745';
    } else {
        const dangerLevel = getDangerLevel();
        if (dangerLevel === 0) {
            locationElement.textContent = 'Exploring (Safe)';
            locationElement.style.color = '#17a2b8';
        } else if (dangerLevel === 1) {
            locationElement.textContent = 'Exploring (Twilight)';
            locationElement.style.color = '#ffc107';
        } else {
            locationElement.textContent = 'Exploring (DANGEROUS!)';
            locationElement.style.color = '#dc3545';
        }
    }
    
    // Update inventory counts
    Object.keys(gameState.inventory).forEach(resourceType => {
        const element = document.getElementById(resourceType + '-count');
        if (element) {
            element.textContent = gameState.inventory[resourceType];
        }
    });
    
    // Update XP bar
    const xpProgress = (gameState.xp / gameState.xpNeeded) * 100;
    document.getElementById('xp-bar').style.width = xpProgress + '%';
    
    // Update skill buttons
    updateSkillButtons();
}

function updateSkillButtons() {
    Object.keys(gameState.skills).forEach(skillName => {
        const skill = gameState.skills[skillName];
        const button = document.getElementById(skillName + '-skill');
        
        if (!button) return; // Skip if button doesn't exist
        
        if (skill.owned) {
            button.classList.add('owned');
            button.disabled = true;
            button.innerHTML = button.innerHTML.replace(/Cost: \d+/, 'OWNED');
        } else {
            // Check if prerequisites are met
            let prereqMet = true;
            if (skill.requires && !gameState.skills[skill.requires].owned) {
                prereqMet = false;
            }
            
            if (!prereqMet) {
                button.disabled = true;
                button.style.opacity = '0.5';
            } else if (gameState.skillPoints >= skill.cost) {
                button.disabled = false;
                button.style.opacity = '1';
            } else {
                button.disabled = true;
                button.style.opacity = '0.7';
            }
        }
    });
}

function buySkill(skillName) {
    const skill = gameState.skills[skillName];
    
    if (skill.owned || gameState.skillPoints < skill.cost) return;
    
    // Check prerequisites
    if (skill.requires && !gameState.skills[skill.requires].owned) return;
    
    gameState.skillPoints -= skill.cost;
    skill.owned = true;
    
    updateUI();
}

function showDiscoveryPopup(landmark, xpGain) {
    document.getElementById('discovery-text').innerHTML = 
        `You discovered the <strong>${landmark.type.name}</strong>!<br>
         Gained <strong>${xpGain} XP</strong>`;
    document.getElementById('discovery-popup').classList.remove('hidden');
    
    // Auto-close after 2 seconds
    setTimeout(() => {
        document.getElementById('discovery-popup').classList.add('hidden');
    }, 2000);
}

function showResourcePopup(resource, xpGain) {
    document.getElementById('resource-text').innerHTML = 
        `You collected <strong>${resource.resourceType.name}</strong>!<br>
         Gained <strong>${xpGain} XP</strong>`;
    document.getElementById('resource-popup').classList.remove('hidden');
    
    // Auto-close after 1.5 seconds (faster for resources since they're more frequent)
    setTimeout(() => {
        document.getElementById('resource-popup').classList.add('hidden');
    }, 1500);
}

function showLevelUpPopup() {
    document.getElementById('new-level').textContent = gameState.level;
    document.getElementById('level-up-popup').classList.remove('hidden');
    
    // Auto-close after 3 seconds (longer for level up since it's more important)
    setTimeout(() => {
        document.getElementById('level-up-popup').classList.add('hidden');
    }, 3000);
}

function closePopup() {
    document.querySelectorAll('.notification').forEach(notification => {
        notification.classList.add('hidden');
    });
}

function resetGame() {
    // Reset game state
    gameState = {
        player: { x: 400, y: 300, radius: 8, speed: 2 },
        level: 1,
        xp: 0,
        xpNeeded: 100,
        skillPoints: 0,
        landmarksFound: 0,
        resourcesCollected: 0,
        inventory: {
            wood: 0,
            stone: 0,
            gold: 0,
            fish: 0,
            herbs: 0,
            sand_glass: 0,
            peat: 0
        },
        time: {
            gameHours: 6, // Start at 6 AM
            gameMinutes: 0,
            dayStartTime: Date.now(),
            realTimePerGameDay: 30 * 60 * 1000, // 30 minutes in milliseconds
            isPaused: false
        },
        cabin: {
            x: 400,
            y: 300,
            radius: 80, // Safe zone radius
            upgrades: {
                storage: 1,
                fireplace: 1,
                workbench: 1
            }
        },
        isInCabin: true,
        skills: {
            // Movement Skills
            speed1: { owned: false, cost: 1, name: "Swift Steps", desc: "Move 25% faster" },
            speed2: { owned: false, cost: 2, name: "Fleet Foot", desc: "Move 50% faster", requires: "speed1" },
            speed3: { owned: false, cost: 3, name: "Wind Walker", desc: "Move 100% faster", requires: "speed2" },
            
            // Vision Skills  
            vision1: { owned: false, cost: 1, name: "Sharp Eyes", desc: "See 25% further" },
            vision2: { owned: false, cost: 2, name: "Eagle Sight", desc: "See 50% further", requires: "vision1" },
            vision3: { owned: false, cost: 3, name: "Far Sight", desc: "See 100% further", requires: "vision2" },
            
            // Discovery Skills
            luck1: { owned: false, cost: 2, name: "Lucky Find", desc: "+25% XP from discoveries" },
            luck2: { owned: false, cost: 3, name: "Fortune's Favor", desc: "+50% XP from discoveries", requires: "luck1" },
            luck3: { owned: false, cost: 4, name: "Blessed Explorer", desc: "+100% XP from discoveries", requires: "luck2" },
            
            // Efficiency Skills
            stamina1: { owned: false, cost: 2, name: "Endurance", desc: "Explore tiles 25% faster" },
            stamina2: { owned: false, cost: 3, name: "Tireless", desc: "Explore tiles 50% faster", requires: "stamina1" },
            
            // Rare Skills
            treasure: { owned: false, cost: 5, name: "Treasure Hunter", desc: "Chance to find bonus XP caches" },
            pathfinder: { owned: false, cost: 4, name: "Pathfinder", desc: "Leave trails showing where you've been" },
            cartographer: { owned: false, cost: 6, name: "Master Cartographer", desc: "Reveal unexplored landmark locations", requires: "vision2" },
            
            // Legendary Skills
            teleport: { owned: false, cost: 8, name: "Mystic Step", desc: "Click anywhere to teleport there", requires: "speed3" },
            omniscient: { owned: false, cost: 10, name: "All-Seeing", desc: "Reveal entire map", requires: "cartographer" }
        },
        world: {
            width: 4000,
            height: 3000,
            tileSize: 20
        },
        camera: { x: 0, y: 0 },
        mousePos: { x: 0, y: 0 },
        isMouseDown: false
    };
    
    // Reset world data
    exploredTiles.clear();
    discoveredLandmarks.clear();
    discoveredResources.clear();
    terrainMap.clear();
    
    // Generate new world
    generateTerrain();
    findSafeSpawnLocation();
    generateLandmarks();
    generateResources();
    
    // Update UI
    updateUI();
    
    // Reset all skill buttons
    document.querySelectorAll('.skill').forEach(button => {
        button.classList.remove('owned');
        button.disabled = false;
        button.style.opacity = '1';
        
        // Reset button text by removing OWNED and restoring cost
        const originalText = button.innerHTML.replace('OWNED', button.id.includes('speed1') ? 'Cost: 1' :
                                                                 button.id.includes('vision1') ? 'Cost: 1' :
                                                                 button.id.includes('speed2') ? 'Cost: 2' :
                                                                 button.id.includes('vision2') ? 'Cost: 2' :
                                                                 button.id.includes('luck1') ? 'Cost: 2' :
                                                                 button.id.includes('stamina1') ? 'Cost: 2' :
                                                                 button.id.includes('speed3') ? 'Cost: 3' :
                                                                 button.id.includes('vision3') ? 'Cost: 3' :
                                                                 button.id.includes('luck2') ? 'Cost: 3' :
                                                                 button.id.includes('stamina2') ? 'Cost: 3' :
                                                                 button.id.includes('luck3') ? 'Cost: 4' :
                                                                 button.id.includes('pathfinder') ? 'Cost: 4' :
                                                                 button.id.includes('treasure') ? 'Cost: 5' :
                                                                 button.id.includes('cartographer') ? 'Cost: 6' :
                                                                 button.id.includes('teleport') ? 'Cost: 8' :
                                                                 button.id.includes('omniscient') ? 'Cost: 10' : 'Cost: ?');
        button.innerHTML = originalText;
    });
}

// Start the game when page loads
window.addEventListener('load', initGame); 