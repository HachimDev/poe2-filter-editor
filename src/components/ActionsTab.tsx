import { useState, useRef } from 'react'
import type { FilterRule, VisualPreset } from '../types'
import { EFFECT_COLORS, MINIMAP_SHAPES, EFFECT_COLOR_CSS } from '../data/constants'
import MinimapIcon from './MinimapIcon'
import ColorControl from './ColorControl'
import styles from './EditorTabs.module.css'
import vStyles from './VisualsPage.module.css'

interface Props {
  rule: FilterRule
  onChange: (rule: FilterRule) => void
  visuals?: VisualPreset[]
  onSaveAsVisual?: (name: string) => void
}

export default function ActionsTab({ rule, onChange, visuals, onSaveAsVisual }: Props) {
  const [applyId, setApplyId] = useState('')
  const [saveAsName, setSaveAsName] = useState('')
  const [saveError, setSaveError] = useState(false)
  const [showVolTip, setShowVolTip] = useState(false)
  const saveInputRef = useRef<HTMLInputElement>(null)
  const effectiveApplyId = applyId || visuals?.[0]?.id || ''
  const a = rule.actions
  const upd = (patch: Partial<typeof a>) => onChange({ ...rule, actions: { ...a, ...patch } })

  const handleApply = () => {
    const preset = visuals?.find(v => v.id === effectiveApplyId)
    if (preset) onChange({ ...rule, actions: preset.actions })
  }

  return (
    <div>
      {(visuals && visuals.length > 0 || onSaveAsVisual) && (
        <div className={vStyles.visualBars}>
          {visuals && visuals.length > 0 && (
            <div className={vStyles.applyBar}>
              <div className={vStyles.applyBarTitle}>Apply Visual</div>
              <div className={vStyles.applyRow}>
                <select
                  style={{ flex: 1, minWidth: 0 }}
                  value={effectiveApplyId}
                  onChange={e => setApplyId(e.target.value)}
                >
                  {visuals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
                <button className="btn btn-sm btn-primary" onClick={handleApply}>Apply</button>
              </div>
            </div>
          )}
          {onSaveAsVisual && (
            <div className={vStyles.applyBar}>
              <div className={vStyles.applyBarTitle}>Save as Visual</div>
              <div className={vStyles.applyRow}>
                <input
                  ref={saveInputRef}
                  style={{ flex: 1, minWidth: 0, borderColor: saveError ? 'var(--hide-light)' : undefined }}
                  value={saveAsName}
                  placeholder="Visual name…"
                  onChange={e => { setSaveAsName(e.target.value); setSaveError(false) }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (!saveAsName.trim()) { setSaveError(true); return }
                      onSaveAsVisual(saveAsName.trim())
                      setSaveAsName('')
                      setSaveError(false)
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    if (!saveAsName.trim()) { setSaveError(true); return }
                    onSaveAsVisual(saveAsName.trim())
                    setSaveAsName('')
                    setSaveError(false)
                  }}
                >Save</button>
              </div>
              {saveError && (
                <div style={{ fontSize: 10, color: 'var(--hide-light)', marginTop: 5 }}>
                  Please enter a name for the visual.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.sectionTitle}>Visual Actions</div>

      {/* Font Size */}
      <div className={styles.actBox}>
        <div className={styles.actLabel}>Font Size</div>
        <div className={styles.sliderRow}>
          <input
            type="range" min={18} max={45} value={a.fontSize}
            onChange={e => upd({ fontSize: +e.target.value })}
          />
          <span className={styles.sliderVal}>{a.fontSize}</span>
        </div>
      </div>

      <ColorControl
        label="Text Color"
        value={a.textColor}
        onChange={v => upd({ textColor: v })}
      />
      <ColorControl
        label="Border Color"
        value={a.borderColor}
        toggleable
        onChange={v => upd({ borderColor: v as typeof a.borderColor })}
      />
      <ColorControl
        label="Background"
        value={a.backgroundColor}
        toggleable
        onChange={v => upd({ backgroundColor: v as typeof a.backgroundColor })}
      />

      {/* Beam Effect */}
      <div className={styles.actBox}>
        <div className={styles.actLabel}>
          <input
            type="checkbox"
            checked={a.playEffect.enabled}
            onChange={e => upd({ playEffect: { ...a.playEffect, enabled: e.target.checked } })}
          />
          Beam Effect
        </div>
        {a.playEffect.enabled ? (
          <div className={styles.inlineRow}>
            <select
              value={a.playEffect.color}
              onChange={e => upd({ playEffect: { ...a.playEffect, color: e.target.value } })}
            >
              {EFFECT_COLORS.map(c => <option key={c}>{c}</option>)}
            </select>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={a.playEffect.temp}
                onChange={e => upd({ playEffect: { ...a.playEffect, temp: e.target.checked } })}
              />
              Temporary
            </label>
          </div>
        ) : <div className={styles.disabled}>Disabled</div>}
      </div>

      {/* Alert Sound */}
      <div className={styles.actBox}>
        <div className={styles.actLabel}>
          <input
            type="checkbox"
            checked={a.playAlertSound.enabled}
            onChange={e => upd({ playAlertSound: { ...a.playAlertSound, enabled: e.target.checked } })}
          />
          Alert Sound
        </div>
        {a.playAlertSound.enabled ? (
          <div className={styles.inlineRow}>
            <span className={styles.inlineLabel}>ID (1–16)</span>
            <input
              type="number" min={1} max={16} value={a.playAlertSound.id} style={{ width: 56 }}
              onChange={e => upd({ playAlertSound: { ...a.playAlertSound, id: +e.target.value } })}
            />
            <button
              className="icon-btn"
              title="Play sound"
              style={{ border: '1px solid #fff', borderRadius: 'var(--radius)', padding: '2px 7px', color: '#fff' }}
              onClick={() => {
                const audio = new Audio(`/sounds/${a.playAlertSound.id}.mp3`)
                audio.volume = a.playAlertSound.volume / 300
                audio.play().catch(() => {})
              }}
            >Play</button>
            <span className={styles.inlineLabel}>Volume</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {showVolTip && (
                <div style={{
                  position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--panel)', border: '1px solid var(--border2)',
                  borderRadius: 3, padding: '1px 6px', fontSize: 10,
                  color: 'var(--text)', whiteSpace: 'nowrap', pointerEvents: 'none',
                }}>{a.playAlertSound.volume}</div>
              )}
              <input
                type="range" min={0} max={300} value={a.playAlertSound.volume}
                onPointerDown={() => setShowVolTip(true)}
                onPointerUp={() => setShowVolTip(false)}
                onChange={e => upd({ playAlertSound: { ...a.playAlertSound, volume: +e.target.value } })}
              />
            </div>
            <span className={styles.sliderVal}>{Math.round(a.playAlertSound.volume / 300 * 100)}%</span>
          </div>
        ) : <div className={styles.disabled}>Disabled</div>}
      </div>

      {/* Minimap Icon */}
      <div className={styles.actBox}>
        <div className={styles.actLabel}>
          <input
            type="checkbox"
            checked={a.minimapIcon.enabled}
            onChange={e => upd({ minimapIcon: { ...a.minimapIcon, enabled: e.target.checked } })}
          />
          Minimap Icon
        </div>
        {a.minimapIcon.enabled ? (
          <>
            <div className={styles.inlineRow}>
              <span className={styles.inlineLabel}>Size</span>
              <select
                value={a.minimapIcon.size}
                onChange={e => upd({ minimapIcon: { ...a.minimapIcon, size: +e.target.value as 0 | 1 | 2 } })}
              >
                <option value={0}>Large</option>
                <option value={1}>Medium</option>
                <option value={2}>Small</option>
              </select>
              <span className={styles.inlineLabel}>Color</span>
              <select
                value={a.minimapIcon.color}
                onChange={e => upd({ minimapIcon: { ...a.minimapIcon, color: e.target.value } })}
              >
                {EFFECT_COLORS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.shapeGrid}>
              {MINIMAP_SHAPES.map(s => {
                const col = EFFECT_COLOR_CSS[a.minimapIcon.color] ?? '#fff'
                const isSelected = a.minimapIcon.shape === s
                return (
                  <div
                    key={s}
                    className={`${styles.shapeCell} ${isSelected ? styles.shapeCellSelected : ''}`}
                    title={s}
                    onClick={() => upd({ minimapIcon: { ...a.minimapIcon, shape: s } })}
                  >
                    <div style={{
                      background: '#060614',
                      border: '1px solid #151530',
                      borderRadius: 3,
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MinimapIcon shape={s} color={col} size={16} />
                    </div>
                    <span className={styles.shapeCellName}>{s === 'UpsideDownHouse' ? 'House↓' : s}</span>
                  </div>
                )
              })}
            </div>
          </>
        ) : <div className={styles.disabled}>Disabled</div>}
      </div>
    </div>
  )
}
