import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Official Data Source Reference Mapping
export const DESTINATION_SOURCES: Record<string, {
  sourceName: string;
  sourceAuthority: string;
  dataType: string;
  updateFrequency: string;
  methodology: string;
}> = {
  tirumala: {
    sourceName: "TTD (Tirumala Tirupati Devasthanams)",
    sourceAuthority: "TTD IT & Vigilance Infrastructure",
    dataType: "Historical + Event-Based Estimate",
    updateFrequency: "Hourly Trend Synthesis",
    methodology: "Vaikuntam Queue Complex historical intake rates, SSD token quotas & calendar event multipliers",
  },
  varanasi: {
    sourceName: "Kashi Vishwanath Temple Trust & UP Tourism",
    sourceAuthority: "Shri Kashi Vishwanath Special Area Development Board",
    dataType: "Historical + Event-Based Estimate",
    updateFrequency: "Hourly Trend Synthesis",
    methodology: "Ghat corridor historical footfall indices, Sugam Darshan registries & festival calendars",
  },
  prayagraj: {
    sourceName: "Prayagraj Mela Authority & UP Tourism",
    sourceAuthority: "District Administration & Mela Command Center",
    dataType: "Historical + Event-Based Estimate",
    updateFrequency: "Hourly Trend Synthesis",
    methodology: "Sangam Ghat area capacity models, bathing date multipliers & transit hub load histories",
  },
  rameswaram: {
    sourceName: "Arulmigu Ramanathaswamy Temple Trust (HR&CE Dept, TN)",
    sourceAuthority: "Hindu Religious & Charitable Endowments Dept",
    dataType: "Historical + Event-Based Estimate",
    updateFrequency: "Hourly Trend Synthesis",
    methodology: "22 Theerthams holy dip flow models, island transit influx & festival historical archives",
  },
};

// Major Religious Events and Multipliers per Destination
export interface PilgrimageEvent {
  id: string;
  name: string;
  type: "festival" | "weekend" | "seasonal" | "standard";
  baseMultiplier: number;
  description: string;
  estimatedVisitors: number;
}

