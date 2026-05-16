import type {
  FilterRule, FilterActions, Condition, RgbaColor,
  NumericField, BoolField,
} from '../types'
import { RARITIES, NUMERIC_FIELDS, STRING_FIELDS, BOOL_FIELDS } from '../data/constants'

// ─── uid ──────────────────────────────────────────────────────────────────────

export const uid = (): string => Math.random().toString(36).slice(2, 9)

// ─── color helpers ────────────────────────────────────────────────────────────

export const toHex = ({ r, g, b }: RgbaColor): string =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')

export const fromHex = (hex: string): Pick<RgbaColor, 'r' | 'g' | 'b'> => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
})

export const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v))

// ─── factory functions ────────────────────────────────────────────────────────

export function mkActions(): FilterActions {
  return {
    fontSize: 32,
    textColor: { r: 200, g: 200, b: 180, a: 255 },
    borderColor: { enabled: false, r: 100, g: 100, b: 100, a: 255 },
    backgroundColor: { enabled: false, r: 0, g: 0, b: 0, a: 255 },
    playEffect: { enabled: false, color: 'White', temp: false },
    minimapIcon: { enabled: false, size: 1, color: 'White', shape: 'Circle' },
    playAlertSound: { enabled: false, id: 1, volume: 300 },
  }
}

const OP_SYMBOL: Record<string, string> = { '>=': '≥', '<=': '≤', '>': '>', '<': '<', '=': '=' }
const RARITY_ABBREV: Record<string, string> = { Normal: 'N', Magic: 'M', Rare: 'R', Unique: 'U' }
const NUMERIC_SHORT: Record<string, string> = {
  ItemLevel: 'iLvl', StackSize: 'Stack', AreaLevel: 'Area', Quality: 'Q', Sockets: 'Sockets',
  GemLevel: 'GemLvl', WaystoneTier: 'WTier', BaseArmour: 'Armour',
  BaseEnergyShield: 'ES', BaseEvasion: 'Eva', Height: 'H', Width: 'W',
  UnidentifiedItemTier: 'UITier',
}
const BOOL_NEGATED: Record<string, string> = {
  Corrupted: 'Uncorrupted', Mirrored: 'Unmirrored', Identified: 'Unidentified',
  AnyEnchantment: 'No Enchantment', HasVaalUniqueMod: 'No Vaal Mod',
  IsVaalUnique: 'Not Vaal Unique', TwiceCorrupted: 'Not Twice Corrupted',
}

function labelValues(vals: string[]): string {
  if (vals.length <= 3) return vals.join(', ')
  return `${vals[0]} +${vals.length - 1} more`
}

export function generateRuleName(conditions: FilterRule['conditions']): string {
  if (conditions.length === 0) return 'New Rule'

  const bt  = conditions.find(c => c.field === 'BaseType')     as { values: string[] } | undefined
  const cl  = conditions.find(c => c.field === 'Class')        as { values: string[] } | undefined
  const rar = conditions.find(c => c.field === 'Rarity')       as { values: string[] } | undefined
  const mod = conditions.find(c => c.field === 'HasExplicitMod') as { values: string[] } | undefined
  const nums = conditions.filter(c => NUMERIC_FIELDS.includes(c.field as NumericField)) as { field: string; operator: string; value: number }[]
  const bools = conditions.filter(c => BOOL_FIELDS.includes(c.field as BoolField))     as { field: string; value: string }[]

  // Main label — BaseType > Class > ExplicitMod
  let label = ''
  if (bt?.values.length)  label = labelValues(bt.values)
  else if (cl?.values.length)  label = labelValues(cl.values)
  else if (mod?.values.length) label = labelValues(mod.values)

  // Qualifier tokens (go in parentheses after label)
  const quals: string[] = []
  if (rar?.values.length) quals.push(rar.values.map(v => RARITY_ABBREV[v] ?? v).join('/'))
  for (const nc of nums) {
    const short = NUMERIC_SHORT[nc.field] ?? nc.field
    const op    = OP_SYMBOL[nc.operator] ?? nc.operator
    const pct   = nc.field === 'Quality' ? '%' : ''
    quals.push(`${short}${op}${nc.value}${pct}`)
  }
  for (const bc of bools) {
    quals.push(bc.value === 'False' ? (BOOL_NEGATED[bc.field] ?? `Not ${bc.field}`) : bc.field)
  }

  if (label) return quals.length ? `${label} (${quals.join(', ')})` : label
  if (quals.length) return quals.join(', ')
  return 'New Rule'
}

