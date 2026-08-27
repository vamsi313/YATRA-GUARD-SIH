import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { emergencyPoints } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';

export default function EmergencyScreen() {
  const colors = useColors();
  return <Screen><View style={ui.headerRow}><Pressable onPress={() => router.back()}><Icon name="arrow-left" size={20} color={colors.ink} /></Pressable><Text style={[styles.headerTitle, { color: colors.ink }]}>Emergency nearby</Text><Icon name="shield" size={19} color={colors.saffron} /></View>
    <View style={[styles.hero, { backgroundColor: colors.dangerSoft }]}><View style={[styles.heroIcon, { backgroundColor: colors.danger }]}><Icon name="phone-call" size={21} color="#FFFFFF" /></View><Text style={[styles.heroTitle, { color: colors.ink }]}>Help is close</Text><Text style={[styles.heroBody, { color: colors.inkSoft }]}>This prototype shows nearby support points for Tirumala. In a live version, these would be verified official services.</Text><PrimaryButton label="Call local emergency services" icon="phone" onPress={() => Alert.alert('Prototype emergency action', 'Calling emergency services would open here.')} /></View>
    <SectionHeader eyebrow="NEARBY SUPPORT" title="Find help" />
    {emergencyPoints.map((point) => <View key={point.label} style={[styles.point, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.pointIcon, { backgroundColor: colors.tealSoft }]}><Icon name={point.icon as React.ComponentProps<typeof Icon>['name']} size={18} color={colors.teal} /></View><View style={{ flex: 1 }}><Text style={[styles.pointTitle, { color: colors.ink }]}>{point.label}</Text><Text style={[styles.pointDetail, { color: colors.mutedForeground }]}>{point.detail}</Text></View><Pressable onPress={() => Alert.alert(point.action, `Prototype action for ${point.label}.`)}><Text style={[styles.pointAction, { color: colors.teal }]}>{point.action}</Text></Pressable></View>)}
    <SectionHeader eyebrow="ALWAYS AVAILABLE" title="Special assistance" />
    <View style={styles.assistance}>{[['search', 'Lost & Found', 'Report a missing person or item'], ['heart', 'Medical assistance', 'Find a first aid point'], ['users', 'Women & child help', 'Private support and guidance']].map(([icon, title, detail]) => <Pressable key={title} onPress={() => Alert.alert(title, 'A verified support flow would open here.')} style={[styles.assistRow, { borderBottomColor: colors.border }]}><Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={18} color={colors.saffron} /><View><Text style={[styles.assistTitle, { color: colors.ink }]}>{title}</Text><Text style={[styles.assistDetail, { color: colors.mutedForeground }]}>{detail}</Text></View><Icon name="chevron-right" size={16} color={colors.mutedForeground} /></Pressable>)}</View>
    <View style={[styles.note, { backgroundColor: colors.goldSoft }]}><Icon name="info" size={15} color="#94631D" /><Text style={styles.noteText}>For your safety, always follow on-ground authority instructions. YatraGuard prototype alerts are not official emergency directions.</Text></View>
  </Screen>;
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 16, fontWeight: '700' },
  hero: { borderRadius: 21, padding: 17, marginTop: 22 },
  heroIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 21, fontWeight: '700', marginTop: 13 },
  heroBody: { fontSize: 12, lineHeight: 18, marginVertical: 9 },
  point: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  pointIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pointTitle: { fontSize: 12, fontWeight: '700' },
  pointDetail: { fontSize: 10, marginTop: 4 },
  pointAction: { fontSize: 10, fontWeight: '800' },
  assistance: { gap: 0 },
  assistRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13, borderBottomWidth: 1 },
  assistTitle: { fontSize: 13, fontWeight: '700' },
  assistDetail: { fontSize: 10, marginTop: 3 },
  note: { marginTop: 23, borderRadius: 14, padding: 11, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  noteText: { flex: 1, color: '#94631D', fontSize: 10, lineHeight: 15 },
});