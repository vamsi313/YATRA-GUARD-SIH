import React, { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { CrowdBadge, Icon, PrimaryButton, Screen, SectionHeader } from '../components/YatraUI';
import { useYatra } from '../context/YatraContext';
import { useColors } from '../hooks/useColors';
import { getCrowdLevel, getOccupancy, getPlace, getRisk } from '../data/mockData';

export default function FamilyHubScreen() {
  const colors = useColors();
  const {
    selectedDestination,
    activeFamilyGroup,
    inviteFamilyMember,
    removeFamilyMember,
    setGroupMeetingPoint,
    triggerGroupSOS,
    placesList,
  } = useYatra();

  const destName = selectedDestination?.name ?? 'Tirumala';
  const group = activeFamilyGroup;

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRel, setInviteRel] = useState('Family');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [newMeetingName, setNewMeetingName] = useState(group?.meetingPoint?.name ?? '');

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Group Safety Alert Check
  const atRiskMembers = group?.members.filter((m) => {
    const place = placesList.find((p) => p.id === m.currentPlaceId);
    if (!place) return false;
    const risk = getRisk(place);
    return risk === 'HIGH' || risk === 'CRITICAL' || m.status === 'CRITICAL' || m.status === 'SOS';
  }) ?? [];

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Email Required', 'Please enter an email address to send invitation.');
      return;
    }
    inviteFamilyMember(inviteEmail, inviteName, inviteRel);
    setInviteEmail('');
    setInviteName('');
    setShowInviteModal(false);
    Alert.alert('Invitation Sent & Accepted', `Connected with ${inviteEmail}! Their live location is now visible on your group map.`);
  };

  const handleSaveMeetingPoint = () => {
    if (!newMeetingName.trim()) return;
    const firstPlace = placesList[0];
    setGroupMeetingPoint(
      newMeetingName,
      firstPlace.id,
      firstPlace.latitude,
      firstPlace.longitude,
      'Meeting point set by Group Organizer'
    );
    setShowMeetingModal(false);
    Alert.alert('Meeting Point Set', `Group meeting point updated to: ${newMeetingName}`);
  };

  const handleTriggerSOS = () => {
    triggerGroupSOS(`${group?.members[0]?.currentPlaceName || destName}`, 'Group Emergency SOS triggered');
    Alert.alert('🚨 GROUP SOS BROADCASTED', 'All connected family members have been alerted with your location.');
  };

  // Map Embed URL centered on destination / meeting point
  const mapCenterLat = group?.meetingPoint?.latitude ?? selectedDestination?.latitude ?? 13.6833;
  const mapCenterLng = group?.meetingPoint?.longitude ?? selectedDestination?.longitude ?? 79.3472;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapCenterLat},${mapCenterLng}&z=14&output=embed`;

  return (
    <Screen>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Icon name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerEyebrow, { color: colors.saffron }]}>PILGRIM SAFETY NETWORK</Text>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Family & Friends Hub</Text>
        </View>
        <View style={[styles.destBadge, { backgroundColor: colors.tealSoft }]}>
          <Icon name="map-pin" size={11} color={colors.teal} />
          <Text style={[styles.destBadgeText, { color: colors.teal }]}>{destName.toUpperCase()}</Text>
        </View>
      </View>

      {/* Main Group Summary Card */}
      <View style={[styles.groupBannerCard, { backgroundColor: colors.ink }]}>
        <View style={styles.groupBannerTop}>
          <View style={[styles.groupIconWrap, { backgroundColor: colors.saffron }]}>
            <Icon name="users" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.groupBannerEyebrow}>CONNECTED TRAVEL GROUP</Text>
            <Text style={styles.groupBannerTitle}>{group?.groupName || 'Pilgrimage Group'}</Text>
            <Text style={styles.groupBannerSub}>
              {group?.members.length} members connected in {destName}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowInviteModal(true)}
            style={[styles.inviteSmallBtn, { backgroundColor: colors.saffron }]}
          >
            <Icon name="user-plus" size={13} color="#FFFFFF" />
            <Text style={styles.inviteSmallText}>+ Invite</Text>
          </Pressable>
        </View>
      </View>

      {/* ⚠️ GROUP SAFETY ALERT BANNER (If any member in HIGH/CRITICAL zone) */}
      {atRiskMembers.length > 0 && (
        <View style={[styles.riskBannerCard, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}>
          <View style={styles.riskBannerHead}>
            <Icon name="alert-triangle" size={20} color={colors.danger} />
            <Text style={[styles.riskBannerTitle, { color: colors.danger }]}>⚠️ FAMILY SAFETY ALERT</Text>
          </View>
          {atRiskMembers.map((m) => {
            const mPlace = placesList.find((p) => p.id === m.currentPlaceId);
            const mOcc = mPlace ? getOccupancy(mPlace) : 100;
            const saferAlt = mPlace?.saferAlternativeId ? getPlace(mPlace.saferAlternativeId) : null;
            return (
              <View key={m.id} style={styles.riskMemberItem}>
                <Text style={[styles.riskMemberText, { color: colors.ink }]}>
                  <Text style={{ fontWeight: '800' }}>{m.name}</Text> is currently near a HIGH-RISK crowd zone:
                  {'\n'}📍 {m.currentPlaceName} ({mOcc}% Occupancy)
                </Text>
                <View style={styles.riskActionRow}>
                  <Pressable
                    onPress={() => {
                      if (mPlace) router.push({ pathname: '/place-map', params: { id: mPlace.id } });
                    }}
                    style={[styles.riskActionBtn, { backgroundColor: colors.danger }]}
                  >
                    <Icon name="map-pin" size={12} color="#FFFFFF" />
                    <Text style={styles.riskActionText}>View Location</Text>
                  </Pressable>
                  {saferAlt && (
                    <Pressable
                      onPress={() => router.push({ pathname: '/place-map', params: { id: saferAlt.id } })}
                      style={[styles.riskActionBtn, { backgroundColor: colors.ink }]}
                    >
                      <Icon name="shield" size={12} color={colors.saffron} />
                      <Text style={styles.riskActionText}>Suggest {saferAlt.name.split(' ')[0]}</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Group SOS Alert Bar */}
      {group?.sosEvents && group.sosEvents.length > 0 && (
        <View style={[styles.sosCard, { backgroundColor: colors.danger }]}>
          <View style={styles.sosHead}>
            <Icon name="bell" size={20} color="#FFFFFF" />
            <Text style={styles.sosTitle}>🚨 ACTIVE GROUP SOS ALERT</Text>
          </View>
          <Text style={styles.sosBody}>
            {group.sosEvents[0].memberName} triggered emergency SOS at {group.sosEvents[0].locationName}!
          </Text>
          <Text style={styles.sosTime}>Triggered {group.sosEvents[0].time} · Status: ACTIVE</Text>
        </View>
      )}

      {/* SHARED GROUP LOCATION MAP SECTION */}
      <SectionHeader
        eyebrow="SHARED GROUP LOCATION MAP"
        title={`Live member map (${destName})`}
      />

      <View style={[styles.mapContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {Platform.OS === 'web' ? (
          <iframe
            title="Group Location Map"
            src={mapEmbedUrl}
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: 18 }}
            loading="lazy"
          />
        ) : (
          <View style={styles.mobileMapBox}>
            <Icon name="users" size={30} color={colors.saffron} />
            <Text style={[styles.mapMainText, { color: colors.ink }]}>
              {group?.members.length} Members Pinpointed in {destName}
            </Text>
          </View>
        )}

        {/* Member Location Pins List */}
        <View style={styles.mapOverlayPins}>
          {group?.members.map((m) => (
            <View key={m.id} style={[styles.pinChip, { backgroundColor: m.avatarColor }]}>
              <Text style={styles.pinChipText}>{m.name.split(' ')[0]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* GROUP MEETING POINT SECTION */}
      <View style={[styles.meetingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.meetingTop}>
          <View style={[styles.meetingIconWrap, { backgroundColor: colors.goldSoft }]}>
            <Icon name="target" size={18} color="#94631D" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.meetingEyebrow, { color: colors.saffron }]}>GROUP MEETING POINT</Text>
            <Text style={[styles.meetingName, { color: colors.ink }]}>
              {group?.meetingPoint?.name || 'Not Set'}
            </Text>
            <Text style={[styles.meetingNotes, { color: colors.mutedForeground }]}>
              {group?.meetingPoint?.notes}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowMeetingModal(true)}
            style={[styles.setMeetingBtn, { borderColor: colors.border }]}
          >
            <Text style={[styles.setMeetingText, { color: colors.teal }]}>Set / Change</Text>
          </Pressable>
        </View>
      </View>

      {/* CONNECTED MEMBERS LIST */}
      <SectionHeader
        eyebrow="GROUP MEMBERS"
        title="Connected travellers"
        action="+ Invite email"
        onAction={() => setShowInviteModal(true)}
      />

      <View style={styles.membersList}>
        {group?.members.map((m) => {
          const mPlace = placesList.find((p) => p.id === m.currentPlaceId);
          const mOcc = mPlace ? getOccupancy(mPlace) : 25;
          const isAtRisk = mOcc > 80;

          return (
            <View
              key={m.id}
              style={[
                styles.memberCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isAtRisk ? colors.danger : colors.border,
                  borderWidth: isAtRisk ? 1.5 : 1,
                },
              ]}
            >
              <View style={[styles.avatarCircle, { backgroundColor: m.avatarColor }]}>
                <Text style={styles.avatarText}>{m.name.substring(0, 2).toUpperCase()}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.memberHead}>
                  <Text style={[styles.memberName, { color: colors.ink }]}>{m.name}</Text>
                  <View style={[styles.roleTag, { backgroundColor: colors.tealSoft }]}>
                    <Text style={[styles.roleTagText, { color: colors.teal }]}>{m.relationship}</Text>
                  </View>
                </View>

                <Text style={[styles.memberLoc, { color: colors.inkSoft }]}>
                  📍 {m.currentPlaceName}
                </Text>

                <View style={styles.memberMeta}>
                  <Text style={[styles.memberBattery, { color: colors.mutedForeground }]}>
                    🔋 {m.battery}% · Updated {m.lastUpdated}
                  </Text>
                  {mPlace && (
                    <Text style={[styles.memberOcc, { color: isAtRisk ? colors.danger : colors.teal }]}>
                      {mOcc}% Crowd Occupancy
                    </Text>
                  )}
                </View>
              </View>

              {!m.isCurrentUser && (
                <Pressable
                  onPress={() => removeFamilyMember(m.id)}
                  style={styles.removeBtn}
                  hitSlop={10}
                >
                  <Icon name="x" size={16} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* SHARED GROUP ITINERARY */}
      <SectionHeader
        eyebrow="SHARED ITINERARY"
        title={`Group schedule in ${destName}`}
      />

      <View style={styles.itineraryList}>
        {[
          { time: '5:30 AM', title: `${destName} Primary Temple Darshan`, placeId: 'venkateswara', note: 'Group entrance slot · Gate 1' },
          { time: '10:00 AM', title: 'Rest & Shared Annadanam Lunch', placeId: 'silathoranam', note: 'Tranquil garden spot after morning darshan' },
          { time: '3:00 PM', title: 'Secondary Shrine & Waterfall Heritage Trail', placeId: 'kapila', note: 'Calmer family walking rhythm' },
        ].map((item, idx) => {
          const itemPlace = placesList.find((p) => p.id === item.placeId);
          const itemOcc = itemPlace ? getOccupancy(itemPlace) : 30;
          const itemLevel = getCrowdLevel(itemOcc);

          return (
            <View
              key={idx}
              style={[styles.itineraryCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.itinTimeBadge}>
                <Text style={styles.itinTimeText}>{item.time}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itinTitle, { color: colors.ink }]}>{item.title}</Text>
                <Text style={[styles.itinNote, { color: colors.mutedForeground }]}>{item.note}</Text>
                <View style={styles.itinBottom}>
                  <CrowdBadge level={itemLevel} compact />
                  <Text style={[styles.itinOcc, { color: colors.inkSoft }]}>{itemOcc}% Occupancy</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* GROUP EMERGENCY SOS TRIGGER ACTION */}
      <View style={styles.sosTriggerWrap}>
        <Pressable onPress={handleTriggerSOS} style={[styles.sosTriggerBtn, { backgroundColor: colors.danger }]}>
          <Icon name="alert-circle" size={20} color="#FFFFFF" />
          <Text style={styles.sosTriggerText}>TRIGGER GROUP SOS EMERGENCY</Text>
        </Pressable>
        <Text style={[styles.sosDisclaimer, { color: colors.mutedForeground }]}>
          Alerts all connected family members instantly with your live location.
        </Text>
      </View>

      {/* MODAL: INVITE MEMBER */}
      {showInviteModal && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHead}>
              <Text style={[styles.modalTitle, { color: colors.ink }]}>Invite Family or Friend</Text>
              <Pressable onPress={() => setShowInviteModal(false)}>
                <Icon name="x" size={20} color={colors.ink} />
              </Pressable>
            </View>

            <Text style={[styles.inputLabel, { color: colors.inkSoft }]}>Member Name (Optional)</Text>
            <TextInput
              value={inviteName}
              onChangeText={setInviteName}
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.textInput, { color: colors.ink, borderColor: colors.border }]}
            />

            <Text style={[styles.inputLabel, { color: colors.inkSoft }]}>Email Address *</Text>
            <TextInput
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder="e.g. rahul@gmail.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.textInput, { color: colors.ink, borderColor: colors.border }]}
            />

            <Text style={[styles.inputLabel, { color: colors.inkSoft }]}>Relationship / Tag</Text>
            <View style={styles.tagOptionRow}>
              {['Family', 'Spouse', 'Parent', 'Child', 'Friend'].map((rel) => (
                <Pressable
                  key={rel}
                  onPress={() => setInviteRel(rel)}
                  style={[
                    styles.tagOptionPill,
                    {
                      backgroundColor: inviteRel === rel ? colors.saffron : colors.background,
                      borderColor: inviteRel === rel ? colors.saffron : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.tagOptionText, { color: inviteRel === rel ? '#FFFFFF' : colors.ink }]}>
                    {rel}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <PrimaryButton
                label="Send Invite & Connect"
                icon="user-check"
                onPress={handleSendInvite}
                style={{ backgroundColor: colors.saffron }}
              />
            </View>
          </View>
        </View>
      )}

      {/* MODAL: SET MEETING POINT */}
      {showMeetingModal && (
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHead}>
              <Text style={[styles.modalTitle, { color: colors.ink }]}>Set Group Meeting Point</Text>
              <Pressable onPress={() => setShowMeetingModal(false)}>
                <Icon name="x" size={20} color={colors.ink} />
              </Pressable>
            </View>

            <Text style={[styles.inputLabel, { color: colors.inkSoft }]}>Meeting Spot Name</Text>
            <TextInput
              value={newMeetingName}
              onChangeText={setNewMeetingName}
              placeholder="e.g. Annadanam Hall Gate 2 / Main Clock Tower"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.textInput, { color: colors.ink, borderColor: colors.border }]}
            />

            <View style={styles.modalBtnRow}>
              <PrimaryButton
                label="Save Meeting Point"
                icon="check"
                onPress={handleSaveMeetingPoint}
                style={{ backgroundColor: colors.teal }}
              />
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  iconBtn: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  destBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  destBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  groupBannerCard: { borderRadius: 20, padding: 16, marginBottom: 14 },
  groupBannerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  groupBannerEyebrow: { color: '#FF9F1C', fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  groupBannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 2 },
  groupBannerSub: { color: '#BBD1D0', fontSize: 11, marginTop: 2 },
  inviteSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10 },
  inviteSmallText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  riskBannerCard: { borderRadius: 16, borderWidth: 1.5, padding: 14, marginBottom: 14, gap: 10 },
  riskBannerHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  riskBannerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8 },
  riskMemberItem: { gap: 8 },
  riskMemberText: { fontSize: 12, lineHeight: 18 },
  riskActionRow: { flexDirection: 'row', gap: 8 },
  riskActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  riskActionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  sosCard: { borderRadius: 16, padding: 14, marginBottom: 14, gap: 4 },
  sosHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sosTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  sosBody: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  sosTime: { color: '#FFEBEB', fontSize: 10, fontStyle: 'italic', marginTop: 4 },
  mapContainer: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', position: 'relative', marginBottom: 14 },
  mobileMapBox: { height: 210, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 },
  mapMainText: { fontSize: 13, fontWeight: '700' },
  mapOverlayPins: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pinChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pinChipText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  meetingCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 16 },
  meetingTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  meetingIconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  meetingEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  meetingName: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  meetingNotes: { fontSize: 11, marginTop: 3 },
  setMeetingBtn: { borderWidth: 1, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8 },
  setMeetingText: { fontSize: 10, fontWeight: '800' },
  membersList: { gap: 9, marginBottom: 20 },
  memberCard: { borderRadius: 16, padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatarCircle: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  memberHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  memberName: { fontSize: 14, fontWeight: '800' },
  roleTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  roleTagText: { fontSize: 8, fontWeight: '800' },
  memberLoc: { fontSize: 11, fontWeight: '600', marginTop: 3 },
  memberMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  memberBattery: { fontSize: 10 },
  memberOcc: { fontSize: 10, fontWeight: '800' },
  removeBtn: { padding: 4 },
  itineraryList: { gap: 10, marginBottom: 20 },
  itineraryCard: { borderRadius: 16, borderWidth: 1, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  itinTimeBadge: { backgroundColor: '#111827', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  itinTimeText: { color: '#FF9F1C', fontSize: 10, fontWeight: '800' },
  itinTitle: { fontSize: 13, fontWeight: '800' },
  itinNote: { fontSize: 11, marginTop: 2 },
  itinBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  itinOcc: { fontSize: 10, fontWeight: '700' },
  sosTriggerWrap: { alignItems: 'center', marginBottom: 30 },
  sosTriggerBtn: { width: '100%', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  sosTriggerText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  sosDisclaimer: { fontSize: 10, marginTop: 8 },
  modalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 99999, justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '100%', borderRadius: 20, borderWidth: 1, padding: 18, gap: 12 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '800' },
  inputLabel: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  textInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  tagOptionRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagOptionPill: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  tagOptionText: { fontSize: 11, fontWeight: '700' },
  modalBtnRow: { marginTop: 10 },
});
