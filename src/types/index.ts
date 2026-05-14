// ─── Color types ──────────────────────────────────────────────────────────────

export interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

export interface ToggleableColor extends RgbaColor {
  enabled: boolean
}

// ─── Condition types ──────────────────────────────────────────────────────────

export interface BaseTypeCondition {
  id: string
  field: 'BaseType' | 'Class'
  values: string[]
}

export interface RarityCondition {
  id: string
  field: 'Rarity'
  values: string[]
}

export interface NumericCondition {
  id: string
  field: 'AreaLevel' | 'ItemLevel' | 'StackSize' | 'Quality' | 'Sockets'
  operator: '>=' | '<=' | '>' | '<' | '='
  value: number
}

export interface BoolCondition {
  id: string
  field: 'Identified' | 'Corrupted' | 'Mirrored'
  value: 'True' | 'False'
}

export interface ExplicitModCondition {
  id: string
  field: 'HasExplicitMod'
  values: string[]
  minCount: number
}

export type Condition =
  | BaseTypeCondition
  | RarityCondition
  | NumericCondition
  | BoolCondition
  | ExplicitModCondition

export type ConditionField = Condition['field']
export type NumericField = NumericCondition['field']
export type BoolField = BoolCondition['field']

// ─── Actions ──────────────────────────────────────────────────────────────────

export interface PlayEffectAction {
  enabled: boolean
  color: string
  temp: boolean
}

export interface MinimapIconAction {
  enabled: boolean
  size: 0 | 1 | 2
  color: string
  shape: string
}

export interface PlayAlertSoundAction {
  enabled: boolean
  id: number
  volume: number
}

export interface FilterActions {
  fontSize: number
  textColor: RgbaColor
  borderColor: ToggleableColor
  backgroundColor: ToggleableColor
  playEffect: PlayEffectAction
  minimapIcon: MinimapIconAction
  playAlertSound: PlayAlertSoundAction
}

// ─── Rule ─────────────────────────────────────────────────────────────────────

export type RuleType = 'Show' | 'Hide'

export interface FilterRule {
  id: string
  type: RuleType
  comment: string
  conditions: Condition[]
  actions: FilterActions
}

// ─── Visual presets ───────────────────────────────────────────────────────────

export interface VisualPreset {
  id: string
  name: string
  actions: FilterActions
}

// ─── App tabs ─────────────────────────────────────────────────────────────────

export type EditorTab = 'conditions' | 'actions' | 'text'
