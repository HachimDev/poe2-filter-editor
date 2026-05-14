import { useState, useRef, useEffect, useMemo } from 'react'
import { CLASS_LIST } from '../data/constants'
import { ALL_BASE_TYPES } from '../data/baseTypes'
import styles from './BaseTypeSelect.module.css'

interface Props {
  field: 'BaseType' | 'Class'
  values: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
}

export default function BaseTypeSelect({ field, values, onAdd, onRemove }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const list = field === 'Class' ? (CLASS_LIST as readonly string[]) : ALL_BASE_TYPES

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return list.filter(b => (!q || b.toLowerCase().includes(q)) && !values.includes(b))
  }, [list, query, values])

  const shown = filtered.slice(0, 80)

  // Close on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleAdd = (val: string) => {
    onAdd(val)
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.tagArea} onClick={() => { setOpen(true); inputRef.current?.focus() }}>
        {values.map(v => (
          <span key={v} className={styles.tag}>
            {v}
            <button
              className={styles.tagX}
              onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onRemove(v) }}
            >✕</button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.tagInput}
          type="text"
          autoComplete="off"
          placeholder={
            field === 'Class'
              ? 'Search item classes…'
              : open
                ? `Type to filter ${list.length} items…`
                : `${list.length} base types — click to search`
          }
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.count}>
            {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
            {!query ? ' — type to filter' : ''}
            {filtered.length > 80 ? ' (first 80 shown)' : ''}
          </div>
          {shown.length === 0 && <div className={styles.empty}>No matches</div>}
          {shown.map(b => (
            <div
              key={b}
              className={styles.option}
              onMouseDown={e => { e.preventDefault(); handleAdd(b) }}
            >{b}</div>
          ))}
        </div>
      )}
    </div>
  )
}
