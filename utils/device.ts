import { DEVICE_ID_KEY } from "@/lib/constants";

/**
 * Generate unique device ID
 * Format: browser-platform-randomId
 */
export const generateDeviceId = (): string => {
  const browser = getBrowserName();
  const platform = getPlatformName();
  const randomId = Math.random().toString(36).substring(2, 15);

  return `${browser}-${platform}-${randomId}`;
};

const getBrowserName = (): string => {
  if (typeof navigator === "undefined") return "server";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("firefox")) return "firefox";
  if (userAgent.includes("chrome")) return "chrome";
  if (userAgent.includes("safari")) return "safari";
  if (userAgent.includes("edge")) return "edge";

  return "unknown";
};

const getPlatformName = (): string => {
  if (typeof navigator === "undefined") return "server";

  const platform = navigator.platform.toLowerCase();

  if (platform.includes("win")) return "windows";
  if (platform.includes("mac")) return "mac";
  if (platform.includes("linux")) return "linux";
  if (platform.includes("android")) return "android";
  if (platform.includes("ios")) return "ios";

  return "unknown";
};

export const getOrCreateDeviceId = (): string => {
  if (typeof window === "undefined") return generateDeviceId();

  const stored = sessionStorage.getItem(DEVICE_ID_KEY);

  if (stored) {
    return stored;
  }

  const newId = generateDeviceId();
  sessionStorage.setItem(DEVICE_ID_KEY, newId);

  return newId;
};
