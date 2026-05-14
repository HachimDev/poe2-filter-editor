import { useState, useEffect } from 'react'
import type { FilterRule } from '../types'
import { EFFECT_COLOR_CSS, SHAPE_CLIP_PATHS, CONDITION_LABELS, NUMERIC_FIELDS, STRING_FIELDS, BOOL_FIELDS } from '../data/constants'
import { clamp } from '../utils/filter'
import styles from './Preview.module.css'

interface Props {
  rule: FilterRule | null
}

export default function Preview({ rule }: Props) {
  const [itemName, setItemName] = useState('Astral Plate')

  const autoName = rule
    ? ((rule.conditions.find(c => c.field === 'BaseType') as { values: string[] } | undefined)?.values[0]
      || (rule.conditions.find(c => c.field === 'Class') as { values: string[] } | undefined)?.values[0]
      || null)
    : null

  useEffect(() => {
    if (autoName !== null) setItemName(autoName)
  }, [autoName])

  if (!rule) {
    return (
      <div className={styles.previewArea}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚔</div>
          <div>Select a rule to preview</div>
        </div>
      </div>
    )
  }

  const a = rule.actions
  const { r: tr, g: tg, b: tb, a: ta } = a.textColor
  const bc = a.borderColor
  const bg = a.backgroundColor

  const textCol = `rgba(${tr},${tg},${tb},${ta / 255})`
  const bordCol = bc.enabled ? `rgba(${bc.r},${bc.g},${bc.b},${bc.a / 255})` : 'transparent'
  const bgCol = bg.enabled ? `rgba(${bg.r},${bg.g},${bg.b},${bg.a / 255})` : 'transparent'
  const beam = a.playEffect.enabled ? (EFFECT_COLOR_CSS[a.playEffect.color] ?? '#fff') : null
  const fs = clamp(Math.round(a.fontSize * 0.82), 14, 36)
  const isHide = rule.type === 'Hide'

  const mmSz = ([36, 26, 18] as const)[a.minimapIcon.size] ?? 26
  const mmCol = EFFECT_COLOR_CSS[a.minimapIcon.color] ?? '#fff'
  const mmSh = a.minimapIcon.shape
  const mmBr = mmSh === 'Circle' ? '50%' : mmSh === 'Square' ? '4px' : '0'
  const mmClip = SHAPE_CLIP_PATHS[mmSh]

  const condSummary = rule.conditions
    .map(c => {
      if (STRING_FIELDS.includes(c.field as 'BaseType' | 'Class') || c.field === 'HasExplicitMod') {
        const vals = (c as { values: string[] }).values
        return `${CONDITION_LABELS[c.field]}: ${vals.join(', ') || 'any'}`
      }
      if (c.field === 'Rarity') return `Rarity: ${(c as { values: string[] }).values.join('|') || 'any'}`
      if (NUMERIC_FIELDS.includes(c.field as typeof NUMERIC_FIELDS[number])) {
        const nc = c as { operator: string; value: number }
        return `${c.field} ${nc.operator} ${nc.value}`
      }
      if (BOOL_FIELDS.includes(c.field as typeof BOOL_FIELDS[number])) {
        return `${c.field}: ${(c as { value: string }).value}`
      }
      return c.field
    })
    .join(' · ')

  return (
    <>
      <div className={styles.itemRow}>
        <span>Item name:</span>
        <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} />
      </div>
      <div className={styles.previewArea}>
        <div
          className={styles.visibility}
          style={{ color: isHide ? 'var(--hide-light)' : 'var(--show-light)' }}
        >
          {isHide ? '⊘ Hidden from ground' : '● Visible on ground'}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Ground Label</div>
          {beam
            ? <div style={{ width: 2, height: 44, background: `linear-gradient(to bottom, transparent, ${beam})`, flexShrink: 0 }} />
            : <div style={{ height: 44 }} />
          }
          <div
            className={styles.itemLabel}
            style={{
              color: textCol,
              fontSize: fs,
              background: bgCol,
              borderColor: bordCol,
              opacity: isHide ? 0.3 : 1,
              textDecoration: isHide ? 'line-through' : 'none',
            }}
          >
            {itemName || 'Item'}
          </div>
        </div>

        {a.minimapIcon.enabled && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Minimap Icon</div>
            <div className={styles.mmBg}>
              <div style={{
                width: mmSz,
                height: mmSz,
                background: mmCol,
                borderRadius: mmBr,
                clipPath: mmClip,
                boxShadow: `0 0 10px ${mmCol}60`,
              }} />
            </div>
            <div className={styles.note}>
              {a.minimapIcon.color} {a.minimapIcon.shape} · size {a.minimapIcon.size}
            </div>
          </div>
        )}

        {beam && (
          <div className={styles.note} style={{ color: beam }}>
            ✦ {a.playEffect.color} beam{a.playEffect.temp ? ' (temp)' : ''}
          </div>
        )}

        {a.playAlertSound.enabled && (
          <div className={styles.note}>
            🔊 Sound #{a.playAlertSound.id} · vol {a.playAlertSound.volume}
          </div>
        )}

        {condSummary && <div className={styles.summary}>{condSummary}</div>}
      </div>
    </>
  )
}
