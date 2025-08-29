import { DEFAULT_URL } from "./config";

export const getWsUrl = () => {
  if (typeof window === "undefined") return DEFAULT_URL;

  // In production, use DEFAULT_URL (your backend)
  if (window.location.hostname.includes("onrender.com")) {
    return DEFAULT_URL;
  }

  // Local dev: same host with port 9013
  const proto = window.location.protocol === "https:" ? "https://" : "http://";
  const host = window.location.hostname;
  return `${proto}${host}:9013`;
};