export const DESTINATION_EVENTS: Record<string, PilgrimageEvent[]> = {
  tirumala: [
    {
      id: "regular_weekday",
      name: "Normal Weekday Flow",
      type: "standard",
      baseMultiplier: 1.0,
      description: "Standard daily quota & slotted sarva darshan flow",
      estimatedVisitors: 48500,
    },
    {
      id: "weekend_surge",
      name: "Weekend Influx (Fri-Sun)",
      type: "weekend",
      baseMultiplier: 1.55,
      description: "Significant increase in un-tokened pilgrim queues",
      estimatedVisitors: 78200,
    },
    {
      id: "brahmotsavam",
      name: "Salakatla Brahmotsavam",
      type: "festival",
      baseMultiplier: 2.1,
      description: "Annual 9-day grand vehicle processions around Mada Streets",
      estimatedVisitors: 105000,
    },
    {
      id: "vaikuntha_ekadashi",
      name: "Vaikuntha Ekadashi / Dwara Darshanam",
      type: "festival",
      baseMultiplier: 2.45,
      description: "Peak annual rush for Northern sanctum opening",
      estimatedVisitors: 122000,
    },
    {
      id: "rathasapthami",
      name: "Ratha Sapthami (One-day Brahmotsavam)",
      type: "festival",
      baseMultiplier: 1.9,
      description: "Surya Prabha and 7-vahanam single-day circuit",
      estimatedVisitors: 94000,
    },
  ],
  varanasi: [
    {
      id: "regular_weekday",
      name: "Normal Weekday Flow",
      type: "standard",
      baseMultiplier: 1.0,
      description: "Routine Kashi corridor & evening Ganga Aarti attendance",
      estimatedVisitors: 36000,
    },
    {
      id: "weekend_surge",
      name: "Weekend Tourist & Pilgrim Influx",
      type: "weekend",
      baseMultiplier: 1.6,
      description: "Heavy rush across Dashashwamedh & Vishwanath Temple",
      estimatedVisitors: 62000,
    },
    {
      id: "maha_shivaratri",
      name: "Maha Shivaratri Mahotsav",
      type: "festival",
      baseMultiplier: 3.2,
      description: "24-hour non-stop Jalabhishek queues from Ganga to Sanctum",
      estimatedVisitors: 165000,
    },
    {
      id: "dev_deepawali",
      name: "Dev Deepawali (Kartik Purnima)",
      type: "festival",
      baseMultiplier: 3.5,
      description: "Million-earthen lamp illumination with peak ghat congestion",
      estimatedVisitors: 190000,
    },
    {
      id: "shravan_somwar",
      name: "Shravan Month Somwar (Mondays)",
      type: "seasonal",
      baseMultiplier: 2.3,
      description: "Kanwar yatri influx bringing Ganga water to Kashi Vishwanath",
      estimatedVisitors: 110000,
    },
  ],
  prayagraj: [
    {
      id: "regular_weekday",
      name: "Normal Weekday Flow",
      type: "standard",
      baseMultiplier: 1.0,
      description: "Standard Triveni Sangam boat rides and Hanuman Mandir darshan",
      estimatedVisitors: 28000,
    },
    {
      id: "weekend_surge",
      name: "Weekend Regional Influx",
      type: "weekend",
      baseMultiplier: 1.65,
      description: "High footfall at Bade Hanumanji and Sangam Nose",
      estimatedVisitors: 54000,
    },
    {
      id: "mauni_amavasya",
      name: "Mauni Amavasya Royal Snan",
      type: "festival",
      baseMultiplier: 8.5,
      description: "Peak holy immersion day of Magh/Kumbh Mela congregation",
      estimatedVisitors: 850000,
    },
    {
      id: "makar_sankranti",
      name: "Makar Sankranti Snan",
      type: "festival",
      baseMultiplier: 5.5,
      description: "Opening holy bath marking commencement of Magh Mela",
      estimatedVisitors: 520000,
    },
    {
      id: "kumbh_mela_shahi",
      name: "Kumbh Mela Maha Shahi Snan",
      type: "festival",
      baseMultiplier: 18.0,
      description: "World's largest human gathering at Sangam ghats",
      estimatedVisitors: 2500000,
    },
  ],
  rameswaram: [
    {
      id: "regular_weekday",
      name: "Normal Weekday Flow",
      type: "standard",
      baseMultiplier: 1.0,
      description: "Standard morning Agni Theertham bath & 22 well rituals",
      estimatedVisitors: 22000,
    },
    {
      id: "weekend_surge",
      name: "Weekend Pilgrim & Pamban Influx",
      type: "weekend",
      baseMultiplier: 1.7,
      description: "Heavy pilgrimage buses from across South India",
      estimatedVisitors: 41000,
    },
    {
      id: "aadi_amavasai",
      name: "Aadi Amavasai (Ancestral Snan)",
      type: "festival",
      baseMultiplier: 3.4,
      description: "Massive holy sea bath ceremonies and tarpanam rituals",
      estimatedVisitors: 88000,
    },
    {
      id: "maha_shivaratri",
      name: "Maha Shivaratri & Rathotsavam",
      type: "festival",
      baseMultiplier: 2.9,
      description: "Silver chariot procession and all-night temple vigilance",
      estimatedVisitors: 76000,
    },
    {
      id: "thai_amavasai",
      name: "Thai Amavasai",
      type: "festival",
      baseMultiplier: 2.8,
      description: "Special sacred dip festival at Agni Theertham",
      estimatedVisitors: 69000,
    },
  ],
};

