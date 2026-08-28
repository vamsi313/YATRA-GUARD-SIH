import { db, destinationsTable, placesTable, lodgesTable } from "./index";

export async function seed() {
  console.log("🌱 Starting Neon Database seeding for YatraGuard...");

  const destinationsData = [
    {
      id: "tirumala",
      name: "Tirumala",
      region: "Andhra Pradesh",
      image: "tirumala",
      weather: "28°",
      weatherDetail: "Partly cloudy",
      rain: "20%",
      humidity: "70%",
      overview: "Sacred hill town with temple darshan, forest trails and quiet alternatives.",
      alerts: ["Main temple queue has reached critical crowd levels.", "Alipiri parking is nearly full."],
    },
    {
      id: "prayagraj",
      name: "Prayagraj",
      region: "Uttar Pradesh",
      image: "varanasi",
      weather: "31°",
      weatherDetail: "Clear skies",
      rain: "8%",
      humidity: "55%",
      overview: "Where three rivers meet, with historic temples and a living festival landscape.",
      alerts: ["Sangam approach road is moving slowly near the east gate."],
    },
    {
      id: "varanasi",
      name: "Varanasi",
      region: "Uttar Pradesh",
      image: "varanasi",
      weather: "30°",
      weatherDetail: "Hazy sunshine",
      rain: "12%",
      humidity: "62%",
      overview: "Ancient riverfront energy, timeless rituals and a deep cultural trail.",
      alerts: ["Evening ghat route is expected to become very busy after 5 PM."],
    },
    {
      id: "rameswaram",
      name: "Rameswaram",
      region: "Tamil Nadu",
      image: "rameswaram",
      weather: "29°",
      weatherDetail: "Breezy",
      rain: "15%",
      humidity: "68%",
      overview: "Island pilgrimage with ocean horizons, bridge views and sacred corridors.",
      alerts: ["Strong winds expected near Dhanushkodi this afternoon."],
    },
  ];

  for (const dest of destinationsData) {
    await db.insert(destinationsTable).values(dest).onConflictDoNothing();
  }
  console.log("✅ Seeded destinations");

  const placesData = [
    {
      id: "venkateswara",
      name: "Sri Venkateswara Temple",
      category: "Temple",
      destinationId: "tirumala",
      description: "The main hill shrine and the heart of the Tirumala pilgrimage.",
      distance: "0 km",
      duration: "2–5 hours",
      hours: "3:00 AM – 11:00 PM",
      recommendedTime: "After 5:00 PM",
      crowd: { capacity: 10000, current: 12000, waitingMinutes: 300, trend: 18, congestion: "Critical at queue complex", narrowPathway: true },
      tags: ["religious", "must visit"],
      image: "tirumala",
      wheelchair: true,
      seniorFriendly: true,
    },
    {
      id: "kapila",
      name: "Kapila Theertham",
      category: "Nature + Temple",
      destinationId: "tirumala",
      description: "A tranquil waterfall shrine at the foot of the hills, ideal while the main queue settles.",
      distance: "3.4 km",
      duration: "45 min",
      hours: "6:00 AM – 7:00 PM",
      recommendedTime: "Now",
      crowd: { capacity: 4000, current: 1360, waitingMinutes: 15, trend: 2, congestion: "Open approach", narrowPathway: false },
      tags: ["low crowd", "senior friendly"],
      image: "tirumala",
      wheelchair: true,
      seniorFriendly: true,
    },
    {
      id: "silathoranam",
      name: "Silathoranam",
      category: "Nature",
      destinationId: "tirumala",
      description: "A rare natural rock arch surrounded by a quiet, breezy hill landscape.",
      distance: "8.2 km",
      duration: "40 min",
      hours: "8:00 AM – 6:00 PM",
      recommendedTime: "Now",
      crowd: { capacity: 3500, current: 980, waitingMinutes: 5, trend: -3, congestion: "Clear", narrowPathway: false },
      tags: ["low crowd", "photography"],
      image: "tirumala",
      wheelchair: false,
      seniorFriendly: false,
    },
  ];

  for (const place of placesData) {
    await db.insert(placesTable).values(place).onConflictDoNothing();
  }
  console.log("✅ Seeded places");

  const lodgesData = [
    {
      destinationId: "tirumala",
      name: "TTD Srinivasam Complex",
      category: "DHARAMSHALA",
      priceRange: "₹200 - ₹500",
      address: "Opposite Tirupati RTC Bus Stand, Tirupati",
      contactNumber: "+91 877 2277777",
      timings: "Open 24 Hours",
      amenities: ["Locker Facility", "Free Filter Water", "Canteen", "EV Charging"],
      rating: "4.5",
    },
    {
      destinationId: "tirumala",
      name: "Tarigonda Vengamamba Nitya Annadanam",
      category: "ANNADANAM",
      priceRange: "Free",
      address: "Near Srivari Temple, Tirumala",
      contactNumber: "+91 877 2264242",
      timings: "9:00 AM - 11:00 PM",
      amenities: ["Free Meals", "Clean Seating", "Elderly Ramp"],
      rating: "4.9",
    },
  ];

  for (const lodge of lodgesData) {
    await db.insert(lodgesTable).values(lodge).onConflictDoNothing();
  }
  console.log("✅ Seeded lodges and annadanam centers");
  console.log("🎉 Seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
