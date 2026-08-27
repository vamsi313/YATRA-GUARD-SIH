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
  image?: 'tirumala' | 'varanasi' | 'rameswaram';
  tags: string[];
  indoor?: boolean;
  wheelchair: boolean;
  seniorFriendly: boolean;
};

export type Destination = {
  id: string;
  name: string;
  region: string;
  image: 'tirumala' | 'varanasi' | 'rameswaram';
  weather: string;
  weatherDetail: string;
  rain: string;
  humidity: string;
  recommendedCount: number;
  overview: string;
  places: string[];
  alerts: string[];
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
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    region: 'Uttar Pradesh',
    image: 'varanasi',
    weather: '31°',
    weatherDetail: 'Clear skies',
    rain: '8%',
    humidity: '55%',
    recommendedCount: 5,
    overview: 'Where three rivers meet, with historic temples and a living festival landscape.',
    places: ['sangam', 'kumbh', 'hanuman', 'alopi'],
    alerts: ['Sangam approach road is moving slowly near the east gate.'],
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
  },
];

export const places: Place[] = [
  {
    id: 'venkateswara', name: 'Sri Venkateswara Temple', category: 'Temple', destinationId: 'tirumala',
    description: 'The main hill shrine and the heart of the Tirumala pilgrimage.',
    distance: '0 km', duration: '2–5 hours', hours: '3:00 AM – 11:00 PM', recommendedTime: 'After 5:00 PM',
    crowd: { capacity: 10000, current: 12000, waitingMinutes: 300, trend: 18, congestion: 'Critical at queue complex', narrowPathway: true },
    image: 'tirumala', tags: ['religious', 'must visit'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'kapila', name: 'Kapila Theertham', category: 'Nature + Temple', destinationId: 'tirumala',
    description: 'A tranquil waterfall shrine at the foot of the hills, ideal while the main queue settles.',
    distance: '3.4 km', duration: '45 min', hours: '6:00 AM – 7:00 PM', recommendedTime: 'Now',
    crowd: { capacity: 4000, current: 1360, waitingMinutes: 15, trend: 2, congestion: 'Open approach', narrowPathway: false },
    image: 'tirumala', tags: ['low crowd', 'senior friendly'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'tiruchanur', name: 'Tiruchanur Padmavathi Temple', category: 'Temple', destinationId: 'tirumala',
    description: 'A graceful temple visit near Tirupati with a calmer, family-friendly rhythm.',
    distance: '5.8 km', duration: '50 min', hours: '6:00 AM – 9:00 PM', recommendedTime: '2:30 PM',
    crowd: { capacity: 7000, current: 2870, waitingMinutes: 35, trend: 4, congestion: 'Moderate at entrance', narrowPathway: false },
    image: 'tirumala', tags: ['family', 'religious'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'silathoranam', name: 'Silathoranam', category: 'Nature', destinationId: 'tirumala',
    description: 'A rare natural rock arch surrounded by a quiet, breezy hill landscape.',
    distance: '8.2 km', duration: '40 min', hours: '8:00 AM – 6:00 PM', recommendedTime: 'Now',
    crowd: { capacity: 3500, current: 980, waitingMinutes: 5, trend: -3, congestion: 'Clear', narrowPathway: false },
    image: 'tirumala', tags: ['low crowd', 'photography'], wheelchair: false, seniorFriendly: false,
  },
  {
    id: 'alipiri', name: 'Alipiri Steps', category: 'Transport + Nature', destinationId: 'tirumala',
    description: 'The traditional walking route up the seven hills from Tirupati.',
    distance: '10.5 km', duration: '3–5 hours', hours: 'Open 24 hours', recommendedTime: 'Before sunrise',
    crowd: { capacity: 6000, current: 4740, waitingMinutes: 20, trend: 8, congestion: 'Busy near first arch', narrowPathway: true },
    tags: ['walking', 'heritage'], wheelchair: false, seniorFriendly: false,
  },
  {
    id: 'akasa', name: 'Akasa Ganga', category: 'Nature', destinationId: 'tirumala',
    description: 'A sacred forest waterfall and refreshing stop along the Tirumala circuit.',
    distance: '4.8 km', duration: '35 min', hours: '7:00 AM – 6:00 PM', recommendedTime: 'Morning',
    crowd: { capacity: 2500, current: 875, waitingMinutes: 10, trend: 1, congestion: 'Clear', narrowPathway: true },
    tags: ['nature', 'low crowd'], wheelchair: false, seniorFriendly: false,
  },
  {
    id: 'sangam', name: 'Triveni Sangam', category: 'Riverfront', destinationId: 'prayagraj',
    description: 'The sacred meeting point of the Ganga, Yamuna and invisible Saraswati.',
    distance: '2.1 km', duration: '90 min', hours: '5:00 AM – 8:00 PM', recommendedTime: 'Early morning',
    crowd: { capacity: 18000, current: 12960, waitingMinutes: 45, trend: 7, congestion: 'Busy at boat jetty', narrowPathway: false },
    image: 'varanasi', tags: ['religious', 'photography'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'kumbh', name: 'Kumbh Mela Main Area', category: 'Festival', destinationId: 'prayagraj',
    description: 'A changing festival district with color, devotion and high crowd movement.',
    distance: '4.4 km', duration: '2 hours', hours: 'Open 24 hours', recommendedTime: 'Before 9:00 AM',
    crowd: { capacity: 30000, current: 31800, waitingMinutes: 90, trend: 15, congestion: 'High at sector 4', narrowPathway: false },
    image: 'varanasi', tags: ['heritage', 'high crowd'], wheelchair: true, seniorFriendly: false,
  },
  {
    id: 'hanuman', name: 'Bade Hanuman Temple', category: 'Temple', destinationId: 'prayagraj',
    description: 'A beloved temple with a distinctive reclining Hanuman idol.',
    distance: '3.2 km', duration: '40 min', hours: '5:00 AM – 10:00 PM', recommendedTime: 'Late afternoon',
    crowd: { capacity: 5000, current: 1800, waitingMinutes: 20, trend: 0, congestion: 'Open', narrowPathway: false },
    tags: ['religious', 'family'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'alopi', name: 'Alopi Devi Temple', category: 'Temple', destinationId: 'prayagraj',
    description: 'A compact, deeply revered shrine tucked into a lively old neighborhood.',
    distance: '2.7 km', duration: '35 min', hours: '6:00 AM – 9:00 PM', recommendedTime: 'Now',
    crowd: { capacity: 4000, current: 980, waitingMinutes: 10, trend: -2, congestion: 'Clear', narrowPathway: true },
    tags: ['low crowd', 'religious'], wheelchair: false, seniorFriendly: true,
  },
  {
    id: 'kashi', name: 'Kashi Vishwanath Temple', category: 'Temple', destinationId: 'varanasi',
    description: 'One of the most revered Shiva temples, set in the heart of the old city.',
    distance: '0 km', duration: '2 hours', hours: '2:30 AM – 11:00 PM', recommendedTime: 'Before 7:00 AM',
    crowd: { capacity: 12000, current: 11160, waitingMinutes: 140, trend: 12, congestion: 'Very high at gate 2', narrowPathway: true },
    image: 'varanasi', tags: ['religious', 'high crowd'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'dashashwamedh', name: 'Dashashwamedh Ghat', category: 'Ghat', destinationId: 'varanasi',
    description: 'The city’s iconic riverfront promenade and evening aarti setting.',
    distance: '1.2 km', duration: '75 min', hours: 'Open 24 hours', recommendedTime: 'Before 5:00 PM',
    crowd: { capacity: 10000, current: 9400, waitingMinutes: 30, trend: 10, congestion: 'Very high after 6 PM', narrowPathway: true },
    image: 'varanasi', tags: ['culture', 'photography'], wheelchair: false, seniorFriendly: false,
  },
  {
    id: 'assi', name: 'Assi Ghat', category: 'Ghat', destinationId: 'varanasi',
    description: 'A wider, more relaxed ghat known for sunrise rituals and local cafés.',
    distance: '5.1 km', duration: '90 min', hours: 'Open 24 hours', recommendedTime: 'Sunrise',
    crowd: { capacity: 8000, current: 2480, waitingMinutes: 10, trend: 2, congestion: 'Open', narrowPathway: false },
    image: 'varanasi', tags: ['low crowd', 'food'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'sarnath', name: 'Sarnath', category: 'Heritage', destinationId: 'varanasi',
    description: 'A peaceful heritage circuit marking the Buddha’s first teaching.',
    distance: '10.6 km', duration: '2 hours', hours: '8:00 AM – 6:00 PM', recommendedTime: 'Morning',
    crowd: { capacity: 9000, current: 2700, waitingMinutes: 12, trend: -1, congestion: 'Clear', narrowPathway: false },
    image: 'varanasi', tags: ['heritage', 'family'], wheelchair: true, seniorFriendly: true, indoor: true,
  },
  {
    id: 'sankat', name: 'Sankat Mochan Temple', category: 'Temple', destinationId: 'varanasi',
    description: 'A serene Hanuman temple set among trees near the Assi neighborhood.',
    distance: '6.2 km', duration: '45 min', hours: '5:00 AM – 10:00 PM', recommendedTime: '4:00 PM',
    crowd: { capacity: 4500, current: 1620, waitingMinutes: 18, trend: 4, congestion: 'Moderate', narrowPathway: false },
    tags: ['religious', 'family'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'ramanathaswamy', name: 'Ramanathaswamy Temple', category: 'Temple', destinationId: 'rameswaram',
    description: 'A monumental corridor temple and one of the most important Shaiva pilgrimages.',
    distance: '0 km', duration: '2 hours', hours: '5:00 AM – 9:00 PM', recommendedTime: 'Before 8:00 AM',
    crowd: { capacity: 15000, current: 9600, waitingMinutes: 75, trend: 9, congestion: 'Busy at east tower', narrowPathway: true },
    image: 'rameswaram', tags: ['religious', 'heritage'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'agni', name: 'Agni Theertham', category: 'Beach', destinationId: 'rameswaram',
    description: 'A sacred shoreline just outside the main temple with a wide ocean view.',
    distance: '0.8 km', duration: '40 min', hours: 'Open 24 hours', recommendedTime: 'Sunrise',
    crowd: { capacity: 7000, current: 2310, waitingMinutes: 5, trend: 1, congestion: 'Clear', narrowPathway: false },
    image: 'rameswaram', tags: ['nature', 'low crowd'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'pamban', name: 'Pamban Bridge', category: 'Attraction', destinationId: 'rameswaram',
    description: 'An iconic sea crossing with wide island vistas and a breezy stop.',
    distance: '11.4 km', duration: '45 min', hours: 'Daylight hours', recommendedTime: 'Morning',
    crowd: { capacity: 5000, current: 1700, waitingMinutes: 10, trend: 3, congestion: 'Open', narrowPathway: false },
    image: 'rameswaram', tags: ['photography', 'family'], wheelchair: true, seniorFriendly: true,
  },
  {
    id: 'dhanushkodi', name: 'Dhanushkodi', category: 'Nature', destinationId: 'rameswaram',
    description: 'A windswept edge-of-the-island landscape where land meets open sea.',
    distance: '20.7 km', duration: '2 hours', hours: '6:00 AM – 6:00 PM', recommendedTime: 'Before noon',
    crowd: { capacity: 6000, current: 1680, waitingMinutes: 10, trend: 4, congestion: 'Wind advisory', narrowPathway: false },
    image: 'rameswaram', tags: ['nature', 'photography'], wheelchair: false, seniorFriendly: false,
  },
  {
    id: 'kalam', name: 'Abdul Kalam Memorial', category: 'Heritage', destinationId: 'rameswaram',
    description: 'A thoughtful memorial celebrating India’s former president and scientist.',
    distance: '10.3 km', duration: '60 min', hours: '10:00 AM – 5:00 PM', recommendedTime: 'Afternoon',
    crowd: { capacity: 3500, current: 980, waitingMinutes: 8, trend: 0, congestion: 'Clear', narrowPathway: false },
    tags: ['heritage', 'family'], wheelchair: true, seniorFriendly: true, indoor: true,
  },
];

export const alerts = [
  { id: 'a1', severity: 'CRITICAL' as AlertSeverity, title: 'Main temple queue', body: 'Sri Venkateswara Temple is at 120% occupancy. Avoid entering the queue area right now.', time: '8 min ago', destinationId: 'tirumala' },
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
};

export function getCrowdLevel(occupancy: number): CrowdLevel {
  if (occupancy <= 30) return 'LOW';
  if (occupancy <= 60) return 'MODERATE';
  if (occupancy <= 80) return 'HIGH';
  if (occupancy <= 100) return 'VERY HIGH';
  if (occupancy <= 120) return 'CRITICAL';
  return 'DANGEROUS';
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