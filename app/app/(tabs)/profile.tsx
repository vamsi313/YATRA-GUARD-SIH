import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, Icon, PrimaryButton, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { useYatra } from '@/context/YatraContext';
import { useColors } from '@/hooks/useColors';
import { getDestinationPlaces } from '@/data/mockData';

const preferenceOptions = [
  'Family',
  'Senior citizens',
  'Children',
  'Photography',
  'Religious',
  'Nature',
  'Food',
  'Budget',
  'Accessibility',
] as const;

export default function ProfileScreen() {
  const colors = useColors();
  const { user, signOut, favorites, preferences, togglePreference, selectedDestination } = useYatra();

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        await signOut();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'YG').toUpperCase();
  };

  return (
    <Screen>
      <View style={ui.headerRow}>
        <View>
          <Text style={[styles.kicker, { color: colors.saffron }]}>YOUR ACCOUNT</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Profile</Text>
        </View>
        <Avatar label={user ? getInitials(user.name) : 'YG'} />
      </View>

      {user ? (
        <View style={[styles.profileCard, { backgroundColor: colors.ink }]}>
          <View style={styles.profileTop}>
            <View style={[styles.bigAvatar, { backgroundColor: colors.saffron }]}>
              <Text style={styles.bigAvatarText}>{getInitials(user.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileSub}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.profileStats}>
            <View>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Saved places</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{preferences.length}</Text>
              <Text style={styles.statLabel}>Preferences</Text>
            </View>
            <View>
              <Text style={styles.statValue}>Connected</Text>
              <Text style={styles.statLabel}>Neon DB</Text>
            </View>
          </View>
          {selectedDestination && (
            <Pressable
              onPress={() => router.push('/destination-picker')}
              style={styles.destRow}
            >
              <View style={styles.destRowLeft}>
                <View style={[styles.destDot, { backgroundColor: colors.teal }]} />
                <View>
                  <Text style={styles.destRowLabel}>CURRENT YATRA</Text>
                  <Text style={styles.destRowName}>{selectedDestination.name}</Text>
                  <Text style={styles.destRowSub}>{selectedDestination.region} · {getDestinationPlaces(selectedDestination.id).length} places</Text>
                </View>
              </View>
              <View style={styles.changePill}>
                <Icon name="refresh-cw" size={12} color="#fff" />
                <Text style={styles.changePillText}>Change</Text>
              </View>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={[styles.loginPromptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.loginIcon, { backgroundColor: colors.saffronSoft }]}>
            <Icon name="user" size={24} color={colors.saffron} />
          </View>
          <Text style={[styles.loginPromptTitle, { color: colors.ink }]}>Sign In to YatraGuard</Text>
          <Text style={[styles.loginPromptSub, { color: colors.mutedForeground }]}>
            Sign in with your email and password to sync your pilgrimage bookmarks and preferences.
          </Text>
          <PrimaryButton
            label="Sign In / Create Account"
            icon="arrow-up-right"
            onPress={() => router.push('/auth')}
            style={{ backgroundColor: colors.saffron, marginTop: 12 }}
          />
        </View>
      )}

      <SectionHeader
        eyebrow="YOUR DAY"
        title={selectedDestination ? `${selectedDestination.name}, today` : 'Your yatra today'}
        action="View plan"
        onAction={() => router.push('/planner')}
      />
      <View style={[styles.dayCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {!selectedDestination ? (
          <Pressable
            onPress={() => router.push('/destination-picker')}
            style={[styles.noDest, { backgroundColor: colors.saffronSoft }]}
          >
            <Icon name="map-pin" size={18} color={colors.saffron} />
            <Text style={[styles.noDestText, { color: colors.saffron }]}>Choose your pilgrimage destination</Text>
            <Icon name="chevron-right" size={15} color={colors.saffron} />
          </Pressable>
        ) : (
          <>
            <View style={styles.dayLine}>
              <View style={[styles.dayDot, { backgroundColor: colors.danger }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>CURRENT CROWD</Text>
                <Text style={[styles.dayValue, { color: colors.ink }]}>Active monitoring · {selectedDestination.name}</Text>
              </View>
              <Icon name="alert-triangle" size={17} color={colors.danger} />
            </View>
            <View style={styles.dayLine}>
              <View style={[styles.dayDot, { backgroundColor: colors.teal }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>DESTINATION STATUS</Text>
                <Text style={[styles.dayValue, { color: colors.ink }]}>{selectedDestination.weather} · {selectedDestination.weatherDetail}</Text>
              </View>
              <Text style={[styles.lowerCrowd, { color: colors.teal }]}>{selectedDestination.recommendedCount} picks</Text>
            </View>
          </>
        )}
        <PrimaryButton
          label="Open my itinerary"
          icon="arrow-up-right"
          onPress={() => router.push('/planner')}
          variant="secondary"
        />
      </View>

      <SectionHeader eyebrow="PERSONALIZE" title="What matters to you?" />
      <View style={styles.preferences}>
        {preferenceOptions.map((preference) => {
          const active = preferences.includes(preference);
          return (
            <Pressable
              key={preference}
              onPress={() => togglePreference(preference)}
              style={[
                styles.preference,
                {
                  backgroundColor: active ? colors.tealSoft : colors.card,
                  borderColor: active ? colors.teal : colors.border,
                },
              ]}
            >
              <Icon
                name={active ? 'check' : 'plus'}
                size={14}
                color={active ? colors.teal : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.preferenceText,
                  { color: active ? colors.teal : colors.inkSoft },
                ]}
              >
                {preference}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader eyebrow="QUICK ACCESS" title="Help & information" />
      {[
        ['alert-circle', 'Alerts & advisories', 'See current crowd and weather notices', '/alerts'],
        ['shield', 'Emergency nearby', 'Help desks, medical assistance and water', '/emergency'],
        ['home', 'Lodges & Annadanam', 'Dharamshalas and free food spots', '/lodges'],
      ].map(([icon, title, detail, path]) => (
        <Pressable
          key={title}
          onPress={() => router.push(path as never)}
          style={[styles.menuRow, { borderBottomColor: colors.border }]}
        >
          <View style={[styles.menuIcon, { backgroundColor: colors.saffronSoft }]}>
            <Icon
              name={icon as React.ComponentProps<typeof Icon>['name']}
              size={17}
              color={colors.saffron}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.menuTitle, { color: colors.ink }]}>{title}</Text>
            <Text style={[styles.menuDetail, { color: colors.mutedForeground }]}>{detail}</Text>
          </View>
          <Icon name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>
      ))}

      {user ? (
        <Pressable onPress={handleSignOut} style={styles.logoutBtn}>
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  destRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 13 },
  destRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  destDot: { width: 9, height: 9, borderRadius: 5 },
  destRowLabel: { color: '#BBD1D0', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  destRowName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 2 },
  destRowSub: { color: '#BBD1D0', fontSize: 10, marginTop: 2 },
  changePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 5 },
  changePillText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  noDest: { flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: 13, padding: 14, marginBottom: 12 },
  noDestText: { flex: 1, fontSize: 13, fontWeight: '600' },
  kicker: { fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -1, marginTop: 4 },
  profileCard: { borderRadius: 22, padding: 17, marginTop: 18 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bigAvatar: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  bigAvatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  profileName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  profileSub: { color: '#BBD1D0', fontSize: 11, marginTop: 4 },
  profileStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  statValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#BBD1D0', fontSize: 10, marginTop: 3 },
  loginPromptCard: { borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 18, alignItems: 'center' },
  loginIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  loginPromptTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  loginPromptSub: { fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 5, paddingHorizontal: 10 },
  dayCard: { borderWidth: 1, borderRadius: 18, padding: 14 },
  dayLine: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 14 },
  dayDot: { width: 8, height: 8, borderRadius: 4 },
  dayLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  dayValue: { fontSize: 14, fontWeight: '700', marginTop: 3 },
  lowerCrowd: { fontSize: 13, fontWeight: '800' },
  preferences: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preference: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  preferenceText: { fontSize: 11, fontWeight: '600' },
  menuRow: {
    borderBottomWidth: 1,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  menuIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 13, fontWeight: '700' },
  menuDetail: { fontSize: 10, marginTop: 3 },
  logoutBtn: { alignItems: 'center', paddingVertical: 18, marginTop: 10 },
  logoutText: { fontSize: 13, fontWeight: '700' },
});