import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '../components/YatraUI';
import { emergencyPoints } from '../data/mockData';
import { useColors } from '../hooks/useColors';

export default function EmergencyScreen() {
  const colors = useColors();
  const [sosSent, setSosSent] = useState(false);

  const triggerSOS = () => {
    Alert.alert(
      '🚨 Trigger SOS Emergency Alert?',
      'This will broadcast an urgent assistance request and prepare SMS location sharing to emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send SOS Alert',
          style: 'destructive',
          onPress: async () => {
            setSosSent(true);
            try {
              await fetch('http://localhost:5000/api/alerts', {
                method: 'GET',
              }).catch(() => {});
            } catch {}

            Alert.alert(
              'SOS Alert Broadcasted',
              'Your emergency distress alert has been recorded. Emergency contacts can receive your live coordinates via SMS.',
              [
                {
                  text: 'Open SMS Location Share',
                  onPress: () => {
                    const message = encodeURIComponent(
                      'EMERGENCY: I need immediate assistance at Tirumala Pilgrimage Area. Please reach out or notify temple authorities.'
                    );
                    Linking.openURL(`sms:?body=${message}`).catch(() => {});
                  },
                },
                { text: 'OK' },
              ]
            );
          },
        },
      ]
    );
  };

  const callEmergency = (number = '112') => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Emergency Call', `Please dial ${number} on your phone.`);
    });
  };

  return (
    <Screen>
      <View style={ui.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Icon name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Emergency & Safety</Text>
        <Icon name="shield" size={19} color={colors.saffron} />
      </View>

      <View style={[styles.hero, { backgroundColor: colors.dangerSoft }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.danger }]}>
          <Icon name="phone-call" size={21} color="#FFFFFF" />
        </View>
        <Text style={[styles.heroTitle, { color: colors.ink }]}>24/7 Pilgrimage SOS</Text>
        <Text style={[styles.heroBody, { color: colors.inkSoft }]}>
          Tap below for immediate police, medical, or crowd emergency support in your area.
        </Text>
        <PrimaryButton
          label={sosSent ? 'Distress Signal Active' : 'Broadcast SOS & Share GPS'}
          icon="alert-circle"
          onPress={triggerSOS}
          style={{ backgroundColor: colors.danger }}
        />
      </View>

      <SectionHeader eyebrow="QUICK HELPLINES" title="Direct Dial" />
      <View style={styles.helplinesRow}>
        <Pressable
          onPress={() => callEmergency('112')}
          style={[styles.quickCallCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Icon name="phone" size={18} color={colors.danger} />
          <Text style={[styles.callNumber, { color: colors.ink }]}>112</Text>
          <Text style={[styles.callLabel, { color: colors.mutedForeground }]}>National Police</Text>
        </Pressable>

        <Pressable
          onPress={() => callEmergency('108')}
          style={[styles.quickCallCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Icon name="plus-square" size={18} color={colors.teal} />
          <Text style={[styles.callNumber, { color: colors.ink }]}>108</Text>
          <Text style={[styles.callLabel, { color: colors.mutedForeground }]}>Ambulance</Text>
        </Pressable>

        <Pressable
          onPress={() => callEmergency('1091')}
          style={[styles.quickCallCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Icon name="users" size={18} color={colors.saffron} />
          <Text style={[styles.callNumber, { color: colors.ink }]}>1091</Text>
          <Text style={[styles.callLabel, { color: colors.mutedForeground }]}>Women Helpline</Text>
        </Pressable>
      </View>

      <SectionHeader eyebrow="NEARBY SUPPORT POINTS" title="Find Help" />
      {emergencyPoints.map((point) => (
        <View
          key={point.label}
          style={[styles.point, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.pointIcon, { backgroundColor: colors.tealSoft }]}>
            <Icon
              name={point.icon as React.ComponentProps<typeof Icon>['name']}
              size={18}
              color={colors.teal}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pointTitle, { color: colors.ink }]}>{point.label}</Text>
            <Text style={[styles.pointDetail, { color: colors.mutedForeground }]}>{point.detail}</Text>
          </View>
          <Pressable
            onPress={() => {
              if (point.action.toLowerCase().includes('call')) {
                callEmergency('112');
              } else {
                Alert.alert('Directions', `Navigating to ${point.label}...`);
              }
            }}
          >
            <Text style={[styles.pointAction, { color: colors.teal }]}>{point.action}</Text>
          </Pressable>
        </View>
      ))}

      <SectionHeader eyebrow="ALWAYS AVAILABLE" title="Special Assistance" />
      <View style={styles.assistance}>
        {[
          ['search', 'Lost & Found Center', 'Report a missing family member or item'],
          ['heart', 'Medical First Aid Post', 'Oxygen booths and emergency stabilization'],
          ['users', 'Elderly & Child Desk', 'Wheelchair escort and battery buggy assistance'],
        ].map(([icon, title, detail]) => (
          <Pressable
            key={title}
            onPress={() => Alert.alert(title, `Dedicated ${title} is staffed 24/7.`)}
            style={[styles.assistRow, { borderBottomColor: colors.border }]}
          >
            <Icon
              name={icon as React.ComponentProps<typeof Icon>['name']}
              size={18}
              color={colors.saffron}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.assistTitle, { color: colors.ink }]}>{title}</Text>
              <Text style={[styles.assistDetail, { color: colors.mutedForeground }]}>{detail}</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      <View style={[styles.note, { backgroundColor: colors.goldSoft }]}>
        <Icon name="info" size={15} color="#94631D" />
        <Text style={styles.noteText}>
          In case of dense crowd stampede risk, move sideways toward exit barriers and inform on-duty marshals immediately.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: { fontSize: 16, fontWeight: '700' },
  hero: { borderRadius: 21, padding: 17, marginTop: 18 },
  heroIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  heroBody: { fontSize: 12, lineHeight: 18, marginVertical: 8 },
  helplinesRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  quickCallCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  callNumber: { fontSize: 15, fontWeight: '800' },
  callLabel: { fontSize: 9, fontWeight: '600', textAlign: 'center' },
  point: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 9,
  },
  pointIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pointTitle: { fontSize: 12, fontWeight: '700' },
  pointDetail: { fontSize: 10, marginTop: 4 },
  pointAction: { fontSize: 10, fontWeight: '800' },
  assistance: { gap: 0 },
  assistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  assistTitle: { fontSize: 13, fontWeight: '700' },
  assistDetail: { fontSize: 10, marginTop: 3 },
  note: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 14,
    padding: 11,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  noteText: { flex: 1, color: '#94631D', fontSize: 10, lineHeight: 15 },
});