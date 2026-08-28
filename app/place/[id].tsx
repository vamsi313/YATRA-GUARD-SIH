import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CrowdBadge, CrowdBar, Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '../../components/YatraUI';
import { getCrowdLevel, getPlace, getOccupancy, getRisk, imageAssets } from '../../data/mockData';
import { useYatra } from '../../context/YatraContext';
import { useColors } from '../../hooks/useColors';

export default function PlaceDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlace(id ?? 'venkateswara') ?? getPlace('venkateswara')!;
  const { isFavorite, toggleFavorite } = useYatra();
  const occupancy = getOccupancy(place);
  const level = getCrowdLevel(occupancy);
  const risk = getRisk(place);
  const isCritical = risk === 'CRITICAL' || occupancy > 100;
  return <Screen><View style={styles.nav}><Pressable onPress={() => router.back()} style={[styles.navButton, { backgroundColor: colors.card, borderColor: colors.border }]}><Icon name="arrow-left" size={18} color={colors.ink} /></Pressable><Pressable onPress={() => toggleFavorite(place.id)} style={[styles.navButton, { backgroundColor: colors.card, borderColor: colors.border }]}><Icon name={isFavorite(place.id) ? 'heart' : 'heart'} size={18} color={isFavorite(place.id) ? colors.saffron : colors.ink} /></Pressable></View>
    {place.image ? <ImageBackground source={imageAssets[place.image]} style={styles.cover} imageStyle={styles.coverImage}><LinearGradient colors={['rgba(16,42,67,0.05)', 'rgba(16,42,67,0.9)']} style={StyleSheet.absoluteFillObject} /><View style={styles.coverCopy}><Text style={styles.coverCategory}>{place.category.toUpperCase()}</Text><Text style={styles.coverTitle}>{place.name}</Text></View></ImageBackground> : <View style={[styles.textCover, { backgroundColor: colors.ink }]}><Text style={styles.coverCategory}>{place.category.toUpperCase()}</Text><Text style={styles.coverTitle}>{place.name}</Text></View>}
    <Text style={[styles.description, { color: colors.inkSoft }]}>{place.description}</Text>
    <View style={styles.quickFacts}><Fact icon="clock" label="Hours" value={place.hours} /><Fact icon="navigation" label="Distance" value={place.distance} /><Fact icon="activity" label="Visit" value={place.duration} /></View>
    <View style={[styles.condition, { backgroundColor: isCritical ? colors.dangerSoft : colors.tealSoft }]}><View style={styles.conditionHead}><View><Text style={[styles.conditionEyebrow, { color: isCritical ? colors.danger : colors.teal }]}>CURRENT CROWD CONDITION</Text><Text style={[styles.conditionValue, { color: colors.ink }]}>{occupancy}% occupancy</Text></View><CrowdBadge level={level} /></View><CrowdBar occupancy={occupancy} height={9} /><View style={styles.conditionStats}><View><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>EST. PEOPLE</Text><Text style={[styles.statValue, { color: colors.ink }]}>{place.crowd.current.toLocaleString()}</Text></View><View><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>WAIT TIME</Text><Text style={[styles.statValue, { color: colors.ink }]}>{Math.floor(place.crowd.waitingMinutes / 60)}h {place.crowd.waitingMinutes % 60}m</Text></View><View><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>TREND</Text><Text style={[styles.statValue, { color: place.crowd.trend > 0 ? colors.danger : colors.teal }]}>{place.crowd.trend > 0 ? '+' : ''}{place.crowd.trend}%</Text></View></View></View>
    {isCritical && <View style={[styles.avoidBox, { backgroundColor: colors.ink }]}><Icon name="shield" size={19} color={colors.saffron} /><View style={{ flex: 1 }}><Text style={styles.avoidTitle}>Avoid entering this area right now.</Text><Text style={styles.avoidBody}>There are safer places nearby with much shorter waits.</Text></View></View>}
    <SectionHeader eyebrow="VISITING NOTES" title="Make it easier" />
    <View style={styles.tags}>{place.tags.map((tag) => <View key={tag} style={[styles.tag, { backgroundColor: colors.card, borderColor: colors.border }]}><Icon name={tag.includes('crowd') ? 'users' : tag.includes('photo') ? 'camera' : 'check'} size={13} color={colors.teal} /><Text style={[styles.tagText, { color: colors.inkSoft }]}>{tag}</Text></View>)}</View>
    <View style={styles.buttons}>
      <PrimaryButton
        label="View on Map"
        icon="map-pin"
        onPress={() => router.push({ pathname: '/place-map', params: { id: place.id } })}
        style={{ backgroundColor: colors.saffron, flex: 1.3 }}
      />
      <PrimaryButton
        label={isFavorite(place.id) ? 'Saved' : 'Save place'}
        icon="heart"
        variant="secondary"
        onPress={() => toggleFavorite(place.id)}
        style={{ flex: 1 }}
      />
    </View>
  </Screen>;
}

function Fact({ icon, label, value }: { icon: React.ComponentProps<typeof Icon>['name']; label: string; value: string }) { const colors = useColors(); return <View style={styles.fact}><Icon name={icon} size={15} color={colors.teal} /><Text style={[styles.factLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.factValue, { color: colors.ink }]} numberOfLines={2}>{value}</Text></View>; }

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  navButton: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cover: { height: 220, marginHorizontal: -20, justifyContent: 'flex-end' },
  coverImage: { resizeMode: 'cover' },
  coverCopy: { padding: 20 },
  textCover: { height: 180, marginHorizontal: -20, padding: 20, justifyContent: 'flex-end' },
  coverCategory: { color: '#D5E9E6', fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  coverTitle: { color: '#FFFFFF', fontSize: 29, lineHeight: 34, fontWeight: '700', letterSpacing: -0.8, marginTop: 5 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 16 },
  quickFacts: { flexDirection: 'row', gap: 10, marginTop: 19 },
  fact: { flex: 1, paddingRight: 5 },
  factLabel: { fontSize: 9, marginTop: 7, fontWeight: '700' },
  factValue: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  condition: { borderRadius: 19, padding: 15, marginTop: 20 },
  conditionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 13 },
  conditionEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  conditionValue: { fontSize: 21, fontWeight: '700', marginTop: 4 },
  conditionStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  statLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  statValue: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  avoidBox: { marginTop: 12, borderRadius: 17, padding: 14, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  avoidTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  avoidBody: { color: '#BBD1D0', fontSize: 11, marginTop: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderWidth: 1, borderRadius: 11, paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', gap: 5, alignItems: 'center' },
  tagText: { fontSize: 11, fontWeight: '600' },
  buttons: { flexDirection: 'row', gap: 9, marginTop: 20 },
});