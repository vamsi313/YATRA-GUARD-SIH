import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon, Screen, SectionHeader, styles as ui } from '../components/YatraUI';
import { useColors } from '../hooks/useColors';
import { useYatra } from '../context/YatraContext';

interface LodgeItem {
  id: string;
  destinationId: string;
  name: string;
  category: 'DHARAMSHALA' | 'ANNADANAM' | 'BUDGET_LODGE';
  priceRange: string;
  address: string;
  contactNumber: string;
  timings: string;
  amenities: string[];
  rating: string;
}

const allLodges: LodgeItem[] = [
  // ─── TIRUMALA ───────────────────────────────────────────────
  {
    id: 't1',
    destinationId: 'tirumala',
    name: 'TTD Srinivasam Pilgrim Complex',
    category: 'DHARAMSHALA',
    priceRange: '₹200 - ₹500',
    address: 'Opposite Tirupati Central Bus Station, Tirupati',
    contactNumber: '+91 877 2277777',
    timings: 'Open 24 Hours (Check-in 6 AM - 10 PM)',
    amenities: ['Cloak Room & Lockers', 'Pure Drinking Water', 'Canteen', 'EV Charging'],
    rating: '4.5',
  },
  {
    id: 't2',
    destinationId: 'tirumala',
    name: 'Tarigonda Vengamamba Nitya Annadanam',
    category: 'ANNADANAM',
    priceRange: 'Free (Nitya Seva)',
    address: 'East Mada Street, Near Srivari Temple, Tirumala',
    contactNumber: '+91 877 2264242',
    timings: '9:00 AM - 11:00 PM',
    amenities: ['Unlimited Pure Meals', 'Clean Seating Hall', 'Elderly Ramp', 'Filtered Water'],
    rating: '4.9',
  },
  {
    id: 't3',
    destinationId: 'tirumala',
    name: 'Vishnu Nivasam Rest House',
    category: 'DHARAMSHALA',
    priceRange: '₹300 - ₹600',
    address: 'Near Tirupati Railway Station Main Gate',
    contactNumber: '+91 877 2225500',
    timings: 'Open 24 Hours',
    amenities: ['Hot Water', 'Luggage Cloakroom', 'Darshan Counter'],
    rating: '4.3',
  },
  {
    id: 't4',
    destinationId: 'tirumala',
    name: 'Govindaraja Swamy Annadanam Hall',
    category: 'ANNADANAM',
    priceRange: 'Free',
    address: 'Near Govindaraja Swamy Temple, Tirupati',
    contactNumber: '+91 877 2264300',
    timings: '11:30 AM - 3:30 PM & 7:00 PM - 9:30 PM',
    amenities: ['Free Vegetarian Meals', 'Wheelchair Access'],
    rating: '4.7',
  },

  // ─── VARANASI ───────────────────────────────────────────────
  {
    id: 'v1',
    destinationId: 'varanasi',
    name: 'Shree Maheshwari Dharamshala',
    category: 'DHARAMSHALA',
    priceRange: '₹200 - ₹400',
    address: 'Bulanala Road, Near Kashi Vishwanath Temple, Varanasi',
    contactNumber: '+91 9520808340',
    timings: 'Open 24 Hours',
    amenities: ['Hot Water', 'Clean Rooms', 'Luggage Storage', 'CCTV Security'],
    rating: '4.2',
  },
  {
    id: 'v2',
    destinationId: 'varanasi',
    name: 'Kashi Annapurna Annakshetra',
    category: 'ANNADANAM',
    priceRange: 'Free (Prasadam)',
    address: 'Near Kashi Annapurna Temple, Godauliya, Varanasi',
    contactNumber: '+91 542 2391501',
    timings: 'Lunch 11:00 AM - 2:00 PM & Dinner 6:30 PM - 9:00 PM',
    amenities: ['Free Daily Prasadam', 'Seated Dining Hall', 'Drinking Water', 'Senior-Friendly'],
    rating: '4.8',
  },
  {
    id: 'v3',
    destinationId: 'varanasi',
    name: 'Sardar Vallabhbhai Patel Dharamshala',
    category: 'DHARAMSHALA',
    priceRange: '₹150 - ₹350',
    address: 'Vijay Nagar Colony, Chetganj, Varanasi',
    contactNumber: '+91 7781984390',
    timings: 'Check-in 8 AM - 10 PM',
    amenities: ['Affordable Rooms', 'Common Dining', 'Parking', 'Ghat Access'],
    rating: '4.1',
  },
  {
    id: 'v4',
    destinationId: 'varanasi',
    name: 'Aditya Ashram Sewa Samiti',
    category: 'DHARAMSHALA',
    priceRange: '₹250 - ₹500',
    address: 'Near Kashi Vishwanath Temple, Varanasi',
    contactNumber: '+91 8069266021',
    timings: 'Open 24 Hours',
    amenities: ['AC & Non-AC Rooms', 'Vegetarian Kitchen', 'Temple Proximity', 'Safe Locker'],
    rating: '4.4',
  },

  // ─── PRAYAGRAJ ──────────────────────────────────────────────
  {
    id: 'p1',
    destinationId: 'prayagraj',
    name: 'Bangur Dharamshala',
    category: 'DHARAMSHALA',
    priceRange: '₹100 - ₹300',
    address: 'G.T. Road, Madhawapura, Prayagraj (Near Sangam Ghat)',
    contactNumber: '+91 9935020360',
    timings: 'Open 24 Hours',
    amenities: ['Dormitory & Private Rooms', 'Pure Drinking Water', 'CCTV', 'Parking'],
    rating: '4.0',
  },
  {
    id: 'p2',
    destinationId: 'prayagraj',
    name: 'Prayagraj Mela Authority Free Kitchen',
    category: 'ANNADANAM',
    priceRange: 'Free (Satvik Meals)',
    address: 'Near Triveni Sangam, Prayagraj',
    contactNumber: '+91 532 2623700',
    timings: 'Breakfast 7:00 AM - 10:00 AM & Lunch 12:00 PM - 3:00 PM',
    amenities: ['Free Satvik Meals', 'Pilgrim Seating', 'Filtered Water', 'Year-Round'],
    rating: '4.6',
  },
  {
    id: 'p3',
    destinationId: 'prayagraj',
    name: 'Shri Narayanam Dharamshala',
    category: 'DHARAMSHALA',
    priceRange: '₹200 - ₹500',
    address: 'Near Dashashwamedh Ghat, Daraganj, Prayagraj',
    contactNumber: '+91 9727866754',
    timings: 'Open 24 Hours',
    amenities: ['AC & Non-AC Rooms', 'Community Hall', 'Sangam Proximity', 'Hot Water'],
    rating: '4.3',
  },
  {
    id: 'p4',
    destinationId: 'prayagraj',
    name: 'Jain Mandir & Dharamshala',
    category: 'DHARAMSHALA',
    priceRange: '₹150 - ₹400',
    address: 'Zero Road, Near Railway Station, Prayagraj',
    contactNumber: '+91 9664036450',
    timings: 'Check-in 7 AM - 10 PM',
    amenities: ['Budget Rooms', 'Spiritual Environment', 'Canteen', 'Ganga Route Access'],
    rating: '4.2',
  },

  // ─── RAMESWARAM ─────────────────────────────────────────────
  {
    id: 'r1',
    destinationId: 'rameswaram',
    name: 'Ramanathaswamy Temple Annadanam',
    category: 'ANNADANAM',
    priceRange: 'Free (TN Govt. Scheme)',
    address: 'Ramanathaswamy Temple Complex, Rameswaram',
    contactNumber: '+91 4573 221223',
    timings: '8:00 AM - 10:00 PM (Full Day)',
    amenities: ['Free Full Meals', 'Tamil Nadu Govt. Sponsored', 'Large Dining Hall', 'Daily Service'],
    rating: '4.8',
  },
  {
    id: 'r2',
    destinationId: 'rameswaram',
    name: 'Maheshwari Bhakt Niwas',
    category: 'DHARAMSHALA',
    priceRange: '₹300 - ₹700',
    address: '100m from Ramanathaswamy Temple, Rameswaram',
    contactNumber: '+91 8069266023',
    timings: 'Open 24 Hours',
    amenities: ['AC & Non-AC Rooms', 'Temple Proximity', 'Hot Water', 'Luggage Storage'],
    rating: '4.4',
  },
  {
    id: 'r3',
    destinationId: 'rameswaram',
    name: 'Sri Ramanjaneya Chatram',
    category: 'DHARAMSHALA',
    priceRange: '₹200 - ₹450',
    address: 'Near Ramanathaswamy Temple, Rameswaram',
    contactNumber: '+91 4573 221100',
    timings: 'Check-in 6 AM - 11 PM',
    amenities: ['Budget Pilgrim Rooms', 'In-house Dining', 'Sea Breeze Location', 'Purified Water'],
    rating: '4.2',
  },
  {
    id: 'r4',
    destinationId: 'rameswaram',
    name: 'TTDC Hotel Aalayam',
    category: 'BUDGET_LODGE',
    priceRange: '₹500 - ₹1200',
    address: 'Near Pamban Bridge Road, Rameswaram',
    contactNumber: '+91 4573 221413',
    timings: 'Open 24 Hours',
    amenities: ['Government Run', 'Sea View Rooms', 'Restaurant', 'Parking'],
    rating: '4.0',
  },
];

