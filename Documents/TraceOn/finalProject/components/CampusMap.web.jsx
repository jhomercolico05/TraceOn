import { useCallback, useEffect, useRef, useState } from 'react'

import { buildCampusMapHtml } from './campusMapHtml'

/**
 * Web version of the campus map. Leaflet runs inside a small self-contained
 * iframe so its CSS cannot leak into the app, and the app talks to it through
 * postMessage.
 */
export default function CampusMap({ campus, buildings, items, filter, selectedId, onSelect }) {
  const frameRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [html] = useState(() =>
    buildCampusMapHtml({ campus, buildings, items, filter }),
  )

  const post = useCallback((payload) => {
    const frame = frameRef.current
    if (!frame?.contentWindow) return
    frame.contentWindow.postMessage(payload, '*')
  }, [])

  useEffect(() => {
    function handleMessage(event) {
      const frame = frameRef.current
      if (!frame || event.source !== frame.contentWindow) return

      const data = event.data
      if (!data || data.source !== 'traceon-map') return

      if (data.type === 'ready') {
        setReady(true)
      } else if (data.type === 'select') {
        onSelect?.(data.id ?? null)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelect])

  useEffect(() => {
    if (!ready) return
    post({ type: 'filter', filter: filter.toLowerCase() })
  }, [filter, post, ready])

  useEffect(() => {
    if (!ready) return
    post({ type: 'select', id: selectedId })
  }, [post, ready, selectedId])

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
