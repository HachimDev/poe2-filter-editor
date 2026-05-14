import { useState } from 'react'
import type { FilterRule } from '../types'
import { PREBUILT_SETS } from '../data/prebuiltRules'
import styles from './PrebuiltRulesDialog.module.css'

interface Props {
  onAdd: (rules: FilterRule[]) => void
  onClose: () => void
}

const PREVIEW_LIMIT = 4

export default function PrebuiltRulesDialog({ onAdd, onClose }: Props) {
  const [added, setAdded] = useState<Set<string>>(new Set())

  const handleAdd = (setId: string, rules: FilterRule[]) => {
    onAdd(rules)
    setAdded(prev => new Set([...prev, setId]))
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <span className={styles.title}>Prebuilt Rules</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {PREBUILT_SETS.map(set => {
            const isAdded = added.has(set.id)
            const preview = set.rules.slice(0, PREVIEW_LIMIT)
            const overflow = set.rules.length - PREVIEW_LIMIT

            return (
              <div key={set.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{set.name}</span>
                  <span className={styles.cardCount}>{set.rules.length} rule{set.rules.length !== 1 ? 's' : ''}</span>
                </div>
                <p className={styles.cardDesc}>{set.description}</p>

                <div className={styles.ruleList}>
                  {preview.map(r => (
                    <div key={r.id} className={styles.ruleEntry}>
                      <span className={styles.ruleDot} />
                      {r.comment || '(unnamed)'}
                    </div>
                  ))}
                  {overflow > 0 && (
                    <div className={styles.ruleEntry}>
                      <span className={styles.ruleDot} />
                      +{overflow} more…
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {isAdded ? (
                    <span className={styles.addedBadge}>✓ Added to filter</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleAdd(set.id, set.rules)}>
                      Add to Filter
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
