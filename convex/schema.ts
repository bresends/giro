import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  // Fleet Management Tables
  vehicleTypes: defineTable({
    name: v.string(),
    description: v.string(),
    maintenanceRules: v.object({
      kmInterval: v.optional(v.number()),
      timeInterval: v.optional(v.number()),
    }),
  }).index("by_name", ["name"]),

  vehicles: defineTable({
    plate: v.string(),
    brand: v.string(),
    model: v.string(),
    year: v.number(),
    chassisNumber: v.string(),
    renavam: v.string(),
    operationalPrefix: v.string(),
    typeId: v.id("vehicleTypes"),
    nextMaintenanceKm: v.optional(v.number()),
    color: v.optional(v.string()),
    ownershipType: v.union(
      v.literal("propria"),
      v.literal("locada")
    ),
    serviceType: v.union(
      v.literal("operational"),
      v.literal("backup")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_plate", ["plate"])
    .index("by_chassis", ["chassisNumber"])
    .index("by_renavam", ["renavam"])
    .index("by_prefix", ["operationalPrefix"])
    .index("by_type", ["typeId"]),

  personnel: defineTable({
    rank: v.string(),
    rg: v.string(),
    name: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_rg", ["rg"])
    .index("by_name", ["name"]),

  vehicleMovements: defineTable({
    vehicleId: v.id("vehicles"),
    personnelId: v.id("personnel"),
    destination: v.string(),
    destinationType: v.optional(
      v.union(
        v.literal("ocorrencia"),
        v.literal("qrf"),
        v.literal("ceman"),
        v.literal("cal"),
        v.literal("outro")
      )
    ),
    departureKm: v.number(),
    departureTime: v.number(),
    arrivalKm: v.optional(v.number()),
    arrivalTime: v.optional(v.number()),
    status: v.union(v.literal("em_transito"), v.literal("concluido")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["status"])
    .index("by_vehicle_and_status", ["vehicleId", "status"])
    .index("by_date", ["departureTime"]),

  vehicleReadings: defineTable({
    vehicleId: v.id("vehicles"),
    kmReading: v.number(),
    readingDate: v.number(),
    recordedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_vehicle", ["vehicleId"])
    .index("by_vehicle_and_date", ["vehicleId", "readingDate"])
    .index("by_date", ["readingDate"]),

  maintenanceRecords: defineTable({
    vehicleId: v.id("vehicles"),
    type: v.union(v.literal("preventive"), v.literal("corrective")),
    status: v.union(
      v.literal("awaiting_ceman"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    seiProcessNumber: v.optional(v.string()),
    sentDate: v.optional(v.number()),
    returnDate: v.optional(v.number()),
    location: v.optional(v.string()),
    kmAtMaintenance: v.number(),
    description: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["status"])
    .index("by_sent_date", ["sentDate"])
    .index("by_vehicle_and_status", ["vehicleId", "status"]),

  vehicleIssues: defineTable({
    vehicleId: v.id("vehicles"),
    title: v.string(),
    description: v.string(),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    reportedDate: v.number(),
    resolvedDate: v.optional(v.number()),
    maintenanceRecordId: v.optional(v.id("maintenanceRecords")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_vehicle", ["vehicleId"])
    .index("by_status", ["status"])
    .index("by_vehicle_and_status", ["vehicleId", "status"]),

  // Legacy table - can be removed later
  numbers: defineTable({
    value: v.number(),
  }),
});
