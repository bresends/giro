import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVehicleTypeColor(type: string | undefined | null) {
  const normalizedType = type?.toUpperCase() || "";

  if (normalizedType.includes("UR") || normalizedType.includes("RESGATE")) {
    return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
  }
  if (normalizedType.includes("ABT")) {
    return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
  }
  if (normalizedType.includes("ASA") || normalizedType.includes("SALVAMENTO")) {
    return "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800";
  }
  if (normalizedType.includes("AV") || normalizedType.includes("VISTORIA")) {
    return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
  }
  if (normalizedType.includes("TP") || normalizedType.includes("TRANSPORTE")) {
    return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
  }
  if (normalizedType.includes("ABS")) {
    return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
  }

  // Default
  return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
}
