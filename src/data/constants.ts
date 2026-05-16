export const RARITIES = ['Normal', 'Magic', 'Rare', 'Unique'] as const

export const NUMERIC_OPS = ['>=', '<=', '>', '<', '='] as const

export const NUMERIC_FIELDS = [
  'AreaLevel', 'ItemLevel', 'StackSize', 'Quality', 'Sockets',
  'GemLevel', 'WaystoneTier', 'BaseArmour', 'BaseEnergyShield', 'BaseEvasion',
  'Height', 'Width', 'UnidentifiedItemTier',
] as const

export const STRING_FIELDS = ['BaseType', 'Class'] as const

export const BOOL_FIELDS = [
  'Identified', 'Corrupted', 'Mirrored',
  'AnyEnchantment', 'HasVaalUniqueMod', 'IsVaalUnique', 'TwiceCorrupted',
] as const

export const ALL_CONDITION_FIELDS = [
  'BaseType', 'Class', 'Rarity',
  'AreaLevel', 'ItemLevel', 'StackSize', 'Quality', 'Sockets',
  'GemLevel', 'WaystoneTier', 'BaseArmour', 'BaseEnergyShield', 'BaseEvasion',
  'Height', 'Width', 'UnidentifiedItemTier',
  'Identified', 'Corrupted', 'Mirrored',
  'AnyEnchantment', 'HasVaalUniqueMod', 'IsVaalUnique', 'TwiceCorrupted',
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
  GemLevel: 'Gem Level',
  WaystoneTier: 'Waystone Tier',
  BaseArmour: 'Base Armour',
  BaseEnergyShield: 'Base Energy Shield',
  BaseEvasion: 'Base Evasion',
  Height: 'Height',
  Width: 'Width',
  UnidentifiedItemTier: 'Unidentified Item Tier',
  Identified: 'Identified',
  Corrupted: 'Corrupted',
  Mirrored: 'Mirrored',
  AnyEnchantment: 'Any Enchantment',
  HasVaalUniqueMod: 'Has Vaal Unique Mod',
  IsVaalUnique: 'Is Vaal Unique',
  TwiceCorrupted: 'Twice Corrupted',
  HasExplicitMod: 'Explicit Mod',
}

export const EFFECT_COLORS = [
  'Red', 'Green', 'Blue', 'Brown', 'White',
  'Yellow', 'Cyan', 'Grey', 'Orange', 'Pink', 'Purple', 'Black',
] as const

export const EFFECT_COLOR_CSS: Record<string, string> = {
  Red: '#FF3127', Green: '#44ff55', Blue: '#1D7BE3', Brown: '#aa7744',
  White: '#ffffff', Yellow: '#f3e709', Cyan: '#35FFFF', Grey: '#888888',
  Orange: '#FF6400', Pink: '#ff88cc', Purple: '#aa44ff', Black: '#000000',
}

export const MINIMAP_SHAPES = [
  'Circle', 'Diamond', 'Hexagon', 'Square', 'Star',
  'Triangle', 'Cross', 'Moon', 'Raindrop', 'Kite',
  'Pentagon', 'UpsideDownHouse',
] as const

export const SHAPE_CLIP_PATHS: Partial<Record<string, string>> = {
  Diamond:        '', // rendered as SVG in Preview (4-diamond cross pattern)
  Triangle:       'polygon(50% 0%,100% 100%,0% 100%)',
  Star:           'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
  Hexagon:        'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
  Cross:          '', // rendered as SVG in Preview (hollow cross-star, evenodd)
  Pentagon:       '', // rendered as SVG in Preview (hollow pentagon, evenodd)
  Moon:           '', // rendered as SVG in Preview (crescent via two circles, evenodd)
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
  'Talismans', 'Two Hand Maces', 'Wands', 'Life Flasks', 'Mana Flasks', 'Charms',
  'Skill Gems', 'Support Gems',
  'Stackable Currency', 'Jewels', 'Waystones', 'Map Fragments',
  'Misc Map Items', 'Tablets',
  'Instance Local Items', 'Quest Items', 'Fishing Rods',
  'Incubators', 'Omen', 'Pinnacle Keys', 'Expedition Logbooks',
  'Augment', 'Vault Keys',
] as const

export const DEFAULT_COL_WIDTHS: [number, number, number] = [30, 40, 30]
