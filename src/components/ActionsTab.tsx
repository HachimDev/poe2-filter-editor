import { useState } from 'react'
import type { FilterRule, VisualPreset } from '../types'
import { EFFECT_COLORS, MINIMAP_SHAPES } from '../data/constants'
import ColorControl from './ColorControl'
import styles from './EditorTabs.module.css'
import vStyles from './VisualsPage.module.css'

interface Props {
  rule: FilterRule
  onChange: (rule: FilterRule) => void
  visuals?: VisualPreset[]
}

export default function ActionsTab({ rule, onChange, visuals }: Props) {
  const [applyId, setApplyId] = useState('')
  const effectiveApplyId = applyId || visuals?.[0]?.id || ''
  const a = rule.actions
  const upd = (patch: Partial<typeof a>) => onChange({ ...rule, actions: { ...a, ...patch } })

  const handleApply = () => {
    const preset = visuals?.find(v => v.id === effectiveApplyId)
    if (preset) onChange({ ...rule, actions: preset.actions })
  }

  return (
    <div>
      {visuals && visuals.length > 0 && (
        <div className={vStyles.applyBar}>
          <div className={vStyles.applyBarTitle}>Apply Visual</div>
          <div className={vStyles.applyRow}>
            <select
              style={{ flex: 1 }}
              value={effectiveApplyId}
              onChange={e => setApplyId(e.target.value)}
            >
              {visuals.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <button className="btn btn-sm btn-primary" onClick={handleApply}>Apply</button>
          </div>
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
          <div className={styles.inlineRow}>
            <span className={styles.inlineLabel}>Size</span>
            <select
              value={a.minimapIcon.size}
              style={{ width: 54 }}
              onChange={e => upd({ minimapIcon: { ...a.minimapIcon, size: +e.target.value as 0 | 1 | 2 } })}
            >
              {[0, 1, 2].map(s => <option key={s}>{s}</option>)}
            </select>
            <span className={styles.inlineLabel}>Color</span>
            <select
              value={a.minimapIcon.color}
              onChange={e => upd({ minimapIcon: { ...a.minimapIcon, color: e.target.value } })}
            >
              {EFFECT_COLORS.map(c => <option key={c}>{c}</option>)}
            </select>
            <span className={styles.inlineLabel}>Shape</span>
            <select
              value={a.minimapIcon.shape}
              onChange={e => upd({ minimapIcon: { ...a.minimapIcon, shape: e.target.value } })}
            >
              {MINIMAP_SHAPES.map(s => <option key={s}>{s}</option>)}
            </select>
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
            <span className={styles.inlineLabel}>Volume</span>
            <input
              type="range" min={0} max={300} value={a.playAlertSound.volume}
              onChange={e => upd({ playAlertSound: { ...a.playAlertSound, volume: +e.target.value } })}
            />
            <span className={styles.sliderVal}>{a.playAlertSound.volume}</span>
          </div>
        ) : <div className={styles.disabled}>Disabled</div>}
      </div>
    </div>
  )
}
