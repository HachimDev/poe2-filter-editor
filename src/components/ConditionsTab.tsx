import { useState } from 'react'
import { MdAdd } from 'react-icons/md'
import type { FilterRule, Condition } from '../types'
import { ALL_CONDITION_FIELDS, CONDITION_LABELS } from '../data/constants'
import { mkCondition } from '../utils/filter'
import ConditionRow from './ConditionRow'
import styles from './EditorTabs.module.css'

interface Props {
  rule: FilterRule
  onChange: (rule: FilterRule) => void
}

export default function ConditionsTab({ rule, onChange }: Props) {
  const [newField, setNewField] = useState('BaseType')

  const used = rule.conditions.map(c => c.field)
  const available = ALL_CONDITION_FIELDS.filter(
    f => !used.includes(f) || f === 'BaseType' || f === 'HasExplicitMod'
  )

  const addCondition = () => {
    const c = mkCondition(newField)
    const next = [...rule.conditions, c]
    onChange({ ...rule, conditions: next })
    const nextUsed = next.map(n => n.field)
    const nextAvailable = ALL_CONDITION_FIELDS.filter(
      f => !nextUsed.includes(f) || f === 'BaseType' || f === 'HasExplicitMod'
    )
    if (nextAvailable.length > 0) setNewField(nextAvailable[0])
  }

  const updateCondition = (id: string, updated: Condition) =>
    onChange({ ...rule, conditions: rule.conditions.map(c => c.id === id ? updated : c) })

  const removeCondition = (id: string) =>
    onChange({ ...rule, conditions: rule.conditions.filter(c => c.id !== id) })

  return (
    <div>
      <div className={styles.sectionTitle}>
        Conditions
        <span className={styles.sectionNote}>(all must match)</span>
      </div>

      {rule.conditions.length === 0 && (
        <div className={styles.empty}>No conditions — this rule matches everything</div>
      )}

      {rule.conditions.map(c => (
        <ConditionRow
          key={c.id}
          rule={rule}
          cond={c}
          onChange={updated => updateCondition(c.id, updated)}
          onRemove={() => removeCondition(c.id)}
        />
      ))}

      <div className={styles.addBar}>
        <select value={newField} style={{ flex: 1 }} onChange={e => setNewField(e.target.value)}>
          {available.map(f => (
            <option key={f} value={f}>{CONDITION_LABELS[f]}</option>
          ))}
        </select>
        <button className="btn btn-sm" onClick={addCondition}><MdAdd /> Add</button>
      </div>
    </div>
  )
}
