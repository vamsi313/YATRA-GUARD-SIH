import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon, Screen, styles as ui } from '@/components/YatraUI';
import { destinations, getDestinationTransport, TransportRouteOption } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { useYatra } from '@/context/YatraContext';

export default function TransportScreen() {
  const colors = useColors();
  const { selectedDestination } = useYatra();

  const [activeDestId, setActiveDestId] = useState<string>(
    selectedDestination?.id || 'tirumala'
  );
  const [tab, setTab] = useState<'local' | 'return'>('local');

  const currentDest = destinations.find((d) => d.id === activeDestId) || destinations[0];
  const transportData = getDestinationTransport(activeDestId);

  const options = tab === 'local' ? transportData.localOptions : transportData.returnOptions;

  const getTypeIcon = (type: TransportRouteOption['type']): React.ComponentProps<typeof Icon>['name'] => {
    switch (type) {
      case 'auto': return 'navigation';
      case 'taxi': return 'car';
      case 'bus': return 'truck';
      case 'shuttle': return 'compass';
      case 'train': return 'disc';
      case 'flight': return 'send';
      case 'walk': return 'user';
      default: return 'navigation';
    }
  };

  const getCongestionColor = (congestion: TransportRouteOption['congestion']) => {
    switch (congestion) {
      case 'LOW': return colors.teal;
      case 'MODERATE': return colors.gold;
      case 'HIGH': return colors.saffron;
    }
  };

  const [showPicker, setShowPicker] = useState(false);

  return (
    <Screen>
      {/* Top Navigation Row */}
      <View style={ui.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.ink }]}>Transport & Travel Hub</Text>
          <Text style={[styles.subTitle, { color: colors.mutedForeground }]}>
            Local transit & return journeys for {currentDest.name}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: colors.saffronSoft }]}>
          <Icon name="navigation" size={14} color={colors.saffron} />
        </View>
      </View>

      {/* Destination Scope Banner */}
      <View style={[styles.scopePill, { backgroundColor: colors.saffronSoft, borderColor: colors.saffron }]}>
        <Icon name="map-pin" size={14} color={colors.saffron} />
        <Text style={[styles.scopeText, { color: colors.ink }]}>
          Showing <Text style={{ fontWeight: '800' }}>{currentDest.name}</Text> transport only
        </Text>
        <Pressable
          onPress={() => setShowPicker(!showPicker)}
          style={[styles.switchBtn, { borderColor: colors.saffron }]}
        >
          <Icon name={showPicker ? 'chevron-up' : 'refresh-cw'} size={12} color={colors.saffron} />
          <Text style={[styles.switchBtnText, { color: colors.saffron }]}>
            {showPicker ? 'Hide' : 'Switch'}
          </Text>
        </Pressable>
      </View>

      {/* Expandable Destination Picker */}
      {showPicker && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destPicker}>
          {destinations.map((d) => {
            const isActive = d.id === activeDestId;
            return (
              <Pressable
                key={d.id}
                onPress={() => {
                  setActiveDestId(d.id);
                  setShowPicker(false);
                }}
                style={[
                  styles.destTab,
                  {
                    backgroundColor: isActive ? colors.saffron : colors.card,
                    borderColor: isActive ? colors.saffron : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.destTabText,
                    { color: isActive ? '#FFFFFF' : colors.ink },
                  ]}
                >
                  {d.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Tab Switcher: Local vs Return */}
      <View style={[styles.tabSegment, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={() => setTab('local')}
          style={[
            styles.segmentBtn,
            tab === 'local' && { backgroundColor: colors.saffron, borderRadius: 12 },
          ]}
        >
          <Icon name="car" size={15} color={tab === 'local' ? '#FFFFFF' : colors.mutedForeground} />
          <Text
            style={[
              styles.segmentText,
              { color: tab === 'local' ? '#FFFFFF' : colors.mutedForeground },
            ]}
          >
            Local Transport (Autos/Cabs/Buses)
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('return')}
          style={[
            styles.segmentBtn,
            tab === 'return' && { backgroundColor: colors.saffron, borderRadius: 12 },
          ]}
        >
          <Icon name="send" size={15} color={tab === 'return' ? '#FFFFFF' : colors.mutedForeground} />
          <Text
            style={[
              styles.segmentText,
              { color: tab === 'return' ? '#FFFFFF' : colors.mutedForeground },
            ]}
          >
            Return Travel (Train/Flight/Bus)
          </Text>
        </Pressable>
      </View>

      {/* Overview Card */}
      <View style={[styles.infoBanner, { backgroundColor: colors.saffronSoft }]}>
        <Icon name="info" size={16} color={colors.saffron} />
        <Text style={[styles.infoText, { color: colors.ink }]}>
          {tab === 'local'
            ? `Showing regulated local transport, autos, taxis, and free shuttles around ${currentDest.name}.`
            : `Showing return connectivity from ${currentDest.name} via Railway, Airport & State Express Buses.`}
        </Text>
      </View>

      {/* Transport Cards List */}
      <View style={styles.list}>
        {options.map((opt) => {
          const congColor = getCongestionColor(opt.congestion);
          return (
            <View
              key={opt.id}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
                  <Icon name={getTypeIcon(opt.type)} size={18} color={colors.saffron} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.optTitle, { color: colors.ink }]}>{opt.title}</Text>
                    {opt.isRecommended && (
                      <View style={[styles.recBadge, { backgroundColor: colors.tealSoft }]}>
                        <Text style={[styles.recText, { color: colors.teal }]}>RECOMMENDED</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.routeName, { color: colors.mutedForeground }]}>
                    {opt.routeName}
                  </Text>
                </View>
              </View>

              {/* Details Grid */}
              <View style={[styles.detailsGrid, { backgroundColor: colors.surface }]}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Time / Duration</Text>
                  <Text style={[styles.detailVal, { color: colors.ink }]}>{opt.travelTime}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Approx Fare</Text>
                  <Text style={[styles.detailVal, { color: colors.saffron }]}>{opt.approxCost}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Availability / Freq</Text>
                  <Text style={[styles.detailVal, { color: colors.ink }]}>{opt.frequencyOrAvailability}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>Live Traffic</Text>
                  <View style={styles.trafficRow}>
                    <View style={[styles.trafficDot, { backgroundColor: congColor }]} />
                    <Text style={[styles.detailVal, { color: congColor }]}>{opt.congestion}</Text>
                  </View>
                </View>
              </View>

              {/* Note */}
              <Text style={[styles.notesText, { color: colors.inkSoft }]}>
                💡 {opt.notes}
              </Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backBtn: { paddingRight: 10 },
  title: { fontSize: 18, fontWeight: '800' },
  subTitle: { fontSize: 11, marginTop: 2 },
  scopePill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, marginTop: 14, marginBottom: 6 },
  scopeText: { flex: 1, fontSize: 12, fontWeight: '600' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  switchBtnText: { fontSize: 10, fontWeight: '700' },
  destPicker: { flexDirection: 'row', marginTop: 6, marginBottom: 10 },
  destTab: { borderRadius: 12, paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, marginRight: 8 },
  destTabText: { fontSize: 12, fontWeight: '700' },
  tabSegment: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, padding: 4, marginVertical: 8 },
  segmentBtn: { flex: 1, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  segmentText: { fontSize: 11, fontWeight: '700' },
  infoBanner: { borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  infoText: { fontSize: 11, fontWeight: '600', flex: 1, lineHeight: 16 },
  list: { gap: 12, marginTop: 6, paddingBottom: 24 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14 },
  cardHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  iconBox: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  optTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  recBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  recText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.5 },
  routeName: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  detailsGrid: { borderRadius: 12, padding: 10, marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },
  detailItem: { width: '50%' },
  detailLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  detailVal: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  trafficRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trafficDot: { width: 6, height: 6, borderRadius: 3 },
  notesText: { fontSize: 11, fontStyle: 'italic', marginTop: 10, lineHeight: 16 },
});
