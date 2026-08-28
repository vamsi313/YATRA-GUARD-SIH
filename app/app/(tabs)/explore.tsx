import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon, PlaceRow, Screen, SearchBar, SectionHeader, styles as ui } from '@/components/YatraUI';
import { destinations, getDestinationPlaces, getOccupancy, places } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { useYatra } from '@/context/YatraContext';

const filters = ['Popular', 'Nearby', 'Low crowd', 'Temples', 'Nature', 'Food'];

export default function ExploreScreen() {
  const colors = useColors();
  const { selectedDestination, placesList } = useYatra();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular');

  const sourcePlaces = useMemo(() => {
    if (selectedDestination) {
      return placesList.filter((p) => p.destinationId === selectedDestination.id);
    }
    return placesList;
  }, [selectedDestination, placesList]);

  const filtered = useMemo(() => {
    let result = sourcePlaces.filter((place) =>
      `${place.name} ${place.category}`.toLowerCase().includes(query.toLowerCase())
    );
    if (activeFilter === 'Low crowd') result = result.sort((a, b) => getOccupancy(a) - getOccupancy(b));
    if (activeFilter === 'Temples') result = result.filter((place) => place.category.includes('Temple'));
    if (activeFilter === 'Nature') result = result.filter((place) => place.category.includes('Nature') || place.category.includes('Beach'));
    return result.slice(0, 12);
  }, [activeFilter, query, sourcePlaces]);

  const title = selectedDestination ? `Explore ${selectedDestination.name}` : 'Explore';
  const eyebrow = selectedDestination ? `${selectedDestination.name.toUpperCase()} · ${selectedDestination.region.toUpperCase()}` : 'DISCOVER YOUR NEXT STOP';

  return (
    <Screen>
      <View style={ui.headerRow}>
        <View>
          <Text style={[styles.kicker, { color: colors.saffron }]}>{eyebrow}</Text>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        </View>
        <Avatar />
      </View>

      {/* Destination info pill if scoped */}
      {selectedDestination && (
        <Pressable
          onPress={() => router.push('/destination-picker')}
          style={[styles.scopePill, { backgroundColor: colors.saffronSoft, borderColor: colors.saffron }]}
        >
          <Icon name="map-pin" size={13} color={colors.saffron} />
          <Text style={[styles.scopeText, { color: colors.saffron }]}>
            {selectedDestination.name} · {getDestinationPlaces(selectedDestination.id).length} places · Tap to change
          </Text>
          <Icon name="chevron-right" size={13} color={colors.saffron} />
        </Pressable>
      )}

      <SearchBar value={query} onPress={() => setQuery(query ? '' : (selectedDestination?.places?.[0] ?? 'Kapila'))} />

      <View style={styles.filterScroll}>
        {filters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filter, {
              backgroundColor: activeFilter === filter ? colors.ink : colors.card,
              borderColor: activeFilter === filter ? colors.ink : colors.border,
            }]}
          >
            <Text style={[styles.filterText, { color: activeFilter === filter ? '#FFFFFF' : colors.inkSoft }]}>
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader
        eyebrow="CURATED FOR SAFETY"
        title={activeFilter === 'Low crowd' ? 'Lower crowd right now' : `Places in ${selectedDestination?.name ?? 'your area'}`}
        action="Map"
        onAction={() => router.push('/map')}
      />
      {filtered.map((place) => (
        <PlaceRow
          key={place.id}
          place={place}
          onPress={() => router.push({ pathname: '/place/[id]', params: { id: place.id } })}
        />
      ))}
      {filtered.length === 0 && (
        <View style={[styles.empty, { backgroundColor: colors.card }]}>
          <Icon name="search" color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.inkSoft }]}>No places match your search.</Text>
        </View>
      )}

      {/* Only show other destinations if no destination is selected */}
      {!selectedDestination && (
        <>
          <SectionHeader eyebrow="DESTINATIONS" title="Plan by destination" />
          {destinations.map((destination) => (
            <Pressable
              key={destination.id}
              onPress={() => router.push({ pathname: '/destination/[id]', params: { id: destination.id } })}
              style={[styles.destinationLine, { borderBottomColor: colors.border }]}
            >
              <View>
                <Text style={[styles.destinationName, { color: colors.ink }]}>{destination.name}</Text>
                <Text style={[styles.destinationSub, { color: colors.mutedForeground }]}>
                  {getDestinationPlaces(destination.id).length} places · {destination.weather} · {destination.weatherDetail}
                </Text>
              </View>
              <Icon name="arrow-up-right" size={17} color={colors.teal} />
            </Pressable>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1, marginTop: 4 },
  scopePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, marginTop: 14, marginBottom: 12 },
  scopeText: { flex: 1, fontSize: 12, fontWeight: '600' },
  filterScroll: { flexDirection: 'row', gap: 8, marginTop: 18, flexWrap: 'wrap' },
  filter: { borderRadius: 12, paddingHorizontal: 13, paddingVertical: 9, borderWidth: 1 },
  filterText: { fontSize: 11, fontWeight: '700' },
  destinationLine: { paddingVertical: 14, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  destinationName: { fontSize: 14, fontWeight: '700' },
  destinationSub: { fontSize: 11, marginTop: 4 },
  empty: { padding: 20, borderRadius: 17, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 13 },
});