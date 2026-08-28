import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { PropsWithChildren } from 'react';
import { Image, ImageBackground, ImageStyle, Platform, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CrowdLevel, getCrowdLevel, getOccupancy, getRisk, imageAssets, Place } from '../data/mockData';
import { useColors } from '../hooks/useColors';

type IconName = React.ComponentProps<typeof Feather>['name'];

export function Screen({ children, scroll = true, style }: PropsWithChildren<{ scroll?: boolean; style?: StyleProp<ViewStyle> }>) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;
  const content = <View style={[styles.screenContent, { paddingTop: topInset + 18, paddingBottom: bottomInset + 110 }, style]}>{children}</View>;
  return <View style={[styles.screen, { backgroundColor: colors.background }]}>{scroll ? <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">{content}</ScrollView> : content}</View>;
}

export function Icon({ name, size = 20, color }: { name: IconName; size?: number; color?: string }) {
  const colors = useColors();
  return <Feather name={name} size={size} color={color ?? colors.ink} />;
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.brandRow}>
      <View style={[styles.brandMark, { backgroundColor: colors.saffron }]}>
        <Icon name="shield" size={compact ? 17 : 20} color={colors.primaryForeground} />
      </View>
      {!compact && <View><Text style={[styles.brandName, { color: colors.ink }]}>YatraGuard</Text><Text style={[styles.brandCaption, { color: colors.inkSoft }]}>TRAVEL SMARTER. STAY SAFER.</Text></View>}
    </View>
  );
}

export function SectionHeader({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHeader}><View>{eyebrow && <Text style={[styles.eyebrow, { color: colors.saffron }]}>{eyebrow}</Text>}<Text style={[styles.sectionTitle, { color: colors.ink }]}>{title}</Text></View>{action && <Pressable onPress={onAction} hitSlop={10}><Text style={[styles.actionText, { color: colors.teal }]}>{action}</Text></Pressable>}</View>;
}

export function CrowdBadge({ level, compact = false }: { level: CrowdLevel; compact?: boolean }) {
  const colors = useColors();
  const stylesByLevel: Record<CrowdLevel, { background: string; foreground: string }> = {
    LOW: { background: colors.tealSoft, foreground: colors.teal },
    MODERATE: { background: colors.goldSoft, foreground: '#94631D' },
    HIGH: { background: colors.accent, foreground: colors.accentForeground },
    'VERY HIGH': { background: '#FCE5CD', foreground: '#A6531B' },
    CRITICAL: { background: colors.dangerSoft, foreground: colors.danger },
    DANGEROUS: { background: '#EED9EA', foreground: '#7D2D69' },
  };
  const current = stylesByLevel[level];
  return <View style={[styles.badge, { backgroundColor: current.background }, compact && styles.badgeCompact]}><View style={[styles.badgeDot, { backgroundColor: current.foreground }]} /><Text style={[styles.badgeText, { color: current.foreground }]}>{level}</Text></View>;
}

export function CrowdBar({ occupancy, height = 8 }: { occupancy: number; height?: number }) {
  const colors = useColors();
  const level = getCrowdLevel(occupancy);
  const foreground = level === 'LOW' ? colors.teal : level === 'MODERATE' ? colors.gold : level === 'HIGH' ? colors.saffron : level === 'VERY HIGH' ? '#C96924' : level === 'CRITICAL' ? colors.danger : '#7D2D69';
  return <View style={[styles.crowdTrack, { height, backgroundColor: colors.muted }]}><View style={[styles.crowdFill, { width: `${Math.min(occupancy, 125) / 1.25}%`, backgroundColor: foreground }]} /></View>;
}

export function SearchBar({ placeholder = 'Search temples, places, hotels, food...', onPress, value }: { placeholder?: string; onPress?: () => void; value?: string }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}><Icon name="search" size={19} color={colors.inkSoft} /><Text numberOfLines={1} style={[styles.searchPlaceholder, { color: value ? colors.ink : colors.mutedForeground }]}>{value ?? placeholder}</Text><Icon name="sliders" size={17} color={colors.inkSoft} /></Pressable>;
}

