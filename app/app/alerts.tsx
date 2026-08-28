import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertSeverity, alerts } from '@/data/mockData';
import { Icon, Screen, styles as ui } from '@/components/YatraUI';
import { useColors } from '@/hooks/useColors';

export default function AlertsScreen() {
  const colors = useColors();
  const tone: Record<AlertSeverity, { bg: string; fg: string; icon: React.ComponentProps<typeof Icon>['name'] }> = { INFO: { bg: colors.blueSoft, fg: colors.blue, icon: 'info' }, WARNING: { bg: colors.goldSoft, fg: '#94631D', icon: 'alert-triangle' }, HIGH: { bg: colors.saffronSoft, fg: colors.saffron, icon: 'bell' }, CRITICAL: { bg: colors.dangerSoft, fg: colors.danger, icon: 'alert-octagon' } };
  return <Screen><View style={ui.headerRow}><Pressable onPress={() => router.back()}><Icon name="arrow-left" size={20} color={colors.ink} /></Pressable><Text style={[styles.title, { color: colors.ink }]}>Alerts & advisories</Text><Icon name="bell" size={19} color={colors.saffron} /></View><Text style={[styles.sub, { color: colors.inkSoft }]}>Stay aware of changes that can affect your route.</Text><View style={[styles.sample, { backgroundColor: colors.goldSoft }]}><Icon name="info" size={14} color="#94631D" /><Text style={styles.sampleText}>Prototype / Sample Data</Text></View>{alerts.map((alert) => { const t = tone[alert.severity]; return <Pressable key={alert.id} onPress={() => router.push({ pathname: '/destination/[id]', params: { id: alert.destinationId } })} style={[styles.alert, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.alertIcon, { backgroundColor: t.bg }]}><Icon name={t.icon} size={18} color={t.fg} /></View><View style={{ flex: 1 }}><View style={styles.alertTop}><Text style={[styles.severity, { color: t.fg }]}>{alert.severity}</Text><Text style={[styles.time, { color: colors.mutedForeground }]}>{alert.time}</Text></View><Text style={[styles.alertTitle, { color: colors.ink }]}>{alert.title}</Text><Text style={[styles.body, { color: colors.inkSoft }]}>{alert.body}</Text></View><Icon name="chevron-right" size={16} color={colors.mutedForeground} /></Pressable>; })}</Screen>;
}

const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: '700' },
  sub: { fontSize: 13, lineHeight: 19, marginTop: 22 },
  sample: { alignSelf: 'flex-start', borderRadius: 10, marginTop: 14, paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', gap: 6, alignItems: 'center' },
  sampleText: { color: '#94631D', fontSize: 10, fontWeight: '700' },
  alert: { borderWidth: 1, borderRadius: 17, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 10 },
  alertIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between' },
  severity: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  time: { fontSize: 9 },
  alertTitle: { fontSize: 13, fontWeight: '700', marginTop: 7 },
  body: { fontSize: 11, lineHeight: 17, marginTop: 4 },
});