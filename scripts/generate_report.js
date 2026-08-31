const fs = require('fs');
const path = require('path');

const targetHtml = 'C:/Users/vamsi/Downloads/Tirumala_Pilgrimage_Crowd_Data_Reference_Report.html';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tirumala Pilgrimage Crowd Dynamics & Spatio-Temporal Reference Report</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap");
    @page { size: A4; margin: 16mm; }
    body {
      font-family: "Plus Jakarta Sans", sans-serif;
      line-height: 1.55;
      color: #0F172A;
      background: #FFFFFF;
      margin: 0;
      padding: 30px;
    }
    .header-box {
      border-left: 6px solid #FF8C00;
      background: #FFF7ED;
      padding: 20px 24px;
      border-radius: 12px;
      margin-bottom: 24px;
    }
    h1 { color: #1E293B; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px; }
    .meta-tag { font-size: 11px; font-weight: 800; color: #EA580C; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 8px; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; color: #475569; margin-top: 10px; }
    h2 { color: #0F172A; font-size: 15px; font-weight: 800; border-bottom: 2px solid #F1F5F9; padding-bottom: 6px; margin-top: 22px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11.5px; }
    th { background: #0F172A; color: #FFFFFF; text-align: left; padding: 8px 10px; font-weight: 700; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 8px 10px; border-bottom: 1px solid #E2E8F0; vertical-align: middle; }
    tr:nth-child(even) td { background: #F8FAFC; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 5px; font-size: 10px; font-weight: 800; letter-spacing: 0.4px; text-align: center; }
    .badge-low { background: #DCFCE7; color: #15803D; }
    .badge-mod { background: #FEF9C3; color: #854D0E; }
    .badge-high { background: #FFEDD5; color: #C2410C; }
    .badge-crit { background: #FEE2E2; color: #B91C1C; }
    .formula-box {
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: "JetBrains Mono", monospace;
      font-size: 11.5px;
      color: #0F172A;
      margin: 10px 0;
    }
    .callout-box {
      background: #EFF6FF;
      border-left: 4px solid #3B82F6;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 11.5px;
      margin: 12px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #E2E8F0;
      font-size: 11px;
      color: #64748B;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="meta-tag">YATRA GUARD · TECHNICAL REPORT & DATASET SPECIFICATION</div>
    <h1>Tirumala Pilgrimage Crowd Dynamics & Spatio-Temporal Reference Model</h1>
    <div class="meta-grid">
      <div><strong>Target Area:</strong> Tirumala Hills (Z1 to Z7 Operational Sectors)</div>
      <div><strong>Document ID:</strong> YG-TIRU-DYN-2026-V1</div>
      <div><strong>Variables:</strong> Geographic Zone, Time-of-Day, Date, Religious Festivals</div>
      <div><strong>Target Model:</strong> YatraGuard AI Predictive Engine</div>
    </div>
  </div>

  <h2>1. Geographic Sectors & Critical Choke Points</h2>
  <table>
    <thead>
      <tr>
        <th>Sector ID</th>
        <th>Zone Name</th>
        <th>Nominal Capacity</th>
        <th>Critical Choke Points / High Risk Features</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Z1</strong></td><td>Vaikuntam Queue Complex (VQC 1 & 2)</td><td>40,000 pilgrims (62 compartments)</td><td>Narrow entry turnstiles, compartment gates, holding corridor bottlenecks</td></tr>
      <tr><td><strong>Z2</strong></td><td>Main Srivari Sanctum & Mada Streets</td><td>25,000 pilgrims</td><td>Mada Street galleries during Vahanam processions, Ananda Nilayam exit</td></tr>
      <tr><td><strong>Z3</strong></td><td>Tarigonda Vengamamba Annadanam</td><td>12,000 pilgrims/hour</td><td>Ground floor queue barricades, lunch peak holding areas</td></tr>
      <tr><td><strong>Z4</strong></td><td>CRO Office & Laddu Complex</td><td>18,000 pilgrims</td><td>48 Laddu distribution counters, token verification booths</td></tr>
      <tr><td><strong>Z5</strong></td><td>Alipiri Footpath Steps (3,550 steps)</td><td>15,000 concurrent climbers</td><td>Galigopuram (Step 1000), Deer Park, Divya Darshan counter (Step 2000)</td></tr>
      <tr><td><strong>Z6</strong></td><td>Srivari Mettu Footpath (2,388 steps)</td><td>8,000 concurrent climbers</td><td>Steep mountain incline (Steps 1200-1800), mountain gate checkpoint</td></tr>
      <tr><td><strong>Z7</strong></td><td>Hill Ring Road & Ghat Transit</td><td>20,000 vehicles/day</td><td>Alipiri Toll Gate, CRO bus terminal, GNC circle junction</td></tr>
    </tbody>
  </table>

  <h2>2. Diurnal Cycle (Time-of-Day Footfall Variance)</h2>
  <table>
    <thead>
      <tr>
        <th>Time Slot (IST)</th>
        <th>Primary Temple Seva / Activity</th>
        <th>VQC Pressure</th>
        <th>Footpath Inflow</th>
        <th>Annadanam Load</th>
        <th>Dominant Flow Direction</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>03:00 - 06:00</strong></td><td>Suprabhatam & VIP Break Darshan</td><td>Moderate (15,000)</td><td>Moderate (Steps open 4 AM)</td><td>Low</td><td>VIP Lines & VQC 1</td></tr>
      <tr><td><strong>06:00 - 11:30</strong></td><td>General Sarva Darshan Peak</td><td><span class="badge badge-high">Very High (35,000)</span></td><td><strong>Peak Footfall</strong></td><td>High</td><td>Entry Gates & VQC 2</td></tr>
      <tr><td><strong>11:30 - 15:30</strong></td><td>Afternoon Darshan Continuous Run</td><td><span class="badge badge-crit">Critical (38,000)</span></td><td>Moderate (Heat slows climb)</td><td><span class="badge badge-crit">Extreme Load</span></td><td>Dining Hall & Laddu Counters</td></tr>
      <tr><td><strong>15:30 - 19:30</strong></td><td>Sahasra Deepalankara Seva</td><td><span class="badge badge-crit">Critical (40,000+)</span></td><td>High (Evening arrivals)</td><td>High</td><td>Mada Streets & Temple Plaza</td></tr>
      <tr><td><strong>19:30 - 23:30</strong></td><td>Night Darshan, Tomala & Archana</td><td>High (28,000)</td><td>Low (Tapering entries)</td><td>Moderate</td><td>Laddu Counters & Cottages</td></tr>
      <tr><td><strong>23:30 - 03:00</strong></td><td>Ekantha Seva (Temple Closes ~01:00 AM)</td><td>Low / Residual (10,000)</td><td>Closed / Restricted</td><td>Closed</td><td>Pilgrim Rest Houses & Sheds</td></tr>
    </tbody>
  </table>

  <h2>3. Religious Event & Festival Impact Multipliers (&mu;)</h2>
  <table>
    <thead>
      <tr>
        <th>Festival / Religious Event</th>
        <th>Lunar / Solar Calendar Window</th>
        <th>Daily Footfall</th>
        <th>Multiplier (&mu;)</th>
        <th>Most Stressed Sector</th>
        <th>Safety & Bottleneck Risk</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Annual Srivari Brahmotsavam</strong></td><td>Sep - Oct (9 Days)</td><td>110,000 - 135,000 / day</td><td><strong>2.3x</strong></td><td>Z2 (Mada Streets), Z1 (VQC)</td><td>Mada street gallery overflow</td></tr>
      <tr><td><strong>Garuda Vahanam Night</strong></td><td>Brahmotsavam Day 5 (8 PM - 1 AM)</td><td><strong>220,000+ peak in 12 hrs</strong></td><td><strong>3.8x</strong></td><td>Z2 (Inner Mada Streets)</td><td><span class="badge badge-crit">High Stampede Risk</span></td></tr>
      <tr><td><strong>Vaikunta Ekadasi & Dwadasi</strong></td><td>Dec - Jan (Margashirsha)</td><td>95,000 - 110,000 / day</td><td><strong>2.5x</strong></td><td>Z1 (VQC all 62 compartments)</td><td>35-40 hour continuous waiting queues</td></tr>
      <tr><td><strong>Rathasapthami (One-Day Brahmotsavam)</strong></td><td>Jan - Feb (Magha Shukla Saptami)</td><td>140,000 / day (7 Vahanams)</td><td><strong>3.1x</strong></td><td>Z2 (Mada Streets all day)</td><td>Dehydration & sun exposure in open galleries</td></tr>
      <tr><td><strong>Puratasi Saturdays (Tamil Devotees)</strong></td><td>Sep - Oct (4-5 Saturdays)</td><td>90,000 - 105,000 / day</td><td><strong>1.9x</strong></td><td>Z5 (Alipiri Steps), Z6 (Mettu)</td><td>Step bottlenecks at Milestones 1000 & 2000</td></tr>
      <tr><td><strong>Standard Weekend (Fri - Sun)</strong></td><td>Weekly</td><td>75,000 - 90,000 / day</td><td><strong>1.5x</strong></td><td>Z1, Z3, Z4</td><td>Regular compartment saturation</td></tr>
      <tr><td><strong>Standard Mid-Week (Tue - Wed)</strong></td><td>Normal Days</td><td>55,000 - 65,000 / day</td><td><strong>1.0x (Base)</strong></td><td>Uniform distribution</td><td>Smooth flow; Darshan time ~4-8 hours</td></tr>
    </tbody>
  </table>

  <h2>4. Predictive Crowd Formulation Engine</h2>
  <div class="formula-box">
    <strong>Spatio-Temporal Crowd Density:</strong><br>
    P(Zone, Date, Time) = Base(Zone, Time) &times; &mu;<sub>DayOfWeek</sub>(Date) &times; &mu;<sub>Season</sub>(Date) &times; &mu;<sub>ReligiousEvent</sub>(Date, Time) &times; &sigma;<sub>Weather</sub>(Date)
    <br><br>
    <strong>Estimated Darshan Waiting Hours (W):</strong><br>
    W(Date, Time) = max(3.0, ( Headcount<sub>VQC</sub>(Date, Time) / 4200 ) &times; &alpha;<sub>VIP_Interruptions</sub>)
  </div>

  <h2>5. Sample Granular Reference Scenarios</h2>
  <table>
    <thead>
      <tr>
        <th>Date / Scenario</th>
        <th>Time Slot</th>
        <th>Active Condition</th>
        <th>Sector</th>
        <th>Headcount</th>
        <th>Occupancy</th>
        <th>Wait Time</th>
        <th>Risk Level</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>2026-09-22 (Tue)</td><td>04:00 - 06:00</td><td>Mid-Week Baseline</td><td>Z1 (VQC)</td><td>12,500</td><td>31%</td><td>3.5 hrs</td><td><span class="badge badge-low">LOW</span></td></tr>
      <tr><td>2026-09-22 (Tue)</td><td>14:00 - 16:00</td><td>Mid-Week Baseline</td><td>Z1 (VQC)</td><td>24,000</td><td>60%</td><td>6.0 hrs</td><td><span class="badge badge-mod">MODERATE</span></td></tr>
      <tr><td>2026-10-03 (Sat)</td><td>08:00 - 11:00</td><td>Puratasi Saturday</td><td>Z5 (Alipiri Steps)</td><td>14,200</td><td>95%</td><td>4.5 hrs hike</td><td><span class="badge badge-high">HIGH</span></td></tr>
      <tr><td>2026-10-03 (Sat)</td><td>16:00 - 19:00</td><td>Puratasi Saturday</td><td>Z1 (VQC)</td><td>37,500</td><td>94%</td><td>18.0 hrs</td><td><span class="badge badge-crit">VERY HIGH</span></td></tr>
      <tr><td>2026-10-18 (Sun)</td><td>19:00 - 23:00</td><td><strong>Garuda Seva Peak</strong></td><td>Z2 (Mada Streets)</td><td><strong>85,000+</strong></td><td><strong>340%</strong></td><td>Gallery Full</td><td><span class="badge badge-crit">CRITICAL / SOS</span></td></tr>
      <tr><td>2026-12-30 (Wed)</td><td>03:00 - 12:00</td><td><strong>Vaikunta Ekadasi</strong></td><td>Z1 (VQC 62 Comps)</td><td>40,000</td><td>100%</td><td>32.0 hrs</td><td><span class="badge badge-crit">CRITICAL</span></td></tr>
    </tbody>
  </table>

  <div class="callout-box">
    <strong>Dynamic Rerouting Protocol:</strong> When real-time or forecasted occupancy exceeds <strong>85%</strong> in Sector Z1/Z2, YatraGuard dynamically pushes diversion cards recommending low-density tranquil shrines (<em>Silathoranam Rock Arch, Kapila Theertham, Akasa Ganga</em>) and delays queue entrance until off-peak hours.
  </div>

  <div class="footer">
    <span>YatraGuard AI Pilgrimage Safety Systems</span>
    <span>Reference Document ID: YG-TIRU-DYN-2026-V1</span>
    <span>Generated: August 2026</span>
  </div>
</body>
</html>`;

fs.writeFileSync(targetHtml, html, 'utf8');
console.log('Successfully saved to: ' + targetHtml);
