import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, BrandMark, DestinationCard, Icon, PrimaryButton, Screen, SearchBar, SectionHeader, styles as ui } from '../../components/YatraUI';
import { destinations, getDestinationPlaces, getOccupancy, getPlace } from '../../data/mockData';
import { useColors } from '../../hooks/useColors';
import { useYatra } from '../../context/YatraContext';

export default function HomeScreen() {
  const colors = useColors();
  const { user, selectedDestination, placesList, activeAlerts } = useYatra();
  const [search, setSearch] = useState('');

  // When a destination is selected, scope to it; otherwise show all
  const activeDestination = selectedDestination;

  const scopedPlaces = useMemo(() => {
    if (activeDestination) {
      return placesList.filter((p) => p.destinationId === activeDestination.id);
    }
    return [];
  }, [activeDestination, placesList]);

  const mainPlace = useMemo(() => {
    if (!activeDestination) return placesList.find((p) => p.id === 'venkateswara');
    return scopedPlaces[0] ?? null;
  }, [activeDestination, scopedPlaces, placesList]);

  const alternativePlaces = useMemo(() => {
    if (!activeDestination) {
      return ['silathoranam', 'kapila', 'tiruchanur'].map((id) => placesList.find((p) => p.id === id)).filter(Boolean);
    }
    // Show low-crowd places in the selected destination (skip main/first one)
    return scopedPlaces
      .slice(1)
      .sort((a, b) => getOccupancy(a) - getOccupancy(b))
      .slice(0, 3);
  }, [activeDestination, scopedPlaces, placesList]);

  const filteredDestinations = useMemo(() => {
    if (activeDestination) return [];
    return destinations.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [activeDestination, search]);

  const mainPlaceOccupancy = mainPlace ? getOccupancy(mainPlace) : 82;
  const destinationLiveAlerts = activeAlerts.filter((a) => a.destinationId === activeDestination?.id);
  const destAlerts = destinationLiveAlerts.length > 0 
    ? destinationLiveAlerts.map(a => `${a.title}: ${a.body}`)
    : (activeDestination?.alerts ?? ['Main temple queue has reached critical crowd levels.']);

  return (
    <Screen>
      <View style={ui.headerRow}>
        <BrandMark />
        <Avatar />
      </View>

      {activeDestination ? (
        <>
          {/* Destination context header */}
          <View style={[styles.destBanner, { backgroundColor: colors.saffronSoft }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.destBannerEyebrow, { color: colors.saffron }]}>YOUR YATRA</Text>
              <Text style={[styles.destBannerName, { color: colors.ink }]}>{activeDestination.name}</Text>
              <Text style={[styles.destBannerRegion, { color: colors.mutedForeground }]}>{activeDestination.region} · {activeDestination.weather} {activeDestination.weatherDetail}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/destination-picker')}
              style={[styles.changeBtn, { borderColor: colors.saffron }]}
            >
              <Icon name="refresh-cw" size={13} color={colors.saffron} />
              <Text style={[styles.changeBtnText, { color: colors.saffron }]}>Change</Text>
            </Pressable>
          </View>

          {/* Safety alert for this destination */}
          <View style={[styles.safetyCard, { backgroundColor: colors.ink }]}>
            <View style={styles.safetyTitle}>
              <View style={[styles.safetyIcon, { backgroundColor: colors.saffron }]}>
                <Icon name="alert-triangle" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.safetyEyebrow}>SMART SAFETY ALERT · {activeDestination.name.toUpperCase()}</Text>
                <Text style={styles.safetyHeading}>
                  {mainPlace ? `${mainPlace.name} is at ${mainPlaceOccupancy}% capacity` : 'Live crowd monitoring active'}
                </Text>
              </View>
            </View>
            <Text style={styles.safetyBody}>{destAlerts[0]}</Text>
            <View style={styles.safetyButtons}>
              <PrimaryButton
                label="View alternatives"
                icon="arrow-up-right"
                onPress={() => router.push({ pathname: '/destination/[id]', params: { id: activeDestination.id } })}
              />
              <Pressable onPress={() => router.push('/transport')} style={styles.safetyEmergency}>
                <Icon name="truck" size={15} color="#FFFFFF" />
                <Text style={styles.safetyEmergencyText}>Transport</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/emergency')} style={styles.safetyEmergency}>
                <Icon name="phone-call" size={15} color="#FFFFFF" />
                <Text style={styles.safetyEmergencyText}>SOS</Text>
              </Pressable>
            </View>
          </View>

          {/* Family & Friends Hub Card */}
          <Pressable
            onPress={() => router.push('/family-hub')}
            style={[styles.familyHubHomeCard, { backgroundColor: colors.card, borderColor: colors.saffron, borderWidth: 1.5 }]}
          >
            <View style={[styles.familyHubIconWrap, { backgroundColor: colors.saffronSoft }]}>
              <Icon name="users" size={20} color={colors.saffron} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.familyHubEyebrow, { color: colors.saffron }]}>FAMILY & FRIENDS HUB</Text>
                <View style={[styles.activeDot, { backgroundColor: colors.teal }]} />
              </View>
              <Text style={[styles.familyHubTitle, { color: colors.ink }]}>Shared Group Location & Safety</Text>
              <Text style={[styles.familyHubSub, { color: colors.mutedForeground }]}>
                Track connected group members, set meeting points & receive crowd risk alerts in {activeDestination.name}.
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.saffron} />
          </Pressable>

          {/* Safer places nearby (scoped) */}
          <SectionHeader
            eyebrow="SAFER SPOTS NEARBY"
            title={`Quieter places in ${activeDestination.name}`}
            action="Explore all"
            onAction={() => router.push('/(tabs)/explore')}
          />
          {alternativePlaces.map((place) => place && (
            <Pressable
              key={place.id}
              onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })}
              style={[styles.recommendRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.recommendMain}>
                <View style={[styles.recommendDot, { backgroundColor: colors.teal }]} />
                <View>
                  <Text style={[styles.recommendName, { color: colors.ink }]}>{place.name}</Text>
                  <Text style={[styles.recommendReason, { color: colors.mutedForeground }]}>
                    {getOccupancy(place)}% occupancy · {place.crowd.waitingMinutes} min wait
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </>
      ) : (
        <>
          {/* No destination (not logged in / no selection) → show all */}
          <Text style={[ui.greeting, { color: colors.ink }]}>Plan your pilgrimage.{'\n'}Travel smarter.</Text>
          <Text style={[ui.subGreeting, { color: colors.inkSoft }]}>Your guide to meaningful moments and safer routes.</Text>
          <SearchBar value={search} onPress={() => setSearch(search ? '' : 'Tirumala')} />
          <SectionHeader eyebrow="CURRENT CONDITIONS" title="Choose your yatra" action="See all" onAction={() => router.push('/(tabs)/explore')} />
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onPress={() => router.push({ pathname: '/destination/[id]', params: { id: destination.id } })}
            />
          ))}
        </>
      )}

      {/* Quick action tiles — always visible */}
      <SectionHeader eyebrow="RIGHT NOW" title="What do you need?" />
      <View style={styles.actionGrid}>
        {[
          ['users', 'Family & Friends', '/family-hub'],
          ['truck', 'Transport & Travel', '/transport'],
          ['map', 'Explore places', '/(tabs)/explore'],
          ['home', 'Lodges & Annadanam', '/lodges'],
          ['calendar', 'Plan my day', '/planner'],
          ['shield', 'Emergency SOS', '/emergency'],
        ].map(([icon, label, path]) => (
          <Pressable
            key={label}
            onPress={() => router.push(path as never)}
            style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={20} color={colors.teal} />
            <Text style={[styles.actionLabel, { color: colors.ink }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.prototypeNote, { backgroundColor: colors.goldSoft }]}>
        <Icon name="info" size={15} color="#94631D" />
        <Text style={styles.prototypeText}>
          Pilgrimage Safety Network · Connected to Neon Live Database & Yatra AI.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  destBanner: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    marginBottom: 16,
  },
  destBannerEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  destBannerName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
  destBannerRegion: { fontSize: 11, marginTop: 3 },
  changeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  changeBtnText: { fontSize: 11, fontWeight: '700' },
  safetyCard: { borderRadius: 22, padding: 17, marginTop: 4 },
  safetyTitle: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  safetyIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  safetyEyebrow: { color: '#BBD1D0', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  safetyHeading: { color: '#FFFFFF', fontSize: 16, lineHeight: 22, fontWeight: '700', marginTop: 4, letterSpacing: -0.3 },
  safetyBody: { color: '#D1E0DE', fontSize: 12, lineHeight: 19, marginTop: 14 },
  safetyButtons: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 16 },
  safetyEmergency: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 8 },
  safetyEmergencyText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  familyHubHomeCard: { borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, marginBottom: 16 },
  familyHubIconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  familyHubEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  familyHubTitle: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  familyHubSub: { fontSize: 11, marginTop: 3, lineHeight: 16 },
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
});
