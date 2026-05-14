import React, { useState } from 'react'
import styles from './ResizeHandle.module.css'

interface Props {
  onDrag: (dx: number) => void
}

export default function ResizeHandle({ onDrag }: Props) {
  const [dragging, setDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    let lastX = e.clientX

    const onMove = (ev: MouseEvent) => {
      onDrag(ev.clientX - lastX)
      lastX = ev.clientX
    }
    const onUp = () => {
      setDragging(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      className={`${styles.handle} ${dragging ? styles.dragging : ''}`}
      onMouseDown={handleMouseDown}
    />
  )
}
