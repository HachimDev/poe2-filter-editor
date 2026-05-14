import type { RgbaColor, ToggleableColor } from '../types'
import { toHex, fromHex } from '../utils/filter'
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
        <div className={styles.row}>
          <div
            className={styles.swatch}
            style={{ background: `rgba(${value.r},${value.g},${value.b},${value.a / 255})` }}
          />
          <input
            type="color"
            value={toHex(value)}
            onChange={e => onChange({ ...value, ...fromHex(e.target.value) })}
          />
          <span className={styles.alphaLabel}>Alpha</span>
          <input
            type="range" min={0} max={255} value={value.a}
            style={{ width: 80 }}
            onChange={e => onChange({ ...value, a: +e.target.value })}
          />
          <span className={styles.alphaVal}>{Math.round(value.a / 255 * 100)}%</span>
        </div>
      ) : (
        <div className={styles.disabled}>Disabled</div>
      )}
    </div>
  )
}
