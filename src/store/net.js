import { DEFAULT_URL } from "./config";
export const getWsUrl = () => {
  if (typeof window === "undefined") return DEFAULT_URL;
  const proto = window.location.protocol === "https:" ? "https://" : "http://";
  const host = window.location.hostname;
  return `${proto}${host}:9013`;
};
