import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { useColors } from '@/hooks/useColors';

const interests = ['Temple', 'Culture', 'Food', 'Nature', 'Family', 'Photography'];

export default function PlannerScreen() {
  const colors = useColors();
  const [days, setDays] = useState(1);
  const [selected, setSelected] = useState(['Temple', 'Family']);
  return <Screen><View style={ui.headerRow}><Pressable onPress={() => router.back()}><Icon name="arrow-left" size={20} color={colors.ink} /></Pressable><Text style={[styles.headerTitle, { color: colors.ink }]}>Plan your yatra</Text><Pressable onPress={() => router.push('/(tabs)/ai')}><Icon name="star" size={19} color={colors.saffron} /></Pressable></View>
    <Text style={[styles.intro, { color: colors.ink }]}>A thoughtful day, shaped around calmer moments.</Text><Text style={[styles.subIntro, { color: colors.inkSoft }]}>We’ll keep crowd conditions and your interests in mind.</Text>
    <SectionHeader eyebrow="DESTINATION" title="Tirumala" />
    <View style={[styles.selectRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.selectIcon, { backgroundColor: colors.saffronSoft }]}><Icon name="map-pin" size={18} color={colors.saffron} /></View><View style={{ flex: 1 }}><Text style={[styles.selectTitle, { color: colors.ink }]}>Tirumala / Tirupati</Text><Text style={[styles.selectSub, { color: colors.mutedForeground }]}>Andhra Pradesh · 1 day yatra</Text></View><Icon name="chevron-down" size={17} color={colors.mutedForeground} /></View>
    <SectionHeader eyebrow="HOW LONG" title="Your time" />
    <View style={styles.days}>{[1, 2, 3].map((value) => <Pressable key={value} onPress={() => setDays(value)} style={[styles.dayButton, { backgroundColor: days === value ? colors.ink : colors.card, borderColor: days === value ? colors.ink : colors.border }]}><Text style={[styles.dayNumber, { color: days === value ? '#FFFFFF' : colors.ink }]}>{value}</Text><Text style={[styles.dayLabel, { color: days === value ? '#BBD1D0' : colors.mutedForeground }]}>{value === 1 ? 'day' : 'days'}</Text></Pressable>)}</View>
    <SectionHeader eyebrow="YOUR INTERESTS" title="Build around what matters" />
    <View style={styles.interests}>{interests.map((interest) => { const active = selected.includes(interest); return <Pressable key={interest} onPress={() => setSelected((current) => active ? current.filter((item) => item !== interest) : [...current, interest])} style={[styles.interest, { backgroundColor: active ? colors.tealSoft : colors.card, borderColor: active ? colors.teal : colors.border }]}><Icon name={active ? 'check' : 'plus'} size={14} color={active ? colors.teal : colors.mutedForeground} /><Text style={[styles.interestText, { color: active ? colors.teal : colors.inkSoft }]}>{interest}</Text></Pressable>; })}</View>
    <PrimaryButton label="Create safer itinerary" icon="arrow-right" onPress={() => undefined} />
    <SectionHeader eyebrow="YOUR GENERATED PLAN" title={`Day 1 · crowd-aware itinerary`} />
    <View style={[styles.timeline, { backgroundColor: colors.card, borderColor: colors.border }]}>{[
      ['5:30 AM', 'Silathoranam', 'Start with a low-crowd hill view', 'compass'],
      ['8:30 AM', 'Breakfast', 'Vegetarian breakfast near Tirupati', 'coffee'],
      ['10:00 AM', 'Kapila Theertham', 'Quiet nature and temple stop', 'droplet'],
      ['1:00 PM', 'Lunch', 'Rest and hydrate before the afternoon', 'sun'],
      ['3:00 PM', 'Tiruchanur', 'Family-friendly temple visit', 'heart'],
      ['5:00 PM', 'Return to main temple', 'Forecast expected to ease', 'rotate-cw'],
    ].map(([time, title, detail, icon], index) => <View key={time} style={styles.timelineRow}><View style={styles.timeCol}><Text style={[styles.time, { color: colors.saffron }]}>{time}</Text></View><View style={styles.timelineMark}><View style={[styles.timelineDot, { backgroundColor: index === 5 ? colors.saffron : colors.teal }]} />{index < 5 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}</View><View style={styles.timelineInfo}><Text style={[styles.timelineTitle, { color: colors.ink }]}>{title}</Text><Text style={[styles.timelineDetail, { color: colors.mutedForeground }]}>{detail}</Text></View><Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={15} color={colors.mutedForeground} /></View>)}</View>
  </Screen>;
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