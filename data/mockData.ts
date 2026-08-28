export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'CRITICAL' | 'DANGEROUS';
export type AlertSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type CrowdData = {
  capacity: number;
  current: number;
  waitingMinutes: number;
  trend: number;
  congestion: string;
  narrowPathway: boolean;
};

export type NearbyFacilityType = 'temple' | 'stay' | 'food' | 'bus' | 'train' | 'parking' | 'hospital' | 'police' | 'emergency';

export type NearbyFacility = {
  id: string;
  name: string;
  category: NearbyFacilityType;
  distance: string;
  detail: string;
  crowdLevel?: CrowdLevel;
  phone?: string;
  isEmergency?: boolean;
};

export type TransportRouteOption = {
  id: string;
  type: 'bus' | 'train' | 'taxi' | 'auto' | 'shuttle' | 'walk' | 'flight';
  title: string;
  routeName: string;
  travelTime: string;
  approxCost: string;
  frequencyOrAvailability: string;
  congestion: 'LOW' | 'MODERATE' | 'HIGH';
  isRecommended: boolean;
  notes: string;
};

export type DestinationTransportData = {
  destinationId: string;
  localOptions: TransportRouteOption[];
  returnOptions: TransportRouteOption[];
};

export type Place = {
  id: string;
  name: string;
  category: string;
  destinationId: string;
  description: string;
  distance: string;
  duration: string;
  hours: string;
  recommendedTime: string;
  crowd: CrowdData;
  image?: 'tirumala' | 'varanasi' | 'rameswaram' | 'prayagraj';
  tags: string[];
  indoor?: boolean;
  wheelchair: boolean;
  seniorFriendly: boolean;
  latitude: number;
  longitude: number;
  saferAlternativeId?: string;
  nearbyFacilities?: NearbyFacility[];
  transportOptions?: TransportRouteOption[];
};

export type Destination = {
  id: string;
  name: string;
  region: string;
  image: 'tirumala' | 'varanasi' | 'rameswaram' | 'prayagraj';
  weather: string;
  weatherDetail: string;
  rain: string;
  humidity: string;
  recommendedCount: number;
  overview: string;
  places: string[];
  alerts: string[];
  latitude: number;
  longitude: number;
};

export type FamilyMember = {
  id: string;
  name: string;
  email: string;
  relationship: string;
  avatarColor: string;
  currentPlaceId: string;
  currentPlaceName: string;
  latitude: number;
  longitude: number;
  battery: number;
  lastUpdated: string;
  status: 'SAFE' | 'CAUTION' | 'CRITICAL' | 'SOS';
  isCurrentUser?: boolean;
};

export type FamilyGroup = {
  id: string;
  groupName: string;
  destinationId: string;
  meetingPoint: {
    name: string;
    placeId: string;
    latitude: number;
    longitude: number;
    notes: string;
  };
  members: FamilyMember[];
  sosEvents: Array<{
    id: string;
    memberName: string;
    memberEmail: string;
    locationName: string;
    time: string;
    status: 'ACTIVE' | 'RESOLVED';
    details: string;
  }>;
};

export const destinations: Destination[] = [
  {
    id: 'tirumala',
    name: 'Tirumala',
    region: 'Andhra Pradesh',
    image: 'tirumala',
    weather: '28°',
    weatherDetail: 'Partly cloudy',
    rain: '20%',
    humidity: '70%',
    recommendedCount: 6,
    overview: 'Sacred hill town with temple darshan, forest trails and quiet alternatives.',
    places: ['venkateswara', 'kapila', 'tiruchanur', 'silathoranam', 'alipiri', 'akasa'],
    alerts: ['Main temple queue has reached critical crowd levels.', 'Alipiri parking is nearly full.'],
    latitude: 13.6833,
    longitude: 79.3472,
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    region: 'Uttar Pradesh',
    image: 'prayagraj',
    weather: '31°',
    weatherDetail: 'Clear skies',
    rain: '8%',
    humidity: '55%',
    recommendedCount: 5,
    overview: 'Where three rivers meet, with historic temples and a living festival landscape.',
    places: ['sangam', 'kumbh', 'hanuman', 'alopi'],
    alerts: ['Sangam approach road is moving slowly near the east gate.'],
    latitude: 25.4358,
    longitude: 81.8463,
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    region: 'Uttar Pradesh',
    image: 'varanasi',
    weather: '30°',
    weatherDetail: 'Hazy sunshine',
    rain: '12%',
    humidity: '62%',
    recommendedCount: 7,
    overview: 'Ancient riverfront energy, timeless rituals and a deep cultural trail.',
    places: ['kashi', 'dashashwamedh', 'assi', 'sarnath', 'sankat'],
    alerts: ['Evening ghat route is expected to become very busy after 5 PM.'],
    latitude: 25.3176,
    longitude: 82.9739,
  },
  {
    id: 'rameswaram',
    name: 'Rameswaram',
    region: 'Tamil Nadu',
    image: 'rameswaram',
    weather: '29°',
    weatherDetail: 'Breezy',
    rain: '15%',
    humidity: '68%',
    recommendedCount: 5,
    overview: 'Island pilgrimage with ocean horizons, bridge views and sacred corridors.',
    places: ['ramanathaswamy', 'agni', 'pamban', 'dhanushkodi', 'kalam'],
    alerts: ['Strong winds expected near Dhanushkodi this afternoon.'],
    latitude: 9.2876,
    longitude: 79.3129,
  },
];

