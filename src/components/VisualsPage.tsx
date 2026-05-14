import { useState } from 'react'
import type { VisualPreset, FilterRule } from '../types'
import { mkActions, uid } from '../utils/filter'
import { useResizableColumns } from '../utils/useResizableColumns'
import ResizeHandle from './ResizeHandle'
import ActionsTab from './ActionsTab'
import Preview from './Preview'
import appStyles from '../App.module.css'
import styles from './VisualsPage.module.css'

interface Props {
  visuals: VisualPreset[]
  onAdd: (v: VisualPreset) => void
  onUpdate: (v: VisualPreset) => void
  onDelete: (id: string) => void
}

export default function VisualsPage({ visuals, onAdd, onUpdate, onDelete }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(visuals[0]?.id ?? null)
  const { colWidths, containerRef, onDragLeft, onDragRight } = useResizableColumns()

  const effectiveId = selectedId ?? visuals[0]?.id ?? null
  const selected = visuals.find(v => v.id === effectiveId) ?? null

  const handleAdd = () => {
    const v: VisualPreset = { id: uid(), name: 'New Visual', actions: mkActions() }
    onAdd(v)
    setSelectedId(v.id)
  }

  const handleDelete = (id: string) => {
    const idx = visuals.findIndex(v => v.id === id)
    const remaining = visuals.filter(v => v.id !== id)
    if (effectiveId === id) {
      setSelectedId(remaining[Math.max(0, idx - 1)]?.id ?? remaining[0]?.id ?? null)
    }
    onDelete(id)
  }

  const previewRule: FilterRule | null = selected
    ? { id: selected.id, type: 'Show', comment: selected.name, conditions: [], actions: selected.actions }
    : null

  return (
    <div className={appStyles.workspace} ref={containerRef}>

      {/* LEFT — Visual List */}
      <div className={appStyles.panelLeft} style={{ width: `${colWidths[0]}%` }}>
        <div className={appStyles.panelHeader}>
          <span>{visuals.length} Visual{visuals.length !== 1 ? 's' : ''}</span>
          <button className="btn btn-sm" onClick={handleAdd}>+ Add</button>
        </div>
        <div className={appStyles.ruleList}>
          {visuals.length === 0 && (
            <div className={styles.emptyList}>No visuals yet.<br />Click + Add to create one.</div>
          )}
          {visuals.map(v => (
            <div
              key={v.id}
              className={[
                appStyles.ruleItem,
                v.id === effectiveId ? appStyles.ruleItemSel : '',
                v.id === effectiveId ? appStyles.ruleItemGold : '',
              ].join(' ')}
              onClick={() => setSelectedId(v.id)}
            >
              <span className={appStyles.ruleName}>{v.name || '(unnamed)'}</span>
              <div className={appStyles.ruleMoves}>
                <button
                  className="icon-btn del"
                  title="Delete"
                  onClick={e => { e.stopPropagation(); handleDelete(v.id) }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ResizeHandle onDrag={onDragLeft} />

      {/* CENTER — Editor */}
      <div className={appStyles.panelCenter} style={{ width: `${colWidths[1]}%` }}>
        {!selected ? (
          <div className={appStyles.emptyState}>
            <div className={appStyles.emptyIcon}>✦</div>
            <div>Add a visual preset to get started</div>
          </div>
        ) : (
          <>
            <div className={styles.nameRow}>
              <input
                type="text"
                style={{ flex: 1, padding: '4px 9px' }}
                value={selected.name}
                placeholder="Visual name…"
                onChange={e => onUpdate({ ...selected, name: e.target.value })}
              />
            </div>
            <div className={appStyles.editorScroll}>
              <ActionsTab
                rule={previewRule!}
                onChange={updated => onUpdate({ ...selected, actions: updated.actions })}
              />
            </div>
          </>
        )}
      </div>

      <ResizeHandle onDrag={onDragRight} />

      {/* RIGHT — Preview */}
      <div className={appStyles.panelRight} style={{ width: `${colWidths[2]}%` }}>
        <div className={appStyles.panelHeader}><span>Live Preview</span></div>
        <Preview rule={previewRule} />
      </div>

    </div>
  )
}
