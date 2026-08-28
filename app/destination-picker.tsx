import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { destinations, imageAssets } from '../data/mockData';
import { useYatra } from '../context/YatraContext';
import { useColors } from '../hooks/useColors';
import { Icon } from '../components/YatraUI';

const DEST_TAGLINE: Record<string, string> = {
  tirumala: 'Seven Hills · Venkateswara Darshan',
  varanasi: 'Ancient Ghats · Kashi Vishwanath',
  prayagraj: 'Triveni Sangam · Sacred Confluence',
  rameswaram: 'Island Shrine · Ramanathaswamy',
};

export default function DestinationPicker() {
  const colors = useColors();
  const { setDestination, user } = useYatra();
  const [selecting, setSelecting] = useState<string | null>(null);

  const handlePick = async (destId: string) => {
    setSelecting(destId);
    await setDestination(destId);
    // Small delay for visual feedback
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 320);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoMark, { backgroundColor: colors.saffron }]}>
            <Text style={styles.logoText}>YG</Text>
          </View>
          <Text style={[styles.greeting, { color: colors.ink }]}>
            {user ? `Namaste, ${user.name.split(' ')[0]}!` : 'Namaste!'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Which pilgrimage destination are you heading to?
          </Text>
          <Text style={[styles.hint, { color: colors.inkSoft }]}>
            The app will show you crowd data, places, alerts and guidance for your chosen destination only.
          </Text>
        </View>

        {/* Destination Cards */}
        <View style={styles.grid}>
          {destinations.map((dest) => {
            const isSelected = selecting === dest.id;
            const imageKey = dest.image as keyof typeof imageAssets;
            return (
              <Pressable
                key={dest.id}
                onPress={() => handlePick(dest.id)}
                style={[
                  styles.card,
                  {
                    borderColor: isSelected ? colors.saffron : colors.border,
                    borderWidth: isSelected ? 2.5 : 1,
                    opacity: selecting && !isSelected ? 0.45 : 1,
                  },
                ]}
              >
                {/* Destination Image */}
                <View style={styles.imageWrap}>
                  <Image
                    source={imageAssets[imageKey]}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={[styles.imageOverlay, { backgroundColor: colors.ink }]} />
                  {/* Weather pill */}
                  <View style={[styles.weatherPill, { backgroundColor: 'rgba(0,0,0,0.55)' }]}>
                    <Text style={styles.weatherText}>{dest.weather} · {dest.weatherDetail}</Text>
                  </View>
                  {/* Selected check */}
                  {isSelected && (
                    <View style={[styles.checkCircle, { backgroundColor: colors.saffron }]}>
                      <Icon name="check" size={16} color="#fff" />
                    </View>
                  )}
                </View>

                {/* Card body */}
                <View style={[styles.cardBody, { backgroundColor: colors.card }]}>
                  <Text style={[styles.destName, { color: colors.ink }]}>{dest.name}</Text>
                  <Text style={[styles.destRegion, { color: colors.saffron }]}>{dest.region}</Text>
                  <Text style={[styles.destTagline, { color: colors.mutedForeground }]}>
                    {DEST_TAGLINE[dest.id]}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={[styles.metaPill, { backgroundColor: colors.tealSoft }]}>
                      <Icon name="map-pin" size={11} color={colors.teal} />
                      <Text style={[styles.metaText, { color: colors.teal }]}>
                        {dest.places.length} places
                      </Text>
                    </View>
                    <View style={[styles.metaPill, { backgroundColor: colors.saffronSoft }]}>
                      <Icon name="alert-circle" size={11} color={colors.saffron} />
                      <Text style={[styles.metaText, { color: colors.saffron }]}>
                        {dest.alerts.length} alerts
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.destOverview, { color: colors.inkSoft }]} numberOfLines={2}>
                    {dest.overview}
                  </Text>

                  <View style={[styles.selectBtn, { backgroundColor: isSelected ? colors.saffron : colors.ink }]}>
                    <Text style={styles.selectBtnText}>
                      {isSelected ? 'Chosen ✓' : 'Choose this destination'}
                    </Text>
                    {!isSelected && <Icon name="arrow-right" size={15} color="#fff" />}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Icon name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            You can change your destination anytime from your Profile.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 18, paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 28, paddingBottom: 24 },
  logoMark: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  greeting: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 6, lineHeight: 22 },
  hint: { fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 8, paddingHorizontal: 12 },
  grid: { gap: 18 },
  card: { borderRadius: 22, overflow: 'hidden' },
  imageWrap: { height: 160, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.35 },
  emojiBadge: {
    position: 'absolute', top: 12, left: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
  },
  emojiText: { fontSize: 18 },
  weatherPill: {
    position: 'absolute', bottom: 10, right: 12,
    borderRadius: 9, paddingHorizontal: 9, paddingVertical: 4,
  },
  weatherText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  checkCircle: {
    position: 'absolute', top: 12, right: 12,
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { padding: 16 },
  destName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  destRegion: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginTop: 3, textTransform: 'uppercase' },
  destTagline: { fontSize: 12, marginTop: 3 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  metaText: { fontSize: 11, fontWeight: '700' },
  destOverview: { fontSize: 12, lineHeight: 18, marginTop: 10 },
  selectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 13, paddingVertical: 13, marginTop: 14,
  },
  selectBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  footer: { flexDirection: 'row', gap: 7, alignItems: 'flex-start', marginTop: 28, paddingHorizontal: 4 },
  footerText: { fontSize: 11, flex: 1, lineHeight: 16 },
});
