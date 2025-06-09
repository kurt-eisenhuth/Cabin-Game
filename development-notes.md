# Open World Game Prototype - Development Notes

## Core Game Concept
A 2D top-down exploration game combining the best mechanics of open world games with persistent progression (Final Fantasy/Stardew Valley hybrid). Focus on the psychology of constant small rewards and meaningful progression.

## Key Design Principles
- **Progress Always Forward**: Not a roguelike - all progress is permanent
- **Constant Rewards**: Small, frequent rewards to maintain engagement
- **Meaningful Progression**: Each level/skill unlock should feel impactful
- **Exploration Loop**: Move → Discover → Reward → Want More

## Core Mechanics (Prototype Phase)

### 1. Player Movement
- 2D top-down view
- Tap/drag to move around map
- Smooth movement with basic collision detection

### 2. World Exploration
- **Fog of War**: Unexplored areas are dark/hidden
- **Landmarks/Outposts**: Discoverable points that unlock new map areas
- **Area Unlocking**: Finding landmarks reveals new sections of the world
- **Persistent Discovery**: Once explored, areas stay revealed

### 3. Progression System
- **Experience Points**: Gained from exploration, discovery, activities
- **Level System**: Clear progression with satisfying level-up moments
- **Skill Tree**: Unlock new abilities and improvements
- **Permanent Upgrades**: All progress carries forward

### 4. Visual Design (Prototype)
- **Player**: Blue circle
- **Landmarks/Outposts**: Red squares
- **Unexplored Areas**: Dark gray/black
- **Explored Areas**: Light green
- **Collectibles/Resources**: Yellow dots
- **UI Elements**: Simple, clean interface

## Game Loop Design
1. **Explore** → Move around the world
2. **Discover** → Find landmarks, resources, secrets
3. **Progress** → Gain XP, level up, unlock skills
4. **Expand** → New areas unlock, more to explore
5. **Repeat** → Cycle continues with increasing rewards

## Future Story Elements (Post-Prototype)
- **Setting**: Family cabin vacation gone wrong
- **Mystery**: Family disappears but protagonist doesn't realize
- **Day/Night Cycle**: Daytime exploration, nighttime survival
- **Ghost Elements**: Psychological horror during night phases
- **Environmental Storytelling**: Clues discovered through exploration

### Cabin Game Elements (Future)
- **Daytime Activities**: Explore, gather resources, prepare
- **Nighttime Survival**: Manage temperature, face supernatural threats
- **Resource Management**: Wood, food, tools, comfort items
- **Story Progression**: Mystery unfolds through discovered clues

## Technical Implementation

### Prototype Tech Stack
- **Platform**: Web-based (HTML5 Canvas)
- **Languages**: HTML, CSS, JavaScript
- **Graphics**: Simple shapes and colors
- **Local Development**: Fully portable, no external dependencies

### iOS Migration (Future)
- Convert to Swift/SpriteKit
- Native iOS controls and performance
- App Store deployment

## Development Phases

### Phase 1: Core Mechanics (Current)
- [ ] Basic player movement
- [ ] Simple map with fog of war
- [ ] Landmark discovery system
- [ ] Basic XP and leveling
- [ ] Simple skill tree

### Phase 2: Polish & Expansion
- [ ] Better graphics and animations
- [ ] More complex skill trees
- [ ] Resource collection mechanics
- [ ] Save/load system

### Phase 3: Story Integration
- [ ] Cabin setting implementation
- [ ] Day/night cycle
- [ ] Mystery story elements
- [ ] Ghost encounters

### Phase 4: iOS Native
- [ ] Convert to Swift/SpriteKit
- [ ] iOS-specific features
- [ ] Performance optimization
- [ ] App Store submission

## Success Metrics
- **Engagement**: Do players want to find "just one more" landmark?
- **Progression Feel**: Does leveling up feel rewarding?
- **Exploration Drive**: Are players curious about unexplored areas?
- **Skill Satisfaction**: Do new skills feel impactful?

## Notes
- Keep the core loop tight and satisfying
- Test frequently to ensure mechanics feel good
- Don't over-complicate the prototype
- Focus on the psychological hooks that make exploration addictive
- Remember: Simple shapes can still create compelling gameplay 