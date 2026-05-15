import { useState, useRef } from 'react'
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import type { FilterRule, EditorTab, VisualPreset } from './types'
import { mkRule, uid, parseFilter, fullFilterText, downloadTextFile } from './utils/filter'
import { useResizableColumns } from './utils/useResizableColumns'
import ResizeHandle from './components/ResizeHandle'
import ConditionsTab from './components/ConditionsTab'
import ActionsTab from './components/ActionsTab'
import TextTab from './components/TextTab'
import Preview from './components/Preview'
import ConfirmDialog from './components/ConfirmDialog'
import VisualsPage from './components/VisualsPage'
import PrebuiltRulesPage from './components/PrebuiltRulesPage'
import styles from './App.module.css'

interface ConfirmState {
  title: string
  message: string
  onConfirm: () => void
}

export default function App() {
  const [rules, setRules] = useState<FilterRule[]>(() => {
    const first = mkRule()
    return [first]
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterName, setFilterName] = useState('MyFilter')
  const [tab, setTab] = useState<EditorTab>('conditions')
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isVisuals = pathname === '/myvisuals'
  const [visuals, setVisuals] = useState<VisualPreset[]>(() => {
    try { return JSON.parse(localStorage.getItem('poe2fe-visuals') ?? '[]') } catch { return [] }
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const { colWidths, containerRef, onDragLeft, onDragRight } = useResizableColumns()

  // Ensure something is selected
  const effectiveSelectedId = selectedId ?? rules[0]?.id ?? null
  const selectedRule = rules.find(r => r.id === effectiveSelectedId) ?? null

  // ── Rule list operations ──────────────────────────────────────────────────

  const addRule = () => {
    const r = mkRule()
    setRules(prev => [r, ...prev])
    setSelectedId(r.id)
    setTab('conditions')
  }

  const deleteRule = (id: string) => {
    setRules(prev => {
      const idx = prev.findIndex(r => r.id === id)
      const next = prev.filter(r => r.id !== id)
      if (effectiveSelectedId === id) {
        setSelectedId(next[Math.max(0, idx - 1)]?.id ?? next[0]?.id ?? null)
      }
      return next
    })
  }

  const moveRule = (id: string, dir: -1 | 1) => {
    setRules(prev => {
      const i = prev.findIndex(r => r.id === id)
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  const toggleType = (id: string) => {
    setRules(prev => prev.map(r =>
      r.id === id ? { ...r, type: r.type === 'Show' ? 'Hide' : 'Show' } : r
    ))
  }

  const updateRule = (updated: FilterRule) => {
    setRules(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  const duplicateRule = (id: string) => {
    setRules(prev => {
      const idx = prev.findIndex(r => r.id === id)
      if (idx === -1) return prev
      const copy = { ...prev[idx], id: uid(), comment: prev[idx].comment ? `${prev[idx].comment} (copy)` : '(copy)' }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      setSelectedId(copy.id)
      return next
    })
  }

  const selectRule = (id: string) => {
    setSelectedId(id)
    setTab('conditions')
  }

  // ── Visual presets ────────────────────────────────────────────────────────

  const saveActionsAsVisual = (name: string) => {
    if (!selectedRule) return
    addVisual({ id: uid(), name, actions: selectedRule.actions })
  }

  const saveVisuals = (next: VisualPreset[]) => {
    setVisuals(next)
    try { localStorage.setItem('poe2fe-visuals', JSON.stringify(next)) } catch {}
  }

  const addVisual = (v: VisualPreset) => saveVisuals([...visuals, v])
  const updateVisual = (v: VisualPreset) => saveVisuals(visuals.map(x => x.id === v.id ? v : x))
  const deleteVisual = (id: string) => saveVisuals(visuals.filter(v => v.id !== id))

  const handleAddPrebuilt = (newRules: FilterRule[]) => {
    setRules(prev => [...prev, ...newRules])
  }

  // ── New Filter ────────────────────────────────────────────────────────────

  const doNew = () => {
    const first = mkRule()
    setRules([first])
    setSelectedId(first.id)
    setFilterName('MyFilter')
    setTab('conditions')
    setConfirm(null)
  }

  const handleNew = () => {
    const isClean = rules.length === 1
      && rules[0].conditions.length === 0
      && rules[0].comment === 'New Rule'
    if (isClean) { doNew(); return }
    setConfirm({
      title: 'New Filter',
      message: 'Start a new blank filter? All unsaved rules will be lost.',
      onConfirm: doNew,
    })
  }

  // ── Import ────────────────────────────────────────────────────────────────

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const result = ev.target?.result
      if (typeof result !== 'string') return
      const parsed = parseFilter(result)
      if (parsed.length > 0) {
        setRules(parsed)
        setSelectedId(parsed[0].id)
        setFilterName(file.name.replace(/\.filter$/i, ''))
        setTab('conditions')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Export ────────────────────────────────────────────────────────────────

  const handleDownload = () => {
    const safeName = (filterName || 'filter').replace(/[^a-zA-Z0-9_-]/g, '_')
    downloadTextFile(fullFilterText(filterName, rules), `${safeName}.filter`)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className={styles.app}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="" className={styles.logoImg} />
          <span className={styles.logoText} onClick={() => navigate('/')}>AnnulFilter</span>
          <span className={styles.logoBadge}>PoE2 v0.4</span>
        </div>
        <input
          className={styles.filterName}
          type="text"
          value={filterName}
          placeholder="Filter name…"
          onChange={e => setFilterName(e.target.value)}
        />
        <div className={styles.headerRight}>
          <button className="btn btn-new" onClick={handleNew}>✦ New Filter</button>
          <button
            className={`btn ${isVisuals ? 'btn-primary' : 'btn-new'}`}
            onClick={() => navigate(isVisuals ? '/' : '/myvisuals')}
          >✦ My Visuals{visuals.length > 0 ? ` (${visuals.length})` : ''}</button>
          <button className="btn" onClick={() => navigate('/prebuiltrules')}>⚙ Prebuilt Rules</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>📂 Import .filter</button>
          <button className="btn btn-primary" onClick={handleDownload}>💾 Download .filter</button>
          <input
            ref={fileRef}
            type="file"
            accept=".filter,.txt"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
      </header>

      {/* WORKSPACE */}
      <Routes>
        <Route path="/prebuiltrules" element={
          <PrebuiltRulesPage onAdd={handleAddPrebuilt} />
        } />
        <Route path="/myvisuals" element={
          <VisualsPage
            visuals={visuals}
            filterName={filterName}
            onAdd={addVisual}
            onUpdate={updateVisual}
            onDelete={deleteVisual}
            onReplaceAll={saveVisuals}
          />
        } />
        <Route path="/" element={
      <div className={styles.workspace} ref={containerRef}>

        {/* LEFT — Rule List */}
        <div className={styles.panelLeft} style={{ width: `${colWidths[0]}%` }}>
          <div className={styles.panelHeader}>
            <span>{rules.length} Rule{rules.length !== 1 ? 's' : ''}</span>
            <button className="btn btn-sm" onClick={addRule}>+ Add Rule</button>
          </div>
          <div className={styles.ruleList}>
            {rules.map(r => (
              <div
                key={r.id}
                className={[
                  styles.ruleItem,
                  r.id === effectiveSelectedId ? styles.ruleItemSel : '',
                  r.type === 'Show' ? styles.ruleItemShow : styles.ruleItemHide,
                ].join(' ')}
                onClick={() => selectRule(r.id)}
              >
                <span className={`${styles.badge} ${r.type === 'Show' ? styles.badgeShow : styles.badgeHide}`}>
                  {r.type}
                </span>
                <span className={styles.ruleName}>{r.comment || '(no comment)'}</span>
                <div className={styles.ruleMoves}>
                  <button className="icon-btn" title="Move up" onClick={e => { e.stopPropagation(); moveRule(r.id, -1) }}>▲</button>
                  <button className="icon-btn" title="Move down" onClick={e => { e.stopPropagation(); moveRule(r.id, 1) }}>▼</button>
                  <button className="icon-btn" title="Duplicate" onClick={e => { e.stopPropagation(); duplicateRule(r.id) }}>⧉</button>
                  <button className="icon-btn del" title="Delete" onClick={e => { e.stopPropagation(); deleteRule(r.id) }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ResizeHandle onDrag={onDragLeft} />

        {/* CENTER — Editor */}
        <div className={styles.panelCenter} style={{ width: `${colWidths[1]}%` }}>
          {!selectedRule ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⚔</div>
              <div>Select a rule to edit</div>
            </div>
          ) : (
            <>
              <div className={styles.ruleHeader}>
                <div className={styles.typeToggle}>
                  <button
                    className={`${styles.tbtn} ${selectedRule.type === 'Show' ? styles.tbtnShowOn : styles.tbtnOff}`}
                    onClick={() => toggleType(selectedRule.id)}
                  >Show</button>
                  <button
                    className={`${styles.tbtn} ${selectedRule.type === 'Hide' ? styles.tbtnHideOn : styles.tbtnOff}`}
                    onClick={() => toggleType(selectedRule.id)}
                  >Hide</button>
                </div>
                <input
                  type="text"
                  style={{ flex: 1, padding: '4px 9px' }}
                  value={selectedRule.comment ?? ''}
                  placeholder="Rule name / comment…"
                  onChange={e => updateRule({ ...selectedRule, comment: e.target.value })}
                />
              </div>

              <div className={styles.tabs}>
                {(['conditions', 'actions', 'text'] as const).map(t => (
                  <button
                    key={t}
                    className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                    onClick={() => setTab(t)}
                  >
                    {t === 'conditions' ? 'Conditions' : t === 'actions' ? 'Actions' : 'Filter Text'}
                  </button>
                ))}
              </div>

              <div className={styles.editorScroll}>
                {tab === 'conditions' && <ConditionsTab rule={selectedRule} onChange={updateRule} />}
                {tab === 'actions' && <ActionsTab rule={selectedRule} onChange={updateRule} visuals={visuals} onSaveAsVisual={saveActionsAsVisual} />}
                {tab === 'text' && <TextTab rule={selectedRule} rules={rules} filterName={filterName} />}
              </div>
            </>
          )}
        </div>

        <ResizeHandle onDrag={onDragRight} />

        {/* RIGHT — Preview */}
        <div className={styles.panelRight} style={{ width: `${colWidths[2]}%` }}>
          <div className={styles.panelHeader}><span>Live Preview</span></div>
          <Preview rule={selectedRule} />
        </div>

      </div>
        } />
      </Routes>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>Version 0.1</span>
        <span>contact@annulfilter.com</span>
        <span>Fan-made tool — not affiliated with Grinding Gear Games</span>
      </footer>

      {/* CONFIRM DIALOG */}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

    </div>
  )
}
