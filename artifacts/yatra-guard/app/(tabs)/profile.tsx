import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { useYatra } from '@/context/YatraContext';
import { useColors } from '@/hooks/useColors';

const preferenceOptions = ['Family', 'Senior citizens', 'Children', 'Photography', 'Religious', 'Nature', 'Food', 'Budget', 'Accessibility'] as const;

export default function ProfileScreen() {
  const colors = useColors();
  const { favorites, preferences, togglePreference } = useYatra();
  return <Screen><View style={ui.headerRow}><View><Text style={[styles.kicker, { color: colors.saffron }]}>YOUR TRAVEL COMPANION</Text><Text style={[styles.title, { color: colors.ink }]}>My Yatra</Text></View><Avatar label="VG" /></View>
    <View style={[styles.profileCard, { backgroundColor: colors.ink }]}><View style={styles.profileTop}><View style={[styles.bigAvatar, { backgroundColor: colors.saffron }]}><Text style={styles.bigAvatarText}>VG</Text></View><View><Text style={styles.profileName}>Pilgrim profile</Text><Text style={styles.profileSub}>Your choices shape safer recommendations.</Text></View></View><View style={styles.profileStats}><View><Text style={styles.statValue}>{favorites.length}</Text><Text style={styles.statLabel}>Saved places</Text></View><View><Text style={styles.statValue}>{preferences.length}</Text><Text style={styles.statLabel}>Preferences</Text></View><View><Text style={styles.statValue}>1</Text><Text style={styles.statLabel}>Active yatra</Text></View></View></View>
    <SectionHeader eyebrow="YOUR DAY" title="Tirumala, today" action="View plan" onAction={() => router.push('/planner')} />
    <View style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.dayLine}><View style={[styles.dayDot, { backgroundColor: colors.danger }]} /><View style={{ flex: 1 }}><Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>CURRENT CROWD</Text><Text style={[styles.dayValue, { color: colors.ink }]}>High at main temple</Text></View><Icon name="alert-triangle" size={17} color={colors.danger} /></View><View style={styles.dayLine}><View style={[styles.dayDot, { backgroundColor: colors.teal }]} /><View style={{ flex: 1 }}><Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>NEXT RECOMMENDATION</Text><Text style={[styles.dayValue, { color: colors.ink }]}>Silathoranam</Text></View><Text style={[styles.lowerCrowd, { color: colors.teal }]}>28%</Text></View><PrimaryButton label="Open my itinerary" icon="arrow-up-right" onPress={() => router.push('/planner')} variant="secondary" /></View>
    <SectionHeader eyebrow="PERSONALIZE" title="What matters to you?" />
    <View style={styles.preferences}>{preferenceOptions.map((preference) => { const active = preferences.includes(preference); return <Pressable key={preference} onPress={() => togglePreference(preference)} style={[styles.preference, { backgroundColor: active ? colors.tealSoft : colors.card, borderColor: active ? colors.teal : colors.border }]}><Icon name={active ? 'check' : 'plus'} size={14} color={active ? colors.teal : colors.mutedForeground} /><Text style={[styles.preferenceText, { color: active ? colors.teal : colors.inkSoft }]}>{preference}</Text></Pressable>; })}</View>
    <SectionHeader eyebrow="QUICK ACCESS" title="Help & information" />
    {[
      ['alert-circle', 'Alerts & advisories', 'See current crowd and weather notices', '/alerts'],
      ['shield', 'Emergency nearby', 'Help desks, medical assistance and water', '/emergency'],
      ['info', 'About the prototype', 'How YatraGuard turns data into guidance', '/about'],
    ].map(([icon, title, detail, path]) => <Pressable key={title} onPress={() => router.push(path as never)} style={[styles.menuRow, { borderBottomColor: colors.border }]}><View style={[styles.menuIcon, { backgroundColor: colors.saffronSoft }]}><Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={17} color={colors.saffron} /></View><View style={{ flex: 1 }}><Text style={[styles.menuTitle, { color: colors.ink }]}>{title}</Text><Text style={[styles.menuDetail, { color: colors.mutedForeground }]}>{detail}</Text></View><Icon name="chevron-right" size={18} color={colors.mutedForeground} /></Pressable>)}
  </Screen>;
}

const styles = StyleSheet.create({
  kicker: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1, marginTop: 4 },
  profileCard: { borderRadius: 22, padding: 17, marginTop: 22 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bigAvatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  bigAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  profileName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  profileSub: { color: '#BBD1D0', fontSize: 11, marginTop: 4 },
  profileStats: { flexDirection: 'row', gap: 34, marginTop: 24 },
  statValue: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' },
  statLabel: { color: '#BBD1D0', fontSize: 10, marginTop: 3 },
  dayCard: { borderWidth: 1, borderRadius: 18, padding: 14 },
  dayLine: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 14 },
  dayDot: { width: 8, height: 8, borderRadius: 4 },
  dayLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  dayValue: { fontSize: 14, fontWeight: '700', marginTop: 3 },
  lowerCrowd: { fontSize: 13, fontWeight: '800' },
  preferences: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preference: { borderWidth: 1, borderRadius: 11, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  preferenceText: { fontSize: 11, fontWeight: '600' },
  menuRow: { borderBottomWidth: 1, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  menuIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 13, fontWeight: '700' },
  menuDetail: { fontSize: 10, marginTop: 3 },
});