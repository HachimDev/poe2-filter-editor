import type { Condition, FilterRule, NumericCondition, BoolCondition, ExplicitModCondition, BaseTypeCondition, RarityCondition } from '../types'
import { RARITIES, NUMERIC_OPS, NUMERIC_FIELDS, STRING_FIELDS, BOOL_FIELDS, CONDITION_LABELS } from '../data/constants'
import BaseTypeSelect from './BaseTypeSelect'
import styles from './ConditionRow.module.css'

interface Props {
  rule: FilterRule
  cond: Condition
  onChange: (updated: Condition) => void
  onRemove: () => void
}

export default function ConditionRow({ cond, onChange, onRemove }: Props) {
  const update = (patch: Partial<Condition>) => onChange({ ...cond, ...patch } as Condition)

  const addTag = (v: string) => {
    if (!v.trim()) return
    const c = cond as BaseTypeCondition | ExplicitModCondition
    if (!c.values.includes(v.trim())) onChange({ ...cond, values: [...c.values, v.trim()] } as Condition)
  }

  const removeTag = (v: string) => {
    const c = cond as BaseTypeCondition | ExplicitModCondition
    onChange({ ...cond, values: c.values.filter(x => x !== v) } as Condition)
  }

  const toggleRarity = (v: string) => {
    const c = cond as RarityCondition
    const vals = c.values
    onChange({ ...cond, values: vals.includes(v) ? vals.filter(x => x !== v) : [...vals, v] } as Condition)
  }

  let body: React.ReactNode = null

  if (cond.field === 'HasExplicitMod') {
    const c = cond as ExplicitModCondition
    body = (
      <>
        <div className={styles.row} style={{ marginBottom: 7 }}>
          <span className={styles.hint}>Min mods:</span>
          <input
            type="number" min={1} max={10} value={c.minCount ?? 1} style={{ width: 55 }}
            onChange={e => update({ minCount: +e.target.value } as Partial<ExplicitModCondition>)}
          />
        </div>
        <div className={styles.tagArea}>
          {c.values.map(v => (
            <span key={v} className={styles.tag}>
              {v}<button className={styles.tagX} onClick={() => removeTag(v)}>✕</button>
            </span>
          ))}
          <input
            className={styles.tagInput} type="text" placeholder="Type mod & press Enter…"
            onKeyDown={e => {
              const inp = e.target as HTMLInputElement
              if (e.key === 'Enter' && inp.value.trim()) { addTag(inp.value.trim()); inp.value = '' }
            }}
          />
        </div>
        <div className={styles.hint}>Press Enter to add each modifier name</div>
      </>
    )
  } else if (STRING_FIELDS.includes(cond.field as 'BaseType' | 'Class')) {
    const c = cond as BaseTypeCondition
    body = (
      <>
        <BaseTypeSelect field={c.field} values={c.values} onAdd={addTag} onRemove={removeTag} />
        <div className={styles.hint}>Click a result to add · Type to filter</div>
      </>
    )
  } else if (cond.field === 'Rarity') {
    const c = cond as RarityCondition
    body = (
      <div className={styles.rarRow}>
        {RARITIES.map(r => (
          <label key={r} className={styles.rarLabel}>
            <input type="checkbox" checked={c.values.includes(r)} onChange={() => toggleRarity(r)} />
            {r}
          </label>
        ))}
      </div>
    )
  } else if (NUMERIC_FIELDS.includes(cond.field as NumericCondition['field'])) {
    const c = cond as NumericCondition
    body = (
      <div className={styles.row}>
        <select value={c.operator ?? '>='} onChange={e => update({ operator: e.target.value as NumericCondition['operator'] })} style={{ width: 58 }}>
          {NUMERIC_OPS.map(op => <option key={op}>{op}</option>)}
        </select>
        <input
          type="number" value={c.value ?? 0} min={0} style={{ width: 78 }}
          onChange={e => update({ value: +e.target.value } as Partial<NumericCondition>)}
        />
      </div>
    )
  } else if (BOOL_FIELDS.includes(cond.field as BoolCondition['field'])) {
    const c = cond as BoolCondition
    body = (
      <select value={c.value ?? 'True'} onChange={e => update({ value: e.target.value as 'True' | 'False' })} style={{ width: 90 }}>
        <option>True</option>
        <option>False</option>
      </select>
    )
  }

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <span className={styles.fieldLabel}>{CONDITION_LABELS[cond.field] ?? cond.field}</span>
        <button className="icon-btn del" onClick={onRemove} style={{ marginLeft: 'auto', fontSize: 11 }}>
          ✕ Remove
        </button>
      </div>
      {body}
    </div>
  )
}