export default function LodgesScreen() {
  const colors = useColors();
  const { selectedDestination } = useYatra();
  const [filter, setFilter] = useState<'ALL' | 'DHARAMSHALA' | 'ANNADANAM'>('ALL');

  const scopedLodges = useMemo(() => {
    const destId = selectedDestination?.id ?? 'tirumala';
    return allLodges.filter((item) => item.destinationId === destId);
  }, [selectedDestination]);

  const filteredLodges = useMemo(() => {
    if (filter === 'ALL') return scopedLodges;
    return scopedLodges.filter((item) => item.category === filter);
  }, [scopedLodges, filter]);

  const destName = selectedDestination?.name ?? 'Tirumala';

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Contact', `Please dial ${number}`);
    });
  };

  return (
    <Screen>
      <View style={ui.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Lodges & Annadanam</Text>
        <Icon name="home" size={19} color={colors.saffron} />
      </View>

      {/* Destination scope banner */}
      <Pressable
        onPress={() => router.push('/destination-picker')}
        style={[styles.scopePill, { backgroundColor: colors.saffronSoft, borderColor: colors.saffron }]}
      >
        <Icon name="map-pin" size={13} color={colors.saffron} />
        <Text style={[styles.scopeText, { color: colors.saffron }]}>
          Showing {destName} · {scopedLodges.length} verified spots · Tap to change
        </Text>
        <Icon name="chevron-right" size={13} color={colors.saffron} />
      </Pressable>

      <View style={[styles.hero, { backgroundColor: colors.tealSoft }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.teal }]}>
          <Icon name="heart" size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.heroTitle, { color: colors.ink }]}>Dharamshalas & Free Food</Text>
        <Text style={[styles.heroBody, { color: colors.inkSoft }]}>
          Budget pilgrim stays, cloakrooms, and free Annadanam dining centers in {destName}.
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'DHARAMSHALA', 'ANNADANAM'] as const).map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setFilter(cat)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: filter === cat ? colors.saffron : colors.card,
                borderColor: filter === cat ? colors.saffron : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === cat ? '#FFFFFF' : colors.inkSoft },
              ]}
            >
              {cat === 'ALL' ? 'All Facilities' : cat === 'ANNADANAM' ? '🍛 Free Annadanam' : '🏨 Dharamshalas'}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader eyebrow="VERIFIED SPOTS" title={`Places & Stays in ${destName}`} />

      <View style={styles.list}>
        {filteredLodges.map((lodge) => (
          <View
            key={lodge.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor:
                          lodge.category === 'ANNADANAM' ? colors.tealSoft :
                          lodge.category === 'BUDGET_LODGE' ? colors.saffronSoft : colors.goldSoft,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: lodge.category === 'ANNADANAM' ? colors.teal :
                          lodge.category === 'BUDGET_LODGE' ? colors.saffron : '#94631D',
                        },
                      ]}
                    >
                      {lodge.category === 'ANNADANAM' ? 'FREE ANNADANAM' :
                       lodge.category === 'BUDGET_LODGE' ? 'BUDGET LODGE' : 'DHARAMSHALA'}
                    </Text>
                  </View>
                  <Text style={[styles.price, { color: colors.saffron }]}>{lodge.priceRange}</Text>
                </View>
                <Text style={[styles.lodgeName, { color: colors.ink }]}>{lodge.name}</Text>
                <Text style={[styles.address, { color: colors.mutedForeground }]}>{lodge.address}</Text>
              </View>
            </View>

            <View style={styles.amenitiesWrap}>
              {lodge.amenities.map((amenity) => (
                <View
                  key={amenity}
                  style={[styles.amenityTag, { backgroundColor: colors.border, borderColor: colors.border }]}
                >
                  <Text style={[styles.amenityText, { color: colors.inkSoft }]}>✓ {amenity}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
              <View style={styles.timingWrap}>
                <Icon name="clock" size={13} color={colors.mutedForeground} />
                <Text style={[styles.timingsText, { color: colors.mutedForeground }]}>
                  {lodge.timings}
                </Text>
              </View>
              <Pressable
                onPress={() => handleCall(lodge.contactNumber)}
                style={[styles.callBtn, { backgroundColor: colors.tealSoft }]}
              >
                <Icon name="phone" size={13} color={colors.teal} />
                <Text style={[styles.callBtnText, { color: colors.teal }]}>Call</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {filteredLodges.length === 0 && (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Icon name="info" size={20} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.inkSoft }]}>
              No {filter === 'ANNADANAM' ? 'Annadanam' : 'Dharamshala'} spots found for {destName}.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 16, fontWeight: '700' },
  scopePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10 },
  scopeText: { flex: 1, fontSize: 12, fontWeight: '600' },
  hero: { borderRadius: 21, padding: 16, marginTop: 4 },
  heroIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  heroBody: { fontSize: 12, lineHeight: 18, marginVertical: 6 },
  filterRow: { flexDirection: 'row', gap: 7, marginTop: 18, marginBottom: 8 },
  filterBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12 },
  filterText: { fontSize: 11, fontWeight: '700' },
  list: { gap: 12, paddingBottom: 30 },
  card: { borderWidth: 1, borderRadius: 16, padding: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  categoryBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '800' },
  price: { fontSize: 12, fontWeight: '800' },
  lodgeName: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  address: { fontSize: 11, lineHeight: 15 },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 10 },
  amenityTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 0.5 },
  amenityText: { fontSize: 10, fontWeight: '600' },
  cardFooter: {
    borderTopWidth: 1, paddingTop: 10, marginTop: 4,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  timingWrap: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  timingsText: { fontSize: 10 },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8 },
  callBtnText: { fontSize: 11, fontWeight: '700' },
  empty: { borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 13, textAlign: 'center' },
});
