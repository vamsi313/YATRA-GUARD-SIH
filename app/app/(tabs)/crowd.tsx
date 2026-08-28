import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CrowdBadge, CrowdBar, Icon, MiniMetric, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { destinations, getCrowdLevel, getOccupancy, mockForecast } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { useYatra } from '@/context/YatraContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CrowdScreen() {
  const colors = useColors();
  const { selectedDestination, placesList, forecastSurges } = useYatra();
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const destId = selectedDestination?.id ?? 'tirumala';
  const destName = selectedDestination?.name ?? 'Tirumala';

  const hotspots = useMemo(() => {
    return placesList.filter((p) => p.destinationId === destId).slice(0, 6);
  }, [destId, placesList]);

  const activeSpot = useMemo(() => {
    return hotspots.find(p => p.id === selectedSpotId) || hotspots[0];
  }, [hotspots, selectedSpotId]);

  const overallOccupancy = useMemo(() => {
    if (hotspots.length === 0) return 82;
    const total = hotspots.reduce((sum, p) => sum + getOccupancy(p), 0);
    return Math.round(total / hotspots.length);
  }, [hotspots]);

  const activeForecast = forecastSurges[destId] ?? mockForecast;
  const criticalCount = hotspots.filter((p) => getOccupancy(p) > 100).length;
  const saferCount = hotspots.filter((p) => getOccupancy(p) <= 60).length;

  // Grid coordinates mapping for cyber heat map simulation
  const mapHotspots = useMemo(() => {
    const coords = [
      { top: '38%', left: '42%', size: 140, severity: 'critical' },
      { top: '22%', left: '60%', size: 95, severity: 'high' },
      { top: '62%', left: '26%', size: 85, severity: 'moderate' },
      { top: '15%', left: '52%', size: 45, severity: 'critical' },
      { top: '68%', left: '18%', size: 50, severity: 'critical' },
      { top: '72%', left: '64%', size: 35, severity: 'moderate' },
    ];
    return hotspots.map((spot, i) => {
      const occ = getOccupancy(spot);
      const sev = occ > 100 ? 'critical' : occ > 75 ? 'high' : 'moderate';
      return {
        ...spot,
        occ,
        sev,
        pos: coords[i % coords.length],
      };
    });
  }, [hotspots]);

  return (
    <Screen>
      <View style={ui.headerRow}>
        <View>
          <Text style={[styles.kicker, { color: colors.saffron }]}>SITUATIONAL AWARENESS</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Crowd Intelligence</Text>
        </View>
        <View style={styles.viewToggle}>
          <Pressable
            onPress={() => setActiveTab('map')}
            style={[styles.toggleBtn, activeTab === 'map' && styles.toggleBtnActive]}
          >
            <Icon name="map" size={13} color={activeTab === 'map' ? '#00F0FF' : '#6B7280'} />
            <Text style={[styles.toggleText, activeTab === 'map' && styles.toggleTextActive]}>Heat Map</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('list')}
            style={[styles.toggleBtn, activeTab === 'list' && styles.toggleBtnActive]}
          >
            <Icon name="list" size={13} color={activeTab === 'list' ? '#00F0FF' : '#6B7280'} />
            <Text style={[styles.toggleText, activeTab === 'list' && styles.toggleTextActive]}>Stats</Text>
          </Pressable>
        </View>
      </View>

      {/* Destination Selector Pill */}
      <Pressable
        onPress={() => router.push('/destination-picker')}
        style={[styles.scopePill, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.livePulse} />
        <Text style={[styles.scopeText, { color: colors.ink }]}>
          ZONE: <Text style={{ fontWeight: '800', color: colors.saffron }}>{destName.toUpperCase()}</Text> · Live Feed
        </Text>
        <Icon name="chevron-right" size={13} color={colors.mutedForeground} />
      </Pressable>

      {/* 🔴 FUTURISTIC DARK CROWD DENSITY MAP SCREENSHOT IMPLEMENTATION */}
      {activeTab === 'map' && (
        <View style={styles.cyberMapCard}>
          {/* Header Bar */}
          <View style={styles.cyberHeader}>
            <Text style={styles.cyberHeaderTitle}>CROWD DENSITY MAP</Text>
            <Text style={styles.cyberHeaderSub}>LIVE FEED · {destName.toUpperCase()} ZONE 04</Text>
          </View>

          {/* Map Grid View Container */}
          <View style={styles.mapGridCanvas}>
            {/* Grid Lines Pattern Background */}
            <View style={styles.gridOverlay}>
              {Array.from({ length: 9 }).map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 10}%` }]} />
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 10}%` }]} />
              ))}
            </View>

            {/* Severity Index Legend Box */}
            <View style={styles.severityLegendBox}>
              <Text style={styles.severityTitle}>SEVERITY INDEX</Text>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF0033', boxShadow: '0 0 8px #FF0033' }]} />
                <Text style={styles.legendLabel}>CRITICAL (&gt;100%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF8800' }]} />
                <Text style={styles.legendLabel}>HIGH (75-100%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFCC00' }]} />
                <Text style={styles.legendLabel}>MODERATE (&lt;75%)</Text>
              </View>
            </View>

            {/* Glowing Density Radial Circles */}
            {mapHotspots.map((spot) => {
              const color = spot.sev === 'critical' ? '#FF0033' : spot.sev === 'high' ? '#FF8800' : '#FFCC00';
              const isSelected = activeSpot?.id === spot.id;

              return (
                <Pressable
                  key={spot.id}
                  onPress={() => setSelectedSpotId(spot.id)}
                  style={[
                    styles.densitySpot,
                    {
                      top: spot.pos.top as any,
                      left: spot.pos.left as any,
                      width: spot.pos.size,
                      height: spot.pos.size,
                      marginLeft: -spot.pos.size / 2,
                      marginTop: -spot.pos.size / 2,
                    },
                  ]}
                >
                  {/* Outer Glowing Heat Radar Circle */}
                  <View
                    style={[
                      styles.heatCircleOuter,
                      {
                        backgroundColor: `${color}28`,
                        borderColor: `${color}88`,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  />

                  {/* Inner Core Density Node */}
                  <View
                    style={[
                      styles.heatCore,
                      {
                        backgroundColor: color,
                        width: isSelected ? 18 : 12,
                        height: isSelected ? 18 : 12,
                        borderRadius: 9,
                      },
                    ]}
                  />

                  {/* Tag Label */}
                  <View style={styles.spotTag}>
                    <Text style={[styles.spotTagText, { color }]}>{spot.occ}%</Text>
                  </View>
                </Pressable>
              );
            })}

            {/* Bottom Timestamp & Refresh status */}
            <View style={styles.mapFooterBar}>
              <Text style={styles.mapTimestamp}>LAST UPDATE: {new Date().toLocaleTimeString()} UTC</Text>
              <View style={styles.refreshBadge}>
                <Text style={styles.refreshText}>LIVE SENSOR ACTIVE</Text>
              </View>
            </View>
          </View>

          {/* Active Location Detail Card below Map */}
          {activeSpot && (
            <View style={styles.spotDetailBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.spotDetailEyebrow}>SELECTED MONITORING POINT</Text>
                <Text style={styles.spotDetailName}>{activeSpot.name}</Text>
                <Text style={styles.spotDetailMeta}>
                  {activeSpot.crowd.current.toLocaleString()} devotess · {activeSpot.crowd.waitingMinutes} min wait time
                </Text>
              </View>
              <Pressable
                onPress={() => router.push({ pathname: '/place/[id]', params: { id: activeSpot.id } })}
                style={styles.inspectBtn}
              >
                <Text style={styles.inspectBtnText}>Analyze</Text>
                <Icon name="arrow-right" size={13} color="#00F0FF" />
              </Pressable>
            </View>
          )}
        </View>
      )}

      {/* Metrics Row */}
      <View style={styles.metrics}>
        <MiniMetric label="Tracked Spots" value={`${hotspots.length}`} icon="map-pin" tone="blue" />
        <MiniMetric label="Critical Zones" value={`${criticalCount}`} icon="alert-octagon" tone="danger" />
        <MiniMetric label="Safer Routes" value={`${saferCount}`} icon="check-circle" tone="teal" />
      </View>

      {/* Forecast Section */}
      <SectionHeader eyebrow="SURGE FORECAST" title="Surge prediction index" />
      <View style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.forecastRow}>
          {activeForecast.map((value, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={[styles.forecastTime, { color: colors.mutedForeground }]}>
                {index === 0 ? 'NOW' : `+${index} HR`}
              </Text>
              <View style={styles.forecastBarWrap}>
                <View
                  style={[
                    styles.forecastBar,
                    {
                      height: Math.max(18, Math.min(value, 125) / 1.25),
                      backgroundColor: value > 100 ? '#FF0033' : value > 80 ? colors.saffron : colors.teal,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.forecastValue, { color: colors.ink }]}>{value}%</Text>
            </View>
          ))}
        </View>
        <View style={[styles.forecastNote, { backgroundColor: colors.dangerSoft }]}>
          <Icon name="trending-up" size={15} color={colors.danger} />
          <Text style={[styles.forecastNoteText, { color: colors.danger }]}>
            {activeForecast.some((v) => v > 100)
              ? 'Critical density surge forecasted in upcoming hours'
              : 'Flow parameters within safe thresholds'}
          </Text>
        </View>
      </View>

      {/* Hotspots List */}
      <SectionHeader
        eyebrow="LOCATION METRICS"
        title={`${destName} Hotspot Ranks`}
        action="Explore all"
        onAction={() => router.push('/(tabs)/explore')}
      />
      {hotspots.map((place) => {
        const occupancy = getOccupancy(place);
        return (
          <Pressable
            key={place.id}
            onPress={() => {
              setSelectedSpotId(place.id);
              setActiveTab('map');
            }}
            style={[styles.hotspot, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.hotspotHead}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.hotspotName, { color: colors.ink }]}>{place.name}</Text>
                <Text style={[styles.hotspotSub, { color: colors.mutedForeground }]}>
                  {place.crowd.current.toLocaleString()} devotees · {place.crowd.waitingMinutes} min wait
                </Text>
              </View>
              <CrowdBadge level={getCrowdLevel(occupancy)} compact />
            </View>
            <CrowdBar occupancy={occupancy} />
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.8, marginTop: 2 },
  viewToggle: { flexDirection: 'row', backgroundColor: '#0F172A', borderRadius: 10, padding: 3, gap: 2 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#1E293B' },
  toggleText: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  toggleTextActive: { color: '#00F0FF' },
  scopePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 12, marginBottom: 12 },
  livePulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00F0FF' },
  scopeText: { flex: 1, fontSize: 11, fontWeight: '600' },

  // 🔴 CYBER DENSITY MAP UI (MATCHING SCREENSHOT)
  cyberMapCard: { backgroundColor: '#050B14', borderRadius: 20, borderWidth: 1, borderColor: '#1E293B', overflow: 'hidden', marginBottom: 16 },
  cyberHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#0F172A', alignItems: 'center' },
  cyberHeaderTitle: { color: '#E2E8F0', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  cyberHeaderSub: { color: '#00F0FF', fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 3 },
  mapGridCanvas: { height: 260, backgroundColor: '#020617', position: 'relative', overflow: 'hidden' },
  gridOverlay: { ...StyleSheet.absoluteFillObject },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#0F172A' },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: '#0F172A' },

  severityLegendBox: { position: 'absolute', top: 12, right: 12, backgroundColor: '#0B132BCC', borderWidth: 1, borderColor: '#1E293B', borderRadius: 10, padding: 8, zIndex: 10 },
  severityTitle: { color: '#94A3B8', fontSize: 8, fontWeight: '800', letterSpacing: 0.8, marginBottom: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: '#CBD5E1', fontSize: 8, fontWeight: '700' },

  densitySpot: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  heatCircleOuter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 999 },
  heatCore: { elevation: 6 },
  spotTag: { position: 'absolute', bottom: -12, backgroundColor: '#090D16EE', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#1E293B' },
  spotTagText: { fontSize: 8, fontWeight: '900' },

  mapFooterBar: { position: 'absolute', bottom: 10, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapTimestamp: { color: '#64748B', fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  refreshBadge: { backgroundColor: '#00F0FF1A', borderColor: '#00F0FF55', borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  refreshText: { color: '#00F0FF', fontSize: 8, fontWeight: '800' },

  spotDetailBanner: { backgroundColor: '#0F172A', padding: 12, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1E293B' },
  spotDetailEyebrow: { color: '#64748B', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  spotDetailName: { color: '#F8FAFC', fontSize: 13, fontWeight: '700', marginTop: 2 },
  spotDetailMeta: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  inspectBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#00F0FF15', borderWidth: 1, borderColor: '#00F0FF66', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9 },
  inspectBtnText: { color: '#00F0FF', fontSize: 11, fontWeight: '800' },

  metrics: { flexDirection: 'row', paddingVertical: 14, gap: 10 },
  forecastCard: { borderWidth: 1, borderRadius: 18, padding: 14 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  forecastItem: { alignItems: 'center', flex: 1 },
  forecastTime: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  forecastBarWrap: { height: 96, justifyContent: 'flex-end', marginTop: 9 },
  forecastBar: { width: 19, borderRadius: 7 },
  forecastValue: { fontSize: 11, fontWeight: '700', marginTop: 7 },
  forecastNote: { marginTop: 15, borderRadius: 11, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 7 },
  forecastNoteText: { fontSize: 11, fontWeight: '700' },
  hotspot: { borderWidth: 1, borderRadius: 16, padding: 13, marginBottom: 10 },
  hotspotHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 11 },
  hotspotName: { fontSize: 13, fontWeight: '700' },
  hotspotSub: { fontSize: 11, marginTop: 4 },
});