export const places: Place[] = [
  // --- TIRUMALA PLACES ---
  {
    id: 'venkateswara',
    name: 'Sri Venkateswara Temple',
    category: 'Temple',
    destinationId: 'tirumala',
    description: 'The main hill shrine and the heart of the Tirumala pilgrimage.',
    distance: '0 km',
    duration: '2–5 hours',
    hours: '3:00 AM – 11:00 PM',
    recommendedTime: 'After 5:00 PM',
    crowd: { capacity: 10000, current: 11800, waitingMinutes: 300, trend: 18, congestion: 'Critical at queue complex', narrowPathway: true },
    image: 'tirumala',
    tags: ['religious', 'must visit'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 13.6833,
    longitude: 79.3472,
    saferAlternativeId: 'silathoranam',
    nearbyFacilities: [
      { id: 'f1', name: 'Tarigonda Vengamamba Annadanam Complex', category: 'food', distance: '0.3 km', detail: 'Free sacred Satvik meals (9 AM - 11 PM)', crowdLevel: 'MODERATE' },
      { id: 'f2', name: 'TTD Central Reception Office & Lodges (CRO)', category: 'stay', distance: '0.5 km', detail: 'Official Pilgrim Cottages & Lockers', crowdLevel: 'HIGH' },
      { id: 'f3', name: 'Tirumala Main Bus Stand & Depo', category: 'bus', distance: '0.4 km', detail: 'Free internal electric shuttles & Ghat buses', crowdLevel: 'HIGH' },
      { id: 'f4', name: 'Srinivasa Multi-Specialty Hospital', category: 'hospital', distance: '0.6 km', detail: '24x7 Emergency Trauma & Ambulance', phone: '108', isEmergency: true },
      { id: 'f5', name: 'Tirumala Town Police & Safety Desk', category: 'police', distance: '0.2 km', detail: 'TTD Vigilance & Missing Child Desk', phone: '100', isEmergency: true },
      { id: 'f6', name: 'Medaramitta Multi-Level Parking', category: 'parking', distance: '0.7 km', detail: 'Covered parking · 12% space free', crowdLevel: 'HIGH' },
    ],
    transportOptions: [
      { id: 't1', type: 'shuttle', title: 'TTD Free Green EV Shuttle', routeName: 'CRO → Queue Complex Gate 1', travelTime: '6 min', approxCost: 'FREE', frequencyOrAvailability: 'Every 3 min', congestion: 'MODERATE', isRecommended: true, notes: 'Direct battery buggy priority for senior citizens & families' },
      { id: 't2', type: 'bus', title: 'APSRTC Ghat Hill Express', routeName: 'Tirupati Central → Tirumala Hill', travelTime: '45 min', approxCost: '₹65', frequencyOrAvailability: 'Every 2 min', congestion: 'HIGH', isRecommended: false, notes: 'Express downhill/uphill bus pass available at counters' },
      { id: 't3', type: 'taxi', title: 'Prepaid Hill Jeep / Taxi', routeName: 'Direct drop to Cottage Ring Road', travelTime: '35 min', approxCost: '₹450', frequencyOrAvailability: 'Instant 24/7', congestion: 'LOW', isRecommended: false, notes: 'Ideal with heavy luggage' },
      { id: 't4', type: 'walk', title: 'Alipiri Mettu Footpath Steps', routeName: 'Traditional 3,550 stone steps', travelTime: '3.5 hours', approxCost: 'FREE', frequencyOrAvailability: 'Open 24/7', congestion: 'MODERATE', isRecommended: false, notes: 'Divya Darshan token counter available at step 2000' },
    ],
  },
  {
    id: 'silathoranam',
    name: 'Silathoranam',
    category: 'Nature',
    destinationId: 'tirumala',
    description: 'A rare natural rock arch surrounded by a quiet, breezy hill landscape.',
    distance: '8.2 km',
    duration: '40 min',
    hours: '8:00 AM – 6:00 PM',
    recommendedTime: 'Now',
    crowd: { capacity: 3500, current: 980, waitingMinutes: 5, trend: -3, congestion: 'Clear', narrowPathway: false },
    image: 'tirumala',
    tags: ['low crowd', 'photography'],
    wheelchair: false,
    seniorFriendly: false,
    latitude: 13.6917,
    longitude: 79.3499,
    nearbyFacilities: [
      { id: 'sf1', name: 'Chakra Theertham Garden & Pond', category: 'temple', distance: '0.4 km', detail: 'Scenic sacred pool in forest setting', crowdLevel: 'LOW' },
      { id: 'sf2', name: 'Silathoranam Forest Cafeteria', category: 'food', distance: '0.1 km', detail: 'Tea, coconut water & refreshments', crowdLevel: 'LOW' },
      { id: 'sf3', name: 'Nature Trail Shuttle Stop', category: 'bus', distance: '0.2 km', detail: 'Electric mini bus to Main Temple', crowdLevel: 'LOW' },
      { id: 'sf4', name: 'Forest Safety Patrol Post', category: 'police', distance: '0.2 km', detail: 'Forest Ranger & Tourist Assistance', isEmergency: true },
    ],
    transportOptions: [
      { id: 'st1', type: 'shuttle', title: 'TTD Internal Circular Mini-Bus', routeName: 'Main Temple CRO → Silathoranam Gate', travelTime: '10 min', approxCost: 'FREE', frequencyOrAvailability: 'Every 10 min', congestion: 'LOW', isRecommended: true, notes: 'Tranquil route with scenic hill views' },
      { id: 'st2', type: 'auto', title: 'Shared Electric Auto', routeName: 'Direct to Park Entrance', travelTime: '8 min', approxCost: '₹30', frequencyOrAvailability: 'Frequent', congestion: 'LOW', isRecommended: false, notes: 'Comfortable family ride' },
      { id: 'st3', type: 'walk', title: 'Forest Walking Trail', routeName: 'From Srivari Mettu junction', travelTime: '20 min', approxCost: 'FREE', frequencyOrAvailability: 'Daylight', congestion: 'LOW', isRecommended: false, notes: 'Peaceful pine-shaded walking promenade' },
    ],
  },
  {
    id: 'kapila',
    name: 'Kapila Theertham',
    category: 'Nature + Temple',
    destinationId: 'tirumala',
    description: 'A tranquil waterfall shrine at the foot of the hills, ideal while the main queue settles.',
    distance: '3.4 km',
    duration: '45 min',
    hours: '6:00 AM – 7:00 PM',
    recommendedTime: 'Now',
    crowd: { capacity: 4000, current: 1360, waitingMinutes: 15, trend: 2, congestion: 'Open approach', narrowPathway: false },
    image: 'tirumala',
    tags: ['low crowd', 'senior friendly'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 13.6558,
    longitude: 79.4216,
    nearbyFacilities: [
      { id: 'kf1', name: 'Kapila Temple Annaprasadam', category: 'food', distance: '0.1 km', detail: 'Prasadam counter & pure veg eateries', crowdLevel: 'LOW' },
      { id: 'kf2', name: 'Srinivasam Pilgrim Complex', category: 'stay', distance: '2.0 km', detail: 'Clean budget dormitory & lockers', crowdLevel: 'MODERATE' },
      { id: 'kf3', name: 'Kapila Theertham City Bus Bay', category: 'bus', distance: '0.1 km', detail: 'Buses to Railway Station & Alipiri', crowdLevel: 'LOW' },
      { id: 'kf4', name: 'SVIMS Super Specialty Hospital', category: 'hospital', distance: '1.2 km', detail: '24x7 Government Hospital Emergency', phone: '108', isEmergency: true },
    ],
    transportOptions: [
      { id: 'kt1', type: 'auto', title: 'City Electric Auto', routeName: 'Tirupati Railway Station → Kapila Theertham', travelTime: '12 min', approxCost: '₹50', frequencyOrAvailability: 'Immediate', congestion: 'LOW', isRecommended: true, notes: 'Direct road drop at temple arch' },
      { id: 'kt2', type: 'bus', title: 'Route 11 City Bus', routeName: 'Bus Stand → Kapila Stop', travelTime: '18 min', approxCost: '₹10', frequencyOrAvailability: 'Every 5 min', congestion: 'LOW', isRecommended: false, notes: 'Very frequent city connection' },
    ],
  },
  {
    id: 'tiruchanur',
    name: 'Tiruchanur Padmavathi Temple',
    category: 'Temple',
    destinationId: 'tirumala',
    description: 'A graceful temple visit near Tirupati with a calmer, family-friendly rhythm.',
    distance: '5.8 km',
    duration: '50 min',
    hours: '6:00 AM – 9:00 PM',
    recommendedTime: '2:30 PM',
    crowd: { capacity: 7000, current: 2870, waitingMinutes: 35, trend: 4, congestion: 'Moderate at entrance', narrowPathway: false },
    image: 'tirumala',
    tags: ['family', 'religious'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 13.6154,
    longitude: 79.4507,
    saferAlternativeId: 'silathoranam',
  },
  {
    id: 'alipiri',
    name: 'Alipiri Steps',
    category: 'Transport + Nature',
    destinationId: 'tirumala',
    description: 'The traditional walking route up the seven hills from Tirupati.',
    distance: '10.5 km',
    duration: '3–5 hours',
    hours: 'Open 24 hours',
    recommendedTime: 'Before sunrise',
    crowd: { capacity: 6000, current: 4740, waitingMinutes: 20, trend: 8, congestion: 'Busy near first arch', narrowPathway: true },
    tags: ['walking', 'heritage'],
    wheelchair: false,
    seniorFriendly: false,
    latitude: 13.6496,
    longitude: 79.4005,
  },
  {
    id: 'akasa',
    name: 'Akasa Ganga',
    category: 'Nature',
    destinationId: 'tirumala',
    description: 'A sacred forest waterfall and refreshing stop along the Tirumala circuit.',
    distance: '4.8 km',
    duration: '35 min',
    hours: '7:00 AM – 6:00 PM',
    recommendedTime: 'Morning',
    crowd: { capacity: 2500, current: 875, waitingMinutes: 10, trend: 1, congestion: 'Clear', narrowPathway: true },
    tags: ['nature', 'low crowd'],
    wheelchair: false,
    seniorFriendly: false,
    latitude: 13.7082,
    longitude: 79.3364,
  },

  // --- VARANASI PLACES ---
  {
    id: 'kashi',
    name: 'Kashi Vishwanath Temple',
    category: 'Temple',
    destinationId: 'varanasi',
    description: 'One of the most revered Shiva temples, set in the heart of the old city.',
    distance: '0 km',
    duration: '2 hours',
    hours: '2:30 AM – 11:00 PM',
    recommendedTime: 'Before 7:00 AM',
    crowd: { capacity: 12000, current: 11160, waitingMinutes: 140, trend: 12, congestion: 'Very high at gate 2', narrowPathway: true },
    image: 'varanasi',
    tags: ['religious', 'high crowd'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 25.3109,
    longitude: 83.0107,
    saferAlternativeId: 'assi',
    nearbyFacilities: [
      { id: 'vf1', name: 'Kashi Vishwanath Corridor Food Court', category: 'food', distance: '0.1 km', detail: 'Clean Satvik prasadam and snacks', crowdLevel: 'HIGH' },
      { id: 'vf2', name: 'Corridor Pilgrim Guest House & Locker Hall', category: 'stay', distance: '0.2 km', detail: 'Government pilgrimage rooms', crowdLevel: 'HIGH' },
      { id: 'vf3', name: 'Godauliya Auto & E-Rickshaw Stand', category: 'bus', distance: '0.5 km', detail: 'Vehicles to Cantonment Railway Station', crowdLevel: 'HIGH' },
      { id: 'vf4', name: 'Lalita Ghat Emergency First Aid Clinic', category: 'hospital', distance: '0.2 km', detail: '24x7 riverfront medical desk', phone: '108', isEmergency: true },
      { id: 'vf5', name: 'Dashashwamedh Police Station', category: 'police', distance: '0.4 km', detail: 'Tourist Police Help & Lost & Found', phone: '100', isEmergency: true },
    ],
    transportOptions: [
      { id: 'vt1', type: 'shuttle', title: 'Corridor Battery Buggy', routeName: 'Godauliya Gate 4 → Temple Plaza', travelTime: '5 min', approxCost: 'FREE / ₹20', frequencyOrAvailability: 'Continuous', congestion: 'MODERATE', isRecommended: true, notes: 'Wheelchair ramp accessible route' },
      { id: 'vt2', type: 'auto', title: 'Shared E-Rickshaw', routeName: 'Varanasi Cantt Station → Godauliya', travelTime: '22 min', approxCost: '₹30', frequencyOrAvailability: 'Immediate', congestion: 'HIGH', isRecommended: false, notes: 'Drop 400m before temple pedestrian zone' },
      { id: 'vt3', type: 'walk', title: 'Riverfront Ghat Walk', routeName: 'From Assi Ghat via Manikarnika to Temple', travelTime: '35 min', approxCost: 'FREE', frequencyOrAvailability: 'Open 24/7', congestion: 'MODERATE', isRecommended: false, notes: 'Scenic sunrise walking heritage route' },
    ],
  },
  {
    id: 'dashashwamedh',
    name: 'Dashashwamedh Ghat',
    category: 'Ghat',
    destinationId: 'varanasi',
    description: 'The city’s iconic riverfront promenade and evening aarti setting.',
    distance: '1.2 km',
    duration: '75 min',
    hours: 'Open 24 hours',
    recommendedTime: 'Before 5:00 PM',
    crowd: { capacity: 10000, current: 9400, waitingMinutes: 30, trend: 10, congestion: 'Very high after 6 PM', narrowPathway: true },
    image: 'varanasi',
    tags: ['culture', 'photography'],
    wheelchair: false,
    seniorFriendly: false,
    latitude: 25.3069,
    longitude: 83.0104,
    saferAlternativeId: 'assi',
  },
  {
    id: 'assi',
    name: 'Assi Ghat',
    category: 'Ghat',
    destinationId: 'varanasi',
    description: 'A wider, more relaxed ghat known for sunrise rituals and local cafés.',
    distance: '5.1 km',
    duration: '90 min',
    hours: 'Open 24 hours',
    recommendedTime: 'Sunrise',
    crowd: { capacity: 8000, current: 2480, waitingMinutes: 10, trend: 2, congestion: 'Open', narrowPathway: false },
    image: 'varanasi',
    tags: ['low crowd', 'food'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 25.2885,
    longitude: 83.0064,
    nearbyFacilities: [
      { id: 'af1', name: 'Assi Morning Aarti & Yoga Pavilion', category: 'temple', distance: '0.1 km', detail: 'Open riverfront yoga & cultural rituals', crowdLevel: 'LOW' },
      { id: 'af2', name: 'Open Terrace Ghat Cafes & Satvik Bhojan', category: 'food', distance: '0.2 km', detail: 'Chai, lassi and organic vegetarian food', crowdLevel: 'LOW' },
      { id: 'af3', name: 'Assi Ghat Ferry & Boat Terminal', category: 'bus', distance: '0.1 km', detail: 'Government CNG cruise & rowing boats', crowdLevel: 'LOW' },
      { id: 'af4', name: 'BHU Trauma Centre & Hospital', category: 'hospital', distance: '2.5 km', detail: 'Premier 24x7 University Hospital', phone: '108', isEmergency: true },
    ],
    transportOptions: [
      { id: 'at1', type: 'auto', title: 'Electric Auto / CNG Tuk-Tuk', routeName: 'Cantt Station → Assi Ghat Square', travelTime: '20 min', approxCost: '₹35', frequencyOrAvailability: 'Continuous', congestion: 'LOW', isRecommended: true, notes: 'Wide road access directly to the river steps' },
      { id: 'at2', type: 'shuttle', title: 'Electric Ganga River Cruise', routeName: 'Rajghat → Assi Ghat', travelTime: '25 min', approxCost: '₹100', frequencyOrAvailability: 'Hourly', congestion: 'LOW', isRecommended: false, notes: 'Avoid city street traffic by cruising on the Ganga' },
    ],
  },
  {
    id: 'sarnath',
    name: 'Sarnath',
    category: 'Heritage',
    destinationId: 'varanasi',
    description: 'A peaceful heritage circuit marking the Buddha’s first teaching.',
    distance: '10.6 km',
    duration: '2 hours',
    hours: '8:00 AM – 6:00 PM',
    recommendedTime: 'Morning',
    crowd: { capacity: 9000, current: 2700, waitingMinutes: 12, trend: -1, congestion: 'Clear', narrowPathway: false },
    image: 'varanasi',
    tags: ['heritage', 'family'],
    wheelchair: true,
    seniorFriendly: true,
    indoor: true,
    latitude: 25.3811,
    longitude: 83.0214,
  },
  {
    id: 'sankat',
    name: 'Sankat Mochan Temple',
    category: 'Temple',
    destinationId: 'varanasi',
    description: 'A serene Hanuman temple set among trees near the Assi neighborhood.',
    distance: '6.2 km',
    duration: '45 min',
    hours: '5:00 AM – 10:00 PM',
    recommendedTime: '4:00 PM',
    crowd: { capacity: 4500, current: 1620, waitingMinutes: 18, trend: 4, congestion: 'Moderate', narrowPathway: false },
    tags: ['religious', 'family'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 25.2818,
    longitude: 82.9984,
  },

  // --- PRAYAGRAJ PLACES ---
  {
    id: 'sangam',
    name: 'Triveni Sangam',
    category: 'Riverfront',
    destinationId: 'prayagraj',
    description: 'The sacred meeting point of the Ganga, Yamuna and invisible Saraswati.',
    distance: '2.1 km',
    duration: '90 min',
    hours: '5:00 AM – 8:00 PM',
    recommendedTime: 'Early morning',
    crowd: { capacity: 18000, current: 12960, waitingMinutes: 45, trend: 7, congestion: 'Busy at boat jetty', narrowPathway: false },
    image: 'prayagraj',
    tags: ['religious', 'photography'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 25.4299,
    longitude: 81.8847,
    saferAlternativeId: 'hanuman',
    nearbyFacilities: [
      { id: 'pf1', name: 'Mela Authority Free Satvik Kitchens', category: 'food', distance: '0.4 km', detail: 'Clean prasadam and bottled drinking water', crowdLevel: 'MODERATE' },
      { id: 'pf2', name: 'Sangam Tent City & Dharamshalas', category: 'stay', distance: '0.8 km', detail: 'Pilgrim tents, lockers & safety camps', crowdLevel: 'MODERATE' },
      { id: 'pf3', name: 'Sangam Main Boat Jetty & Ramp', category: 'bus', distance: '0.1 km', detail: 'Government licensed life-jacket boat ride', crowdLevel: 'HIGH' },
      { id: 'pf4', name: 'Sangam Riverfront Medical Camp', category: 'hospital', distance: '0.3 km', detail: '24x7 Doctors & Boat Ambulances', phone: '108', isEmergency: true },
      { id: 'pf5', name: 'Kumbh Sector 1 Police Station', category: 'police', distance: '0.2 km', detail: 'Mela Control Room & Crowd Surveillance', phone: '100', isEmergency: true },
    ],
    transportOptions: [
      { id: 'pt1', type: 'shuttle', title: 'Mela Authority Free EV Buggy', routeName: 'Parking Lot 3 → Sangam Ghat Point', travelTime: '8 min', approxCost: 'FREE', frequencyOrAvailability: 'Every 4 min', congestion: 'LOW', isRecommended: true, notes: 'Priority for elderly & devotees with children' },
      { id: 'pt2', type: 'auto', title: 'Shared E-Rickshaw', routeName: 'Prayagraj Junction → Sangam Arch', travelTime: '25 min', approxCost: '₹40', frequencyOrAvailability: 'Frequent', congestion: 'MODERATE', isRecommended: false, notes: 'Direct road access to embankment' },
    ],
  },
  {
    id: 'kumbh',
    name: 'Kumbh Mela Main Area',
    category: 'Festival',
    destinationId: 'prayagraj',
    description: 'A changing festival district with color, devotion and high crowd movement.',
    distance: '4.4 km',
    duration: '2 hours',
    hours: 'Open 24 hours',
    recommendedTime: 'Before 9:00 AM',
    crowd: { capacity: 30000, current: 31800, waitingMinutes: 90, trend: 15, congestion: 'High at sector 4', narrowPathway: false },
    image: 'prayagraj',
    tags: ['heritage', 'high crowd'],
    wheelchair: true,
    seniorFriendly: false,
    latitude: 25.4340,
    longitude: 81.8790,
    saferAlternativeId: 'alopi',
  },
  {
    id: 'hanuman',
    name: 'Bade Hanuman Temple',
    category: 'Temple',
    destinationId: 'prayagraj',
    description: 'A beloved temple with a distinctive reclining Hanuman idol.',
    distance: '3.2 km',
    duration: '40 min',
    hours: '5:00 AM – 10:00 PM',
    recommendedTime: 'Late afternoon',
    crowd: { capacity: 5000, current: 1800, waitingMinutes: 20, trend: 0, congestion: 'Open', narrowPathway: false },
    tags: ['religious', 'family'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 25.4310,
    longitude: 81.8780,
    nearbyFacilities: [
      { id: 'hf1', name: 'Hanuman Temple Prasadam Counters', category: 'food', distance: '0.1 km', detail: 'Besan laddoos and tea stalls', crowdLevel: 'LOW' },
      { id: 'hf2', name: 'Akshaya Vat Pilgrim Lodge', category: 'stay', distance: '0.6 km', detail: 'Rooms and dormitory facilities', crowdLevel: 'LOW' },
      { id: 'hf3', name: 'Fort Road Police Help Post', category: 'police', distance: '0.2 km', detail: '24/7 Security and tourist assistance', isEmergency: true },
    ],
    transportOptions: [
      { id: 'ht1', type: 'auto', title: 'Direct E-Rickshaw', routeName: 'Civil Lines → Bade Hanuman Temple', travelTime: '15 min', approxCost: '₹30', frequencyOrAvailability: 'Immediate', congestion: 'LOW', isRecommended: true, notes: 'Smooth paved road right to the temple courtyard' },
    ],
  },
  {
    id: 'alopi',
    name: 'Alopi Devi Temple',
    category: 'Temple',
    destinationId: 'prayagraj',
    description: 'A compact, deeply revered shrine tucked into a lively old neighborhood.',
    distance: '2.7 km',
    duration: '35 min',
    hours: '6:00 AM – 9:00 PM',
    recommendedTime: 'Now',
    crowd: { capacity: 4000, current: 980, waitingMinutes: 10, trend: -2, congestion: 'Clear', narrowPathway: true },
    tags: ['low crowd', 'religious'],
    wheelchair: false,
    seniorFriendly: true,
    latitude: 25.4390,
    longitude: 81.8650,
  },

  // --- RAMESWARAM PLACES ---
  {
    id: 'ramanathaswamy',
    name: 'Ramanathaswamy Temple',
    category: 'Temple',
    destinationId: 'rameswaram',
    description: 'A monumental corridor temple and one of the most important Shaiva pilgrimages.',
    distance: '0 km',
    duration: '2 hours',
    hours: '5:00 AM – 9:00 PM',
    recommendedTime: 'Before 8:00 AM',
    crowd: { capacity: 15000, current: 9600, waitingMinutes: 75, trend: 9, congestion: 'Busy at east tower', narrowPathway: true },
    image: 'rameswaram',
    tags: ['religious', 'heritage'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 9.2881,
    longitude: 79.3174,
    saferAlternativeId: 'agni',
    nearbyFacilities: [
      { id: 'rf1', name: 'Tamil Nadu Govt Free Annadanam Hall', category: 'food', distance: '0.2 km', detail: 'Pure vegetarian lunch & dinner (daily)', crowdLevel: 'MODERATE' },
      { id: 'rf2', name: 'Sri Ramanjaneya Chatram & Cottages', category: 'stay', distance: '0.4 km', detail: 'Traditional pilgrimage dharamshala', crowdLevel: 'LOW' },
      { id: 'rf3', name: 'Rameswaram Temple Car Stand & Bus Bay', category: 'bus', distance: '0.3 km', detail: 'Town buses to Pamban & Dhanushkodi', crowdLevel: 'MODERATE' },
      { id: 'rf4', name: 'Government Taluk Hospital Rameswaram', category: 'hospital', distance: '1.0 km', detail: '24x7 Emergency Ward', phone: '108', isEmergency: true },
      { id: 'rf5', name: 'Temple East Gate Police Outpost', category: 'police', distance: '0.1 km', detail: 'Safety outpost and pilgrim guidance', phone: '100', isEmergency: true },
    ],
    transportOptions: [
      { id: 'rt1', type: 'walk', title: 'Corridor Walk from Beach', routeName: 'Agni Theertham → East Gopuram Entrance', travelTime: '7 min', approxCost: 'FREE', frequencyOrAvailability: 'Always open', congestion: 'LOW', isRecommended: true, notes: 'Pleasant walk directly after morning theertham bath' },
      { id: 'rt2', type: 'auto', title: 'Island Auto Rickshaw', routeName: 'Rameswaram Railway Station → Temple', travelTime: '10 min', approxCost: '₹60', frequencyOrAvailability: 'Immediate', congestion: 'LOW', isRecommended: false, notes: 'Fixed rate counter at railway station exit' },
    ],
  },
  {
    id: 'agni',
    name: 'Agni Theertham',
    category: 'Beach',
    destinationId: 'rameswaram',
    description: 'A sacred shoreline just outside the main temple with a wide ocean view.',
    distance: '0.8 km',
    duration: '40 min',
    hours: 'Open 24 hours',
    recommendedTime: 'Sunrise',
    crowd: { capacity: 7000, current: 2310, waitingMinutes: 5, trend: 1, congestion: 'Clear', narrowPathway: false },
    image: 'rameswaram',
    tags: ['nature', 'low crowd'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 9.2895,
    longitude: 79.3210,
    nearbyFacilities: [
      { id: 'agf1', name: 'Beachfront Change Rooms & Lockers', category: 'stay', distance: '0.1 km', detail: 'Clean changing rooms and bath cubicles', crowdLevel: 'LOW' },
      { id: 'agf2', name: 'Fresh Coconut Water & South Indian Tiffins', category: 'food', distance: '0.1 km', detail: 'Idli, dosa and morning refreshments', crowdLevel: 'LOW' },
      { id: 'agf3', name: 'Coastal Guard & Lifeguard Tower', category: 'police', distance: '0.1 km', detail: '24/7 Ocean safety & lifebuoy station', isEmergency: true },
    ],
    transportOptions: [
      { id: 'agt1', type: 'walk', title: 'Direct Shore Promenade', routeName: 'From Main Temple East Tower', travelTime: '5 min', approxCost: 'FREE', frequencyOrAvailability: 'Immediate', congestion: 'LOW', isRecommended: true, notes: 'Gentle slope paved walkway' },
    ],
  },
  {
    id: 'pamban',
    name: 'Pamban Bridge',
    category: 'Attraction',
    destinationId: 'rameswaram',
    description: 'An iconic sea crossing with wide island vistas and a breezy stop.',
    distance: '11.4 km',
    duration: '45 min',
    hours: 'Daylight hours',
    recommendedTime: 'Morning',
    crowd: { capacity: 5000, current: 1700, waitingMinutes: 10, trend: 3, congestion: 'Open', narrowPathway: false },
    image: 'rameswaram',
    tags: ['photography', 'family'],
    wheelchair: true,
    seniorFriendly: true,
    latitude: 9.2798,
    longitude: 79.2088,
  },
  {
    id: 'dhanushkodi',
    name: 'Dhanushkodi',
    category: 'Nature',
    destinationId: 'rameswaram',
    description: 'A windswept edge-of-the-island landscape where land meets open sea.',
    distance: '20.7 km',
    duration: '2 hours',
    hours: '6:00 AM – 6:00 PM',
    recommendedTime: 'Before noon',
    crowd: { capacity: 6000, current: 1680, waitingMinutes: 10, trend: 4, congestion: 'Wind advisory', narrowPathway: false },
    image: 'rameswaram',
    tags: ['nature', 'photography'],
    wheelchair: false,
    seniorFriendly: false,
    latitude: 9.1782,
    longitude: 79.4172,
  },
  {
    id: 'kalam',
    name: 'Abdul Kalam Memorial',
    category: 'Heritage',
    destinationId: 'rameswaram',
    description: 'A thoughtful memorial celebrating India’s former president and scientist.',
    distance: '10.3 km',
    duration: '60 min',
    hours: '10:00 AM – 5:00 PM',
    recommendedTime: 'Afternoon',
    crowd: { capacity: 3500, current: 980, waitingMinutes: 8, trend: 0, congestion: 'Clear', narrowPathway: false },
    tags: ['heritage', 'family'],
    wheelchair: true,
    seniorFriendly: true,
    indoor: true,
    latitude: 9.2941,
    longitude: 79.2890,
  },
];

export const mockFamilyGroups: Record<string, FamilyGroup> = {
  tirumala: {
    id: 'g-tirumala',
    groupName: 'Sharma Family Yatra',
    destinationId: 'tirumala',
    meetingPoint: {
      name: 'Tarigonda Vengamamba Annadanam Hall (Gate 2)',
      placeId: 'venkateswara',
      latitude: 13.6828,
      longitude: 79.3485,
      notes: 'Near large water dispenser & shaded seating benches',
    },
    members: [
      { id: 'm1', name: 'You (Organizer)', email: 'vamsi@yatraguard.in', relationship: 'Self', avatarColor: '#E07A5F', currentPlaceId: 'silathoranam', currentPlaceName: 'Silathoranam', latitude: 13.6917, longitude: 79.3499, battery: 88, lastUpdated: 'Just now', status: 'SAFE', isCurrentUser: true },
      { id: 'm2', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', relationship: 'Brother', avatarColor: '#3D5A80', currentPlaceId: 'venkateswara', currentPlaceName: 'Sri Venkateswara Temple (Queue Complex)', latitude: 13.6833, longitude: 79.3472, battery: 64, lastUpdated: '2 min ago', status: 'CRITICAL' },
      { id: 'm3', name: 'Priya Sharma', email: 'priya.s@gmail.com', relationship: 'Sister', avatarColor: '#81B29A', currentPlaceId: 'venkateswara', currentPlaceName: 'Tirumala Main Bus Stand', latitude: 13.6815, longitude: 79.3460, battery: 92, lastUpdated: '5 min ago', status: 'SAFE' },
      { id: 'm4', name: 'Uncle Suresh', email: 'suresh.k@gmail.com', relationship: 'Family', avatarColor: '#F2CC8F', currentPlaceId: 'kapila', currentPlaceName: 'Kapila Theertham Waiting Lounge', latitude: 13.6558, longitude: 79.4216, battery: 45, lastUpdated: '8 min ago', status: 'SAFE' },
    ],
    sosEvents: [],
  },
  varanasi: {
    id: 'g-varanasi',
    groupName: 'Kashi Pilgrimage Group',
    destinationId: 'varanasi',
    meetingPoint: {
      name: 'Assi Ghat Open Cultural Pavilion',
      placeId: 'assi',
      latitude: 25.2885,
      longitude: 83.0064,
      notes: 'In front of Ganga Seva Nidhi dais',
    },
    members: [
      { id: 'm1', name: 'You (Organizer)', email: 'vamsi@yatraguard.in', relationship: 'Self', avatarColor: '#E07A5F', currentPlaceId: 'assi', currentPlaceName: 'Assi Ghat', latitude: 25.2885, longitude: 83.0064, battery: 90, lastUpdated: 'Just now', status: 'SAFE', isCurrentUser: true },
      { id: 'm2', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', relationship: 'Friend', avatarColor: '#3D5A80', currentPlaceId: 'kashi', currentPlaceName: 'Kashi Vishwanath Gate 4', latitude: 25.3109, longitude: 83.0107, battery: 52, lastUpdated: '3 min ago', status: 'CRITICAL' },
      { id: 'm3', name: 'Priya Sharma', email: 'priya.s@gmail.com', relationship: 'Friend', avatarColor: '#81B29A', currentPlaceId: 'dashashwamedh', currentPlaceName: 'Godauliya Crossing', latitude: 25.3069, longitude: 83.0104, battery: 78, lastUpdated: '6 min ago', status: 'CAUTION' },
    ],
    sosEvents: [],
  },
  prayagraj: {
    id: 'g-prayagraj',
    groupName: 'Sangam Devotee Group',
    destinationId: 'prayagraj',
    meetingPoint: {
      name: 'Bade Hanuman Temple Main Gate Arch',
      placeId: 'hanuman',
      latitude: 25.4310,
      longitude: 81.8780,
      notes: 'Near flag mast and water point',
    },
    members: [
      { id: 'm1', name: 'You (Organizer)', email: 'vamsi@yatraguard.in', relationship: 'Self', avatarColor: '#E07A5F', currentPlaceId: 'hanuman', currentPlaceName: 'Bade Hanuman Temple', latitude: 25.4310, longitude: 81.8780, battery: 85, lastUpdated: 'Just now', status: 'SAFE', isCurrentUser: true },
      { id: 'm2', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', relationship: 'Brother', avatarColor: '#3D5A80', currentPlaceId: 'kumbh', currentPlaceName: 'Kumbh Sector 4 Concourse', latitude: 25.4340, longitude: 81.8790, battery: 60, lastUpdated: '4 min ago', status: 'CRITICAL' },
      { id: 'm3', name: 'Priya Sharma', email: 'priya.s@gmail.com', relationship: 'Sister', avatarColor: '#81B29A', currentPlaceId: 'sangam', currentPlaceName: 'Sangam Jetty 2', latitude: 25.4299, longitude: 81.8847, battery: 91, lastUpdated: '1 min ago', status: 'CAUTION' },
    ],
    sosEvents: [],
  },
  rameswaram: {
    id: 'g-rameswaram',
    groupName: 'Rameswaram Yatra Family',
    destinationId: 'rameswaram',
    meetingPoint: {
      name: 'Agni Theertham Northern Steps Clock Tower',
      placeId: 'agni',
      latitude: 9.2895,
      longitude: 79.3210,
      notes: 'Near Government Tourism Help Desk',
    },
    members: [
      { id: 'm1', name: 'You (Organizer)', email: 'vamsi@yatraguard.in', relationship: 'Self', avatarColor: '#E07A5F', currentPlaceId: 'agni', currentPlaceName: 'Agni Theertham', latitude: 9.2895, longitude: 79.3210, battery: 94, lastUpdated: 'Just now', status: 'SAFE', isCurrentUser: true },
      { id: 'm2', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', relationship: 'Brother', avatarColor: '#3D5A80', currentPlaceId: 'ramanathaswamy', currentPlaceName: 'Ramanathaswamy East Corridor', latitude: 9.2881, longitude: 79.3174, battery: 71, lastUpdated: '2 min ago', status: 'CAUTION' },
      { id: 'm3', name: 'Priya Sharma', email: 'priya.s@gmail.com', relationship: 'Sister', avatarColor: '#81B29A', currentPlaceId: 'agni', currentPlaceName: 'Sea View Promenade', latitude: 9.2890, longitude: 79.3205, battery: 80, lastUpdated: '4 min ago', status: 'SAFE' },
    ],
    sosEvents: [],
  },
};

export const alerts = [
  { id: 'a1', severity: 'CRITICAL' as AlertSeverity, title: 'Main temple queue', body: 'Sri Venkateswara Temple is at 118% occupancy. Avoid entering the queue area right now.', time: '8 min ago', destinationId: 'tirumala' },
  { id: 'a2', severity: 'WARNING' as AlertSeverity, title: 'Parking nearly full', body: 'Alipiri Parking has only 7.5% availability. Consider the Tirupati Central alternative.', time: '22 min ago', destinationId: 'tirumala' },
  { id: 'a3', severity: 'INFO' as AlertSeverity, title: 'Bus services increased', body: 'Additional shuttle buses are running between Tirupati and Tirumala until 8 PM.', time: '1 hr ago', destinationId: 'tirumala' },
  { id: 'a4', severity: 'HIGH' as AlertSeverity, title: 'Ghat route busy after 5 PM', body: 'The Varanasi riverfront is expected to become very busy. Assi Ghat is a calmer alternative.', time: '2 hrs ago', destinationId: 'varanasi' },
];

export const transportation = [
  { icon: 'bus', label: 'Next bus', value: 'In 08 min', detail: 'Frequent shuttle • Moderate crowd' },
  { icon: 'navigation', label: 'Travel time', value: '18 min', detail: 'Tirupati → Tirumala' },
  { icon: 'truck', label: 'Parking', value: '7.5% free', detail: 'Alipiri Parking • Critical' },
];

export const food = [
  { name: 'Annamayya Tiffin Centre', detail: 'Vegetarian • ₹₹ • 0.8 km', crowd: 'LOW', rating: '4.6' },
  { name: 'Tirumala Laddu Complex', detail: 'Local food • ₹ • 1.2 km', crowd: 'MODERATE', rating: '4.4' },
];

export const emergencyPoints = [
  { icon: 'plus-square', label: 'Tirumala First Aid Centre', detail: 'Medical assistance • 1.1 km', action: 'Call help' },
  { icon: 'shield', label: 'Tirumala Police Help Desk', detail: 'Safety desk • 0.6 km', action: 'Navigate' },
  { icon: 'users', label: 'Women & Child Help', detail: '24/7 support • 0.9 km', action: 'Call help' },
  { icon: 'droplet', label: 'Drinking Water Point', detail: 'Free water • 0.3 km', action: 'Navigate' },
];

export const imageAssets = {
  tirumala: require('../assets/images/tirumala.jpg'),
  varanasi: require('../assets/images/varanasi.jpg'),
  rameswaram: require('../assets/images/rameswaram.jpg'),
  prayagraj: require('../assets/images/prayagraj.png'),
};

export function getCrowdLevel(occupancy: number): CrowdLevel {
  if (occupancy <= 30) return 'LOW';
  if (occupancy <= 60) return 'MODERATE';
  if (occupancy <= 80) return 'HIGH';
  if (occupancy <= 100) return 'VERY HIGH';
  if (occupancy <= 120) return 'CRITICAL';
  return 'DANGEROUS';
}

export const destinationTransports: Record<string, DestinationTransportData> = {
  tirumala: {
    destinationId: 'tirumala',
    localOptions: [
      { id: 'tiru-loc-1', type: 'shuttle', title: 'TTD Free Dharma Ratham Shuttle', routeName: 'Hill Ring Road Circular', travelTime: '15-20 mins', approxCost: 'Free', frequencyOrAvailability: 'Every 10 mins (24/7)', congestion: 'MODERATE', isRecommended: true, notes: 'Free eco-friendly electric buses connecting all main rest houses & queue complexes.' },
      { id: 'tiru-loc-2', type: 'auto', title: 'Local Shared / Prepaid Auto', routeName: 'Tirumala Bus Stand to Rest Houses', travelTime: '10 mins', approxCost: '₹50 - ₹120', frequencyOrAvailability: 'Available 24/7', congestion: 'LOW', isRecommended: false, notes: 'Prepaid counter available near CRO office. Regulated rates.' },
      { id: 'tiru-loc-3', type: 'taxi', title: 'APSRTC Ghat Taxi / Cab', routeName: 'Tirumala Hill <-> Tirupati Town', travelTime: '45 mins', approxCost: '₹600 - ₹900', frequencyOrAvailability: 'On Demand', congestion: 'MODERATE', isRecommended: false, notes: 'Direct door-to-door cab via Alipiri Toll Gate.' },
      { id: 'tiru-loc-4', type: 'walk', title: 'Srivari Mettu & Alipiri Footpaths', routeName: 'Tirupati Footpath Trail', travelTime: '3.5 - 4.5 hrs', approxCost: 'Free', frequencyOrAvailability: 'Open 4:00 AM - 10:00 PM', congestion: 'HIGH', isRecommended: false, notes: 'Sacred walking steps trail with free luggage transfer facilities.' },
    ],
    returnOptions: [
      { id: 'tiru-ret-1', type: 'bus', title: 'APSRTC Saptagiri Express Bus', routeName: 'Tirumala Bus Stand -> Tirupati Railway Station / Central Bus Stand', travelTime: '50 mins', approxCost: '₹70', frequencyOrAvailability: 'Every 2 mins continuous', congestion: 'LOW', isRecommended: true, notes: 'Frequent electric & express RTC buses descending the ghat road.' },
      { id: 'tiru-ret-2', type: 'train', title: 'Tirupati Main (TPTY) & Renigunta (RU) Junctions', routeName: 'Rail Connect to Hyderabad, Chennai, Bangalore, Vijayawada', travelTime: '45 mins to station', approxCost: '₹150 - ₹1,400 (Train Fare)', frequencyOrAvailability: 'Over 80 daily express & Vande Bharat trains', congestion: 'MODERATE', isRecommended: true, notes: 'Direct trains to major metropolitan hubs.' },
      { id: 'tiru-ret-3', type: 'flight', title: 'Tirupati International Airport (TIR / Renigunta)', routeName: 'Tirumala -> TIR Airport (38 km)', travelTime: '1 hr by taxi', approxCost: '₹900 cab + Flight Fare', frequencyOrAvailability: 'Daily flights by IndiGo, Alliance Air, Air India Express', congestion: 'LOW', isRecommended: false, notes: 'Non-stop flights to Hyderabad, Bangalore, Mumbai, New Delhi.' },
    ],
  },
  varanasi: {
    destinationId: 'varanasi',
    localOptions: [
      { id: 'var-loc-1', type: 'auto', title: 'Shared E-Rickshaw / Toto', routeName: 'Godowlia Chowk <-> Dashashwamedh Ghat & Assi', travelTime: '15 mins', approxCost: '₹20 - ₹50', frequencyOrAvailability: 'Continuous', congestion: 'HIGH', isRecommended: true, notes: 'Best for narrow inner alleyways near main ghats where cars cannot enter.' },
      { id: 'var-loc-2', type: 'taxi', title: 'Varanasi Prepaid Auto & Cab Stand', routeName: 'Cantonment <-> Chowk & Sarnath', travelTime: '25-40 mins', approxCost: '₹150 - ₹400', frequencyOrAvailability: 'Available 24/7', congestion: 'MODERATE', isRecommended: false, notes: 'Prepaid taxis available at Varanasi Junction (BSB).' },
      { id: 'var-loc-3', type: 'shuttle', title: 'Ganga Cruise & Wooden Ferry Shuttle', routeName: 'Assi Ghat <-> Manikarnika <-> Kashi Vishwanath Corridor', travelTime: '30 mins scenic waterway', approxCost: '₹100 - ₹300', frequencyOrAvailability: 'Every 20 mins', congestion: 'LOW', isRecommended: true, notes: 'Bypasses land traffic jams with serene river transport.' },
    ],
    returnOptions: [
      { id: 'var-ret-1', type: 'train', title: 'Varanasi Junction (BSB) / Banaras (BSBS) / Deen Dayal Upadhyaya (DDU)', routeName: 'Intercity Rail Hub', travelTime: '25 mins to station', approxCost: '₹180 - ₹1,800', frequencyOrAvailability: '100+ daily trains including Vande Bharat Express', congestion: 'MODERATE', isRecommended: true, notes: 'Vande Bharat trains to New Delhi, Patna, Howrah.' },
      { id: 'var-ret-2', type: 'flight', title: 'Lal Bahadur Shastri International Airport (VNS / Babatpur)', routeName: 'Varanasi City -> VNS Airport (26 km)', travelTime: '45 mins - 1 hr', approxCost: '₹750 cab + Airfare', frequencyOrAvailability: 'Frequent direct flights', congestion: 'LOW', isRecommended: true, notes: 'Direct flights to Delhi, Mumbai, Bengaluru, Kolkata, Ahmedabad.' },
      { id: 'var-ret-3', type: 'bus', title: 'UPSRTC Volvo & AC Janrath Buses', routeName: 'Varanasi Bus Stand -> Lucknow / Ayodhya / Prayagraj', travelTime: '3-6 hrs depending on destination', approxCost: '₹250 - ₹650', frequencyOrAvailability: 'Every 30 mins', congestion: 'MODERATE', isRecommended: false, notes: 'Direct highway buses across Uttar Pradesh.' },
    ],
  },
  prayagraj: {
    destinationId: 'prayagraj',
    localOptions: [
      { id: 'pra-loc-1', type: 'auto', title: 'Mela & Sangam E-Auto Shuttle', routeName: 'Civil Lines <-> Triveni Sangam & Bade Hanuman Temple', travelTime: '20 mins', approxCost: '₹30 - ₹70', frequencyOrAvailability: 'Every 5 mins', congestion: 'MODERATE', isRecommended: true, notes: 'Eco-friendly battery rickshaws allowed deep into Sangam Mela zone.' },
      { id: 'pra-loc-2', type: 'taxi', title: 'City Prepaid Taxi Service', routeName: 'Prayagraj Junction <-> Sangam Ghats', travelTime: '25 mins', approxCost: '₹200 - ₹450', frequencyOrAvailability: 'Available 24/7', congestion: 'LOW', isRecommended: false, notes: 'AC cabs for family groups.' },
    ],
    returnOptions: [
      { id: 'pra-ret-1', type: 'train', title: 'Prayagraj Junction (PRYJ) & Subedarganj (SFG)', routeName: 'North Central Railway Headquarters Station', travelTime: '15 mins to station', approxCost: '₹150 - ₹1,600', frequencyOrAvailability: 'Direct connections across India', congestion: 'MODERATE', isRecommended: true, notes: 'High frequency express trains to Delhi, Kanpur, Varanasi, Mumbai.' },
      { id: 'pra-ret-2', type: 'flight', title: 'Prayagraj Airport (IXD / Bamrauli)', routeName: 'Prayagraj City -> IXD Airport (12 km)', travelTime: '30 mins', approxCost: '₹400 cab + Airfare', frequencyOrAvailability: 'Daily flights', congestion: 'LOW', isRecommended: true, notes: 'Direct flights to Delhi, Mumbai, Bangalore, Pune, Bhopal.' },
      { id: 'pra-ret-3', type: 'bus', title: 'UPSRTC Inter-City Bus Terminal', routeName: 'Civil Lines Bus Stand -> Ayodhya / Varanasi / Lucknow', travelTime: '2.5 - 4 hrs', approxCost: '₹200 - ₹500', frequencyOrAvailability: 'Every 20 mins', congestion: 'LOW', isRecommended: false, notes: 'Frequent state roadways buses.' },
    ],
  },
  rameswaram: {
    destinationId: 'rameswaram',
    localOptions: [
      { id: 'ram-loc-1', type: 'auto', title: 'Rameswaram Town Auto Rickshaw', routeName: 'Ramanathaswamy Temple <-> Agni Theertham & Local Teerthams', travelTime: '10 mins', approxCost: '₹40 - ₹100', frequencyOrAvailability: 'Available continuously', congestion: 'LOW', isRecommended: true, notes: 'Fixed meter/negotiated rates around temple streets.' },
      { id: 'ram-loc-2', type: 'bus', title: 'Tamil Nadu State Town Bus & Dhanushkodi Jeep', routeName: 'Rameswaram Bus Stand <-> Dhanushkodi Sangam Point (20 km)', travelTime: '35 mins', approxCost: '₹30 - ₹150', frequencyOrAvailability: 'Every 15 mins', congestion: 'MODERATE', isRecommended: true, notes: 'Best scenic coastal bus route to Dhanushkodi tip.' },
    ],
    returnOptions: [
      { id: 'ram-ret-1', type: 'train', title: 'Rameswaram Railway Station (RMM) & Pamban Sea Bridge', routeName: 'Southern Railway Network', travelTime: '10 mins to station', approxCost: '₹200 - ₹1,500', frequencyOrAvailability: 'Daily express trains', congestion: 'LOW', isRecommended: true, notes: 'Iconic train journey crossing Pamban Bridge to Chennai, Madurai, Kanyakumari.' },
      { id: 'ram-ret-2', type: 'bus', title: 'SETC & Private Sleeper Buses', routeName: 'Rameswaram Bus Stand -> Madurai, Chennai, Coimbatore, Bangalore', travelTime: '4 - 11 hrs', approxCost: '₹350 - ₹1,200', frequencyOrAvailability: 'Multiple evening departures', congestion: 'LOW', isRecommended: true, notes: 'Overnight comfortable sleeper buses.' },
      { id: 'ram-ret-3', type: 'flight', title: 'Madurai International Airport (IXM - 170 km away)', routeName: 'Rameswaram -> Madurai Airport', travelTime: '3 hrs by taxi/bus', approxCost: '₹2,500 cab + Airfare', frequencyOrAvailability: 'Daily flights', congestion: 'LOW', isRecommended: false, notes: 'Nearest major airport with domestic & international connectivity.' },
    ],
  },
};

export function getDestinationTransport(destinationId: string): DestinationTransportData {
  return destinationTransports[destinationId] || destinationTransports['tirumala'];
}

export function getOccupancy(place: Place) {
  return Math.round((place.crowd.current / place.crowd.capacity) * 100);
}

export function getRisk(place: Place) {
  const occupancy = getOccupancy(place);
  if (occupancy > 110 || (occupancy > 100 && place.crowd.trend > 12)) return 'CRITICAL';
  if (occupancy > 80 || place.crowd.waitingMinutes > 120) return 'HIGH';
  if (occupancy > 60 || place.crowd.trend > 8) return 'CAUTION';
  return 'LOW';
}

export function getDestinationPlaces(destinationId: string) {
  return places.filter((place) => place.destinationId === destinationId);
}

export function getPlace(id: string) {
  return places.find((place) => place.id === id);
}

export function getDestination(id: string) {
  return destinations.find((destination) => destination.id === id);
}

export const mockForecast = [82, 91, 108, 121, 114];