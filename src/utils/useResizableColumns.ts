import { useState, useRef, useCallback, RefObject } from 'react'
import { clamp } from '../utils/filter'
import { DEFAULT_COL_WIDTHS } from '../data/constants'

export type ColWidths = [number, number, number]

interface UseResizableColumnsResult {
  colWidths: ColWidths
  containerRef: RefObject<HTMLDivElement>
  onDragLeft: (dx: number) => void
  onDragRight: (dx: number) => void
}

export function useResizableColumns(): UseResizableColumnsResult {
  const [colWidths, setColWidths] = useState<ColWidths>(DEFAULT_COL_WIDTHS)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalWidth = useCallback((): number =>
    containerRef.current?.clientWidth ?? window.innerWidth, [])

  const onDragLeft = useCallback((dx: number) => {
    const tw = totalWidth()
    setColWidths(([l, c, r]) => {
      const delta = (dx / tw) * 100
      const nl = clamp(l + delta, 10, 60)
      const nc = clamp(c - delta, 15, 70)
      return [nl, nc, r] as ColWidths
    })
  }, [totalWidth])

  const onDragRight = useCallback((dx: number) => {
    const tw = totalWidth()
    setColWidths(([l, c, r]) => {
      const delta = (dx / tw) * 100
      const nc = clamp(c + delta, 15, 70)
      const nr = clamp(r - delta, 10, 60)
      return [l, nc, nr] as ColWidths
    })
  }, [totalWidth])

  return { colWidths, containerRef, onDragLeft, onDragRight }
}
