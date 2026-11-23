/**
 * Builds the self-contained Leaflet document used by both map platforms:
 * - web renders it in an iframe
 * - native renders it in a react-native-webview
 *
 * Keeping the map in one HTML document means the OSM tiles, campus labels and
 * pins behave the same everywhere, and no native map SDK is required.
 */

const escapeForInlineScript = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

export function buildCampusMapHtml({
  campus,
  buildings,
  items,
  filter = 'all',
  pickMode = false,
  pin = null,
}) {
  const data = escapeForInlineScript({ campus, buildings, items, filter, pickMode, pin })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
  <style>
    html,
    body,
    #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      background: #efede2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
      overflow: hidden;
    }

    #map {
      background: #efede2;
    }

    /* Muted, warm basemap so the OSM detail sits behind the pins. */
    .leaflet-tile-pane {
      filter: sepia(0.16) saturate(0.62) brightness(1.04) contrast(0.94);
    }

    .leaflet-container {
      background: #efede2;
      font-family: inherit;
    }

    .leaflet-control-attribution {
      margin: 0 6px 6px 0 !important;
      padding: 2px 5px !important;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.82) !important;
      color: #5b645e !important;
      font-size: 9px !important;
      line-height: 1.4;
    }

    .leaflet-control-attribution a {
      color: #14614a !important;
    }

    .bldg-label {
      padding: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      color: #4b554e !important;
      font-size: 9px !important;
      font-weight: 700 !important;
      letter-spacing: 0.045em;
      text-align: center;
      text-transform: uppercase;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.95),
        0 0 4px rgba(255, 255, 255, 0.85);
      white-space: nowrap;
      pointer-events: none;
    }

    .bldg-label::before {
      display: none !important;
    }

    .pin-icon {
      background: transparent;
      border: 0;
    }

    .pin {
      display: block;
      width: 22px;
      height: 22px;
      border: 2.5px solid #ffffff;
      border-radius: 999px;
      box-shadow: 0 2px 6px rgba(20, 32, 27, 0.35);
      transition: transform 140ms ease, box-shadow 140ms ease;
    }

    .pin.lost {
      background: #b42318;
    }

    .pin.found {
      background: #0b6b4f;
    }

    .pin.active {
      transform: scale(1.28);
      box-shadow: 0 0 0 5px rgba(20, 97, 74, 0.18),
        0 3px 9px rgba(20, 32, 27, 0.4);
    }

    /* The pin dropped by the report form's location picker. */
    .pick-pin {
      position: relative;
      display: block;
      width: 26px;
      height: 26px;
      border: 3px solid #ffffff;
      border-radius: 999px 999px 999px 0;
      transform: rotate(-45deg);
      background: #14614a;
      box-shadow: 0 3px 9px rgba(20, 32, 27, 0.42);
    }

    .pick-pin::after {
      content: '';
      position: absolute;
      inset: 7px;
      border-radius: 999px;
      background: #ffffff;
    }

    .map-controls {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 800;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .map-controls button {
      display: flex;
      width: 38px;
      height: 38px;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 1px solid #d9d7cb;
      border-radius: 999px;
      background: #ffffff;
      color: #14201b;
      font-family: inherit;
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(20, 32, 27, 0.14);
      -webkit-tap-highlight-color: transparent;
    }

    .map-controls button:active {
      background: #f2f0e8;
      transform: scale(0.97);
    }

    .map-controls .glyph {
      display: block;
      font-size: 20px;
      line-height: 1;
    }

    .map-controls button.locate {
      font-size: 17px;
    }

    .map-error {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: #5b645e;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <div class="map-controls">
    <button type="button" id="zoom-in" aria-label="Zoom in">
      <span class="glyph">+</span>
    </button>
    <button type="button" id="zoom-out" aria-label="Zoom out">
      <span class="glyph">-</span>
    </button>
    <button type="button" id="recenter" class="locate" aria-label="Recenter campus">
      <span class="glyph">&#9678;</span>
    </button>
  </div>

  <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script>
  <script>
    (function () {
      var DATA = ${data};
      var mapEl = document.getElementById('map');

      function post(payload) {
        var message = Object.assign({ source: 'traceon-map' }, payload);
        try {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
          } else if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, '*');
          }
        } catch (error) {
          /* the host can be gone while the map is unloading */
        }
      }

      if (!window.L) {
        mapEl.innerHTML =
          '<div class="map-error">The map could not load. Check your internet connection and try again.</div>';
        return;
      }

      var campus = DATA.campus;
      var currentFilter = (DATA.filter || 'all').toLowerCase();
      var selectedId = null;
      var pickMode = !!DATA.pickMode;
      var picked = DATA.pin ? [DATA.pin.lat, DATA.pin.lon] : null;

      var map = L.map('map', {
        zoomControl: false,
        attributionControl: true,
        minZoom: 15,
        maxZoom: 19,
        zoomSnap: 0.25,
        maxBounds: [
          [14.1915, 120.8705],
          [14.2075, 120.8925],
        ],
        maxBoundsViscosity: 0.65,
      });

      map.attributionControl.setPrefix(false);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.fitBounds(campus.bounds, { padding: [22, 22] });

      var labelsLayer = L.layerGroup().addTo(map);

      // Permanent labels are decluttered manually: the campus is dense at
      // Indang, so without this ADMIN / CED / ENGINEERING all stack on top.
      function renderLabels() {
        labelsLayer.clearLayers();

        var placed = [];
        var zoom = map.getZoom();

        DATA.buildings
          .slice()
          .sort(function (a, b) {
            return (a.priority || 99) - (b.priority || 99);
          })
          .forEach(function (building) {
            if (building.minZoom && zoom < building.minZoom) return;

            var point = map.latLngToContainerPoint([building.lat, building.lon]);
            var width = building.name.length * 5.4 + 8;
            var height = 13;
            var box = {
              left: point.x - width / 2,
              right: point.x + width / 2,
              top: point.y - height / 2,
              bottom: point.y + height / 2,
            };

            var collides = placed.some(function (other) {
              return !(
                box.right < other.left ||
                box.left > other.right ||
                box.bottom < other.top ||
                box.top > other.bottom
              );
            });
            if (collides) return;

            placed.push(box);

            L.tooltip({
              permanent: true,
              direction: 'center',
              className: 'bldg-label',
              opacity: 1,
            })
              .setLatLng([building.lat, building.lon])
              .setContent(building.name)
              .addTo(labelsLayer);
          });
      }

      map.on('zoomend', renderLabels);

      var pinsLayer = L.layerGroup().addTo(map);

      function visibleItems() {
        return DATA.items.filter(function (item) {
          return currentFilter === 'all' || item.type === currentFilter;
        });
      }

      function renderPins() {
        pinsLayer.clearLayers();
        if (pickMode) return;

        visibleItems().forEach(function (item) {
          var active = item.id === selectedId;
          var icon = L.divIcon({
            className: 'pin-icon',
            html:
              '<span class="pin ' +
              item.type +
              (active ? ' active' : '') +
              '"></span>',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          L.marker([item.lat, item.lon], {
            icon: icon,
            title: item.title,
            riseOnHover: true,
          })
            .on('click', function () {
              post({ type: 'select', id: item.id });
            })
            .addTo(pinsLayer);
        });
      }

      var pickLayer = L.layerGroup().addTo(map);

      function renderPick() {
        pickLayer.clearLayers();
        if (!picked) return;

        var icon = L.divIcon({
          className: 'pin-icon',
          html: '<span class="pick-pin"></span>',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        L.marker(picked, { icon: icon, interactive: false }).addTo(pickLayer);
      }

      map.on('click', function (event) {
        if (pickMode) {
          picked = [event.latlng.lat, event.latlng.lng];
          renderPick();
          post({ type: 'pick', lat: picked[0], lng: picked[1] });
          return;
        }
        post({ type: 'select', id: null });
      });

      function applyFilter(value) {
        var next = String(value || 'all').toLowerCase();
        if (next !== 'all' && next !== 'lost' && next !== 'found') {
          next = 'all';
        }
        currentFilter = next;

        var stillVisible = visibleItems().some(function (item) {
          return item.id === selectedId;
        });
        if (!stillVisible) {
          selectedId = null;
        }

        renderPins();
      }

      window.traceonSetFilter = applyFilter;

      window.traceonSetSelected = function (value) {
        selectedId = value || null;
        renderPins();
      };

      window.traceonSetPin = function (lat, lng) {
        picked = lat != null && lng != null ? [lat, lng] : null;
        renderPick();
      };

      function receive(raw) {
        if (!raw) return;

        var payload = raw;
        if (typeof raw === 'string') {
          try {
            payload = JSON.parse(raw);
          } catch (error) {
            return;
          }
        }

        if (payload.type === 'filter') {
          applyFilter(payload.filter);
        } else if (payload.type === 'select') {
          window.traceonSetSelected(payload.id);
        } else if (payload.type === 'pin') {
          window.traceonSetPin(payload.lat, payload.lng);
        }
      }

      window.addEventListener('message', function (event) {
        receive(event.data);
      });

      document.getElementById('zoom-in').addEventListener('click', function () {
        map.zoomIn(0.5);
      });

      document.getElementById('zoom-out').addEventListener('click', function () {
        map.zoomOut(0.5);
      });

      document.getElementById('recenter').addEventListener('click', function () {
        map.fitBounds(campus.bounds, { padding: [22, 22] });
        post({ type: 'select', id: null });
      });

      renderLabels();
      renderPins();

      function notifyReady() {
        map.invalidateSize();
        renderLabels();
        renderPins();
        renderPick();
        post({ type: 'ready' });
      }

      if (document.readyState === 'complete') {
        setTimeout(notifyReady, 60);
      } else {
        window.addEventListener('load', function () {
          setTimeout(notifyReady, 60);
        });
      }

      window.addEventListener('resize', function () {
        map.invalidateSize();
      });
    })();
  </script>
</body>
</html>`
}