export function mkRule(type: 'Show' | 'Hide' = 'Show'): FilterRule {
  return { id: uid(), type, comment: 'New Rule', commentAuto: true, conditions: [], actions: mkActions() }
}

export function mkCondition(field: string): Condition {
  if (STRING_FIELDS.includes(field as 'BaseType' | 'Class') || field === 'HasExplicitMod') {
    const c = { id: uid(), field, values: [] } as Condition
    if (field === 'HasExplicitMod') return { ...c, field: 'HasExplicitMod', minCount: 1 } as Condition
    return c
  }
  if (field === 'Rarity') return { id: uid(), field: 'Rarity', values: ['Normal', 'Magic', 'Rare'] }
  if (NUMERIC_FIELDS.includes(field as NumericField)) {
    return { id: uid(), field: field as NumericField, operator: '>=', value: 1 }
  }
  if (BOOL_FIELDS.includes(field as BoolField)) {
    return { id: uid(), field: field as BoolField, value: 'True' }
  }
  // fallback
  return { id: uid(), field: 'Identified', value: 'True' }
}

// ─── serialization ────────────────────────────────────────────────────────────

export function ruleToText(rule: FilterRule): string {
  const lines: string[] = [`${rule.type} # ${rule.comment || 'Rule'}`]

  for (const c of rule.conditions) {
    if (c.field === 'HasExplicitMod' && c.values.length > 0) {
      lines.push(`\tHasExplicitMod >=${c.minCount ?? 1} ${c.values.map(v => `"${v}"`).join(' ')}`)
    } else if ((c.field === 'BaseType' || c.field === 'Class') && c.values.length > 0) {
      lines.push(`\t${c.field} == ${c.values.map(v => `"${v}"`).join(' ')}`)
    } else if (c.field === 'Rarity' && c.values.length > 0) {
      lines.push(`\tRarity ${c.values.join(' ')}`)
    } else if (NUMERIC_FIELDS.includes(c.field as NumericField)) {
      const nc = c as import('../types').NumericCondition
      lines.push(`\t${nc.field} ${nc.operator ?? '>='} ${nc.value ?? 0}`)
    } else if (BOOL_FIELDS.includes(c.field as BoolField)) {
      const bc = c as import('../types').BoolCondition
      lines.push(`\t${bc.field} ${bc.value ?? 'True'}`)
    }
  }

  const a = rule.actions
  lines.push(`\tSetFontSize ${a.fontSize}`)
  lines.push(`\tSetTextColor ${a.textColor.r} ${a.textColor.g} ${a.textColor.b} ${a.textColor.a}`)
  if (a.borderColor.enabled) lines.push(`\tSetBorderColor ${a.borderColor.r} ${a.borderColor.g} ${a.borderColor.b} ${a.borderColor.a}`)
  if (a.backgroundColor.enabled) lines.push(`\tSetBackgroundColor ${a.backgroundColor.r} ${a.backgroundColor.g} ${a.backgroundColor.b} ${a.backgroundColor.a}`)
  if (a.playAlertSound.enabled) lines.push(`\tPlayAlertSound ${a.playAlertSound.id} ${a.playAlertSound.volume}`)
  if (a.playEffect.enabled) lines.push(`\tPlayEffect ${a.playEffect.color}${a.playEffect.temp ? ' Temp' : ''}`)
  if (a.minimapIcon.enabled) lines.push(`\tMinimapIcon ${a.minimapIcon.size} ${a.minimapIcon.color} ${a.minimapIcon.shape}`)

  return lines.join('\n')
}

export function fullFilterText(filterName: string, rules: FilterRule[]): string {
  return [
    `# ${filterName}`,
    `# Path of Exile 2`,
    `# Generated by Annul Filter`,
    '',
    ...rules.map(ruleToText),
  ].join('\n\n')
}