export function DestinationCard({ destination, onPress }: { destination: { id: string; name: string; region: string; image: keyof typeof imageAssets; weather: string; recommendedCount: number }; onPress: () => void }) {
  const colors = useColors();
  const mainTemple = destination.id === 'tirumala' ? { occupancy: 120, level: 'CRITICAL' as CrowdLevel } : destination.id === 'varanasi' ? { occupancy: 93, level: 'VERY HIGH' as CrowdLevel } : destination.id === 'prayagraj' ? { occupancy: 106, level: 'CRITICAL' as CrowdLevel } : { occupancy: 64, level: 'HIGH' as CrowdLevel };
  return <Pressable testID={`destination-${destination.id}`} onPress={onPress} style={({ pressed }) => [styles.destinationCard, { backgroundColor: colors.card }, pressed && styles.pressed]}>
    <ImageBackground source={imageAssets[destination.image]} imageStyle={styles.destinationImage} style={styles.destinationImageWrap}>
      <LinearGradient colors={['rgba(16,42,67,0.05)', 'rgba(16,42,67,0.86)']} style={styles.destinationOverlay} />
      <View style={styles.destinationTop}><View style={styles.regionPill}><Text style={styles.regionText}>{destination.region}</Text></View><View style={styles.weatherPill}><Icon name="cloud" size={13} color="#FFFFFF" /><Text style={styles.weatherText}>{destination.weather}</Text></View></View>
      <View style={styles.destinationBottom}><Text style={styles.destinationName}>{destination.name}</Text><View style={styles.destinationMeta}><CrowdBadge level={mainTemple.level} compact /><Text style={styles.recommended}>{destination.recommendedCount} safer picks</Text></View></View>
    </ImageBackground>
    <View style={styles.cardFooter}><View><Text style={[styles.cardFooterLabel, { color: colors.mutedForeground }]}>CURRENT CROWD</Text><Text style={[styles.cardFooterValue, { color: colors.ink }]}>{mainTemple.occupancy}% occupancy</Text></View><View style={styles.footerStatus}><Icon name="shield" size={14} color={mainTemple.level === 'CRITICAL' ? colors.danger : colors.saffron} /><Text style={[styles.footerStatusText, { color: mainTemple.level === 'CRITICAL' ? colors.danger : colors.saffron }]}>{mainTemple.level === 'CRITICAL' ? 'CAUTION' : 'MONITOR'}</Text></View></View>
  </Pressable>;
}

export function PlaceRow({ place, onPress, showFavorite = true }: { place: Place; onPress: () => void; showFavorite?: boolean }) {
  const colors = useColors();
  const occupancy = getOccupancy(place);
  const level = getCrowdLevel(occupancy);
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.placeRow, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}>
    <View style={[styles.placeIcon, { backgroundColor: place.category.includes('Nature') ? colors.tealSoft : colors.accent }]}><Icon name={place.category.includes('Nature') ? 'compass' : 'map-pin'} size={19} color={place.category.includes('Nature') ? colors.teal : colors.saffron} /></View>
    <View style={styles.placeInfo}><Text style={[styles.placeName, { color: colors.ink }]} numberOfLines={1}>{place.name}</Text><Text style={[styles.placeSub, { color: colors.mutedForeground }]} numberOfLines={1}>{place.category} · {place.distance} · {place.duration}</Text><View style={styles.placeCrowd}><CrowdBadge level={level} compact /><Text style={[styles.placeWait, { color: colors.inkSoft }]}>{place.crowd.waitingMinutes} min wait</Text></View></View>
    {showFavorite && <Icon name="chevron-right" size={19} color={colors.mutedForeground} />}
  </Pressable>;
}

export function PrimaryButton({ label, icon, onPress, variant = 'primary', testID }: { label: string; icon?: IconName; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; testID?: string }) {
  const colors = useColors();
  const backgroundColor = variant === 'primary' ? colors.saffron : variant === 'secondary' ? colors.tealSoft : 'transparent';
  const foreground = variant === 'primary' ? colors.primaryForeground : variant === 'secondary' ? colors.teal : colors.teal;
  return <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor, borderColor: variant === 'ghost' ? colors.border : backgroundColor }, pressed && styles.pressed]}><Text style={[styles.primaryButtonText, { color: foreground }]}>{label}</Text>{icon && <Icon name={icon} size={17} color={foreground} />}</Pressable>;
}

