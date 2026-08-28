import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { destinations, Destination, places as initialPlaces, alerts as initialAlerts, AlertSeverity, Place, FamilyGroup, mockFamilyGroups, FamilyMember } from '@/data/mockData';
import Constants from 'expo-constants';

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
  }
  // Default to live Render cloud backend
  return 'https://yatraguard-api.onrender.com';
}

export type Preference =
  | 'Family'
  | 'Senior citizens'
  | 'Children'
  | 'Photography'
  | 'Religious'
  | 'Nature'
  | 'Food'
  | 'Budget'
  | 'Accessibility';

export type UserProfile = {
  id?: number;
  name: string;
  email: string;
  role?: 'pilgrim' | 'authority';
};

export type EmergencyEvent = {
  id: string;
  destinationId: string;
  location: string;
  type: 'MEDICAL' | 'STAMPEDE_RISK' | 'LOST_PERSON' | 'DISTRESS';
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED';
  time: string;
  details: string;
};

export type TransportCondition = {
  id: string;
  destinationId: string;
  route: string;
  status: 'SMOOTH' | 'MODERATE' | 'CONGESTED' | 'HEAVY_DELAY';
  congestionPercent: number;
  waitingMinutes: number;
};

type YatraContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  favorites: string[];
  preferences: Preference[];
  selectedDestination: Destination | null;
  placesList: Place[];
  activeAlerts: Array<{ id: string; severity: AlertSeverity; title: string; body: string; time: string; destinationId: string }>;
  emergencyEvents: EmergencyEvent[];
  transportConditions: TransportCondition[];
  forecastSurges: Record<string, number[]>;
  familyGroups: Record<string, FamilyGroup>;
  activeFamilyGroup: FamilyGroup | null;
  inviteFamilyMember: (email: string, name?: string, relationship?: string) => void;
  removeFamilyMember: (memberId: string) => void;
  setGroupMeetingPoint: (name: string, placeId: string, lat: number, lng: number, notes: string) => void;
  triggerGroupSOS: (locationName: string, details: string) => void;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  togglePreference: (preference: Preference) => void;
  isFavorite: (id: string) => boolean;
  setDestination: (destinationId: string) => Promise<void>;
  // Authority operational control actions
  updatePlaceOccupancy: (placeId: string, newOccupancyPercent: number) => void;
  updatePlaceCrowdData: (placeId: string, current: number, capacity: number, waitingMinutes: number, trend: number) => void;
  togglePlaceRestricted: (placeId: string) => void;
  issueAuthorityAlert: (destinationId: string, severity: AlertSeverity, title: string, body: string) => void;
  resolveEmergencyEvent: (eventId: string) => void;
  createEmergencyEvent: (event: Omit<EmergencyEvent, 'id' | 'time'>) => void;
  updateTransportStatus: (transportId: string, status: TransportCondition['status'], congestionPercent: number) => void;
  updateForecastSurge: (destinationId: string, forecastArray: number[]) => void;
};

const YatraContext = createContext<YatraContextValue | null>(null);
const USER_KEY = 'yatraguard-user';
const FAVORITES_KEY = 'yatraguard-favorites';
const PREFS_KEY = 'yatraguard-preferences';
const DESTINATION_KEY = 'yatraguard-destination';

const initialEmergencyEvents: EmergencyEvent[] = [
  { id: 'sos-1', destinationId: 'tirumala', location: 'Vaikuntam Queue Complex Compartment 14', type: 'STAMPEDE_RISK', status: 'ACTIVE', time: '4 min ago', details: 'Surge of 300+ pilgrims pushing toward gate 2. Barrier pressure high.' },
  { id: 'sos-2', destinationId: 'tirumala', location: 'Alipiri Footpath Milestone 350', type: 'MEDICAL', status: 'RESPONDING', time: '12 min ago', details: 'Senior citizen dehydrated with breathlessness. First responder en route.' },
  { id: 'sos-3', destinationId: 'varanasi', location: 'Dashashwamedh Ghat Lower Steps', type: 'STAMPEDE_RISK', status: 'ACTIVE', time: '8 min ago', details: 'High crowd density forming prior to Ganga Aarti. Boat jetty bottleneck.' },
  { id: 'sos-4', destinationId: 'varanasi', location: 'Kashi Vishwanath Gate 4 Entrance', type: 'LOST_PERSON', status: 'RESOLVED', time: '35 min ago', details: 'Child separated from family, re-united via Help Desk.' },
  { id: 'sos-5', destinationId: 'prayagraj', location: 'Triveni Sangam East Boat Jetty', type: 'DISTRESS', status: 'ACTIVE', time: '6 min ago', details: 'Boat passenger queue overflowing past safe barricades.' },
  { id: 'sos-6', destinationId: 'rameswaram', location: 'Ramanathaswamy North Corridor', type: 'MEDICAL', status: 'ACTIVE', time: '15 min ago', details: 'Pilgrim fainted in unventilated corner near the 22 theerthams.' },
];