// ─── parser ───────────────────────────────────────────────────────────────────

export function parseFilter(text: string): FilterRule[] {
  const rules: FilterRule[] = []
  let cur: FilterRule | null = null

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()

    // Show / Hide header
    if (
      (line.startsWith('Show') || line.startsWith('Hide')) &&
      (line.length === 4 || line[4] === ' ' || line[4] === '#')
    ) {
      if (cur) rules.push(cur)
      const type = line.startsWith('Show') ? 'Show' : 'Hide'
      const cm = line.match(/# (.+)/)
      const comment = cm
        ? cm[1].replace(/\$[^\s]+ /g, '').replace(/![^\s]+/g, '').trim()
        : ''
      cur = { id: uid(), type, comment, commentAuto: false, conditions: [], actions: mkActions() }
      continue
    }

    if (!cur || !line || line.startsWith('#')) continue

    const a = cur.actions
    let m: RegExpMatchArray | null

    if ((m = line.match(/^SetFontSize (\d+)/))) { a.fontSize = +m[1]; continue }
    if ((m = line.match(/^SetTextColor (\d+) (\d+) (\d+)(?: (\d+))?/))) {
      a.textColor = { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 255 }; continue
    }
    if ((m = line.match(/^SetBorderColor (\d+) (\d+) (\d+)(?: (\d+))?/))) {
      a.borderColor = { enabled: true, r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 255 }; continue
    }
    if ((m = line.match(/^SetBackgroundColor (\d+) (\d+) (\d+)(?: (\d+))?/))) {
      a.backgroundColor = { enabled: true, r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 200 }; continue
    }
    if ((m = line.match(/^PlayEffect (\w+)( Temp)?/))) {
      a.playEffect = { enabled: true, color: m[1], temp: !!m[2] }; continue
    }
    if ((m = line.match(/^MinimapIcon (\d+) (\w+) (\w+)/))) {
      a.minimapIcon = { enabled: true, size: +m[1] as 0 | 1 | 2, color: m[2], shape: m[3] }; continue
    }
    if ((m = line.match(/^PlayAlertSound (\S+)(?: (\d+))?/))) {
      a.playAlertSound = { enabled: true, id: isNaN(+m[1]) ? 1 : +m[1], volume: m[2] ? +m[2] : 300 }; continue
    }
    if ((m = line.match(/^BaseType (?:(?:==|!=) )?(.+)/))) {
      cur.conditions.push({ id: uid(), field: 'BaseType', values: [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]) }); continue
    }
    if ((m = line.match(/^Class (?:(?:==|!=) )?(.+)/))) {
      cur.conditions.push({ id: uid(), field: 'Class', values: [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]) }); continue
    }
    if ((m = line.match(/^Rarity (.+)/))) {
      cur.conditions.push({ id: uid(), field: 'Rarity', values: m[1].split(/\s+/).filter(v => RARITIES.includes(v as typeof RARITIES[number])) }); continue
    }

    let hit = false
    for (const f of NUMERIC_FIELDS) {
      if ((m = line.match(new RegExp(`^${f} (?:(>=|<=|>|<|=) )?(\\d+)`)))) {
        cur.conditions.push({ id: uid(), field: f, operator: (m[1] ?? '=') as '>=', value: +m[2] })
        hit = true; break
      }
    }
    if (hit) continue

    for (const f of BOOL_FIELDS) {
      if ((m = line.match(new RegExp(`^${f} (True|False)`)))) {
        cur.conditions.push({ id: uid(), field: f, value: m[1] as 'True' | 'False' }); break
      }
    }

    if ((m = line.match(/^HasExplicitMod >=(\d+) (.+)/))) {
      cur.conditions.push({
        id: uid(), field: 'HasExplicitMod',
        minCount: +m[1],
        values: [...m[2].matchAll(/"([^"]+)"/g)].map(x => x[1]),
      })
    }
  }

  if (cur) rules.push(cur)
  return rules
}

// ─── download helper ──────────────────────────────────────────────────────────

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
