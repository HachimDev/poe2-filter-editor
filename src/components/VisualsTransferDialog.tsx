import { useState, useRef } from 'react'
import { MdClose, MdFolderOpen, MdDownload, MdUpload } from 'react-icons/md'
import type { VisualPreset } from '../types'
import { uid } from '../utils/filter'
import styles from './VisualsTransferDialog.module.css'

interface Props {
  mode: 'export' | 'import'
  visuals: VisualPreset[]
  defaultFileName?: string
  onExport: (selected: VisualPreset[], fileName: string) => void
  onImport: (selected: VisualPreset[], replace: boolean) => void
  onClose: () => void
}

export default function VisualsTransferDialog({ mode, visuals, defaultFileName = 'visuals', onExport, onImport, onClose }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(visuals.map(v => v.id)))
  const [fileName, setFileName] = useState(defaultFileName)
  const [importedVisuals, setImportedVisuals] = useState<VisualPreset[] | null>(null)
  const [importSelectedIds, setImportSelectedIds] = useState<Set<string>>(new Set())
  const [importMode, setImportMode] = useState<'add' | 'replace'>('add')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const list = mode === 'export' ? visuals : (importedVisuals ?? [])
  const ids = mode === 'export' ? selectedIds : importSelectedIds
  const allSelected = list.length > 0 && list.every(v => ids.has(v.id))

  const toggle = (id: string) => {
    if (mode === 'export') {
      const next = new Set(selectedIds)
      if (next.has(id)) next.delete(id); else next.add(id)
      setSelectedIds(next)
    } else {
      const next = new Set(importSelectedIds)
      if (next.has(id)) next.delete(id); else next.add(id)
      setImportSelectedIds(next)
    }
  }

  const toggleAll = () => {
    const next = allSelected ? new Set<string>() : new Set(list.map(v => v.id))
    if (mode === 'export') setSelectedIds(next); else setImportSelectedIds(next)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (!Array.isArray(data) || !data.every(v => v.name && v.actions)) throw new Error()
        const withNewIds: VisualPreset[] = data.map(v => ({ ...v, id: uid() }))
        setImportedVisuals(withNewIds)
        setImportSelectedIds(new Set(withNewIds.map(v => v.id)))
        setError('')
      } catch {
        setError('Invalid file. Please select a valid Annul Filter visuals export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExport = () => {
    const toExport = visuals.filter(v => selectedIds.has(v.id))
    onExport(toExport, fileName.trim() || defaultFileName)
  }

  const handleImport = () => {
    if (!importedVisuals) return
    const toImport = importedVisuals.filter(v => importSelectedIds.has(v.id))
    onImport(toImport, importMode === 'replace')
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <span>{mode === 'export' ? 'Export Visuals' : 'Import Visuals'}</span>
          <button className="icon-btn" onClick={onClose}><MdClose /></button>
        </div>

        {mode === 'import' && !importedVisuals && (
          <div className={styles.filePick}>
            <p>Select a visuals JSON file exported from Annul Filter.</p>
            <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
              <MdFolderOpen /> Choose File
            </button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
            {error && <div className={styles.error}>{error}</div>}
          </div>
        )}

        {(mode === 'export' || importedVisuals) && (
          <>
            {mode === 'import' && (
              <div className={styles.importModeRow}>
                <span>Import as:</span>
                <label className={styles.radioLabel}>
                  <input type="radio" checked={importMode === 'add'} onChange={() => setImportMode('add')} />
                  Add to existing
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} />
                  Replace all
                </label>
              </div>
            )}

            {mode === 'export' && (
              <div className={styles.fileNameRow}>
                <span className={styles.fileNameLabel}>File name</span>
                <input
                  style={{ flex: 1 }}
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="export-name"
                />
                <span className={styles.fileNameExt}>.json</span>
              </div>
            )}

            <div className={styles.listHeader}>
              <span>{list.length} visual{list.length !== 1 ? 's' : ''}</span>
              <button className="btn btn-sm" onClick={toggleAll}>
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className={styles.list}>
              {list.length === 0 && <div className={styles.empty}>No visuals available.</div>}
              {list.map(v => (
                <label key={v.id} className={styles.item}>
                  <input type="checkbox" checked={ids.has(v.id)} onChange={() => toggle(v.id)} />
                  <span>{v.name || '(unnamed)'}</span>
                </label>
              ))}
            </div>

            <div className={styles.footer}>
              <span className={styles.count}>{ids.size} selected</span>
              {mode === 'export' ? (
                <button className="btn btn-primary" disabled={ids.size === 0} onClick={handleExport}>
                  <MdDownload /> Export
                </button>
              ) : (
                <button className="btn btn-primary" disabled={ids.size === 0} onClick={handleImport}>
                  <MdUpload /> Import
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