const initialTransportConditions: TransportCondition[] = [
  { id: 'tr-1', destinationId: 'tirumala', route: 'Alipiri Ghat Road (Upward)', status: 'CONGESTED', congestionPercent: 88, waitingMinutes: 35 },
  { id: 'tr-2', destinationId: 'tirumala', route: 'Tirupati Bus Station Shuttle', status: 'HEAVY_DELAY', congestionPercent: 92, waitingMinutes: 45 },
  { id: 'tr-3', destinationId: 'tirumala', route: 'Srivari Mettu Footpath', status: 'SMOOTH', congestionPercent: 40, waitingMinutes: 5 },
  { id: 'tr-4', destinationId: 'varanasi', route: 'Godauliya - Dashashwamedh E-Rickshaw', status: 'HEAVY_DELAY', congestionPercent: 95, waitingMinutes: 50 },
  { id: 'tr-5', destinationId: 'varanasi', route: 'Cantt Railway Station Shuttle', status: 'MODERATE', congestionPercent: 65, waitingMinutes: 20 },
  { id: 'tr-6', destinationId: 'prayagraj', route: 'Sangam Approach VIP Corridor', status: 'CONGESTED', congestionPercent: 82, waitingMinutes: 30 },
  { id: 'tr-7', destinationId: 'rameswaram', route: 'Pamban Sea Bridge Highway', status: 'MODERATE', congestionPercent: 55, waitingMinutes: 15 },
];

