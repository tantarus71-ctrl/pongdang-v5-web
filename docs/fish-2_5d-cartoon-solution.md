# Pongdang v5 fish visual solution

## Final direction

Use a real Gonjiamcheon underwater background with 2.5D semi-cartoon fish.

This is the best balance for Pongdang v5:

- Aquarium background: realistic Gonjiamcheon underwater image
- Swimming fish: semi-3D cartoon PNG sprites
- Collection card: polished cartoon illustration
- Popup image: larger representative cartoon image
- Rare fish: brighter fantasy-accent cartoon, still based on local species
- Motion: z-depth, scale, direction sprites, tail/body micro motion

## Why this is better than fully realistic fish

Realistic fish are educational, but they lose readability in a small mobile aquarium. Species marks blend into the background, rotation looks muddy, and transparent edges are easier to notice.

Semi-cartoon fish are clearer, more collectible, and easier to animate. They preserve species identity while giving children a character they want to find and collect.

## Best asset format

Each species should ship in three groups.

Aquarium sprites:

- Transparent PNG
- Semi-3D cartoon style
- No baked background
- Very soft outline
- No heavy shadow
- Strong silhouette at small size
- Minimum 5 directions
- Recommended 10 files: 5 directions x 2 tail frames

Collection card:

- Larger premium cartoon illustration
- More detail than aquarium sprite
- Same species markings
- Clean transparent or card-ready background

Popup image:

- Same style family as card
- Larger body and clearer face
- Used for learning and species explanation

## Beodeulchi v5 art rules

- Keep the real slender body shape
- Use a soft center stripe at about 50-60 percent strength
- Make eyes about 15-20 percent larger than real scale
- Brighten the belly
- Give tail and fins a warm yellow-red tint
- Keep the outline thin and soft
- Remove heavy shadow
- Keep background 100 percent transparent

## Runtime engine rule

The current v5 runtime should use this order:

1. z-depth controls scale, clarity, blur, saturation, and z-index.
2. Movement direction selects a left/right/front-angle sprite.
3. Tail/body feeling is faked with tiny rotate and scaleX motion.
4. Card and popup images stay separate from the swimming sprite.
5. Future layered-bone animation can replace the sprite internals without changing the data contract.

## Current implementation step

The current code now supports:

- `depth`
- `swim.phase`
- `swim.xAmp`
- `swim.yAmp`
- `swim.roll`
- `swim.tailRate`
- `sprites.left`
- `sprites.right`
- `sprites.frontLeft`
- `sprites.frontRight`

When final cartoon PNGs are ready, replace the file paths under each fish species and keep the same runtime structure.
