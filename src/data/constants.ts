export const RARITIES = ['Normal', 'Magic', 'Rare', 'Unique'] as const

export const NUMERIC_OPS = ['>=', '<=', '>', '<', '='] as const

export const NUMERIC_FIELDS = ['AreaLevel', 'ItemLevel', 'StackSize', 'Quality', 'Sockets'] as const

export const STRING_FIELDS = ['BaseType', 'Class'] as const

export const BOOL_FIELDS = ['Identified', 'Corrupted', 'Mirrored'] as const

export const ALL_CONDITION_FIELDS = [
  'BaseType', 'Class', 'Rarity',
  'AreaLevel', 'ItemLevel', 'StackSize', 'Quality', 'Sockets',
  'Identified', 'Corrupted', 'Mirrored',
  'HasExplicitMod',
] as const

export const CONDITION_LABELS: Record<string, string> = {
  BaseType: 'Base Type',
  Class: 'Class',
  Rarity: 'Rarity',
  AreaLevel: 'Area Level',
  ItemLevel: 'Item Level',
  StackSize: 'Stack Size',
  Quality: 'Quality',
  Sockets: 'Sockets',
  Identified: 'Identified',
  Corrupted: 'Corrupted',
  Mirrored: 'Mirrored',
  HasExplicitMod: 'Explicit Mod',
}

export const EFFECT_COLORS = [
  'Red', 'Green', 'Blue', 'Brown', 'White',
  'Yellow', 'Cyan', 'Grey', 'Orange', 'Pink', 'Purple',
] as const

export const EFFECT_COLOR_CSS: Record<string, string> = {
  Red: '#ff0000', Green: '#44ff55', Blue: '#4488ff', Brown: '#aa7744',
  White: '#eeeeee', Yellow: '#ffee44', Cyan: '#44ffff', Grey: '#888888',
  Orange: '#ff8833', Pink: '#ff88cc', Purple: '#aa44ff',
}

export const MINIMAP_SHAPES = [
  'Circle', 'Diamond', 'Hexagon', 'Square', 'Star',
  'Triangle', 'Cross', 'Moon', 'Raindrop', 'Kite',
  'Pentagon', 'UpsideDownHouse',
] as const

export const SHAPE_CLIP_PATHS: Partial<Record<string, string>> = {
  Diamond:        'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
  Triangle:       'polygon(50% 0%,100% 100%,0% 100%)',
  Star:           'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
  Hexagon:        'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
  Cross:          'polygon(35% 0%,65% 0%,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0% 65%,0% 35%,35% 35%)',
  Pentagon:       'polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)',
  Moon:           'polygon(18% 5%,38% 0%,60% 3%,78% 12%,90% 26%,96% 42%,98% 50%,96% 58%,90% 74%,78% 88%,60% 97%,38% 100%,18% 95%,30% 80%,40% 65%,46% 50%,40% 35%,30% 20%)',
  Raindrop:       'polygon(50% 0%,64% 18%,76% 36%,84% 52%,87% 66%,84% 80%,75% 91%,62% 98%,50% 100%,38% 98%,25% 91%,16% 80%,13% 66%,16% 52%,24% 36%,36% 18%)',
  // kite — elongated diamond, wider at bottom half
  Kite:           'polygon(50% 0%,100% 30%,50% 100%,0% 30%)',
  // house flipped upside-down — flat top, point at bottom
  UpsideDownHouse:'polygon(0% 0%,100% 0%,100% 60%,50% 100%,0% 60%)',
}

export const CLASS_LIST = [
  'Amulets', 'Belts', 'Body Armours', 'Boots', 'Bows', 'Bucklers',
  'Crossbows', 'Foci', 'Gloves', 'Helmets', 'One Hand Maces', 'Quarterstaves',
  'Quivers', 'Rings', 'Sceptres', 'Shields', 'Spears', 'Staves',
  'Talismans', 'Two Hand Maces', 'Wands', 'Flasks', 'Charms',
  'Stackable Currency', 'Jewels', 'Waystones', 'Map Fragments',
  'Misc Map Items', 'Tablets',
] as const

export const DEFAULT_COL_WIDTHS: [number, number, number] = [30, 40, 30]
