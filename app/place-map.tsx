import React, { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { CrowdBadge, CrowdBar, Icon, PrimaryButton, Screen, SectionHeader } from '../components/YatraUI';
import { getCrowdLevel, getOccupancy, getPlace, getRisk, NearbyFacility, NearbyFacilityType, Place, TransportRouteOption } from '../data/mockData';
import { useColors } from '../hooks/useColors';
import { useYatra } from '../context/YatraContext';

export default function PlaceMapScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { placesList } = useYatra();

  const selectedPlace: Place = placesList.find((p) => p.id === id) || getPlace(id ?? 'venkateswara') || placesList[0];
  const occupancy = getOccupancy(selectedPlace);
  const crowdLevel = getCrowdLevel(occupancy);
  const risk = getRisk(selectedPlace);
  const isCritical = risk === 'CRITICAL' || occupancy > 100;

  const saferAlternative = selectedPlace.saferAlternativeId
    ? placesList.find((p) => p.id === selectedPlace.saferAlternativeId)
    : placesList.find((p) => p.destinationId === selectedPlace.destinationId && p.id !== selectedPlace.id && getOccupancy(p) < 40);

  const [activeCategory, setActiveCategory] = useState<NearbyFacilityType | 'all'>('all');
  const [showTransportModal, setShowTransportModal] = useState(false);

  const facilities = selectedPlace.nearbyFacilities ?? [];
  const filteredFacilities = activeCategory === 'all'
    ? facilities
    : facilities.filter((f) => f.category === activeCategory);

  const transportOpts: TransportRouteOption[] = selectedPlace.transportOptions ?? [
    {
      id: 'def-1',
      type: 'shuttle',
      title: 'Local Pilgrimage Shuttle',
      routeName: `Central Hub → ${selectedPlace.name}`,
      travelTime: '12 min',
      approxCost: '₹15',
      frequencyOrAvailability: 'Every 5 min',
      congestion: 'LOW',
      isRecommended: true,
      notes: 'Direct eco-friendly battery shuttle to entrance',
    },
    {
      id: 'def-2',
      type: 'auto',
      title: 'Shared Auto Rickshaw',
      routeName: `Station / Bus Stand → ${selectedPlace.name}`,
      travelTime: '15 min',
      approxCost: '₹40',
      frequencyOrAvailability: 'Immediate 24/7',
      congestion: 'MODERATE',
      isRecommended: false,
      notes: 'Frequent shared rides available at main gate',
    },
  ];

  const openGoogleMapsExternal = () => {
    const query = encodeURIComponent(`${selectedPlace.name}, ${selectedPlace.destinationId}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}&query_place_id=${query}`;
    Linking.openURL(url).catch(() => {});
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${selectedPlace.latitude},${selectedPlace.longitude}&z=15&output=embed`;

  return (
    <Screen>
      {/* Header bar */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerEyebrow, { color: colors.saffron }]}>DYNAMIC GOOGLE MAP EXPLORER</Text>
          <Text style={[styles.headerTitle, { color: colors.ink }]} numberOfLines={1}>
            {selectedPlace.name}
          </Text>
        </View>
        <Pressable
          onPress={openGoogleMapsExternal}
          style={[styles.extMapBtn, { backgroundColor: colors.saffronSoft, borderColor: colors.saffron }]}
        >
          <Icon name="external-link" size={14} color={colors.saffron} />
          <Text style={[styles.extMapText, { color: colors.saffron }]}>Open App</Text>
        </Pressable>
      </View>

      {/* Google Map Container */}
      <View style={[styles.mapWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {Platform.OS === 'web' ? (
          <iframe
            title="Google Map Explorer"
            src={mapEmbedUrl}
            width="100%"
            height="260"
            style={{ border: 0, borderRadius: 18 }}
            loading="lazy"
          />
        ) : (
          <View style={styles.mobileMapContainer}>
            {/* Realistic Dark Cyber Map Canvas */}
            <View style={{ flex: 1, backgroundColor: '#09111E', position: 'relative', overflow: 'hidden' }}>
              {/* Grid Lines Pattern */}
              <View style={StyleSheet.absoluteFillObject}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <View key={`h-${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 12}%`, height: 1, backgroundColor: '#1E293B55' }} />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <View key={`v-${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i + 1) * 12}%`, width: 1, backgroundColor: '#1E293B55' }} />
                ))}
              </View>

              {/* Simulated Map Road Networks & Pathways */}
              <View style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: 14, backgroundColor: '#33415555', transform: [{ rotate: '-12deg' }] }} />
              <View style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 18, backgroundColor: '#33415555', transform: [{ rotate: '8deg' }] }} />
              <View style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: 16, backgroundColor: '#33415555', transform: [{ rotate: '15deg' }] }} />
              <View style={{ position: 'absolute', top: 0, bottom: 0, left: '70%', width: 22, backgroundColor: '#33415555', transform: [{ rotate: '-25deg' }] }} />

              {/* Simulated River / Waterway (Blue Contour) */}
              <View style={{ position: 'absolute', top: '45%', left: '-10%', right: '-10%', height: 42, backgroundColor: '#0284C722', borderWidth: 1, borderColor: '#38BDF844', borderRadius: 20, transform: [{ rotate: '-6deg' }] }} />

              {/* Surrounding Nearby POI Markers */}
              <View style={{ position: 'absolute', top: '22%', left: '28%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#38BDF8' }} />
              <View style={{ position: 'absolute', top: '65%', left: '75%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#38BDF8' }} />
              <View style={{ position: 'absolute', top: '78%', left: '42%', width: 8, height: 8, borderRadius: 4, backgroundColor: '#38BDF8' }} />

              {/* Target Location Pulsing Radar Marker Pin */}
              <View style={{ position: 'absolute', top: '42%', left: '46%', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF550025', borderWidth: 2, borderColor: '#FF5500AA', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FF5500', borderWidth: 3, borderColor: '#FFFFFF' }} />
                </View>
                <View style={{ backgroundColor: '#0F172AEE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginTop: 4, borderWidth: 1, borderColor: '#FF5500' }}>
                  <Text style={{ color: '#F8FAFC', fontSize: 11, fontWeight: '800' }}>{selectedPlace.name}</Text>
                  <Text style={{ color: '#FF5500', fontSize: 9, fontWeight: '700', textAlign: 'center' }}>
                    {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>

              {/* Map Scale & Compass Overlay */}
              <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#0F172ACC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#334155' }}>
                <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '800' }}>GPS RADAR MAP · 150m</Text>
              </View>
            </View>

            <Pressable onPress={openGoogleMapsExternal} style={styles.mobileMapOverlayBtn}>
              <Icon name="navigation" size={14} color="#FFFFFF" />
              <Text style={styles.mobileMapOverlayText}>Navigate in Google Maps</Text>
            </Pressable>
          </View>
        )}

        {/* Live Map Overlay Chip */}
        <View style={styles.mapOverlayBadge}>
          <View style={[styles.liveDot, { backgroundColor: isCritical ? colors.danger : colors.teal }]} />
          <Text style={styles.liveOverlayText}>
            {selectedPlace.name.toUpperCase()} · {occupancy}% OCCUPANCY
          </Text>
        </View>
      </View>

      {/* Crowd & Risk Status Banner */}
      <View
        style={[
          styles.crowdStatusCard,
          {
            backgroundColor: isCritical ? colors.dangerSoft : colors.tealSoft,
            borderColor: isCritical ? colors.danger : colors.teal,
          },
        ]}
      >
        <View style={styles.crowdStatusHead}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusEyebrow, { color: isCritical ? colors.danger : colors.teal }]}>
              YATRAGUARD CROWD & SAFETY STATUS
            </Text>
            <Text style={[styles.statusValue, { color: colors.ink }]}>
              {occupancy}% Capacity ({selectedPlace.crowd.current.toLocaleString()} Devotees)
            </Text>
          </View>
          <CrowdBadge level={crowdLevel} />
        </View>
        <CrowdBar occupancy={occupancy} height={8} />
        <Text style={[styles.statusDetail, { color: colors.inkSoft }]}>
          Estimated wait time: <Text style={{ fontWeight: '800' }}>{Math.floor(selectedPlace.crowd.waitingMinutes / 60)}h {selectedPlace.crowd.waitingMinutes % 60}m</Text> · {selectedPlace.crowd.congestion}
        </Text>
      </View>

      {/* Safer Alternative Highlight Banner (if place is HIGH or CRITICAL) */}
      {isCritical && saferAlternative && (
        <View style={[styles.alternativeBanner, { backgroundColor: colors.ink }]}>
          <Icon name="shield" size={22} color={colors.saffron} />
          <View style={{ flex: 1 }}>
            <Text style={styles.altEyebrow}>RECOMMENDED SAFER ALTERNATIVE</Text>
            <Text style={styles.altTitle}>{saferAlternative.name}</Text>
            <Text style={styles.altSub}>
              Only {getOccupancy(saferAlternative)}% occupancy · {saferAlternative.crowd.waitingMinutes} min wait time
            </Text>
          </View>
          <Pressable
            onPress={() => router.replace({ pathname: '/place-map', params: { id: saferAlternative.id } })}
            style={[styles.switchBtn, { backgroundColor: colors.saffron }]}
          >
            <Text style={styles.switchBtnText}>Switch Map</Text>
          </Pressable>
        </View>
      )}

      {/* Transport Quick Access Button */}
      <Pressable
        onPress={() => setShowTransportModal(!showTransportModal)}
        style={[styles.reachCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={[styles.reachIcon, { backgroundColor: colors.tealSoft }]}>
          <Icon name="navigation" size={20} color={colors.teal} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.reachEyebrow, { color: colors.teal }]}>TRANSPORTATION GUIDE</Text>
          <Text style={[styles.reachTitle, { color: colors.ink }]}>How do I reach {selectedPlace.name.split(' ')[0]}?</Text>
          <Text style={[styles.reachSub, { color: colors.mutedForeground }]}>
            {transportOpts.length} transit routes available (Bus, Auto, Taxi, Shuttle, Walking)
          </Text>
        </View>
        <Icon name={showTransportModal ? 'chevron-up' : 'chevron-down'} size={20} color={colors.ink} />
      </Pressable>

      {/* Transport Modal / Accordion Options */}
      {showTransportModal && (
        <View style={styles.transportListWrap}>
          {transportOpts.map((opt) => (
            <View
              key={opt.id}
              style={[
                styles.transportTile,
                {
                  backgroundColor: colors.card,
                  borderColor: opt.isRecommended ? colors.teal : colors.border,
                  borderWidth: opt.isRecommended ? 2 : 1,
                },
              ]}
            >
              <View style={styles.transHeader}>
                <Icon
                  name={
                    opt.type === 'bus' ? 'truck' : opt.type === 'walk' ? 'compass' : 'navigation'
                  }
                  size={16}
                  color={colors.teal}
                />
                <Text style={[styles.transTitle, { color: colors.ink }]}>{opt.title}</Text>
                {opt.isRecommended && (
                  <View style={[styles.recTag, { backgroundColor: colors.teal }]}>
                    <Text style={styles.recTagText}>RECOMMENDED</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.transRoute, { color: colors.mutedForeground }]}>{opt.routeName}</Text>

              <View style={styles.transMetrics}>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>TIME</Text>
                  <Text style={[styles.metricVal, { color: colors.ink }]}>{opt.travelTime}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>APPROX COST</Text>
                  <Text style={[styles.metricVal, { color: colors.ink }]}>{opt.approxCost}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>AVAILABILITY</Text>
                  <Text style={[styles.metricVal, { color: colors.ink }]}>{opt.frequencyOrAvailability}</Text>
                </View>
              </View>
              <Text style={[styles.transNotes, { color: colors.inkSoft }]}>{opt.notes}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Nearby Facilities & POIs */}
      <SectionHeader
        eyebrow="NEARBY FACILITIES & POIS"
        title={`What's near ${selectedPlace.name.split(' ')[0]}?`}
      />

      {/* Category filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
        {[
          ['all', 'All Nearby'],
          ['food', 'Food & Annadanam'],
          ['stay', 'Hotels & Lodges'],
          ['bus', 'Bus & Rail'],
          ['hospital', 'Hospitals'],
          ['police', 'Police & Safety'],
          ['parking', 'Parking'],
        ].map(([catKey, label]) => {
          const isSel = activeCategory === catKey;
          return (
            <Pressable
              key={catKey}
              onPress={() => setActiveCategory(catKey as never)}
              style={[
                styles.catPill,
                {
                  backgroundColor: isSel ? colors.ink : colors.card,
                  borderColor: isSel ? colors.ink : colors.border,
                },
              ]}
            >
              <Text style={[styles.catPillText, { color: isSel ? '#FFFFFF' : colors.inkSoft }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Facilities List */}
      <View style={styles.facilityList}>
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map((fac) => (
            <View
              key={fac.id}
              style={[
                styles.facilityCard,
                {
                  backgroundColor: colors.card,
                  borderColor: fac.isEmergency ? colors.danger : colors.border,
                  borderWidth: fac.isEmergency ? 1.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.facIconWrap,
                  {
                    backgroundColor: fac.isEmergency
                      ? colors.dangerSoft
                      : fac.category === 'food'
                      ? colors.goldSoft
                      : colors.tealSoft,
                  },
                ]}
              >
                <Icon
                  name={
                    fac.category === 'hospital'
                      ? 'plus-square'
                      : fac.category === 'police'
                      ? 'shield'
                      : fac.category === 'food'
                      ? 'home'
                      : fac.category === 'stay'
                      ? 'moon'
                      : fac.category === 'parking'
                      ? 'truck'
                      : 'map-pin'
                  }
                  size={18}
                  color={
                    fac.isEmergency
                      ? colors.danger
                      : fac.category === 'food'
                      ? '#94631D'
                      : colors.teal
                  }
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.facHead}>
                  <Text style={[styles.facName, { color: colors.ink }]}>{fac.name}</Text>
                  {fac.crowdLevel && <CrowdBadge level={fac.crowdLevel} compact />}
                </View>
                <Text style={[styles.facDetail, { color: colors.mutedForeground }]}>
                  {fac.distance} · {fac.detail}
                </Text>
                {fac.phone && (
                  <Text style={[styles.facPhone, { color: colors.danger }]}>
                    📞 Helpline: {fac.phone}
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="info" size={20} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No items listed under this category for {selectedPlace.name}. Select 'All Nearby' to view available spots.
            </Text>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <PrimaryButton
          label="Open in Google Maps App"
          icon="external-link"
          onPress={openGoogleMapsExternal}
          style={{ backgroundColor: colors.saffron }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconBtn: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  extMapBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  extMapText: { fontSize: 10, fontWeight: '700' },
  mapWrap: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', position: 'relative', marginBottom: 14 },
  mobileMapContainer: { height: 260, position: 'relative', width: '100%' },
  mobileMapImage: { width: '100%', height: '100%' },
  mobileMapOverlayBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#FF6F00', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6, elevation: 4 },
  mobileMapOverlayText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  mapOverlayBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(9, 13, 22, 0.85)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveOverlayText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  crowdStatusCard: { borderRadius: 18, borderWidth: 1, padding: 14, marginBottom: 12 },
  crowdStatusHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  statusEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  statusValue: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  statusDetail: { fontSize: 11, marginTop: 8 },
  alternativeBanner: { borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  altEyebrow: { color: '#FF9F1C', fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  altTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 2 },
  altSub: { color: '#BBD1D0', fontSize: 11, marginTop: 3 },
  switchBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  switchBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  reachCard: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  reachIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  reachEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  reachTitle: { fontSize: 14, fontWeight: '800', marginTop: 1 },
  reachSub: { fontSize: 10, marginTop: 2 },
  transportListWrap: { gap: 10, marginBottom: 16 },
  transportTile: { borderRadius: 14, padding: 12 },
  transHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  transTitle: { fontSize: 13, fontWeight: '800', flex: 1 },
  recTag: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  recTagText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  transRoute: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  transMetrics: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  metricItem: { alignItems: 'flex-start' },
  metricLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  metricVal: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  transNotes: { fontSize: 11, fontStyle: 'italic', marginTop: 8 },
  catRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  catPill: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, marginRight: 6 },
  catPillText: { fontSize: 11, fontWeight: '700' },
  facilityList: { gap: 8, marginBottom: 20 },
  facilityCard: { borderRadius: 14, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center' },
  facIconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  facHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  facName: { fontSize: 13, fontWeight: '700', flex: 1 },
  facDetail: { fontSize: 11, marginTop: 3 },
  facPhone: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  emptyWrap: { borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  actionRow: { marginTop: 10, marginBottom: 30 },
});
