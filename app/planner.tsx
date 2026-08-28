import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '../components/YatraUI';
import { useColors } from '../hooks/useColors';
import { useYatra } from '../context/YatraContext';

const interests = ['Temple', 'Culture', 'Food', 'Nature', 'Family', 'Photography'];

export default function PlannerScreen() {
  const colors = useColors();
  let selectedDestination = null;
  try {
    const yatraCtx = useYatra();
    selectedDestination = yatraCtx?.selectedDestination;
  } catch {
    // fallback if context initializing
  }
  const destName = selectedDestination?.name ?? 'Tirumala';
  const destId = selectedDestination?.id ?? 'tirumala';

  const [days, setDays] = useState(1);
  const [selected, setSelected] = useState(['Temple', 'Family']);
  const [isGenerated, setIsGenerated] = useState(true);

  const itinerariesByDest: Record<string, Array<[string, string, string, string]>> = {
    tirumala: [
      ['5:30 AM', 'Silathoranam', 'Start with a low-crowd hill view & natural arch', 'compass'],
      ['8:30 AM', 'Annadanam Hall', 'Complimentary Satvik breakfast at Vengamamba', 'coffee'],
      ['10:00 AM', 'Kapila Theertham', 'Quiet waterfall temple stop & senior ramps', 'droplet'],
      ['1:00 PM', 'Tarigonda Lunch', 'Hydrate and rest during peak midday queue surge', 'sun'],
      ['3:30 PM', 'Tiruchanur Temple', 'Family-friendly Padmavathi Ammavari darshan', 'heart'],
      ['5:30 PM', 'Venkateswara Temple', 'Enter VQC Queue complex as crowd levels recede', 'rotate-cw'],
    ],
    varanasi: [
      ['5:30 AM', 'Assi Ghat Sunrise', 'Peaceful morning Aarti & tea by the Ganges', 'compass'],
      ['8:00 AM', 'Sarnath Stupa', 'Quiet morning walk around Buddhist heritage site', 'coffee'],
      ['11:00 AM', 'Annapurna Temple', 'Free prasadam lunch near Godauliya', 'droplet'],
      ['2:30 PM', 'Manikarnika Ghat Walk', 'Cultural heritage trail with low congestion', 'sun'],
      ['5:00 PM', 'Kashi Vishwanath Corridor', 'Enter via dedicated senior/pilgrim corridor', 'heart'],
      ['6:30 PM', 'Dashashwamedh Aarti', 'Reserved boat spot for evening Ganga Aarti', 'rotate-cw'],
    ],
    prayagraj: [
      ['6:00 AM', 'Triveni Sangam Boat', 'Early morning holy dip before river jetty rush', 'compass'],
      ['8:30 AM', 'Bade Hanuman Temple', 'Spiritual visit to reclining Hanuman idol', 'coffee'],
      ['11:30 AM', 'Alopi Devi Temple', 'Quiet shakthipeeth visit with low crowd density', 'droplet'],
      ['1:30 PM', 'Satvik Meal Kitchen', 'Free hygienic lunch provided by Mela Authority', 'sun'],
      ['4:00 PM', 'Anand Bhavan Gardens', 'Relaxing heritage walk & shade rest area', 'heart'],
      ['6:00 PM', 'Sangam Evening View', 'Sunset view from Fort ghat area', 'rotate-cw'],
    ],
    rameswaram: [
      ['6:00 AM', 'Agni Theertham Bath', 'Sunrise holy sea dip on serene sandy shore', 'compass'],
      ['8:00 AM', 'Ramanathaswamy Corridors', 'Walk 1000-pillar corridors before peak hours', 'coffee'],
      ['10:30 AM', 'Pamban Sea Bridge', 'Panoramic sea view & photo stop', 'droplet'],
      ['1:00 PM', 'Temple Annadanam', 'Free Tamil Nadu Govt prasadam lunch', 'sun'],
      ['3:30 PM', 'Dhanushkodi Ghost Town', 'Scenic coastal drive to sea tip', 'heart'],
      ['6:00 PM', 'Kothandaramaswamy', 'Sunset view near quiet lagoon temple', 'rotate-cw'],
    ],
  };

  const activeItinerary = itinerariesByDest[destId] ?? itinerariesByDest.tirumala;

  return (
    <Screen>
      <View style={ui.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Plan Your Yatra</Text>
        <Pressable onPress={() => router.push('/(tabs)/ai')}>
          <Icon name="star" size={19} color={colors.saffron} />
        </Pressable>
      </View>

      <Text style={[styles.intro, { color: colors.ink }]}>A thoughtful day, shaped around calmer moments.</Text>
      <Text style={[styles.subIntro, { color: colors.inkSoft }]}>We’ll keep crowd conditions and your interests in mind.</Text>

      <SectionHeader eyebrow="DESTINATION" title={destName} />
      <Pressable
        onPress={() => router.push('/destination-picker')}
        style={[styles.selectRow, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={[styles.selectIcon, { backgroundColor: colors.saffronSoft }]}>
          <Icon name="map-pin" size={18} color={colors.saffron} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.selectTitle, { color: colors.ink }]}>{destName}</Text>
          <Text style={[styles.selectSub, { color: colors.mutedForeground }]}>
            {destName} Region · {days} Day Crowd-Safe Itinerary
          </Text>
        </View>
        <Icon name="chevron-right" size={17} color={colors.mutedForeground} />
      </Pressable>

      <SectionHeader eyebrow="HOW LONG" title="Your time" />
      <View style={styles.days}>
        {[1, 2, 3].map((value) => (
          <Pressable
            key={value}
            onPress={() => setDays(value)}
            style={[
              styles.dayButton,
              {
                backgroundColor: days === value ? colors.ink : colors.card,
                borderColor: days === value ? colors.ink : colors.border,
              },
            ]}
          >
            <Text style={[styles.dayNumber, { color: days === value ? '#FFFFFF' : colors.ink }]}>{value}</Text>
            <Text style={[styles.dayLabel, { color: days === value ? '#BBD1D0' : colors.mutedForeground }]}>
              {value === 1 ? 'day' : 'days'}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader eyebrow="YOUR INTERESTS" title="Build around what matters" />
      <View style={styles.interests}>
        {interests.map((interest) => {
          const active = selected.includes(interest);
          return (
            <Pressable
              key={interest}
              onPress={() =>
                setSelected((current) => (active ? current.filter((item) => item !== interest) : [...current, interest]))
              }
              style={[
                styles.interest,
                { backgroundColor: active ? colors.tealSoft : colors.card, borderColor: active ? colors.teal : colors.border },
              ]}
            >
              <Icon name={active ? 'check' : 'plus'} size={14} color={active ? colors.teal : colors.mutedForeground} />
              <Text style={[styles.interestText, { color: active ? colors.teal : colors.inkSoft }]}>{interest}</Text>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        label={isGenerated ? `Re-generate ${destName} Itinerary` : `Create Safer Itinerary`}
        icon="sparkles"
        onPress={() => {
          setIsGenerated(true);
        }}
      />

      <SectionHeader eyebrow="YOUR GENERATED PLAN" title={`Day 1 · ${destName} Crowd-Aware Plan`} />
      <View style={[styles.timeline, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {activeItinerary.map(([time, title, detail, icon], index) => (
          <View key={time} style={styles.timelineRow}>
            <View style={styles.timeCol}>
              <Text style={[styles.time, { color: colors.saffron }]}>{time}</Text>
            </View>
            <View style={styles.timelineMark}>
              <View style={[styles.timelineDot, { backgroundColor: index === 5 ? colors.saffron : colors.teal }]} />
              {index < 5 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
            </View>
            <View style={styles.timelineInfo}>
              <Text style={[styles.timelineTitle, { color: colors.ink }]}>{title}</Text>
              <Text style={[styles.timelineDetail, { color: colors.mutedForeground }]}>{detail}</Text>
            </View>
            <Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={15} color={colors.mutedForeground} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 16, fontWeight: '700' },
  intro: { fontSize: 27, lineHeight: 32, fontWeight: '700', letterSpacing: -0.8, marginTop: 25 },
  subIntro: { fontSize: 13, lineHeight: 19, marginTop: 8 },
  selectRow: { borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  selectTitle: { fontSize: 13, fontWeight: '700' },
  selectSub: { fontSize: 11, marginTop: 4 },
  days: { flexDirection: 'row', gap: 10 },
  dayButton: { flex: 1, borderRadius: 15, borderWidth: 1, paddingVertical: 13, alignItems: 'center' },
  dayNumber: { fontSize: 19, fontWeight: '700' },
  dayLabel: { fontSize: 10, marginTop: 2 },
  interests: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  interest: { borderWidth: 1, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 9, flexDirection: 'row', gap: 6, alignItems: 'center' },
  interestText: { fontSize: 11, fontWeight: '600' },
  timeline: { borderWidth: 1, borderRadius: 18, padding: 14 },
  timelineRow: { minHeight: 52, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  timeCol: { width: 54 },
  time: { fontSize: 10, fontWeight: '800', marginTop: 2 },
  timelineMark: { width: 12, alignItems: 'center', height: 52 },
  timelineDot: { width: 8, height: 8, borderRadius: 4, marginTop: 3 },
  timelineLine: { width: 1, flex: 1, marginTop: 4 },
  timelineInfo: { flex: 1 },
  timelineTitle: { fontSize: 12, fontWeight: '700' },
  timelineDetail: { fontSize: 10, lineHeight: 15, marginTop: 3 },
});