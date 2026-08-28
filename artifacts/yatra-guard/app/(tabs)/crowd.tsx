import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CrowdBadge, CrowdBar, Icon, MiniMetric, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { destinations, getDestinationPlaces, getCrowdLevel, getOccupancy, mockForecast, places } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { useYatra } from '@/context/YatraContext';

export default function CrowdScreen() {
  const colors = useColors();
  const { selectedDestination, placesList, forecastSurges } = useYatra();

  const destId = selectedDestination?.id ?? 'tirumala';
  const destName = selectedDestination?.name ?? 'Tirumala';

  // Scope places to selected destination or default to tirumala
  const hotspots = useMemo(() => {
    return placesList.filter((p) => p.destinationId === destId).slice(0, 5);
  }, [destId, placesList]);

  // Overall occupancy for the destination (average of all its places)
  const overallOccupancy = useMemo(() => {
    if (hotspots.length === 0) return 82;
    const total = hotspots.reduce((sum, p) => sum + getOccupancy(p), 0);
    return Math.round(total / hotspots.length);
  }, [hotspots]);

  const activeForecast = forecastSurges[destId] ?? mockForecast;
  const criticalCount = hotspots.filter((p) => getOccupancy(p) > 100).length;
  const saferCount = hotspots.filter((p) => getOccupancy(p) <= 60).length;

  return (
    <Screen>
      <View style={ui.headerRow}>
        <View>
          <Text style={[styles.kicker, { color: colors.saffron }]}>SITUATIONAL AWARENESS</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Crowd intelligence</Text>
        </View>
        <View style={[styles.livePill, { backgroundColor: colors.tealSoft }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.teal }]} />
          <Text style={[styles.liveText, { color: colors.teal }]}>LIVE</Text>
        </View>
      </View>

      {/* Scoped destination pill */}
      {selectedDestination && (
        <Pressable
          onPress={() => router.push('/destination-picker')}
          style={[styles.scopePill, { backgroundColor: colors.saffronSoft, borderColor: colors.saffron }]}
        >
          <Icon name="map-pin" size={13} color={colors.saffron} />
          <Text style={[styles.scopeText, { color: colors.saffron }]}>
            Showing {destName} only · Tap to change
          </Text>
          <Icon name="chevron-right" size={13} color={colors.saffron} />
        </Pressable>
      )}

      {/* Hero crowd card */}
      <View style={[styles.hero, { backgroundColor: colors.ink }]}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.heroEyebrow}>{destName.toUpperCase()} · NOW</Text>
            <Text style={styles.heroTitle}>{overallOccupancy}% overall crowd</Text>
          </View>
          <CrowdBadge level={getCrowdLevel(overallOccupancy)} />
        </View>
        <CrowdBar occupancy={overallOccupancy} height={10} />
        <Text style={styles.heroBody}>
          {overallOccupancy > 100
            ? `${destName} is above safe capacity right now. Consider visiting quieter spots within the destination.`
            : overallOccupancy > 80
              ? `High congestion expected in approximately 2 hours. Plan your visit accordingly.`
              : `Crowd levels are manageable. A good time to visit ${destName}.`}
        </Text>
        <Pressable
          onPress={() => router.push({ pathname: '/destination/[id]', params: { id: destId } })}
          style={styles.heroLink}
        >
          <Text style={styles.heroLinkText}>Open {destName} dashboard</Text>
          <Icon name="arrow-up-right" size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.metrics}>
        <MiniMetric label="Locations tracked" value={`${hotspots.length}`} icon="map-pin" tone="blue" />
        <MiniMetric label="Critical" value={`${criticalCount}`} icon="alert-octagon" tone="danger" />
        <MiniMetric label="Safer picks" value={`${saferCount}`} icon="check-circle" tone="teal" />
      </View>

      <SectionHeader eyebrow="FORECAST" title="Crowd forecast" action="How it works" />
      <View style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.forecastRow}>
          {activeForecast.map((value, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={[styles.forecastTime, { color: colors.mutedForeground }]}>
                {index === 0 ? 'NOW' : `+${index} HR`}
              </Text>
              <View style={styles.forecastBarWrap}>
                <View style={[styles.forecastBar, {
                  height: Math.max(18, Math.min(value, 125) / 1.25),
                  backgroundColor: value > 100 ? colors.danger : value > 80 ? colors.saffron : colors.teal,
                }]} />
              </View>
              <Text style={[styles.forecastValue, { color: colors.ink }]}>{value}%</Text>
            </View>
          ))}
        </View>
        <View style={[styles.forecastNote, { backgroundColor: colors.dangerSoft }]}>
          <Icon name="trending-up" size={15} color={colors.danger} />
          <Text style={[styles.forecastNoteText, { color: colors.danger }]}>
            {activeForecast.some(v => v > 100) ? 'Critical surge predicted in incoming intervals' : 'Manageable flow predicted'}
          </Text>
        </View>
      </View>

      <SectionHeader
        eyebrow="MONITORED LOCATIONS"
        title={`${destName} hotspots`}
        action="All places"
        onAction={() => router.push('/(tabs)/explore')}
      />
      {hotspots.map((place) => {
        const occupancy = getOccupancy(place);
        return (
          <Pressable
            key={place.id}
            onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })}
            style={[styles.hotspot, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.hotspotHead}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.hotspotName, { color: colors.ink }]}>{place.name}</Text>
                <Text style={[styles.hotspotSub, { color: colors.mutedForeground }]}>
                  {place.crowd.current.toLocaleString()} people · {place.crowd.waitingMinutes} min wait
                </Text>
              </View>
              <CrowdBadge level={getCrowdLevel(occupancy)} compact />
            </View>
            <CrowdBar occupancy={occupancy} />
          </Pressable>
        );
      })}

      <SectionHeader eyebrow="HOW WE READ IT" title="A clearer picture" />
      <View style={[styles.infoBox, { backgroundColor: colors.tealSoft }]}>
        <Icon name="info" size={16} color={colors.teal} />
        <Text style={[styles.infoText, { color: colors.inkSoft }]}>
          Occupancy can exceed 100% when estimated people are above a location's safe capacity. This app combines occupancy, trend, waiting time and pathway data into a simple risk signal.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  title: { fontSize: 27, fontWeight: '700', letterSpacing: -0.8, marginTop: 4, maxWidth: 210 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  scopePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginTop: 14, marginBottom: 8 },
  scopeText: { flex: 1, fontSize: 12, fontWeight: '600' },
  hero: { borderRadius: 22, padding: 17, marginTop: 8 },
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