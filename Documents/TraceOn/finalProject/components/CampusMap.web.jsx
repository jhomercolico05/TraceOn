import { useCallback, useEffect, useRef, useState } from 'react'
import { buildCampusMapHtml } from './campusMapHtml'

/**
 * Web version of the campus map. Leaflet runs inside a small self-contained
 * iframe so its CSS cannot leak into the app, and the app talks to it through
 * postMessage.
 *
 * Pass `pickMode` to turn taps into dropped pins (used by the report form).
 */
export default function CampusMap({
  campus,
  buildings,
  items,
  filter = 'All',
  selectedId,
  onSelect,
  pickMode = false,
  pin = null,
  onPick,
}) {
  const frameRef = useRef(null)
  const [ready, setReady] = useState(false)
  const html = buildCampusMapHtml({ campus, buildings, items, filter, pickMode, pin })

  const post = useCallback((payload) => {
    const frame = frameRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.postMessage(payload, '*')
  }, [])

  useEffect(() => {
    function handleMessage(event) {
      const frame = frameRef.current
      if (!frame?.contentWindow) return

      const data = event.data
      if (!data || data.source !== 'traceon-map') return

      if (data.type === 'ready') {
        setReady(true)
      } else if (data.type === 'select') {
        onSelect?.(data.id ?? null)
      } else if (data.type === 'pick') {
        onPick?.({ lat: data.lat, lng: data.lng })
      } else if (data.type === 'pin') {
        onPick?.({ lat: data.lat, lng: data.lng })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelect, onPick])

  useEffect(() => {
    if (!ready) return
    post({ type: 'filter', filter: String(filter).toLowerCase() })
  }, [filter, post, ready])

  useEffect(() => {
    if (!ready) return
    post({ type: 'select', id: selectedId })
  }, [post, ready, selectedId])

  useEffect(() => {
    if (!ready) return
    post({ type: 'pin', lat: pin?.lat ?? null, lng: pin?.lng ?? null })
  }, [post, ready, pin])

  return (
    <iframe
      ref={frameRef}
      title="CvSU Main Campus map"
      srcDoc={html}
      style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  )
}