import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, BrandMark, DestinationCard, Icon, PrimaryButton, Screen, SearchBar, SectionHeader, styles as ui } from '@/components/YatraUI';
import { destinations, getPlace, getOccupancy } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const [search, setSearch] = useState('');
  const featured = getPlace('venkateswara');
  const alternatives = useMemo(() => ['silathoranam', 'kapila', 'tiruchanur'].map((id) => getPlace(id)).filter(Boolean), []);
  const filteredDestinations = destinations.filter((destination) => destination.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <Screen>
      <View style={ui.headerRow}><BrandMark /><Avatar /></View>
      <Text style={[ui.greeting, { color: colors.ink }]}>Plan your pilgrimage.{'\n'}Travel smarter.</Text>
      <Text style={[ui.subGreeting, { color: colors.inkSoft }]}>Your guide to meaningful moments and safer routes.</Text>
      <SearchBar value={search} onPress={() => setSearch(search ? '' : 'Tirumala')} />

      <SectionHeader eyebrow="CURRENT CONDITIONS" title="Choose your yatra" action="See all" onAction={() => router.push('/(tabs)/explore')} />
      {filteredDestinations.slice(0, 2).map((destination) => <DestinationCard key={destination.id} destination={destination} onPress={() => router.push({ pathname: '/destination/[id]', params: { id: destination.id } })} />)}
      {filteredDestinations.length === 0 && <View style={[styles.empty, { backgroundColor: colors.card }]}><Icon name="search" color={colors.mutedForeground} /><Text style={[styles.emptyText, { color: colors.inkSoft }]}>No destination matches “{search}”.</Text></View>}

      <View style={[styles.safetyCard, { backgroundColor: colors.ink }]}>
        <View style={styles.safetyTitle}><View style={[styles.safetyIcon, { backgroundColor: colors.saffron }]}><Icon name="alert-triangle" size={18} color="#FFFFFF" /></View><View style={{ flex: 1 }}><Text style={styles.safetyEyebrow}>SMART SAFETY ALERT</Text><Text style={styles.safetyHeading}>Main temple is at critical crowd levels</Text></View></View>
        <Text style={styles.safetyBody}>Sri Venkateswara Temple is currently at {featured ? getOccupancy(featured) : 120}% occupancy. Consider a calmer place while conditions improve.</Text>
        <View style={styles.safetyButtons}><PrimaryButton label="View alternatives" icon="arrow-up-right" onPress={() => router.push({ pathname: '/destination/[id]', params: { id: 'tirumala', focus: 'alternatives' } })} /><Pressable onPress={() => router.push('/emergency')} style={styles.safetyEmergency}><Icon name="phone-call" size={16} color="#FFFFFF" /><Text style={styles.safetyEmergencyText}>Emergency</Text></Pressable></View>
      </View>

      <SectionHeader eyebrow="FOR YOU" title="Safer places nearby" action="Explore" onAction={() => router.push('/(tabs)/explore')} />
      {alternatives.map((place) => place && <Pressable key={place.id} onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })} style={[styles.recommendRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.recommendMain}><View style={[styles.recommendDot, { backgroundColor: colors.teal }]} /><View><Text style={[styles.recommendName, { color: colors.ink }]}>{place.name}</Text><Text style={[styles.recommendReason, { color: colors.mutedForeground }]}>{getOccupancy(place)}% occupancy · {place.crowd.waitingMinutes} min wait</Text></View></View><Icon name="chevron-right" size={18} color={colors.mutedForeground} /></Pressable>)}

      <SectionHeader eyebrow="RIGHT NOW" title="What do you need?" />
      <View style={styles.actionGrid}>{[
        ['map', 'Explore places', '/(tabs)/explore'], ['calendar', 'Plan my day', '/planner'], ['truck', 'Transport', '/destination/tirumala'], ['heart', 'Saved places', '/(tabs)/profile'],
      ].map(([icon, label, path]) => <Pressable key={label} onPress={() => router.push(path as never)} style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.border }]}><Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={20} color={colors.teal} /><Text style={[styles.actionLabel, { color: colors.ink }]}>{label}</Text></Pressable>)}</View>
      <View style={[styles.prototypeNote, { backgroundColor: colors.goldSoft }]}><Icon name="info" size={15} color="#94631D" /><Text style={styles.prototypeText}>Prototype / Sample Data · Conditions are illustrative, not official real-time information.</Text></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safetyCard: { borderRadius: 22, padding: 17, marginTop: 16 },
  safetyTitle: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  safetyIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  safetyEyebrow: { color: '#BBD1D0', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  safetyHeading: { color: '#FFFFFF', fontSize: 18, lineHeight: 22, fontWeight: '700', marginTop: 4, letterSpacing: -0.3 },
  safetyBody: { color: '#D1E0DE', fontSize: 12, lineHeight: 19, marginTop: 14 },
  safetyButtons: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 16 },
  safetyEmergency: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 8 },
  safetyEmergencyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  recommendRow: { borderWidth: 1, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  recommendMain: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recommendDot: { width: 9, height: 9, borderRadius: 5 },
  recommendName: { fontSize: 13, fontWeight: '700' },
  recommendReason: { fontSize: 11, marginTop: 3 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionTile: { width: '47%', minHeight: 73, borderWidth: 1, borderRadius: 16, padding: 13, justifyContent: 'space-between' },
  actionLabel: { fontSize: 12, fontWeight: '700' },
  prototypeNote: { borderRadius: 14, padding: 11, flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 26 },
  prototypeText: { flex: 1, color: '#94631D', fontSize: 10, lineHeight: 15, fontWeight: '600' },
  empty: { borderRadius: 18, padding: 22, flexDirection: 'row', gap: 10, alignItems: 'center' },
  emptyText: { fontSize: 13 },
});
