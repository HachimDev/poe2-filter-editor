import { useState } from 'react'
import type { RgbaColor, ToggleableColor } from '../types'
import { toHex, fromHex } from '../utils/filter'
import { EFFECT_COLORS, EFFECT_COLOR_CSS } from '../data/constants'
import styles from './ColorControl.module.css'

interface Props {
  label: string
  value: RgbaColor | ToggleableColor
  onChange: (v: RgbaColor | ToggleableColor) => void
  toggleable?: boolean
}

export default function ColorControl({ label, value, onChange, toggleable = false }: Props) {
  const tv = value as ToggleableColor
  const active = !toggleable || tv.enabled

  const currentHex = toHex(value).toLowerCase()
  const matchedPreset = (Object.entries(EFFECT_COLOR_CSS) as [string, string][])
    .find(([, hex]) => hex.toLowerCase() === currentHex)?.[0] ?? null

  const [forcePicker, setForcePicker] = useState(false)
  const showPicker = matchedPreset === null || forcePicker

  const handlePresetChange = (selected: string) => {
    if (selected === 'Custom') {
      setForcePicker(true)
    } else {
      onChange({ ...value, ...fromHex(EFFECT_COLOR_CSS[selected]) })
      setForcePicker(false)
    }
  }

  const selectValue = showPicker && matchedPreset === null ? 'Custom' : (forcePicker ? 'Custom' : (matchedPreset ?? 'Custom'))

  return (
    <div className={styles.box}>
      <div className={styles.label}>
        {toggleable && (
          <input
            type="checkbox"
            checked={!!tv.enabled}
            onChange={e => onChange({ ...value, enabled: e.target.checked })}
          />
        )}
        {label}
      </div>
      {active ? (
        <>
          <div className={styles.row}>
            <div
              className={styles.swatch}
              style={{ background: `rgba(${value.r},${value.g},${value.b},${value.a / 255})` }}
            />
            <select
              value={selectValue}
              onChange={e => handlePresetChange(e.target.value)}
            >
              {EFFECT_COLORS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Custom">— Custom —</option>
            </select>
            <span className={styles.alphaLabel}>Alpha</span>
            <input
              type="range" min={0} max={255} value={value.a}
              style={{ width: 80 }}
              onChange={e => onChange({ ...value, a: +e.target.value })}
            />
            <span className={styles.alphaVal}>{Math.round(value.a / 255 * 100)}%</span>
          </div>
          {showPicker && (
            <div className={styles.pickerRow}>
              <input
                type="color"
                value={toHex(value)}
                onChange={e => onChange({ ...value, ...fromHex(e.target.value) })}
              />
              <span className={styles.pickerLabel}>Custom color</span>
            </div>
          )}
        </>
      ) : (
        <div className={styles.disabled}>Disabled</div>
      )}
    </div>
  )
}
