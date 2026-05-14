import { useState } from 'react'
import type { FilterRule } from '../types'
import { ruleToText, fullFilterText } from '../utils/filter'
import styles from './EditorTabs.module.css'

interface Props {
  rule: FilterRule
  rules: FilterRule[]
  filterName: string
}

export default function TextTab({ rule, rules, filterName }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(fullFilterText(filterName, rules)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div>
      <div className={styles.sectionTitle}>Current Rule</div>
      <textarea className={styles.codeArea} readOnly style={{ height: 120 }} value={ruleToText(rule)} />

      <div className={styles.sectionTitle} style={{ marginTop: 14 }}>
        Full Filter <span className={styles.sectionNote}>({rules.length} rules)</span>
      </div>
      <textarea className={styles.codeArea} readOnly style={{ height: 200 }} value={fullFilterText(filterName, rules)} />

      <div style={{ marginTop: 10 }}>
        <button className="btn" onClick={handleCopy}>
          {copied ? '✓ Copied!' : '📋 Copy All'}
        </button>
      </div>
    </div>
  )
}