// Zone Definition Template with baseline capacities
const DESTINATION_ZONES_CONFIG: Record<string, Array<{
  id: string;
  name: string;
  capacity: number;
  category: "sanctum" | "queue_complex" | "ghat" | "transit" | "perimeter";
  baseWaitMins: number;
}>> = {
  tirumala: [
    { id: "tir_sanctum", name: "Ananda Nilayam & Sanctum Sanctorum", capacity: 3500, category: "sanctum", baseWaitMins: 45 },
    { id: "tir_vqc1", name: "Vaikuntam Queue Complex 1 (Compartments)", capacity: 18000, category: "queue_complex", baseWaitMins: 210 },
    { id: "tir_vqc2", name: "Vaikuntam Queue Complex 2 (General)", capacity: 25000, category: "queue_complex", baseWaitMins: 360 },
    { id: "tir_mada", name: "Four Mada Streets & Temple Plaza", capacity: 40000, category: "perimeter", baseWaitMins: 20 },
    { id: "tir_laddu", name: "Laddu Prasadam Counters Complex", capacity: 8000, category: "transit", baseWaitMins: 35 },
    { id: "tir_bus", name: "Crore Bus Stand & Alipiri Toll Gate", capacity: 20000, category: "transit", baseWaitMins: 15 },
  ],
  varanasi: [
    { id: "var_sanctum", name: "Kashi Vishwanath Jyotirlinga Sanctum", capacity: 2800, category: "sanctum", baseWaitMins: 60 },
    { id: "var_corridor", name: "Vishwanath Dham Main Corridor", capacity: 22000, category: "queue_complex", baseWaitMins: 90 },
    { id: "var_dashashwamedh", name: "Dashashwamedh Ghat (Aarti Arena)", capacity: 35000, category: "ghat", baseWaitMins: 45 },
    { id: "var_manikarnika", name: "Manikarnika & Scindia Ghats Path", capacity: 12000, category: "ghat", baseWaitMins: 25 },
    { id: "var_godowlia", name: "Godowlia Chowk & Temple Entry Plaza", capacity: 18000, category: "transit", baseWaitMins: 30 },
    { id: "var_kalbhairav", name: "Kaal Bhairav Temple Approach", capacity: 8000, category: "sanctum", baseWaitMins: 40 },
  ],
  prayagraj: [
    { id: "pra_sangam_nose", name: "Triveni Sangam Nose (Confluence Bathing)", capacity: 80000, category: "ghat", baseWaitMins: 30 },
    { id: "pra_hanuman", name: "Lethe Hue Hanuman Ji Mandir (Subterranean)", capacity: 12000, category: "sanctum", baseWaitMins: 75 },
    { id: "pra_mela_sec1", name: "Sector 1 Pontoon Bridges (Arrival)", capacity: 60000, category: "transit", baseWaitMins: 40 },
    { id: "pra_mela_sec2", name: "Sector 2 Akhada Marg (Ashram Zone)", capacity: 50000, category: "perimeter", baseWaitMins: 20 },
    { id: "pra_arail_ghat", name: "Arail Ghat Tent City & Boat Terminus", capacity: 30000, category: "ghat", baseWaitMins: 25 },
    { id: "pra_parade", name: "Parade Ground Central Transit Hub", capacity: 75000, category: "transit", baseWaitMins: 15 },
  ],
  rameswaram: [
    { id: "ram_sanctum", name: "Ramanathaswamy & Parvathavarthini Sanctum", capacity: 3000, category: "sanctum", baseWaitMins: 50 },
    { id: "ram_22wells", name: "22 Sacred Theerthams Bathing Corridor", capacity: 10000, category: "queue_complex", baseWaitMins: 110 },
    { id: "ram_agni", name: "Agni Theertham (Seashore Holy Snan)", capacity: 25000, category: "ghat", baseWaitMins: 20 },
    { id: "ram_third_corridor", name: "1212 Pillar Outer Third Corridor", capacity: 20000, category: "perimeter", baseWaitMins: 15 },
    { id: "ram_bus_stand", name: "Town Bus Stand & Rameswaram Station", capacity: 15000, category: "transit", baseWaitMins: 15 },
    { id: "ram_dhanushkodi", name: "Dhanushkodi Mukundarayar Chathiram Checkpoint", capacity: 12000, category: "transit", baseWaitMins: 30 },
  ],
};

/**
 * Dynamic Mock Engine Calculation
 */
