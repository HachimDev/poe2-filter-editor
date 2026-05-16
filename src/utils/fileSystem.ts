declare global {
  interface Window {
    showSaveFilePicker(options?: {
      id?: string
      suggestedName?: string
      startIn?: string
      types?: Array<{ description?: string; accept: Record<string, string[]> }>
    }): Promise<FileSystemFileHandle>
  }
}

export const hasFSA = typeof window !== 'undefined' && 'showSaveFilePicker' in window

export async function saveWithPicker(filename: string, content: string): Promise<boolean> {
  try {
    const handle = await window.showSaveFilePicker({
      id: 'poe2filter',
      suggestedName: filename,
      startIn: 'documents',
      types: [{ description: 'PoE2 Filter', accept: { 'text/plain': ['.filter'] } }],
    })
    const writable = await handle.createWritable()
    await writable.write(content)
    await writable.close()
    return true
  } catch (e) {
    if ((e as DOMException).name === 'AbortError') return false
    throw e
  }
}
