import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CrowdBadge, Icon, Screen, styles as ui } from '@/components/YatraUI';
import { places, getCrowdLevel, getOccupancy } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function MapScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState('venkateswara');
  const selectedPlace = places.find((place) => place.id === selected) ?? places[0];
  return <Screen scroll={false}><View style={ui.headerRow}><Pressable onPress={() => router.back()}><Icon name="arrow-left" size={20} color={colors.ink} /></Pressable><Text style={[styles.title, { color: colors.ink }]}>Explore map</Text><Icon name="layers" size={19} color={colors.teal} /></View><View style={styles.mapLegend}>{[['teal', 'Low'], ['gold', 'Moderate'], ['saffron', 'High'], ['danger', 'Critical']].map(([tone, label]) => <View key={label} style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors[tone as keyof typeof colors] as string }]} /><Text style={[styles.legendText, { color: colors.inkSoft }]}>{label}</Text></View>)}</View><View style={[styles.map, { backgroundColor: '#E1E9E2' }]}><View style={[styles.road, styles.roadA]} /><View style={[styles.road, styles.roadB]} /><View style={[styles.road, styles.roadC]} /><View style={[styles.water, { backgroundColor: '#B9D5D5' }]} /><Text style={styles.mapLabel}>TIRUMALA</Text>{places.slice(0, 7).map((place, index) => { const occupancy = getOccupancy(place); const level = getCrowdLevel(occupancy); const dotColor = level === 'LOW' ? colors.teal : level === 'MODERATE' ? colors.gold : level === 'HIGH' ? colors.saffron : colors.danger; return <Pressable key={place.id} onPress={() => setSelected(place.id)} style={[styles.marker, { left: `${12 + (index * 13) % 75}%`, top: `${21 + (index * 17) % 64}%` }]}><View style={[styles.markerDot, { backgroundColor: dotColor, borderColor: selected === place.id ? '#FFFFFF' : dotColor }]} /><Text style={[styles.markerLabel, { backgroundColor: '#FFFFFF', color: colors.ink }]}>{place.name.split(' ')[0]}</Text></Pressable>; })}</View><View style={[styles.mapCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.cardTop}><View><Text style={[styles.cardEyebrow, { color: colors.saffron }]}>SELECTED PLACE</Text><Text style={[styles.cardTitle, { color: colors.ink }]}>{selectedPlace.name}</Text></View><CrowdBadge level={getCrowdLevel(getOccupancy(selectedPlace))} compact /></View><Text style={[styles.cardSub, { color: colors.mutedForeground }]}>{getOccupancy(selectedPlace)}% occupancy · {selectedPlace.crowd.waitingMinutes} min wait</Text><Pressable onPress={() => router.push({ pathname: '/place/[id]', params: { id: selectedPlace.id } })}><Text style={[styles.cardLink, { color: colors.teal }]}>View place details <Icon name="arrow-up-right" size={13} color={colors.teal} /></Text></Pressable></View></Screen>;
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: '700' },
  mapLegend: { flexDirection: 'row', gap: 12, marginTop: 20, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendText: { fontSize: 10, fontWeight: '600' },
  map: { flex: 1, minHeight: 430, borderRadius: 23, marginTop: 14, overflow: 'hidden', position: 'relative' },
  road: { position: 'absolute', height: 5, backgroundColor: '#C1CEC2', borderRadius: 5, transform: [{ rotate: '28deg' }] },
  roadA: { width: '105%', top: '35%', left: '-5%' },
  roadB: { width: '90%', top: '61%', left: '8%', transform: [{ rotate: '-17deg' }] },
  roadC: { width: '95%', top: '17%', left: '7%', transform: [{ rotate: '74deg' }] },
  water: { position: 'absolute', width: '38%', height: '110%', right: '-11%', top: '-5%', borderRadius: 100, transform: [{ rotate: '12deg' }] },
  mapLabel: { position: 'absolute', top: 21, left: 20, color: '#617A73', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  marker: { position: 'absolute', alignItems: 'center', gap: 3 },
  markerDot: { width: 15, height: 15, borderRadius: 8, borderWidth: 3 },
  markerLabel: { paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5, fontSize: 8, fontWeight: '700', shadowOpacity: 0.1, shadowRadius: 3 },
  mapCard: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 12, marginBottom: 110 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  cardEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  cardSub: { fontSize: 11, marginTop: 8 },
  cardLink: { fontSize: 12, fontWeight: '700', marginTop: 12 },
});