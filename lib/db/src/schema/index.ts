import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users / Pilgrims table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  savedPlaceIds: jsonb("saved_place_ids").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// Destinations table (Tirumala, Varanasi, Prayagraj, Rameswaram, etc.)
export const destinationsTable = pgTable("destinations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  image: text("image").notNull(),
  weather: text("weather").notNull(),
  weatherDetail: text("weather_detail"),
  rain: text("rain"),
  humidity: text("humidity"),
  overview: text("overview").notNull(),
  alerts: jsonb("alerts").$type<string[]>().default([]),
});

export const insertDestinationSchema = createInsertSchema(destinationsTable);
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinationsTable.$inferSelect;

// Places / Temples table
export const placesTable = pgTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  destinationId: text("destination_id").notNull(),
  description: text("description").notNull(),
  distance: text("distance"),
  duration: text("duration"),
  hours: text("hours"),
  recommendedTime: text("recommended_time"),
  crowd: jsonb("crowd").$type<{
    capacity: number;
    current: number;
    waitingMinutes: number;
    trend: number;
    congestion: string;
    narrowPathway: boolean;
  }>().notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  image: text("image"),
  wheelchair: boolean("wheelchair").default(false),
  seniorFriendly: boolean("senior_friendly").default(false),
});

export const insertPlaceSchema = createInsertSchema(placesTable);
export type InsertPlace = z.infer<typeof insertPlaceSchema>;
export type Place = typeof placesTable.$inferSelect;

// Emergency & SOS Alerts Table
export const emergencyAlertsTable = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  destinationId: text("destination_id"),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlertsTable).omit({ id: true, createdAt: true });
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type EmergencyAlert = typeof emergencyAlertsTable.$inferSelect;

// Crowdsourced Live Reports Table
export const crowdReportsTable = pgTable("crowd_reports", {
  id: serial("id").primaryKey(),
  placeId: text("place_id").notNull(),
  reportedLevel: text("reported_level").notNull(),
  waitingMinutes: integer("waiting_minutes").default(0),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCrowdReportSchema = createInsertSchema(crowdReportsTable).omit({ id: true, createdAt: true });
export type InsertCrowdReport = z.infer<typeof insertCrowdReportSchema>;
export type CrowdReport = typeof crowdReportsTable.$inferSelect;

// Lodges Table
export const lodgesTable = pgTable("lodges", {
  id: serial("id").primaryKey(),
  destinationId: text("destination_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceRange: text("price_range").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number"),
  timings: text("timings"),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  rating: text("rating").default("4.5"),
});

export const insertLodgeSchema = createInsertSchema(lodgesTable).omit({ id: true });
export type InsertLodge = z.infer<typeof insertLodgeSchema>;
export type Lodge = typeof lodgesTable.$inferSelect;