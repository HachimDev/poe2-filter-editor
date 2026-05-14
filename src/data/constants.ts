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
  Red: '#ff4444', Green: '#44ff55', Blue: '#4488ff', Brown: '#aa7744',
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
  // crescent opening to the left — outer arc right side, inner arc cuts back
  Moon:           'polygon(50% 0%,82% 7%,98% 30%,100% 50%,98% 70%,82% 93%,50% 100%,55% 85%,68% 72%,74% 55%,74% 45%,68% 28%,55% 15%)',
  // teardrop pointing downward
  Raindrop:       'polygon(50% 100%,12% 58%,2% 38%,3% 22%,12% 8%,27% 2%,50% 0%,73% 2%,88% 8%,97% 22%,98% 38%,88% 58%)',
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
