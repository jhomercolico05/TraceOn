import { useCallback, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import CampusMap from '../components/CampusMap'
import { BUILDINGS, CAMPUS, ITEMS } from '../data/campusMap'
import { supabase } from '../lib/supabase'

const COLORS = {
  bg: '#F7F3EA',
  surface: '#FFFFFF',
  border: '#E0DED2',
  text: '#14201B',
  muted: '#737A75',
  primary: '#14614A',
  primaryDark: '#0E4A38',
  lost: '#B42318',
  pill: '#E7F0EA',
}

const FILTERS = ['All', 'Lost', 'Found']

export default function MapScreen({ navigation }) {
  const [filter, setFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(null)
  const [reports, setReports] = useState([])

  // Load reports from Supabase
  useEffect(() => {
    let isMounted = true;
    supabase
      .from('reports')
      .select('id, type, title, lat, lon')
      .order('id', { ascending: false })
      .then(({ data }) => {
        if (isMounted) setReports(data || []);
      })
      .catch((err) => {
        console.error('Error loading reports:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Combine seed items with database reports for map display
  const seedPins = ITEMS.filter(
    (item) => filter === 'All' || item.type === filter.toLowerCase(),
  )

  const reportPins = reports
    .filter(
      (r) =>
        filter === 'All' ||
        (r.type && r.type.toLowerCase() === filter.toLowerCase()),
    )
    .map((r) => ({
      id: r.id,
      title: r.title || 'Reported Item',
      lat: r.lat,
      lon: r.lon,
      type: r.type || 'lost',
      place: '',
      category: 'Others',
    }))

  const allPins = [...seedPins, ...reportPins]

  const selected = allPins.find((item) => item.id === selectedId)

  const handleSelect = useCallback((id) => {
    setSelectedId((current) => {
      if (!id) return null
      return current === id ? null : id
    })
  }, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation?.goBack()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>INTERACTIVE 2D MAP</Text>
            <Text style={styles.title}>CvSU Main Campus</Text>
          </View>

          <Pressable
            onPress={() => navigation?.navigate('Report')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Report an item"
            style={styles.addButton}
          >
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.chips}>
            {FILTERS.map((option) => {
              const active = option === filter
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    setFilter(option)
                    setSelectedId(null)
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {option}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.countPill}>
            <Text style={styles.countText}>{allPins.length} PINS</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          <CampusMap
            campus={CAMPUS}
            buildings={BUILDINGS}
            items={allPins}
            filter={filter}
            selectedId={selectedId}
            onSelect={handleSelect}
          />

          <View pointerEvents="none" style={styles.hintPill}>
            <Ionicons name="location-outline" size={14} color={COLORS.primary} />
            <Text style={styles.hintText} numberOfLines={1}>
              Tap a pin to preview an item.
            </Text>
          </View>

          <View pointerEvents="none" style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.lost }]} />
            <Text style={styles.legendText}>Lost</Text>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>Found</Text>
          </View>
        </View>

        {selected ? (
          <View style={styles.preview}>
            <View
              style={[
                styles.previewDot,
                {
                  backgroundColor:
                    selected.type === 'lost' ? COLORS.lost : COLORS.primary,
                },
              ]}
            />
            <View style={styles.previewText}>
              <Text style={styles.previewTitle} numberOfLines={1}>
                {selected.title}
              </Text>
              <Text style={styles.previewPlace} numberOfLines={1}>
                {selected.place}
              </Text>
            </View>
            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor:
                    selected.type === 'lost' ? '#FBEAE8' : COLORS.pill,
                },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      selected.type === 'lost' ? COLORS.lost : COLORS.primary,
                  },
                ]}
              >
                {selected.type.toUpperCase()}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.note}>
            Pins show reported locations, not live GPS.
          </Text>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 3,
    color: COLORS.text,
    fontSize: 25,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14201B',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  filterRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 1,
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  countPill: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  mapCard: {
    flex: 1,
    minHeight: 260,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#EFEDE2',
    overflow: 'hidden',
  },
  hintPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 62,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderColor: '#E6E4D9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    shadowColor: '#14201B',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  hintText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  legend: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    height: 38,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderWidth: 1,
    borderColor: '#E6E4D9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    shadowColor: '#14201B',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    marginLeft: 4,
  },
  legendText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '500',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  previewDot: {
    width: 11,
    height: 11,
    borderRadius: 999,
  },
  previewText: {
    flex: 1,
  },
  previewTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  previewPlace: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 11,
  },
  typeBadge: {
    height: 24,
    paddingHorizontal: 9,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  note: {
    paddingVertical: 14,
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
  },
})
