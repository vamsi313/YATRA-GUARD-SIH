import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CrowdBadge, CrowdBar, Icon, MiniMetric, PlaceRow, PrimaryButton, Screen, SectionHeader, styles as ui } from '../../components/YatraUI';
import { getDestination, getDestinationPlaces, getPlace, getOccupancy, getRisk, imageAssets } from '../../data/mockData';
import { useColors } from '../../hooks/useColors';

export default function DestinationScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const destination = getDestination(id ?? 'tirumala') ?? getDestination('tirumala')!;
  const places = getDestinationPlaces(destination.id);
  const mainPlace = places[0] ?? getPlace('venkateswara')!;
  const occupancy = getOccupancy(mainPlace);
  const alternatives = places.filter((place) => getOccupancy(place) < 60).slice(0, 3);
  return <Screen><View style={styles.topNav}><Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: 'rgba(255,255,255,0.85)' }]}><Icon name="arrow-left" size={19} color={colors.ink} /></Pressable><Pressable onPress={() => router.push('/alerts')} style={[styles.back, { backgroundColor: 'rgba(255,255,255,0.85)' }]}><Icon name="bell" size={18} color={colors.ink} /></Pressable></View>
    <ImageBackground source={imageAssets[destination.image]} style={styles.cover} imageStyle={styles.coverImage}><LinearGradient colors={['rgba(16,42,67,0.05)', 'rgba(16,42,67,0.9)']} style={StyleSheet.absoluteFillObject} /><View style={styles.coverText}><Text style={styles.region}>{destination.region.toUpperCase()}</Text><Text style={styles.name}>{destination.name}</Text><Text style={styles.overview}>{destination.overview}</Text></View></ImageBackground>
    <SectionHeader eyebrow="TODAY AT A GLANCE" title="Destination dashboard" />
    <View style={styles.metrics}><MiniMetric label="Weather" value={destination.weather} icon="cloud" tone="blue" /><MiniMetric label="Crowd" value="82%" icon="users" tone="saffron" /><MiniMetric label="Wait" value={`${Math.round(mainPlace.crowd.waitingMinutes / 60)}h ${mainPlace.crowd.waitingMinutes % 60}m`} icon="clock" tone="danger" /></View>
    <View style={[styles.riskCard, { backgroundColor: colors.dangerSoft }]}><View style={styles.riskHead}><View><Text style={[styles.riskEyebrow, { color: colors.danger }]}>SAFETY STATUS</Text><Text style={[styles.riskTitle, { color: colors.ink }]}>{getRisk(mainPlace)} CROWD RISK</Text></View><CrowdBadge level="CRITICAL" /></View><Text style={[styles.riskBody, { color: colors.inkSoft }]}>The main temple is at {occupancy}% occupancy with a {Math.round(mainPlace.crowd.trend)}% rise in 30 minutes. Avoid entering this area right now.</Text><CrowdBar occupancy={occupancy} height={9} /><View style={styles.riskActions}><PrimaryButton label="See safer alternatives" icon="arrow-down" onPress={() => router.push({ pathname: '/place/[id]', params: { id: alternatives[0]?.id ?? 'kapila' } })} /><Pressable onPress={() => router.push('/emergency')}><Text style={[styles.emergencyLink, { color: colors.danger }]}>Emergency</Text></Pressable></View></View>
    <SectionHeader eyebrow="SMART ROUTE" title="A better plan for now" />
    <View style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.planStep}><View style={[styles.planNumber, { backgroundColor: colors.teal }]}><Text style={styles.planNumberText}>1</Text></View><View style={{ flex: 1 }}><Text style={[styles.planTitle, { color: colors.ink }]}>Visit {alternatives[0]?.name ?? 'Silathoranam'}</Text><Text style={[styles.planText, { color: colors.mutedForeground }]}>{alternatives[0] ? getOccupancy(alternatives[0]) : 28}% occupancy · lower crowd</Text></View><Icon name="check-circle" size={17} color={colors.teal} /></View><View style={styles.planConnector} /><View style={styles.planStep}><View style={[styles.planNumber, { backgroundColor: colors.gold }]}><Text style={styles.planNumberText}>2</Text></View><View style={{ flex: 1 }}><Text style={[styles.planTitle, { color: colors.ink }]}>Return after 5 PM</Text><Text style={[styles.planText, { color: colors.mutedForeground }]}>Forecast is expected to ease later</Text></View><Icon name="clock" size={17} color={colors.gold} /></View><PrimaryButton label="Build this itinerary" icon="calendar" onPress={() => router.push('/planner')} variant="secondary" /></View>
    <SectionHeader eyebrow="PLACES" title="Explore {destination.name}" action="Map" onAction={() => router.push('/map')} />
    {places.slice(0, 5).map((place) => <PlaceRow key={place.id} place={place} onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })} />)}
    <View style={[styles.weatherNote, { backgroundColor: colors.blueSoft }]}><Icon name="cloud-rain" size={16} color={colors.blue} /><Text style={[styles.weatherText, { color: colors.inkSoft }]}>Weather note: {destination.weatherDetail}. Rain chance is {destination.rain}; humidity is {destination.humidity}. Plan outdoor stops earlier if conditions shift.</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  topNav: { position: 'absolute', top: 0, left: 20, right: 20, zIndex: 3, flexDirection: 'row', justifyContent: 'space-between' },
  back: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  cover: { height: 245, marginHorizontal: -20, marginTop: 0, justifyContent: 'flex-end' },
  coverImage: { resizeMode: 'cover' },
  coverText: { padding: 20 },
  region: { color: '#D5E9E6', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  name: { color: '#FFFFFF', fontSize: 34, fontWeight: '700', letterSpacing: -1, marginTop: 5 },
  overview: { color: '#E2ECEA', fontSize: 12, lineHeight: 18, marginTop: 6, maxWidth: 300 },
  metrics: { flexDirection: 'row', gap: 12, marginBottom: 5 },
  riskCard: { borderRadius: 20, padding: 16, marginTop: 13 },
  riskHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  riskEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  riskTitle: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  riskBody: { fontSize: 12, lineHeight: 18, marginVertical: 13 },
  riskActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  emergencyLink: { fontSize: 12, fontWeight: '700' },
  planCard: { borderWidth: 1, borderRadius: 18, padding: 14 },
  planStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  planNumber: { width: 27, height: 27, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  planNumberText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  planTitle: { fontSize: 13, fontWeight: '700' },
  planText: { fontSize: 11, marginTop: 3 },
  planConnector: { height: 19, borderLeftWidth: 1, borderStyle: 'dashed', borderLeftColor: '#B6C7C2', marginLeft: 13 },
  weatherNote: { marginTop: 15, borderRadius: 15, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  weatherText: { fontSize: 11, lineHeight: 17, flex: 1 },
});