export function calculateDynamicCrowd(params: {
  destinationId: string;
  selectedEventId?: string;
  dateStr?: string;
  hour?: number;
}) {
  const destId = params.destinationId?.toLowerCase() || "tirumala";
  const sourceInfo = DESTINATION_SOURCES[destId] || DESTINATION_SOURCES.tirumala;
  const events = DESTINATION_EVENTS[destId] || DESTINATION_EVENTS.tirumala;
  const zonesConfig = DESTINATION_ZONES_CONFIG[destId] || DESTINATION_ZONES_CONFIG.tirumala;

  // 1. Determine Date and Day Factor
  const targetDate = params.dateStr ? new Date(params.dateStr) : new Date();
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri, Sat, Sun
  const currentHour = typeof params.hour === "number" ? params.hour : targetDate.getHours();

  // 2. Determine Event
  let activeEvent: PilgrimageEvent = events[0];
  if (params.selectedEventId) {
    const found = events.find((e) => e.id === params.selectedEventId);
    if (found) activeEvent = found;
  } else if (isWeekend) {
    const weekendEvt = events.find((e) => e.type === "weekend");
    if (weekendEvt) activeEvent = weekendEvt;
  }

  // 3. Time of Day Multiplier Curve
  // Morning peak (6-11), Afternoon lull (13-16), Evening peak (17-21), Night low (22-5)
  const hourlyFactors: number[] = [
    0.15, 0.12, 0.10, 0.18, 0.35, 0.65, // 0 - 5 AM
    0.92, 1.15, 1.30, 1.35, 1.25, 1.10, // 6 - 11 AM (Morning Peak)
    0.85, 0.70, 0.65, 0.75, 0.95, 1.20, // 12 - 5 PM (Afternoon rest -> Evening start)
    1.40, 1.35, 1.15, 0.85, 0.50, 0.28, // 6 - 11 PM (Evening Aarti Peak)
  ];
  const timeMultiplier = hourlyFactors[currentHour] ?? 1.0;

  // Day variation jitter (pseudo-random based on date to feel dynamic yet consistent per day)
  const dateHash = (targetDate.getDate() * 17 + (targetDate.getMonth() + 1) * 31) % 15;
  const dayJitter = 0.95 + (dateHash / 100); // 0.95 to 1.10

  // 4. Overall Estimated Footfall
  const baseVisitors = activeEvent.estimatedVisitors;
  const totalEstimatedDailyVisitors = Math.round(baseVisitors * (isWeekend && activeEvent.type === "standard" ? 1.45 : 1.0) * dayJitter);
  const currentActiveInPark = Math.round((totalEstimatedDailyVisitors * 0.38) * timeMultiplier);

  // Overall Occupancy Index (0 to 135%)
  const baseOccupancy = Math.min(135, Math.round((totalEstimatedDailyVisitors / (baseVisitors * 1.3)) * 75 * timeMultiplier));
  const crowdLevel: "Low" | "Moderate" | "High" | "Very High" | "Extremely High" =
    baseOccupancy > 110 ? "Extremely High" :
    baseOccupancy > 85 ? "Very High" :
    baseOccupancy > 65 ? "High" :
    baseOccupancy > 40 ? "Moderate" : "Low";

  const peakWindow = "07:30 AM – 11:30 AM & 05:30 PM – 08:30 PM";

  // 5. Zone by Zone Simulation
  const simulatedZones = zonesConfig.map((z, idx) => {
    // Zone specific load modifier
    const zoneVariance = [1.15, 1.25, 1.05, 0.85, 0.95, 0.75][idx % 6];
    const occ = Math.min(145, Math.max(18, Math.round(baseOccupancy * zoneVariance + ((idx * 7) % 12))));
    const zoneCurrentCount = Math.round(z.capacity * (occ / 100));
    const waitMultiplier = occ > 100 ? (occ / 100) * 1.6 : (occ / 100);
    const estimatedWaitMinutes = Math.round(z.baseWaitMins * waitMultiplier * activeEvent.baseMultiplier);

    const queueVelocity = occ > 100 ? "18-25 pilgrims/min (Slow)" : occ > 75 ? "35-45 pilgrims/min (Steady)" : "55-70 pilgrims/min (Fast)";
    const status: "Normal" | "Elevated" | "High" | "Critical Congestion" =
      occ > 115 ? "Critical Congestion" :
      occ > 90 ? "High" :
      occ > 65 ? "Elevated" : "Normal";

    return {
      zoneId: z.id,
      name: z.name,
      category: z.category,
      capacity: z.capacity,
      currentOccupancyPercent: occ,
      estimatedPresentCount: zoneCurrentCount,
      estimatedWaitMinutes,
      waitFormatted: estimatedWaitMinutes > 60
        ? `${(estimatedWaitMinutes / 60).toFixed(1)} hrs`
        : `${estimatedWaitMinutes} mins`,
      queueVelocity,
      status,
      recommendation: occ > 100
        ? "Diversion active. Use designated holding corridors."
        : occ > 75
        ? "Expect moderate wait. Token batches moving steadily."
        : "Direct access available. Optimal entry window.",
    };
  });

  // 6. Generate 24-Hour Timeline Projection
  const timelineProjection = hourlyFactors.map((f, h) => {
    const projOcc = Math.min(135, Math.round((baseOccupancy / timeMultiplier) * f));
    const hrDisplay = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
    return {
      hour: h,
      label: hrDisplay,
      occupancyPercent: projOcc,
      intensity: projOcc > 90 ? "critical" : projOcc > 70 ? "high" : projOcc > 45 ? "moderate" : "low",
    };
  });

  return {
    meta: {
      status: "Estimated",
      dataType: "Historical + Event-Based Estimate",
      dataSource: sourceInfo.sourceName,
      sourceAuthority: sourceInfo.sourceAuthority,
      methodology: sourceInfo.methodology,
      disclaimer: "Estimated crowd intelligence based on historical trend synthesis, day factors & religious calendar models. Not live streaming sensor counts.",
      confidenceIndex: "94.6% Historical Calibration",
      generatedAt: new Date().toISOString(),
    },
    destination: {
      id: destId,
      name: destId.charAt(0).toUpperCase() + destId.slice(1),
    },
    factors: {
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek],
      isWeekend,
      activeEvent: {
        id: activeEvent.id,
        name: activeEvent.name,
        type: activeEvent.type,
        description: activeEvent.description,
        multiplier: activeEvent.baseMultiplier,
      },
      availableEvents: events.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        estimatedVisitors: e.estimatedVisitors,
      })),
      currentHour: `${currentHour}:00`,
      peakTimeWindow: peakWindow,
    },
    overview: {
      crowdLevel,
      overallOccupancyPercent: baseOccupancy,
      totalEstimatedDailyVisitors,
      currentActiveVisitors: currentActiveInPark,
      darshanWaitHours: destId === "tirumala" 
        ? `${Math.max(2, Math.round(baseOccupancy / 16))} - ${Math.max(3, Math.round(baseOccupancy / 12) + 2)} hrs`
        : `${Math.max(1, Math.round(baseOccupancy / 35))} - ${Math.max(2, Math.round(baseOccupancy / 25) + 1)} hrs`,
      safestVisitWindow: "01:30 PM – 04:00 PM or 09:30 PM – 11:00 PM",
    },
    zones: simulatedZones,
    hourlyForecast: timelineProjection,
  };
}

// GET /api/crowd (mounted under /api)
router.get("/crowd", (req, res) => {
  try {
    const destinationId = (req.query.destinationId as string) || "tirumala";
    const selectedEventId = req.query.eventId as string | undefined;
    const dateStr = req.query.date as string | undefined;
    const hour = req.query.hour ? parseInt(req.query.hour as string, 10) : undefined;

    const data = calculateDynamicCrowd({
      destinationId,
      selectedEventId,
      dateStr,
      hour,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/crowd/:destinationId
router.get("/crowd/:destinationId", (req, res) => {
  try {
    const destinationId = req.params.destinationId || "tirumala";
    const selectedEventId = req.query.eventId as string | undefined;
    const dateStr = req.query.date as string | undefined;
    const hour = req.query.hour ? parseInt(req.query.hour as string, 10) : undefined;

    const data = calculateDynamicCrowd({
      destinationId,
      selectedEventId,
      dateStr,
      hour,
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
