import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/YatraUI';
import { useYatra, EmergencyEvent, TransportCondition } from '../../context/YatraContext';
import { destinations, getOccupancy, getCrowdLevel, AlertSeverity } from '../../data/mockData';

export default function AuthorityDashboard() {
  const {
    user,
    selectedDestination,
    setDestination,
    placesList,
    activeAlerts,
    emergencyEvents,
    transportConditions,
    forecastSurges,
    updatePlaceOccupancy,
    togglePlaceRestricted,
    issueAuthorityAlert,
    resolveEmergencyEvent,
    createEmergencyEvent,
    updateTransportStatus,
    updateForecastSurge,
    signOut,
  } = useYatra();

  const destId = selectedDestination?.id ?? 'tirumala';
  const destName = selectedDestination?.name ?? 'Tirumala';

  // Destination filtered datasets
  const destinationPlaces = useMemo(
    () => placesList.filter((p) => p.destinationId === destId),
    [placesList, destId]
  );

  const destinationAlerts = useMemo(
    () => activeAlerts.filter((a) => a.destinationId === destId),
    [activeAlerts, destId]
  );

  const destinationSOS = useMemo(
    () => emergencyEvents.filter((e) => e.destinationId === destId),
    [emergencyEvents, destId]
  );

  const destinationTransport = useMemo(
    () => transportConditions.filter((t) => t.destinationId === destId),
    [transportConditions, destId]
  );

  const currentForecast = useMemo(
    () => forecastSurges[destId] ?? [80, 95, 110, 125, 115],
    [forecastSurges, destId]
  );

  // Overall calculations
  const totalMonitored = destinationPlaces.length;
  const totalCapacity = destinationPlaces.reduce((acc, p) => acc + p.crowd.capacity, 0);
  const totalCurrent = destinationPlaces.reduce((acc, p) => acc + p.crowd.current, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalCurrent / totalCapacity) * 100) : 85;
  const avgWait = destinationPlaces.length > 0 ? Math.round(destinationPlaces.reduce((acc, p) => acc + p.crowd.waitingMinutes, 0) / destinationPlaces.length) : 45;
  
  // Simulated operational dynamics
  const entryRatePerHour = Math.round(totalCurrent * 0.28);
  const exitRatePerHour = Math.round(totalCurrent * 0.21);
  const flowImbalance = entryRatePerHour - exitRatePerHour;
  const crowdGrowthRate = flowImbalance > 0 ? `+${Math.round((flowImbalance / (totalCapacity || 1)) * 100)}%/hr` : '-2%/hr';

  // Risk Score (0-100)
  const riskScore = Math.min(100, Math.round(overallOccupancy * 0.6 + (destinationSOS.filter(s => s.status === 'ACTIVE').length * 12) + (flowImbalance > 0 ? 15 : 0)));
  const riskLevel = riskScore >= 80 ? 'CRITICAL / ACTION REQ' : riskScore >= 60 ? 'HIGH SURGE' : riskScore >= 40 ? 'MODERATE' : 'OPTIMAL';

  // Modals & form state
  const [modalType, setModalType] = useState<'ALERT' | 'OCCUPANCY' | 'SOS' | 'FORECAST' | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [newOccupancyVal, setNewOccupancyVal] = useState<string>('120');
  
  // Alert form
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('CRITICAL');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertBody, setAlertBody] = useState('');

  // SOS Form
  const [sosLocation, setSosLocation] = useState('');
  const [sosType, setSosType] = useState<EmergencyEvent['type']>('STAMPEDE_RISK');
  const [sosDetails, setSosDetails] = useState('');

  // Forecast override
  const [customSurgeNow, setCustomSurgeNow] = useState(String(currentForecast[0] || 85));
  const [customSurge30, setCustomSurge30] = useState(String(currentForecast[1] || 98));
  const [customSurge1h, setCustomSurge1h] = useState(String(currentForecast[2] || 115));
  const [customSurge2h, setCustomSurge2h] = useState(String(currentForecast[3] || 130));

  const handleIssueAlert = () => {
    if (!alertTitle.trim() || !alertBody.trim()) {
      if (Platform.OS === 'web') window.alert('Please fill in title and description.');
      return;
    }
    issueAuthorityAlert(destId, alertSeverity, alertTitle, alertBody);
    setAlertTitle('');
    setAlertBody('');
    setModalType(null);
    if (Platform.OS === 'web') window.alert('Operational Safety Alert Broadcasted to all pilgrims!');
  };

  const handleUpdateOccupancy = () => {
    const val = parseInt(newOccupancyVal, 10);
    if (isNaN(val) || val < 0) return;
    updatePlaceOccupancy(selectedPlaceId, val);
    setModalType(null);
  };

  const handleCreateSOS = () => {
    if (!sosLocation.trim() || !sosDetails.trim()) return;
    createEmergencyEvent({
      destinationId: destId,
      location: sosLocation,
      type: sosType,
      status: 'ACTIVE',
      details: sosDetails,
    });
    setSosLocation('');
    setSosDetails('');
    setModalType(null);
  };

  const handleSaveForecast = () => {
    const arr = [
      parseInt(customSurgeNow, 10) || 80,
      parseInt(customSurge30, 10) || 95,
      parseInt(customSurge1h, 10) || 110,
      parseInt(customSurge2h, 10) || 125,
      115,
    ];
    updateForecastSurge(destId, arr);
    setModalType(null);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Top Authority Command Header */}
      <View style={styles.topBar}>
        <View style={styles.badgeRow}>
          <View style={styles.authBadge}>
            <Icon name="shield" size={14} color="#FF6B6B" />
            <Text style={styles.authBadgeText}>COMMAND & CONTROL</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.livePulse} />
            <Text style={styles.liveLabel}>SYSTEM ONLINE · 100%</Text>
          </View>
        </View>

        <View style={styles.officerRow}>
          <View>
            <Text style={styles.officerTitle}>YatraGuard Authority Ops</Text>
            <Text style={styles.officerName}>
              Logged in: {user?.name || 'Chief Safety Officer'}
            </Text>
          </View>
          <Pressable onPress={() => signOut()} style={styles.exitBtn}>
            <Icon name="log-out" size={15} color="#fff" />
            <Text style={styles.exitBtnText}>Logout</Text>
          </Pressable>
        </View>

        {/* Destination Command Switcher */}
        <Text style={styles.switcherLabel}>MONITORED SECTOR / PILGRIMAGE ZONE:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destScroll}>
          {destinations.map((d) => {
            const active = d.id === destId;
            return (
              <Pressable
                key={d.id}
                onPress={() => setDestination(d.id)}
                style={[styles.destTab, active && styles.destTabActive]}
              >
                <Text style={[styles.destTabText, active && styles.destTabTextActive]}>
                  {d.name.toUpperCase()}
                </Text>
                {active && <View style={styles.activeDot} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* Risk & Telemetry Banner */}
        <View style={[styles.riskBanner, riskScore >= 75 ? styles.riskCrit : styles.riskWarn]}>
          <View style={styles.riskHeader}>
            <View>
              <Text style={styles.riskEyebrow}>REAL-TIME SECTOR THREAT INDEX</Text>
              <Text style={styles.riskScoreText}>{riskScore}/100 · {riskLevel}</Text>
            </View>
            <View style={styles.riskIconWrap}>
              <Icon name="alert-triangle" size={24} color="#FFF" />
            </View>
          </View>
          <Text style={styles.riskDesc}>
            {flowImbalance > 0
              ? `Surge rate is positive (+${flowImbalance} pilgrims/hr net ingress). Bottlenecks forming at key queue complexes. Manual crowd throttling suggested.`
              : 'Flow balance is within normal dispersal velocity.'}
          </Text>
        </View>

        {/* Quick Tactical Action Bar */}
        <Text style={styles.sectionHeading}>RAPID INTERVENTION ACTIONS</Text>
        <View style={styles.actionGrid}>
          <Pressable
            onPress={() => setModalType('ALERT')}
            style={[styles.actionCard, { borderColor: '#E53935', backgroundColor: '#2C1B1B' }]}
          >
            <Icon name="volume-2" size={20} color="#FF5252" />
            <Text style={styles.actionCardTitle}>Broadcast Alert</Text>
            <Text style={styles.actionCardSub}>Send live advisory to pilgrims</Text>
          </Pressable>

          <Pressable
            onPress={() => setModalType('FORECAST')}
            style={[styles.actionCard, { borderColor: '#FFB300', backgroundColor: '#2B2516' }]}
          >
            <Icon name="trending-up" size={20} color="#FFD54F" />
            <Text style={styles.actionCardTitle}>Update Forecast</Text>
            <Text style={styles.actionCardSub}>Set surge predictions</Text>
          </Pressable>

          <Pressable
            onPress={() => setModalType('SOS')}
            style={[styles.actionCard, { borderColor: '#00E676', backgroundColor: '#14271E' }]}
          >
            <Icon name="plus-circle" size={20} color="#69F0AE" />
            <Text style={styles.actionCardTitle}>Log Incident / SOS</Text>
            <Text style={styles.actionCardSub}>Deploy first-responders</Text>
          </Pressable>
        </View>

        {/* Key Operational Metrics */}
        <Text style={styles.sectionHeading}>KEY OPERATIONAL TELEMETRY · {destName.toUpperCase()}</Text>
        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricNum}>{overallOccupancy}%</Text>
            <Text style={styles.metricLbl}>Overall Occupancy</Text>
            <Text style={styles.metricSub}>Cap: {totalCapacity.toLocaleString()}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricNum}>{crowdGrowthRate}</Text>
            <Text style={styles.metricLbl}>Growth Velocity</Text>
            <Text style={styles.metricSub}>Net: +{flowImbalance}/hr</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricNum}>{avgWait}m</Text>
            <Text style={styles.metricLbl}>Avg Wait Time</Text>
            <Text style={styles.metricSub}>{totalMonitored} Nodes</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricBoxSmall}>
            <Text style={styles.metricNumSmall}>{entryRatePerHour}/hr</Text>
            <Text style={styles.metricLbl}>Entry Velocity</Text>
          </View>
          <View style={styles.metricBoxSmall}>
            <Text style={styles.metricNumSmall}>{exitRatePerHour}/hr</Text>
            <Text style={styles.metricLbl}>Dispersal Velocity</Text>
          </View>
          <View style={styles.metricBoxSmall}>
            <Text style={[styles.metricNumSmall, { color: flowImbalance > 0 ? '#FF5252' : '#69F0AE' }]}>
              {flowImbalance > 0 ? `+${flowImbalance}` : flowImbalance}
            </Text>
            <Text style={styles.metricLbl}>Net Imbalance</Text>
          </View>
        </View>

        {/* UPCOMING CROWD / FORECAST MATRIX */}
        <View style={styles.panelCard}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>PREDICTIVE SURGE INTELLIGENCE</Text>
              <Text style={styles.panelTitle}>Upcoming Crowd Dynamics</Text>
            </View>
            <Pressable onPress={() => setModalType('FORECAST')} style={styles.editPill}>
              <Icon name="sliders" size={12} color="#4FC3F7" />
              <Text style={styles.editPillText}>Simulate Surge</Text>
            </Pressable>
          </View>

          <View style={styles.surgeRow}>
            {['NOW', '+30 MIN', '+1 HOUR', '+2 HOURS', '+3 HOURS'].map((timeLabel, idx) => {
              const val = currentForecast[idx] || 80;
              const isCrit = val >= 100;
              const isWarn = val >= 85 && val < 100;
              return (
                <View key={timeLabel} style={styles.surgeCol}>
                  <Text style={styles.surgeTime}>{timeLabel}</Text>
                  <View style={styles.surgeBarTrack}>
                    <View
                      style={[
                        styles.surgeBarFill,
                        {
                          height: `${Math.min(100, val / 1.3)}%`,
                          backgroundColor: isCrit ? '#FF1744' : isWarn ? '#FFAB00' : '#00E676',
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.surgeVal,
                      { color: isCrit ? '#FF5252' : isWarn ? '#FFD54F' : '#FFF' },
                    ]}
                  >
                    {val}%
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.surgeWarningBox}>
            <Icon name="zap" size={15} color="#FF9100" />
            <Text style={styles.surgeWarningText}>
              Surge detection: Ingress spikes expected in +1 hour. Implement pre-emptive gate holding.
            </Text>
          </View>
        </View>

        {/* MONITORED NODES & HOTSPOT CONTROLS */}
        <Text style={styles.sectionHeading}>MONITORED VENUES & OPERATIONAL OVERRIDES</Text>
        <Text style={styles.sectionSub}>
          Click "Adjust" on any shrine/gate to simulate real-time crowd change or "Restrict Entry" to close gates.
        </Text>

        <View style={styles.nodesList}>
          {destinationPlaces.map((place) => {
            const occ = getOccupancy(place);
            const isRestricted = place.tags.includes('entry-restricted');
            const level = getCrowdLevel(occ);
            return (
              <View key={place.id} style={[styles.nodeCard, isRestricted && styles.nodeCardRestricted]}>
                <View style={styles.nodeTop}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.nodeBadgeRow}>
                      <Text style={styles.nodeCategory}>{place.category.toUpperCase()}</Text>
                      {isRestricted && (
                        <View style={styles.restrictedBadge}>
                          <Text style={styles.restrictedBadgeText}>ENTRY RESTRICTED</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.nodeName}>{place.name}</Text>
                    <Text style={styles.nodeMetrics}>
                      Occupancy: <Text style={{ color: occ > 100 ? '#FF5252' : '#FFF', fontWeight: '800' }}>{occ}%</Text> ({place.crowd.current.toLocaleString()} / {place.crowd.capacity.toLocaleString()}) · Wait: {place.crowd.waitingMinutes}m
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: occ > 100 ? '#D50000' : occ > 80 ? '#FF6D00' : '#1B5E20' }]}>
                    <Text style={styles.statusBadgeText}>{level}</Text>
                  </View>
                </View>

                {/* Direct Control Buttons */}
                <View style={styles.nodeControls}>
                  <Pressable
                    onPress={() => {
                      setSelectedPlaceId(place.id);
                      setNewOccupancyVal(String(occ));
                      setModalType('OCCUPANCY');
                    }}
                    style={styles.nodeBtn}
                  >
                    <Icon name="edit-3" size={13} color="#90CAF9" />
                    <Text style={styles.nodeBtnText}>Set Occupancy %</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => togglePlaceRestricted(place.id)}
                    style={[styles.nodeBtn, isRestricted ? styles.nodeBtnActiveWarn : styles.nodeBtnWarn]}
                  >
                    <Icon name="lock" size={13} color={isRestricted ? '#00E676' : '#FFAB40'} />
                    <Text style={[styles.nodeBtnText, { color: isRestricted ? '#00E676' : '#FFAB40' }]}>
                      {isRestricted ? 'Re-open Entry' : 'Restrict Gate'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      updatePlaceOccupancy(place.id, 125);
                      issueAuthorityAlert(
                        destId,
                        'CRITICAL',
                        `${place.name} Capacity Overload`,
                        `${place.name} has crossed 125% occupancy. Pilgrims are being redirected to tranquil alternatives.`
                      );
                    }}
                    style={[styles.nodeBtn, { borderColor: '#E53935' }]}
                  >
                    <Icon name="alert-octagon" size={13} color="#FF5252" />
                    <Text style={[styles.nodeBtnText, { color: '#FF5252' }]}>Trigger Surge (125%)</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* ACTIVE SOS & EMERGENCY DISPATCH */}
        <View style={styles.panelCard}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>INCIDENT DISPATCH FEED</Text>
              <Text style={styles.panelTitle}>Active SOS & Distress Calls ({destinationSOS.length})</Text>
            </View>
            <Pressable onPress={() => setModalType('SOS')} style={styles.editPill}>
              <Icon name="plus" size={12} color="#4FC3F7" />
              <Text style={styles.editPillText}>Log Incident</Text>
            </Pressable>
          </View>

          {destinationSOS.map((ev) => (
            <View key={ev.id} style={styles.sosRow}>
              <View style={styles.sosLeft}>
                <View style={[styles.sosDot, { backgroundColor: ev.status === 'ACTIVE' ? '#FF1744' : ev.status === 'RESPONDING' ? '#FFAB00' : '#00E676' }]} />
                <View style={{ flex: 1 }}>
                  <View style={styles.sosBadgeLine}>
                    <Text style={styles.sosType}>{ev.type}</Text>
                    <Text style={styles.sosTime}>{ev.time}</Text>
                  </View>
                  <Text style={styles.sosLocation}>{ev.location}</Text>
                  <Text style={styles.sosDetails}>{ev.details}</Text>
                </View>
              </View>

              {ev.status !== 'RESOLVED' && (
                <Pressable
                  onPress={() => resolveEmergencyEvent(ev.id)}
                  style={styles.resolveBtn}
                >
                  <Icon name="check-circle" size={13} color="#00E676" />
                  <Text style={styles.resolveBtnText}>Mark Resolved</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* TRANSIT & LOGISTICS CONGESTION */}
        <View style={[styles.panelCard, { marginBottom: 40 }]}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>TRANSIT CORRIDORS</Text>
              <Text style={styles.panelTitle}>Access Roads & Shuttles</Text>
            </View>
          </View>

          {destinationTransport.map((tr) => (
            <View key={tr.id} style={styles.trRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.trName}>{tr.route}</Text>
                <Text style={styles.trSub}>
                  Congestion: {tr.congestionPercent}% · Avg delay: {tr.waitingMinutes}m
                </Text>
              </View>
              <View style={styles.trActionGroup}>
                <Pressable
                  onPress={() =>
                    updateTransportStatus(
                      tr.id,
                      tr.status === 'HEAVY_DELAY' ? 'SMOOTH' : 'HEAVY_DELAY',
                      tr.status === 'HEAVY_DELAY' ? 35 : 95
                    )
                  }
                  style={[styles.trStatusPill, { backgroundColor: tr.status === 'HEAVY_DELAY' ? '#D50000' : tr.status === 'CONGESTED' ? '#E65100' : '#1B5E20' }]}
                >
                  <Text style={styles.trStatusText}>{tr.status}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL 1: SET OCCUPANCY */}
      <Modal visible={modalType === 'OCCUPANCY'} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Override Venue Occupancy</Text>
            <Text style={styles.modalSub}>
              Simulate live sensor/turnstile crowd changes across pilgrim dashboards.
            </Text>

            <Text style={styles.inputLbl}>Target Occupancy (%)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={newOccupancyVal}
              onChangeText={setNewOccupancyVal}
              placeholder="e.g. 125"
              placeholderTextColor="#888"
            />

            <View style={styles.modalBtnRow}>
              <Pressable onPress={() => setModalType(null)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleUpdateOccupancy} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmText}>Apply Override</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: BROADCAST SAFETY ALERT */}
      <Modal visible={modalType === 'ALERT'} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Broadcast Emergency Advisory</Text>
            <Text style={styles.modalSub}>
              This will immediately reflect in the Pilgrim App header and safety banners for {destName}.
            </Text>

            <Text style={styles.inputLbl}>Severity Level</Text>
            <View style={styles.sevRow}>
              {(['INFO', 'WARNING', 'HIGH', 'CRITICAL'] as AlertSeverity[]).map((sev) => (
                <Pressable
                  key={sev}
                  onPress={() => setAlertSeverity(sev)}
                  style={[styles.sevBtn, alertSeverity === sev && styles.sevBtnActive]}
                >
                  <Text style={[styles.sevBtnText, alertSeverity === sev && styles.sevBtnTextActive]}>
                    {sev}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLbl}>Alert Title</Text>
            <TextInput
              style={styles.modalInput}
              value={alertTitle}
              onChangeText={setAlertTitle}
              placeholder="e.g. Gate 2 Overload - Diversion in Effect"
              placeholderTextColor="#888"
            />

            <Text style={styles.inputLbl}>Advisory Details</Text>
            <TextInput
              style={[styles.modalInput, { height: 75 }]}
              multiline
              value={alertBody}
              onChangeText={setAlertBody}
              placeholder="Detailed instructions for pilgrims..."
              placeholderTextColor="#888"
            />

            <View style={styles.modalBtnRow}>
              <Pressable onPress={() => setModalType(null)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleIssueAlert} style={[styles.modalConfirmBtn, { backgroundColor: '#E53935' }]}>
                <Text style={styles.modalConfirmText}>Transmit Alert</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: LOG INCIDENT / SOS */}
      <Modal visible={modalType === 'SOS'} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Incident / Emergency Event</Text>
            <Text style={styles.modalSub}>
              Deploy safety units and register live hotspot event in {destName}.
            </Text>

            <Text style={styles.inputLbl}>Incident Type</Text>
            <View style={styles.sevRow}>
              {(['STAMPEDE_RISK', 'MEDICAL', 'LOST_PERSON', 'DISTRESS'] as EmergencyEvent['type'][]).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setSosType(t)}
                  style={[styles.sevBtn, sosType === t && styles.sevBtnActive]}
                >
                  <Text style={[styles.sevBtnText, sosType === t && styles.sevBtnTextActive]}>
                    {t.replace('_', ' ')}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLbl}>Location</Text>
            <TextInput
              style={styles.modalInput}
              value={sosLocation}
              onChangeText={setSosLocation}
              placeholder="e.g. Compartment 12 Barrier"
              placeholderTextColor="#888"
            />

            <Text style={styles.inputLbl}>Incident Notes</Text>
            <TextInput
              style={[styles.modalInput, { height: 65 }]}
              multiline
              value={sosDetails}
              onChangeText={setSosDetails}
              placeholder="First responder instructions..."
              placeholderTextColor="#888"
            />

            <View style={styles.modalBtnRow}>
              <Pressable onPress={() => setModalType(null)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleCreateSOS} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmText}>Dispatch Event</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: SIMULATE SURGE FORECAST */}
      <Modal visible={modalType === 'FORECAST'} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Simulate Surge Predictions (%)</Text>
            <Text style={styles.modalSub}>
              Override forecasted occupancy for {destName} over the next 3 hours.
            </Text>

            <View style={styles.forecastInputGrid}>
              <View style={styles.forecastInputCol}>
                <Text style={styles.inputLbl}>NOW</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="number-pad"
                  value={customSurgeNow}
                  onChangeText={setCustomSurgeNow}
                />
              </View>
              <View style={styles.forecastInputCol}>
                <Text style={styles.inputLbl}>+30m</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="number-pad"
                  value={customSurge30}
                  onChangeText={setCustomSurge30}
                />
              </View>
              <View style={styles.forecastInputCol}>
                <Text style={styles.inputLbl}>+1h</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="number-pad"
                  value={customSurge1h}
                  onChangeText={setCustomSurge1h}
                />
              </View>
              <View style={styles.forecastInputCol}>
                <Text style={styles.inputLbl}>+2h</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="number-pad"
                  value={customSurge2h}
                  onChangeText={setCustomSurge2h}
                />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable onPress={() => setModalType(null)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleSaveForecast} style={styles.modalConfirmBtn}>
                <Text style={styles.modalConfirmText}>Update Prediction Model</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F19' },
  topBar: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#371B1D',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },
  authBadgeText: { color: '#F87171', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  livePulse: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  liveLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: '700' },
  officerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  officerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  officerName: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  exitBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  switcherLabel: { color: '#6B7280', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8 },
  destScroll: { flexDirection: 'row' },
  destTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  destTabActive: { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' },
  destTabText: { color: '#9CA3AF', fontSize: 12, fontWeight: '800' },
  destTabTextActive: { color: '#FFFFFF' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#60A5FA' },
  mainScroll: { paddingHorizontal: 16, paddingTop: 14 },
  riskBanner: { borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1 },
  riskCrit: { backgroundColor: '#450A0A', borderColor: '#DC2626' },
  riskWarn: { backgroundColor: '#422006', borderColor: '#D97706' },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  riskEyebrow: { color: '#FCA5A5', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  riskScoreText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 2 },
  riskIconWrap: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  riskDesc: { color: '#E5E7EB', fontSize: 11, lineHeight: 16, marginTop: 8 },
  sectionHeading: { color: '#E5E7EB', fontSize: 13, fontWeight: '800', letterSpacing: 0.8, marginTop: 14, marginBottom: 8 },
  sectionSub: { color: '#9CA3AF', fontSize: 11, marginBottom: 12 },
  actionGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  actionCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, justifyContent: 'space-between' },
  actionCardTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', marginTop: 8 },
  actionCardSub: { color: '#9CA3AF', fontSize: 9, marginTop: 2 },
  metricRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  metricBox: { flex: 1, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 12, padding: 12, alignItems: 'center' },
  metricNum: { color: '#60A5FA', fontSize: 20, fontWeight: '800' },
  metricLbl: { color: '#E5E7EB', fontSize: 10, fontWeight: '700', marginTop: 4 },
  metricSub: { color: '#6B7280', fontSize: 9, marginTop: 2 },
  metricBoxSmall: { flex: 1, backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 10, padding: 8, alignItems: 'center' },
  metricNumSmall: { color: '#E5E7EB', fontSize: 14, fontWeight: '800' },
  panelCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 14, padding: 14, marginTop: 14 },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  panelEyebrow: { color: '#9CA3AF', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  panelTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 2 },
  editPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1E293B', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  editPillText: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  surgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110, paddingVertical: 8 },
  surgeCol: { alignItems: 'center', flex: 1 },
  surgeTime: { color: '#9CA3AF', fontSize: 9, fontWeight: '700', marginBottom: 6 },
  surgeBarTrack: { height: 60, width: 14, backgroundColor: '#1F2937', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  surgeBarFill: { width: '100%', borderRadius: 4 },
  surgeVal: { fontSize: 11, fontWeight: '800', marginTop: 6 },
  surgeWarningBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#372714', borderRadius: 8, padding: 9, marginTop: 12 },
  surgeWarningText: { color: '#FDBA74', fontSize: 10, fontWeight: '600', flex: 1 },
  nodesList: { gap: 10 },
  nodeCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#1F2937', borderRadius: 14, padding: 13 },
  nodeCardRestricted: { borderColor: '#DC2626', backgroundColor: '#201010' },
  nodeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nodeBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  nodeCategory: { color: '#9CA3AF', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  restrictedBadge: { backgroundColor: '#7F1D1D', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  restrictedBadgeText: { color: '#FCA5A5', fontSize: 8, fontWeight: '800' },
  nodeName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  nodeMetrics: { color: '#9CA3AF', fontSize: 11, marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  nodeControls: { flexDirection: 'row', gap: 6, marginTop: 12, borderTopWidth: 1, borderTopColor: '#1F2937', paddingTop: 10, flexWrap: 'wrap' },
  nodeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1F2937', borderWidth: 1, borderColor: '#374151', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 6 },
  nodeBtnWarn: { borderColor: '#D97706' },
  nodeBtnActiveWarn: { borderColor: '#059669', backgroundColor: '#064E3B' },
  nodeBtnText: { color: '#E5E7EB', fontSize: 10, fontWeight: '700' },
  sosRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#1F2937', paddingVertical: 10 },
  sosLeft: { flexDirection: 'row', gap: 10, flex: 1 },
  sosDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  sosBadgeLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  sosType: { color: '#F87171', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  sosTime: { color: '#6B7280', fontSize: 9 },
  sosLocation: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  sosDetails: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#064E3B', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6 },
  resolveBtnText: { color: '#34D399', fontSize: 10, fontWeight: '700' },
  trRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1F2937', paddingVertical: 10 },
  trName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  trSub: { color: '#9CA3AF', fontSize: 10, marginTop: 2 },
  trActionGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trStatusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  trStatusText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#374151', borderRadius: 16, padding: 18, width: '100%', maxWidth: 440 },
  modalTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  modalSub: { color: '#9CA3AF', fontSize: 11, marginTop: 4, marginBottom: 14, lineHeight: 16 },
  inputLbl: { color: '#E5E7EB', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  modalInput: { backgroundColor: '#1F2937', borderWidth: 1, borderColor: '#374151', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: '#FFF', fontSize: 13, marginBottom: 12 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  modalCancelBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8, backgroundColor: '#1F2937' },
  modalCancelText: { color: '#9CA3AF', fontSize: 12, fontWeight: '700' },
  modalConfirmBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8, backgroundColor: '#2563EB' },
  modalConfirmText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  sevRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  sevBtn: { flex: 1, paddingVertical: 6, backgroundColor: '#1F2937', borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#374151' },
  sevBtnActive: { backgroundColor: '#B91C1C', borderColor: '#DC2626' },
  sevBtnText: { color: '#9CA3AF', fontSize: 9, fontWeight: '800' },
  sevBtnTextActive: { color: '#FFF' },
  forecastInputGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  forecastInputCol: { flex: 1 },
});
