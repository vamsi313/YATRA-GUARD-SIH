import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CrowdBadge, CrowdBar, Icon, MiniMetric, Screen, SectionHeader, styles as ui } from '@/components/YatraUI';
import { CROWD_EVENTS, CROWD_SOURCES, destinations, getCrowdLevel, getOccupancy, mockForecast } from '@/data/mockData';
import { useColors } from '@/hooks/useColors';
import { useYatra } from '@/context/YatraContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BackendCrowdData {
  meta: {
    status: string;
    dataType: string;
    dataSource: string;
    sourceAuthority: string;
    methodology: string;
    disclaimer: string;
    confidenceIndex: string;
    generatedAt: string;
  };
  destination: {
    id: string;
    name: string;
  };
  factors: {
    dayOfWeek: string;
    isWeekend: boolean;
    activeEvent: {
      id: string;
      name: string;
      type: string;
      description: string;
      multiplier: number;
    };
    availableEvents: Array<{
      id: string;
      name: string;
      type: string;
      estimatedVisitors: number;
    }>;
    currentHour: string;
    peakTimeWindow: string;
  };
  overview: {
    crowdLevel: string;
    overallOccupancyPercent: number;
    totalEstimatedDailyVisitors: number;
    currentActiveVisitors: number;
    darshanWaitHours: string;
    safestVisitWindow: string;
  };
  zones: Array<{
    zoneId: string;
    name: string;
    category: string;
    capacity: number;
    currentOccupancyPercent: number;
    estimatedPresentCount: number;
    estimatedWaitMinutes: number;
    waitFormatted: string;
    queueVelocity: string;
    status: string;
    recommendation: string;
  }>;
  hourlyForecast: Array<{
    hour: number;
    label: string;
    occupancyPercent: number;
    intensity: 'low' | 'moderate' | 'high' | 'critical';
  }>;
}

