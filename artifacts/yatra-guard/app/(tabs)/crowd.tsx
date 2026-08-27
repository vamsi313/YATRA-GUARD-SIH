import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CrowdBadge, CrowdBar, Icon, MiniMetric, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { destinations, getDestinationPlaces, getCrowdLevel, getOccupancy, mockForecast, places } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function CrowdScreen() {
  const colors = useColors();
  const tirumalaPlaces = getDestinationPlaces('tirumala').slice(0, 4);
  return <Screen><View style={ui.headerRow}><View><Text style={[styles.kicker, { color: colors.saffron }]}>SITUATIONAL AWARENESS</Text><Text style={[styles.title, { color: colors.ink }]}>Crowd intelligence</Text></View><View style={[styles.livePill, { backgroundColor: colors.tealSoft }]}><View style={[styles.liveDot, { backgroundColor: colors.teal }]} /><Text style={[styles.liveText, { color: colors.teal }]}>SAMPLE LIVE</Text></View></View>
    <View style={[styles.hero, { backgroundColor: colors.ink }]}><View style={styles.heroHeader}><View><Text style={styles.heroEyebrow}>TIRUMALA · NOW</Text><Text style={styles.heroTitle}>82% overall crowd</Text></View><CrowdBadge level="VERY HIGH" /></View><CrowdBar occupancy={82} height={10} /><Text style={styles.heroBody}>High congestion expected in approximately 2 hours. The main temple queue is already beyond safe capacity.</Text><Pressable onPress={() => router.push({ pathname: '/destination/[id]', params: { id: 'tirumala' } })} style={styles.heroLink}><Text style={styles.heroLinkText}>Open Tirumala dashboard</Text><Icon name="arrow-up-right" size={16} color="#FFFFFF" /></Pressable></View>
    <View style={styles.metrics}><MiniMetric label="Locations tracked" value="32" icon="map-pin" tone="blue" /><MiniMetric label="Critical" value="3" icon="alert-octagon" tone="danger" /><MiniMetric label="Safer picks" value="12" icon="check-circle" tone="teal" /></View>
    <SectionHeader eyebrow="FORECAST" title="Crowd forecast" action="How it works" />
    <View style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.forecastRow}>{mockForecast.map((value, index) => <View key={index} style={styles.forecastItem}><Text style={[styles.forecastTime, { color: colors.mutedForeground }]}>{index === 0 ? 'NOW' : `+${index} HR`}</Text><View style={styles.forecastBarWrap}><View style={[styles.forecastBar, { height: Math.max(18, Math.min(value, 125) / 1.25), backgroundColor: value > 100 ? colors.danger : value > 80 ? colors.saffron : colors.teal }]} /></View><Text style={[styles.forecastValue, { color: colors.ink }]}>{value}%</Text></View>)}</View><View style={[styles.forecastNote, { backgroundColor: colors.dangerSoft }]}><Icon name="trending-up" size={15} color={colors.danger} /><Text style={[styles.forecastNoteText, { color: colors.danger }]}>Peak congestion predicted around +3 hours</Text></View></View>
    <SectionHeader eyebrow="MONITORED LOCATIONS" title="Tirumala hotspots" action="All places" onAction={() => router.push('/(tabs)/explore')} />
    {tirumalaPlaces.map((place) => { const occupancy = getOccupancy(place); return <Pressable key={place.id} onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })} style={[styles.hotspot, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.hotspotHead}><View style={{ flex: 1 }}><Text style={[styles.hotspotName, { color: colors.ink }]}>{place.name}</Text><Text style={[styles.hotspotSub, { color: colors.mutedForeground }]}>{place.crowd.current.toLocaleString()} people · {place.crowd.waitingMinutes} min wait</Text></View><CrowdBadge level={getCrowdLevel(occupancy)} compact /></View><CrowdBar occupancy={occupancy} /></Pressable> })}
    <SectionHeader eyebrow="HOW WE READ IT" title="A clearer picture" />
    <View style={[styles.infoBox, { backgroundColor: colors.tealSoft }]}><Icon name="info" size={16} color={colors.teal} /><Text style={[styles.infoText, { color: colors.inkSoft }]}>Occupancy can exceed 100% when estimated people are above a location’s safe capacity. This prototype combines mock occupancy, trend, waiting time and pathway data into a simple risk signal.</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  kicker: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  title: { fontSize: 27, fontWeight: '700', letterSpacing: -0.8, marginTop: 4, maxWidth: 210 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  hero: { borderRadius: 22, padding: 17, marginTop: 22 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  heroEyebrow: { color: '#BBD1D0', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginTop: 5, letterSpacing: -0.5 },
  heroBody: { color: '#D1E0DE', fontSize: 12, lineHeight: 19, marginTop: 13 },
  heroLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 15 },
  heroLinkText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  metrics: { flexDirection: 'row', paddingVertical: 22, gap: 12 },
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
  infoBox: { borderRadius: 15, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  infoText: { fontSize: 11, lineHeight: 17, flex: 1 },
});