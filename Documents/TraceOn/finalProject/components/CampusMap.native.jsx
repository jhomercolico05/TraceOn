import { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview'

import { buildCampusMapHtml } from './campusMapHtml'

/**
 * Native version of the campus map. The same Leaflet document used on web is
 * displayed in a WebView, so iOS and Android get the identical OSM map in
 * Expo Go without adding a native map SDK.
 */
export default function CampusMap({ campus, buildings, items, filter, selectedId, onSelect }) {
  const webviewRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [html] = useState(() =>
    buildCampusMapHtml({ campus, buildings, items, filter }),
  )

  const run = (script) => {
    webviewRef.current?.injectJavaScript(`${script}; true;`)
  }

  useEffect(() => {
    if (!ready) return
    run(`window.traceonSetFilter(${JSON.stringify(filter.toLowerCase())})`)
  }, [filter, ready])

  useEffect(() => {
    if (!ready) return
    run(`window.traceonSetSelected(${JSON.stringify(selectedId || '')})`)
  }, [ready, selectedId])

  const handleMessage = (event) => {
    let data
    try {
      data = JSON.parse(event.nativeEvent.data)
    } catch (error) {
      return
    }

    if (!data || data.source !== 'traceon-map') return

    if (data.type === 'ready') {
      setReady(true)
    } else if (data.type === 'select') {
      onSelect?.(data.id ?? null)
    }
  }

  return (
    <WebView
      ref={webviewRef}
      source={{ html }}
      originWhitelist={['*']}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      setSupportMultipleWindows={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: '#EFEDE2' }}
      containerStyle={{ flex: 1, backgroundColor: '#EFEDE2' }}
    />
  )
}