export function MiniMetric({ label, value, icon, tone = 'teal' }: { label: string; value: string; icon: IconName; tone?: 'teal' | 'saffron' | 'danger' | 'blue' }) {
  const colors = useColors();
  const palette = tone === 'danger' ? { bg: colors.dangerSoft, fg: colors.danger } : tone === 'saffron' ? { bg: colors.saffronSoft, fg: colors.saffron } : tone === 'blue' ? { bg: colors.blueSoft, fg: colors.blue } : { bg: colors.tealSoft, fg: colors.teal };
  return <View style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: palette.bg }]}><Icon name={icon} size={15} color={palette.fg} /></View><Text style={[styles.metricValue, { color: colors.ink }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text></View>;
}

export function Avatar({ label = 'VG' }: { label?: string }) {
  const colors = useColors();
  return <View style={[styles.avatar, { backgroundColor: colors.ink }]}><Text style={styles.avatarText}>{label}</Text></View>;
}

export function ImageThumb({ source, style }: { source: keyof typeof imageAssets; style?: StyleProp<ImageStyle> }) {
  return <Image source={imageAssets[source]} style={[styles.thumb, style]} />;
}

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  screenContent: { paddingHorizontal: 20 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 18, fontWeight: '700', letterSpacing: -0.4 },
  brandCaption: { fontSize: 8, letterSpacing: 1.1, fontWeight: '700', marginTop: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 30, lineHeight: 35, fontWeight: '700', letterSpacing: -1, marginTop: 20 },
  subGreeting: { fontSize: 15, lineHeight: 22, marginTop: 5 },
  searchBar: { height: 52, borderRadius: 17, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 11, marginTop: 20 },
  searchPlaceholder: { fontSize: 13, flex: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 28, marginBottom: 13 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700', marginBottom: 4 },
  sectionTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  actionText: { fontSize: 13, fontWeight: '600', paddingBottom: 2 },
  destinationCard: { borderRadius: 22, overflow: 'hidden', marginBottom: 14, shadowColor: '#173B42', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  destinationImageWrap: { height: 192, justifyContent: 'space-between' },
  destinationImage: { resizeMode: 'cover' },
  destinationOverlay: { ...StyleSheet.absoluteFillObject },
  destinationTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 13 },
  regionPill: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 9, paddingVertical: 5, paddingHorizontal: 9 },
  regionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  weatherPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(16,42,67,0.45)', borderRadius: 9, paddingVertical: 5, paddingHorizontal: 9 },
  weatherText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  destinationBottom: { padding: 14 },
  destinationName: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', letterSpacing: -0.6 },
  destinationMeta: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 7 },
  badge: { borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 9, alignSelf: 'flex-start' },
  badgeCompact: { paddingVertical: 4, paddingHorizontal: 7 },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  recommended: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  cardFooter: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooterLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  cardFooterValue: { fontSize: 14, fontWeight: '600', marginTop: 3 },
  footerStatus: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerStatusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  placeRow: { borderRadius: 17, borderWidth: 1, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 10 },
  placeIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 14, fontWeight: '700' },
  placeSub: { fontSize: 11, marginTop: 3 },
  placeCrowd: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7 },
  placeWait: { fontSize: 10, fontWeight: '600' },
  primaryButton: { borderRadius: 15, minHeight: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1 },
  primaryButtonText: { fontSize: 13, fontWeight: '700' },
  metric: { flex: 1, minWidth: 85 },
  metricIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  metricValue: { fontSize: 16, fontWeight: '700' },
  metricLabel: { fontSize: 10, marginTop: 3 },
  crowdTrack: { width: '100%', borderRadius: 8, overflow: 'hidden' },
  crowdFill: { height: '100%', borderRadius: 8 },
  avatar: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  thumb: { width: 58, height: 58, borderRadius: 13 },
});