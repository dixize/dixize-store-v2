// Server-side source of truth for configurator pricing.
// The client displays these numbers, but the API recalculates the total
// from projectType + addons so the price can not be tampered with.
export const PRICING = {
  landing: { base: 2000, tgAddon: 500, animAddon: 0, forcedAddons: false },
  service: { base: 2400, tgAddon: 500, animAddon: 0, forcedAddons: false },
  store: { base: 3200, tgAddon: 0, animAddon: 0, forcedAddons: true },
} as const;

export type ProjectType = keyof typeof PRICING;

export const PROJECT_TYPES: ProjectType[] = ["landing", "service", "store"];

const ADDON_KEYS = ["tg", "anim"] as const;
export type AddonKey = (typeof ADDON_KEYS)[number];

export function isProjectType(v: unknown): v is ProjectType {
  return typeof v === "string" && v in PRICING;
}

export function normalizeAddons(type: ProjectType, raw: unknown): AddonKey[] {
  const config = PRICING[type];
  if (config.forcedAddons) return ["tg", "anim"];
  if (!Array.isArray(raw)) return [];
  const unique = new Set(raw.filter((a): a is AddonKey => a === "tg" || a === "anim"));
  return Array.from(unique);
}

export function calcPrice(type: ProjectType, addons: AddonKey[]): number {
  const config = PRICING[type];
  if (config.forcedAddons) return config.base;
  let total = config.base;
  if (addons.includes("tg")) total += config.tgAddon;
  if (addons.includes("anim")) total += config.animAddon;
  return total;
}
