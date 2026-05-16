import type { FilterRule } from '../types'
import { MdOpenInNew } from 'react-icons/md'
import styles from './WikiTab.module.css'

interface Props {
  rule: FilterRule
}

const WIKI_BASE = 'https://www.poe2wiki.net/wiki/'

function wikiUrl(name: string): string {
  return WIKI_BASE + name.replace(/ /g, '_')
}

export default function WikiTab({ rule }: Props) {
  const btCond  = rule.conditions.find(c => c.field === 'BaseType') as { values: string[] } | undefined
  const clCond  = rule.conditions.find(c => c.field === 'Class')    as { values: string[] } | undefined
  const rarCond = rule.conditions.find(c => c.field === 'Rarity')   as { values: string[] } | undefined

  const hasLinks = btCond?.values.length || clCond?.values.length || rarCond?.values.length

  if (!hasLinks) {
    return (
      <div className={styles.empty}>
        Add a BaseType, Class or Rarity condition to see wiki links.
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      {btCond?.values.length ? (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Base Types</div>
          {btCond.values.map(v => (
            <a key={v} href={wikiUrl(v)} target="_blank" rel="noreferrer" className={styles.link}>
              {v}<MdOpenInNew className={styles.icon} />
            </a>
          ))}
        </section>
      ) : null}

      {clCond?.values.length ? (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Classes</div>
          {clCond.values.map(v => (
            <a key={v} href={wikiUrl(v)} target="_blank" rel="noreferrer" className={styles.link}>
              {v}<MdOpenInNew className={styles.icon} />
            </a>
          ))}
        </section>
      ) : null}

      {rarCond?.values.length ? (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Rarities</div>
          {rarCond.values.map(v => (
            <a key={v} href={wikiUrl(v)} target="_blank" rel="noreferrer" className={styles.link}>
              {v}<MdOpenInNew className={styles.icon} />
            </a>
          ))}
        </section>
      ) : null}
    </div>
  )
}
