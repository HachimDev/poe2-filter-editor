import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdCheck } from 'react-icons/md'
import type { FilterRule } from '../types'
import { PREBUILT_SETS } from '../data/prebuiltRules'
import styles from './PrebuiltRulesDialog.module.css'
import pageStyles from './PrebuiltRulesPage.module.css'

interface Props {
  onAdd: (rules: FilterRule[]) => void
}

const PREVIEW_LIMIT = 4

export default function PrebuiltRulesPage({ onAdd }: Props) {
  const navigate = useNavigate()
  const [added, setAdded] = useState<Set<string>>(new Set())

  const handleAdd = (setId: string, rules: FilterRule[]) => {
    onAdd(rules)
    setAdded(prev => new Set([...prev, setId]))
  }

  return (
    <div className={pageStyles.page}>
      <Helmet>
        <title>Prebuilt Filter Rules for Path of Exile 2 — AnnulFilter</title>
        <meta name="description" content="Browse ready-to-use filter rules for Path of Exile 2. Add prebuilt rules to your filter in one click — no configuration needed." />
        <link rel="canonical" href="https://annulfilter.com/prebuiltrules" />
        <meta property="og:title" content="Prebuilt Filter Rules for Path of Exile 2 — AnnulFilter" />
        <meta property="og:url" content="https://annulfilter.com/prebuiltrules" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className={pageStyles.pageHeader}>
        <span className={pageStyles.pageTitle}>Prebuilt Rules</span>
        <button className="btn btn-sm" onClick={() => navigate('/')}><MdArrowBack /> Back to Editor</button>
      </div>

      <div className={pageStyles.grid}>
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
                  <span className={styles.addedBadge}><MdCheck /> Added to filter</span>
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
  )
}
