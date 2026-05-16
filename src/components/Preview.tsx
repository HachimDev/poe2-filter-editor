import { useState, useEffect } from 'react'
import type { FilterRule } from '../types'
import { EFFECT_COLOR_CSS } from '../data/constants'
import MinimapIcon from './MinimapIcon'
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

  const mmSz = ([18, 14, 9] as const)[a.minimapIcon.size] ?? 16
  const mmCol = EFFECT_COLOR_CSS[a.minimapIcon.color] ?? '#fff'
  const mmSh = a.minimapIcon.shape


  return (
    <>
      <div className={styles.itemRow}>
        <span>Item name:</span>
        <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} />
      </div>
      <div className={styles.previewArea}>
        <div className={styles.minimapContainer}>
          <img src="/minimap.png" alt="" className={styles.minimapImg} />
          {a.minimapIcon.enabled && (
            <div className={styles.minimapIconOverlay}>
              <MinimapIcon shape={mmSh} color={mmCol} size={mmSz} />
            </div>
          )}
        </div>
        <div
          className={styles.visibility}
          style={{ color: isHide ? 'var(--hide-light)' : 'var(--show-light)' }}
        >
          {isHide ? '⊘ Hidden from ground' : '● Visible on ground'}
        </div>

        <div className={styles.groundCenter}>
          {beam
            ? <div style={{ width: 3, height: 130, background: `linear-gradient(to bottom, transparent, ${beam})`, flexShrink: 0, marginBottom: 8 }} />
            : <div style={{ height: 110, marginBottom: 8 }} />
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
      </div>
    </>
  )
}
