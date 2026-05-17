import { MdClose, MdDownload, MdContentCopy } from 'react-icons/md'
import { useState } from 'react'
import styles from './DownloadDialog.module.css'

interface Props {
  onDownload: () => Promise<void> | void
  onClose: () => void
}

const FILTER_PATH = String.raw`Documents\My Games\Path of Exile 2`

export default function DownloadDialog({ onDownload, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(FILTER_PATH).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <span className={styles.title}>Download Filter</span>
          <button className={styles.closeBtn} onClick={onClose}><MdClose /></button>
        </div>

        <div className={styles.body}>
          <p className={styles.hint}>
            Place the downloaded <code>.filter</code> file in your Path of Exile 2 filters folder to use it in-game:
          </p>
          <div className={styles.pathRow}>
            <code className={styles.path}>{FILTER_PATH}</code>
            <button className={styles.copyBtn} onClick={handleCopy} title="Copy path">
              {copied ? <><MdContentCopy /> Copied!</> : <><MdContentCopy /> Copy</>}
            </button>
          </div>
          <p className={styles.sub}>
            Then enable it in-game under <strong>Options → Game → Item Filter</strong>.
          </p>
        </div>

        <div className={styles.footer}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => { await onDownload(); onClose() }}>
            <MdDownload /> Download .filter
          </button>
        </div>
      </div>
    </div>
  )
}