export function YatraProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>(['Family', 'Religious']);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [placesList, setPlacesList] = useState<Place[]>(initialPlaces);
  const [activeAlerts, setActiveAlerts] = useState<Array<{ id: string; severity: AlertSeverity; title: string; body: string; time: string; destinationId: string }>>(initialAlerts);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>(initialEmergencyEvents);
  const [transportConditions, setTransportConditions] = useState<TransportCondition[]>(initialTransportConditions);
  const [forecastSurges, setForecastSurges] = useState<Record<string, number[]>>({
    tirumala: [82, 95, 112, 128, 118],
    varanasi: [78, 90, 105, 120, 110],
    prayagraj: [65, 80, 98, 115, 100],
    rameswaram: [60, 72, 85, 95, 88],
  });
  const [familyGroups, setFamilyGroups] = useState<Record<string, FamilyGroup>>(mockFamilyGroups);

  const destId = selectedDestination?.id ?? 'tirumala';
  const activeFamilyGroup = familyGroups[destId] ?? familyGroups.tirumala;

  const inviteFamilyMember = (email: string, name?: string, relationship?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;
    const derivedName = name?.trim() || cleanEmail.split('@')[0] || 'Family Member';
    const colors = ['#E07A5F', '#3D5A80', '#81B29A', '#F2CC8F', '#9B51E0', '#2F80ED'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember: FamilyMember = {
      id: `m-${Date.now()}`,
      name: derivedName,
      email: cleanEmail,
      relationship: relationship || 'Family',
      avatarColor: randomColor,
      currentPlaceId: activeFamilyGroup?.meetingPoint?.placeId || 'venkateswara',
      currentPlaceName: activeFamilyGroup?.meetingPoint?.name || 'Group Entrance',
      latitude: activeFamilyGroup?.meetingPoint?.latitude || 13.6833,
      longitude: activeFamilyGroup?.meetingPoint?.longitude || 79.3472,
      battery: 85,
      lastUpdated: 'Just now (Accepted)',
      status: 'SAFE',
    };

    setFamilyGroups((prev) => {
      const group = prev[destId] ?? prev.tirumala;
      return {
        ...prev,
        [destId]: {
          ...group,
          members: [...group.members, newMember],
        },
      };
    });
  };

  const removeFamilyMember = (memberId: string) => {
    setFamilyGroups((prev) => {
      const group = prev[destId] ?? prev.tirumala;
      return {
        ...prev,
        [destId]: {
          ...group,
          members: group.members.filter((m) => m.id !== memberId),
        },
      };
    });
  };

  const setGroupMeetingPoint = (name: string, placeId: string, lat: number, lng: number, notes: string) => {
    setFamilyGroups((prev) => {
      const group = prev[destId] ?? prev.tirumala;
      return {
        ...prev,
        [destId]: {
          ...group,
          meetingPoint: {
            name,
            placeId,
            latitude: lat,
            longitude: lng,
            notes,
          },
        },
      };
    });
  };

  const triggerGroupSOS = (locationName: string, details: string) => {
    const userName = user?.name || 'Devotee';
    const userEmail = user?.email || 'user@yatraguard.in';
    const newSos = {
      id: `gsos-${Date.now()}`,
      memberName: userName,
      memberEmail: userEmail,
      locationName,
      time: 'Just now',
      status: 'ACTIVE' as const,
      details,
    };

    setFamilyGroups((prev) => {
      const group = prev[destId] ?? prev.tirumala;
      return {
        ...prev,
        [destId]: {
          ...group,
          sosEvents: [newSos, ...group.sosEvents],
          members: group.members.map((m) =>
            m.isCurrentUser || m.email === userEmail ? { ...m, status: 'SOS' } : m
          ),
        },
      };
    });
  };

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(USER_KEY),
      AsyncStorage.getItem(FAVORITES_KEY),
      AsyncStorage.getItem(PREFS_KEY),
      AsyncStorage.getItem(DESTINATION_KEY),
    ]).then(([storedUser, storedFavorites, storedPrefs, storedDestination]) => {
      if (storedUser) setUser(JSON.parse(storedUser) as UserProfile);
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites) as string[]);
      if (storedPrefs) setPreferences(JSON.parse(storedPrefs) as Preference[]);
      if (storedDestination) {
        const dest = destinations.find((d) => d.id === storedDestination);
        if (dest) setSelectedDestination(dest);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      // Check for Admin signup attempt
      if (cleanEmail === 'admin' || cleanEmail === 'admin@yatraguard.gov.in') {
        const adminUser: UserProfile = { name: 'Authority Command Admin', email: 'admin@yatraguard.gov.in', role: 'authority' };
        setUser(adminUser);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(adminUser));
        return { success: true };
      }

      const baseUrl = getApiBaseUrl();
      let res: Response;
      try {
        res = await fetch(`${baseUrl}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
        });
      } catch (fetchErr) {
        console.error('Fetch signup failed to:', baseUrl, fetchErr);
        return { success: false, error: `Could not connect to database backend at ${baseUrl}. Ensure backend server is running.` };
      }

      const data = await res.json();
      if (data.success && data.user) {
        const neonUser: UserProfile = { ...data.user, role: 'pilgrim' };
        setUser(neonUser);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(neonUser));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed.' };
      }
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // PROTOTYPE AUTHORITY ACCOUNT CHECK:
      // Username: admin, Password: admin123
      if ((cleanEmail === 'admin' || cleanEmail === 'admin@yatraguard.gov.in') && cleanPassword === 'admin123') {
        const authorityUser: UserProfile = {
          name: 'Chief Pilgrimage Safety Officer',
          email: 'admin@yatraguard.gov.in',
          role: 'authority',
        };
        setUser(authorityUser);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(authorityUser));
        return { success: true };
      }

      const baseUrl = getApiBaseUrl();
      let res: Response;
      try {
        res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
        });
      } catch (fetchErr) {
        console.error('Fetch login failed to:', baseUrl, fetchErr);
        return { success: false, error: `Cannot connect to database backend at ${baseUrl}.` };
      }

      const data = await res.json();
      if (data.success && data.user) {
        const neonUser: UserProfile = { ...data.user, role: 'pilgrim' };
        setUser(neonUser);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(neonUser));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSelectedDestination(null);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(DESTINATION_KEY);
  };

  const setDestination = async (destinationId: string) => {
    const dest = destinations.find((d) => d.id === destinationId);
    if (dest) {
      setSelectedDestination(dest);
      await AsyncStorage.setItem(DESTINATION_KEY, destinationId);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      void AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const togglePreference = (preference: Preference) => {
    setPreferences((current) => {
      const next = current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference];
      void AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Authority Action: update occupancy percent of any place
  const updatePlaceOccupancy = (placeId: string, newOccupancyPercent: number) => {
    setPlacesList((prev) =>
      prev.map((place) => {
        if (place.id === placeId) {
          const newCurrent = Math.round((newOccupancyPercent / 100) * place.crowd.capacity);
          const newWait = Math.round((newOccupancyPercent / 100) * 180);
          const newTrend = newOccupancyPercent > 100 ? 18 : newOccupancyPercent > 80 ? 8 : 2;
          const newCongestion = newOccupancyPercent > 110 ? 'Critical congestion at entrance' : newOccupancyPercent > 80 ? 'Heavy queue lines' : 'Normal flow';
          return {
            ...place,
            crowd: {
              ...place.crowd,
              current: newCurrent,
              waitingMinutes: newWait,
              trend: newTrend,
              congestion: newCongestion,
            },
          };
        }
        return place;
      })
    );
  };

  // Authority Action: deep update crowd metrics
  const updatePlaceCrowdData = (placeId: string, current: number, capacity: number, waitingMinutes: number, trend: number) => {
    setPlacesList((prev) =>
      prev.map((place) => {
        if (place.id === placeId) {
          return {
            ...place,
            crowd: {
              ...place.crowd,
              current,
              capacity,
              waitingMinutes,
              trend,
            },
          };
        }
        return place;
      })
    );
  };

  // Authority Action: restrict/unrestrict entrance
  const togglePlaceRestricted = (placeId: string) => {
    setPlacesList((prev) =>
      prev.map((place) => {
        if (place.id === placeId) {
          const isRestricted = place.tags.includes('entry-restricted');
          const nextTags = isRestricted
            ? place.tags.filter((t) => t !== 'entry-restricted')
            : [...place.tags, 'entry-restricted'];
          return {
            ...place,
            tags: nextTags,
          };
        }
        return place;
      })
    );
  };

  // Authority Action: issue destination-wide live safety alert
  const issueAuthorityAlert = (destinationId: string, severity: AlertSeverity, title: string, body: string) => {
    const newAlert = {
      id: `auth-alt-${Date.now()}`,
      destinationId,
      severity,
      title,
      body,
      time: 'Just now',
    };
    setActiveAlerts((prev) => [newAlert, ...prev]);
  };

  // Authority Action: resolve emergency SOS event
  const resolveEmergencyEvent = (eventId: string) => {
    setEmergencyEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'RESOLVED' } : ev))
    );
  };

  // Authority Action: create manual SOS / crowd emergency incident
  const createEmergencyEvent = (event: Omit<EmergencyEvent, 'id' | 'time'>) => {
    const newEv: EmergencyEvent = {
      ...event,
      id: `sos-${Date.now()}`,
      time: 'Just now',
    };
    setEmergencyEvents((prev) => [newEv, ...prev]);
  };

  // Authority Action: update transit/route congestion
  const updateTransportStatus = (transportId: string, status: TransportCondition['status'], congestionPercent: number) => {
    setTransportConditions((prev) =>
      prev.map((tr) => (tr.id === transportId ? { ...tr, status, congestionPercent } : tr))
    );
  };

  // Authority Action: update upcoming surge forecast
  const updateForecastSurge = (destinationId: string, forecastArray: number[]) => {
    setForecastSurges((prev) => ({
      ...prev,
      [destinationId]: forecastArray,
    }));
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      favorites,
      preferences,
      selectedDestination,
      placesList,
      activeAlerts,
      emergencyEvents,
      transportConditions,
      forecastSurges,
      familyGroups,
      activeFamilyGroup,
      inviteFamilyMember,
      removeFamilyMember,
      setGroupMeetingPoint,
      triggerGroupSOS,
      signUp,
      signIn,
      signOut,
      setDestination,
      toggleFavorite,
      togglePreference,
      isFavorite: (id: string) => favorites.includes(id),
      updatePlaceOccupancy,
      updatePlaceCrowdData,
      togglePlaceRestricted,
      issueAuthorityAlert,
      resolveEmergencyEvent,
      createEmergencyEvent,
      updateTransportStatus,
      updateForecastSurge,
    }),
    [
      user,
      isLoading,
      favorites,
      preferences,
      selectedDestination,
      placesList,
      activeAlerts,
      emergencyEvents,
      transportConditions,
      forecastSurges,
      familyGroups,
      activeFamilyGroup,
    ]
  );

  return <YatraContext.Provider value={value}>{children}</YatraContext.Provider>;
}

export function useYatra() {
  const context = useContext(YatraContext);
  if (!context) throw new Error('useYatra must be used within YatraProvider');
  return context;
}