export default function CrowdScreen() {
  const colors = useColors();
  const { selectedDestination, placesList, forecastSurges } = useYatra();
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'forecast'>('map');
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [crowdData, setCrowdData] = useState<BackendCrowdData | null>(null);
  const [isLoadingCrowd, setIsLoadingCrowd] = useState(false);

  const destId = selectedDestination?.id ?? 'tirumala';
  const destName = selectedDestination?.name ?? 'Tirumala';

  // Available scenario events for this destination
  const eventsList = useMemo(() => {
    return CROWD_EVENTS[destId] || CROWD_EVENTS.tirumala;
  }, [destId]);

  const sourceMeta = useMemo(() => {
    return CROWD_SOURCES[destId] || CROWD_SOURCES.tirumala;
  }, [destId]);

  // Reset selected event when destination changes
  useEffect(() => {
    setSelectedEventId(null);
    setSelectedSpotId(null);
  }, [destId]);

  // Fetch dynamic crowd model from backend
  useEffect(() => {
    let isMounted = true;
    async function loadCrowdModel() {
      setIsLoadingCrowd(true);
      try {
        const domain = process.env.EXPO_PUBLIC_DOMAIN || 'localhost:5000';
        const protocol = domain.includes('localhost') ? 'http' : 'https';
        const query = selectedEventId ? `?destinationId=${destId}&eventId=${selectedEventId}` : `?destinationId=${destId}`;
        const url = `${protocol}://${domain}/api/crowd${query}`;

        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setCrowdData(json);
            setIsLoadingCrowd(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend crowd fetch fallback to local synthesis:', err);
      }

      // Offline / Local Simulation Fallback
      if (isMounted) {
        const currentEvt = eventsList.find(e => e.id === selectedEventId) || eventsList[0];
        const isWknd = [0, 5, 6].includes(new Date().getDay());
        const totalVis = Math.round(currentEvt.estimatedVisitors * (isWknd && currentEvt.type === 'standard' ? 1.4 : 1.0));
        const occ = Math.min(130, Math.round(currentEvt.multiplier * 42));

        setCrowdData({
          meta: {
            status: "Estimated",
            dataType: sourceMeta.dataType,
            dataSource: sourceMeta.sourceName,
            sourceAuthority: sourceMeta.sourceAuthority,
            methodology: "Historical intake rates & event multipliers",
            disclaimer: "Estimated crowd intelligence based on historical footfall models. Not live streaming sensor counts.",
            confidenceIndex: sourceMeta.confidence,
            generatedAt: new Date().toISOString(),
          },
          destination: { id: destId, name: destName },
          factors: {
            dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()],
            isWeekend: isWknd,
            activeEvent: {
              id: currentEvt.id,
              name: currentEvt.name,
              type: currentEvt.type,
              description: "Configured religious scenario",
              multiplier: currentEvt.multiplier,
            },
            availableEvents: eventsList,
            currentHour: `${new Date().getHours()}:00`,
            peakTimeWindow: "07:30 AM – 11:30 AM & 05:30 PM – 08:30 PM",
          },
          overview: {
            crowdLevel: occ > 100 ? "Extremely High" : occ > 80 ? "Very High" : occ > 60 ? "High" : "Moderate",
            overallOccupancyPercent: occ,
            totalEstimatedDailyVisitors: totalVis,
            currentActiveVisitors: Math.round(totalVis * 0.35),
            darshanWaitHours: `${Math.max(2, Math.round(occ / 15))} - ${Math.max(3, Math.round(occ / 12) + 1)} hrs`,
            safestVisitWindow: "01:30 PM – 04:00 PM",
          },
          zones: [
            {
              zoneId: `${destId}_sanctum`,
              name: "Main Sanctum Sanctorum",
              category: "sanctum",
              capacity: 3500,
              currentOccupancyPercent: Math.min(135, occ + 18),
              estimatedPresentCount: Math.round(3500 * (occ / 100)),
              estimatedWaitMinutes: Math.round(180 * currentEvt.multiplier),
              waitFormatted: `${Math.round(3 * currentEvt.multiplier)} hrs`,
              queueVelocity: occ > 80 ? "25 pilgrims/min" : "45 pilgrims/min",
              status: occ > 90 ? "High" : "Normal",
              recommendation: "Use slotted token entry.",
            },
            {
              zoneId: `${destId}_vqc`,
              name: "Central Queue Complex / Corridor",
              category: "queue_complex",
              capacity: 20000,
              currentOccupancyPercent: occ,
              estimatedPresentCount: Math.round(20000 * (occ / 100)),
              estimatedWaitMinutes: Math.round(240 * currentEvt.multiplier),
              waitFormatted: `${Math.round(4 * currentEvt.multiplier)} hrs`,
              queueVelocity: "35 pilgrims/min",
              status: occ > 100 ? "Critical Congestion" : "Elevated",
              recommendation: "Holding compartments active.",
            },
            {
              zoneId: `${destId}_plaza`,
              name: "Outer Temple Plaza & Mada Streets",
              category: "perimeter",
              capacity: 35000,
              currentOccupancyPercent: Math.max(30, occ - 25),
              estimatedPresentCount: Math.round(35000 * ((occ - 25) / 100)),
              estimatedWaitMinutes: 20,
              waitFormatted: "20 mins",
              queueVelocity: "60 pilgrims/min",
              status: "Normal",
              recommendation: "Direct access available.",
            },
          ],
          hourlyForecast: [
            { hour: 6, label: "6 AM", occupancyPercent: 55, intensity: "moderate" },
            { hour: 9, label: "9 AM", occupancyPercent: 82, intensity: "high" },
            { hour: 12, label: "12 PM", occupancyPercent: 60, intensity: "moderate" },
            { hour: 15, label: "3 PM", occupancyPercent: 45, intensity: "low" },
            { hour: 18, label: "6 PM", occupancyPercent: 90, intensity: "critical" },
            { hour: 21, label: "9 PM", occupancyPercent: 50, intensity: "moderate" },
          ],
        });
        setIsLoadingCrowd(false);
      }
    }

    loadCrowdModel();
    return () => { isMounted = false; };
  }, [destId, selectedEventId, eventsList, sourceMeta, destName]);

  const hotspots = useMemo(() => {
    return placesList.filter((p) => p.destinationId === destId).slice(0, 6);
  }, [destId, placesList]);

  const activeOccupancy = crowdData?.overview.overallOccupancyPercent ?? 78;
  const activeVisitors = crowdData?.overview.totalEstimatedDailyVisitors ?? 65000;
  const activeLevel = crowdData?.overview.crowdLevel ?? 'High';
  const waitHours = crowdData?.overview.darshanWaitHours ?? '3 - 5 hrs';

  // Grid coordinates mapping for cyber heat map simulation
  const mapHotspots = useMemo(() => {
    const coords = [
      { top: '38%', left: '42%', size: 140 },
      { top: '22%', left: '60%', size: 95 },
      { top: '62%', left: '26%', size: 85 },
      { top: '15%', left: '52%', size: 45 },
      { top: '68%', left: '18%', size: 50 },
      { top: '72%', left: '64%', size: 35 },
    ];

    if (crowdData?.zones && crowdData.zones.length > 0) {
      return crowdData.zones.map((zone, i) => {
        const occ = zone.currentOccupancyPercent;
        const sev = occ > 105 ? 'critical' : occ > 75 ? 'high' : 'moderate';
        return {
          id: zone.zoneId,
          name: zone.name,
          category: zone.category,
          occ,
          sev,
          wait: zone.waitFormatted,
          velocity: zone.queueVelocity,
          status: zone.status,
          recommendation: zone.recommendation,
          pos: coords[i % coords.length],
        };
      });
    }

    return hotspots.map((spot, i) => {
      const occ = getOccupancy(spot);
      const sev = occ > 100 ? 'critical' : occ > 75 ? 'high' : 'moderate';
      return {
        id: spot.id,
        name: spot.name,
        category: spot.category,
        occ,
        sev,
        wait: `${Math.round(spot.crowd.waitingMinutes / 60)} hrs`,
        velocity: '35 pilgrims/min',
        status: spot.crowd.congestion,
        recommendation: 'Follow queue corridors',
        pos: coords[i % coords.length],
      };
    });
  }, [crowdData, hotspots]);

  const activeSpot = useMemo(() => {
    return mapHotspots.find(p => p.id === selectedSpotId) || mapHotspots[0];
  }, [mapHotspots, selectedSpotId]);

  return (
    <Screen>
      <View style={ui.headerRow}>
        <View>
          <Text style={[styles.kicker, { color: colors.saffron }]}>ESTIMATED INTELLIGENCE</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Crowd Analytics</Text>
        </View>
        <View style={styles.viewToggle}>
          <Pressable
            onPress={() => setActiveTab('map')}
            style={[styles.toggleBtn, activeTab === 'map' && styles.toggleBtnActive]}
          >
            <Icon name="map" size={13} color={activeTab === 'map' ? '#00F0FF' : '#6B7280'} />
            <Text style={[styles.toggleText, activeTab === 'map' && styles.toggleTextActive]}>Heat Map</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('list')}
            style={[styles.toggleBtn, activeTab === 'list' && styles.toggleBtnActive]}
          >
            <Icon name="list" size={13} color={activeTab === 'list' ? '#00F0FF' : '#6B7280'} />
            <Text style={[styles.toggleText, activeTab === 'list' && styles.toggleTextActive]}>Zones</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('forecast')}
            style={[styles.toggleBtn, activeTab === 'forecast' && styles.toggleBtnActive]}
          >
            <Icon name="clock" size={13} color={activeTab === 'forecast' ? '#00F0FF' : '#6B7280'} />
            <Text style={[styles.toggleText, activeTab === 'forecast' && styles.toggleTextActive]}>24h Curve</Text>
          </Pressable>
        </View>
      </View>

      {/* Destination Selector Pill */}
      <Pressable
        onPress={() => router.push('/destination-picker')}
        style={[styles.scopePill, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.livePulse} />
        <Text style={[styles.scopeText, { color: colors.ink }]}>
          ZONE: <Text style={{ fontWeight: '800', color: colors.saffron }}>{destName.toUpperCase()}</Text> · Estimated Model
        </Text>
        <Icon name="chevron-right" size={13} color={colors.mutedForeground} />
      </Pressable>

      {/* 🏛️ OFFICIAL REFERENCE DATA SOURCE ATTRIBUTION BANNER */}
      <View style={[styles.sourceCard, { backgroundColor: '#0B1528', borderColor: '#1E3A8A' }]}>
        <View style={styles.sourceTopRow}>
          <View style={styles.sourceTag}>
            <Icon name="shield" size={12} color="#60A5FA" />
            <Text style={styles.sourceTagText}>ESTIMATED MODEL · {crowdData?.meta.status || 'Active'}</Text>
          </View>
          <Text style={styles.confidenceText}>{crowdData?.meta.confidenceIndex || sourceMeta.confidence}</Text>
        </View>

        <View style={styles.sourceDetailsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sourceLabel}>Data Source:</Text>
            <Text style={styles.sourceValue} numberOfLines={1}>
              {crowdData?.meta.dataSource || sourceMeta.sourceName}
            </Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text style={styles.sourceLabel}>Data Type:</Text>
            <Text style={styles.sourceValue} numberOfLines={1}>
              {crowdData?.meta.dataType || sourceMeta.dataType}
            </Text>
          </View>
        </View>

        <Text style={styles.disclaimerText}>
          ℹ️ {crowdData?.meta.disclaimer || "Simulated crowd model based on historical footfall and religious calendars. Not live streaming sensor counts."}
        </Text>
      </View>

      {/* 🎭 SCENARIO & FESTIVAL EVENT SELECTOR */}
      <View style={styles.scenarioSection}>
        <View style={styles.scenarioHeader}>
          <Text style={[styles.scenarioTitle, { color: colors.ink }]}>Select Event / Surge Scenario:</Text>
          {isLoadingCrowd && <ActivityIndicator size="small" color="#00F0FF" />}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scenarioScroll}>
          {eventsList.map((evt) => {
            const isSelected = (selectedEventId === evt.id) || (!selectedEventId && crowdData?.factors.activeEvent.id === evt.id);
            return (
              <Pressable
                key={evt.id}
                onPress={() => setSelectedEventId(evt.id)}
                style={[
                  styles.scenarioChip,
                  isSelected && styles.scenarioChipSelected,
                ]}
              >
                <Text style={[styles.scenarioChipText, isSelected && styles.scenarioChipTextActive]}>
                  {evt.type === 'festival' ? '🪔 ' : evt.type === 'weekend' ? '📅 ' : '✨ '}
                  {evt.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 📊 DYNAMIC SUMMARY METRICS BAR */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.metricKicker, { color: colors.mutedForeground }]}>Estimated Visitors</Text>
          <Text style={[styles.metricValue, { color: colors.ink }]}>
            {activeVisitors.toLocaleString('en-IN')}
          </Text>
          <Text style={[styles.metricSub, { color: '#00F0FF' }]}>
            {crowdData?.factors.dayOfWeek || 'Today'} · {crowdData?.factors.isWeekend ? 'Weekend' : 'Weekday'}
          </Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.metricKicker, { color: colors.mutedForeground }]}>Crowd Density</Text>
          <Text style={[styles.metricValue, { color: activeOccupancy > 90 ? '#EF4444' : activeOccupancy > 70 ? '#F97316' : '#EAB308' }]}>
            {activeLevel} ({activeOccupancy}%)
          </Text>
          <Text style={[styles.metricSub, { color: colors.mutedForeground }]}>
            Avg Wait: {waitHours}
          </Text>
        </View>
      </View>

      {/* 🔴 TAB 1: FUTURISTIC DARK CROWD DENSITY MAP */}
      {activeTab === 'map' && (
        <View style={styles.cyberMapCard}>
          {/* Header Bar */}
          <View style={styles.cyberMapHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[styles.cyberPulseDot, { backgroundColor: activeOccupancy > 85 ? '#EF4444' : '#00F0FF' }]} />
              <Text style={styles.cyberMapTitle}>TACTICAL DENSITY RADAR · {destName.toUpperCase()}</Text>
            </View>
            <Text style={styles.cyberMapCoords}>
              PEAK: {crowdData?.factors.peakTimeWindow ? '10 AM - 2 PM' : '10:00 - 14:00'}
            </Text>
          </View>

          {/* Map Surface */}
          <View style={styles.radarContainer}>
            {/* Grid Pattern Background */}
            <View style={styles.gridOverlay}>
              <View style={styles.gridLineHorizontal} />
              <View style={[styles.gridLineHorizontal, { top: '33%' }]} />
              <View style={[styles.gridLineHorizontal, { top: '66%' }]} />
              <View style={styles.gridLineVertical} />
              <View style={[styles.gridLineVertical, { left: '33%' }]} />
              <View style={[styles.gridLineVertical, { left: '66%' }]} />
            </View>

            {/* Radar Sweep Arc Simulation */}
            <View style={styles.radarCenterTarget} />

            {/* Glowing Hotspots */}
            {mapHotspots.map((spot) => {
              const isSelected = activeSpot?.id === spot.id;
              const sevColor = spot.sev === 'critical' ? '#EF4444' : spot.sev === 'high' ? '#F97316' : '#EAB308';
              return (
                <Pressable
                  key={spot.id}
                  onPress={() => setSelectedSpotId(spot.id)}
                  style={[
                    styles.heatSpotWrapper,
                    {
                      top: spot.pos.top as any,
                      left: spot.pos.left as any,
                      width: spot.pos.size,
                      height: spot.pos.size,
                      transform: [{ translateX: -spot.pos.size / 2 }, { translateY: -spot.pos.size / 2 }],
                    }
                  ]}
                >
                  {/* Outer Glowing Radial Aura */}
                  <View
                    style={[
                      styles.heatSpotAura,
                      {
                        backgroundColor: sevColor,
                        opacity: spot.sev === 'critical' ? 0.35 : 0.22,
                        borderColor: sevColor,
                        borderWidth: isSelected ? 2 : 1,
                      }
                    ]}
                  />
                  {/* Inner Solid Nucleus */}
                  <View
                    style={[
                      styles.heatSpotNucleus,
                      {
                        backgroundColor: sevColor,
                        shadowColor: sevColor,
                      }
                    ]}
                  />
                  {/* Label Pill */}
                  <View style={[styles.heatSpotTag, isSelected && { borderColor: '#00F0FF', backgroundColor: '#030712' }]}>
                    <Text style={styles.heatSpotTagText} numberOfLines={1}>{spot.name}</Text>
                    <Text style={[styles.heatSpotTagOcc, { color: sevColor }]}>{spot.occ}%</Text>
                  </View>
                </Pressable>
              );
            })}

            {/* Radar Coordinates Overlay Bottom */}
            <View style={styles.radarLegendOverlay}>
              <View style={styles.radarLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Critical (&gt;100%)</Text>
              </View>
              <View style={styles.radarLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
                <Text style={styles.legendText}>High (75-100%)</Text>
              </View>
              <View style={styles.radarLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EAB308' }]} />
                <Text style={styles.legendText}>Moderate (&lt;75%)</Text>
              </View>
            </View>
          </View>

          {/* Active Spot Detail Banner */}
          {activeSpot && (
            <View style={styles.activeSpotBar}>
              <View style={{ flex: 1 }}>
                <Text style={styles.activeSpotName}>{activeSpot.name}</Text>
                <Text style={styles.activeSpotDetail}>
                  Wait Time: <Text style={{ color: '#00F0FF', fontWeight: '700' }}>{activeSpot.wait}</Text> · Flow: {activeSpot.velocity}
                </Text>
                <Text style={styles.activeSpotRec}>💡 {activeSpot.recommendation}</Text>
              </View>
              <View style={styles.activeSpotBadge}>
                <Text style={styles.activeSpotOccVal}>{activeSpot.occ}%</Text>
                <Text style={styles.activeSpotOccLbl}>OCCUPANCY</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* 📋 TAB 2: ZONE-BY-ZONE CONGESTION BREAKDOWN */}
      {activeTab === 'list' && (
        <View style={{ gap: 10 }}>
          <SectionHeader
            title="Zone Congestion Breakdown"
            action="Tap to Inspect"
            onAction={() => setActiveTab('map')}
          />
          {mapHotspots.map((zone) => {
            const isCrit = zone.occ > 100;
            return (
              <Pressable
                key={zone.id}
                onPress={() => {
                  setSelectedSpotId(zone.id);
                  setActiveTab('map');
                }}
                style={[
                  styles.zoneCard,
                  { backgroundColor: colors.card, borderColor: isCrit ? '#EF4444' : colors.border },
                ]}
              >
                <View style={styles.zoneCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.zoneName, { color: colors.ink }]}>{zone.name}</Text>
                    <Text style={[styles.zoneCat, { color: colors.mutedForeground }]}>
                      Category: {zone.category?.toUpperCase()} · Queue Flow: {zone.velocity}
                    </Text>
                  </View>
                  <View style={[styles.zoneStatusPill, { backgroundColor: isCrit ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)' }]}>
                    <Text style={[styles.zoneStatusText, { color: isCrit ? '#EF4444' : '#F97316' }]}>
                      {zone.status}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(100, zone.occ)}%`,
                        backgroundColor: isCrit ? '#EF4444' : zone.occ > 75 ? '#F97316' : '#10B981',
                      },
                    ]}
                  />
                </View>

                <View style={styles.zoneCardBottom}>
                  <Text style={[styles.zoneWaitText, { color: colors.ink }]}>
                    Est. Wait: <Text style={{ fontWeight: '800', color: colors.saffron }}>{zone.wait}</Text>
                  </Text>
                  <Text style={[styles.zoneOccText, { color: colors.mutedForeground }]}>
                    Occupancy: <Text style={{ fontWeight: '700', color: colors.ink }}>{zone.occ}%</Text>
                  </Text>
                </View>
                <Text style={styles.zoneCardRec}>💡 {zone.recommendation}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* ⏱️ TAB 3: 24-HOUR HOURLY PROJECTION */}
      {activeTab === 'forecast' && (
        <View style={[styles.forecastCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.forecastTitle, { color: colors.ink }]}>24-Hour Estimated Crowd Timeline</Text>
          <Text style={[styles.forecastSubtitle, { color: colors.mutedForeground }]}>
            Historical diurnal footfall curve for {destName} ({crowdData?.factors.dayOfWeek || 'Today'})
          </Text>

          <View style={styles.safestWindowBox}>
            <Icon name="check-circle" size={16} color="#10B981" />
            <Text style={styles.safestWindowText}>
              Safest Recommended Window: <Text style={{ fontWeight: '800', color: '#10B981' }}>{crowdData?.overview.safestVisitWindow || '01:30 PM – 04:00 PM'}</Text>
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyTimelineScroll}>
            {(crowdData?.hourlyForecast || []).map((slot, idx) => {
              const isPeak = slot.intensity === 'critical' || slot.intensity === 'high';
              return (
                <View key={idx} style={styles.hourCol}>
                  <Text style={[styles.hourPercent, { color: isPeak ? '#EF4444' : '#10B981' }]}>
                    {slot.occupancyPercent}%
                  </Text>
                  <View style={styles.hourBarTrack}>
                    <View
                      style={[
                        styles.hourBarFill,
                        {
                          height: `${Math.min(100, slot.occupancyPercent)}%`,
                          backgroundColor: slot.intensity === 'critical' ? '#EF4444' : slot.intensity === 'high' ? '#F97316' : '#10B981',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.hourLabel, { color: colors.mutedForeground }]}>{slot.label}</Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.forecastFooter}>
            <Text style={[styles.forecastFooterText, { color: colors.mutedForeground }]}>
              Peak Rush: <Text style={{ color: '#EF4444', fontWeight: '700' }}>{crowdData?.factors.peakTimeWindow || '07:30 AM – 11:30 AM & 05:30 PM – 08:30 PM'}</Text>
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Safety Tip */}
      <View style={[styles.safetyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Icon name="info" size={16} color={colors.saffron} />
        <Text style={[styles.safetyText, { color: colors.ink }]}>
          Early morning (before 07:00 AM) and post-noon (01:30 PM – 04:00 PM) consistently record 35-40% lower queue times.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 3,
    gap: 3,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: '#1F2937',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#00F0FF',
    fontWeight: '800',
  },
  scopePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  scopeText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  // 🏛️ Official Source Card
  sourceCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  sourceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 0.5,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  sourceDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: 'rgba(30, 58, 138, 0.6)',
  },
  sourceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  sourceValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 1,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },

  // 🎭 Scenario Chips
  scenarioSection: {
    marginBottom: 12,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scenarioTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  scenarioScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  scenarioChip: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  scenarioChipSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#00F0FF',
  },
  scenarioChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  scenarioChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // 📊 Metrics Bar
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricKicker: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // 🔴 Cyber Heat Map UI
  cyberMapCard: {
    backgroundColor: '#030712',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1F2937',
    overflow: 'hidden',
    marginBottom: 14,
  },
  cyberMapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B1120',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  cyberPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  cyberMapTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 0.8,
  },
  cyberMapCoords: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00F0FF',
    fontFamily: 'monospace',
  },
  radarContainer: {
    height: 280,
    position: 'relative',
    backgroundColor: '#020617',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
  },
  radarCenterTarget: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.25)',
    borderStyle: 'dashed',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  heatSpotWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatSpotAura: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
  heatSpotNucleus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  heatSpotTag: {
    position: 'absolute',
    bottom: -18,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heatSpotTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F1F5F9',
    maxWidth: 65,
  },
  heatSpotTagOcc: {
    fontSize: 9,
    fontWeight: '900',
  },
  radarLegendOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#334155',
  },
  radarLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 9,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  activeSpotBar: {
    backgroundColor: '#0F172A',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeSpotName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  activeSpotDetail: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  activeSpotRec: {
    fontSize: 10,
    color: '#38BDF8',
    marginTop: 4,
    fontWeight: '600',
  },
  activeSpotBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeSpotOccVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F59E0B',
  },
  activeSpotOccLbl: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  // 📋 Zone Cards
  zoneCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  zoneCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '800',
  },
  zoneCat: {
    fontSize: 11,
    marginTop: 2,
  },
  zoneStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoneStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  zoneCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  zoneWaitText: {
    fontSize: 12,
    fontWeight: '600',
  },
  zoneOccText: {
    fontSize: 12,
  },
  zoneCardRec: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 6,
  },

  // ⏱️ 24-hr Forecast
  forecastCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  forecastTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  forecastSubtitle: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  safestWindowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  safestWindowText: {
    fontSize: 11,
    color: '#D1FAE5',
  },
  hourlyTimelineScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 6,
  },
  hourCol: {
    alignItems: 'center',
    width: 44,
  },
  hourPercent: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  hourBarTrack: {
    width: 14,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  hourBarFill: {
    width: '100%',
    borderRadius: 7,
  },
  hourLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
  forecastFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  forecastFooterText: {
    fontSize: 11,
  },

  safetyCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  safetyText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
});