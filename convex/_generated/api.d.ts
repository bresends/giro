/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alerts from "../alerts.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as maintenanceRecords from "../maintenanceRecords.js";
import type * as migrations_removeColorField from "../migrations/removeColorField.js";
import type * as myFunctions from "../myFunctions.js";
import type * as personnel from "../personnel.js";
import type * as seedVehicleTypes from "../seedVehicleTypes.js";
import type * as vehicleIssues from "../vehicleIssues.js";
import type * as vehicleMovements from "../vehicleMovements.js";
import type * as vehicleReadings from "../vehicleReadings.js";
import type * as vehicleTypes from "../vehicleTypes.js";
import type * as vehicles from "../vehicles.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  auth: typeof auth;
  http: typeof http;
  maintenanceRecords: typeof maintenanceRecords;
  "migrations/removeColorField": typeof migrations_removeColorField;
  myFunctions: typeof myFunctions;
  personnel: typeof personnel;
  seedVehicleTypes: typeof seedVehicleTypes;
  vehicleIssues: typeof vehicleIssues;
  vehicleMovements: typeof vehicleMovements;
  vehicleReadings: typeof vehicleReadings;
  vehicleTypes: typeof vehicleTypes;
  vehicles: typeof vehicles;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
