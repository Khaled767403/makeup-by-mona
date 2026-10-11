import {
  FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaXTwitter, FaSnapchat,
  FaPinterestP, FaLinkedinIn, FaTelegram, FaWhatsapp, FaThreads, FaGlobe,
} from "react-icons/fa6";

// Each platform is recognised by its domain. Anything unknown still works and
// gets a generic "website" icon, so no link is ever rejected for its domain.
const PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: FaInstagram, hosts: ["instagram.com", "instagr.am"] },
  { key: "facebook", label: "Facebook", icon: FaFacebookF, hosts: ["facebook.com", "fb.com", "fb.me", "fb.watch", "m.me"] },
  { key: "tiktok", label: "TikTok", icon: FaTiktok, hosts: ["tiktok.com"] },
  { key: "youtube", label: "YouTube", icon: FaYoutube, hosts: ["youtube.com", "youtu.be"] },
  { key: "x", label: "X", icon: FaXTwitter, hosts: ["x.com", "twitter.com"] },
  { key: "snapchat", label: "Snapchat", icon: FaSnapchat, hosts: ["snapchat.com"] },
  { key: "pinterest", label: "Pinterest", icon: FaPinterestP, hosts: ["pinterest.com", "pin.it"] },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedinIn, hosts: ["linkedin.com", "lnkd.in"] },
  { key: "telegram", label: "Telegram", icon: FaTelegram, hosts: ["t.me", "telegram.me", "telegram.org"] },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, hosts: ["wa.me", "whatsapp.com"] },
  { key: "threads", label: "Threads", icon: FaThreads, hosts: ["threads.net", "threads.com"] },
];

const GENERIC = { key: "website", label: "Website", icon: FaGlobe };

export function detectPlatform(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return GENERIC;
  }
  return (
    PLATFORMS.find((p) => p.hosts.some((h) => host === h || host.endsWith(`.${h}`))) || GENERIC
  );
}

// Accepts "instagram.com/by_mona" as well as a full link; returns a clean
// https URL, or null when the text can't be a web link.
export function normalizeUrl(input) {
  const text = (input || "").trim();
  if (!text || /\s/.test(text)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withScheme);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

// Two links that differ only by "www.", letter case or a trailing slash are the
// same page — used to stop the same page being added twice.
export function linkKey(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    return `${host}${u.pathname.replace(/\/+$/, "")}${u.search}`.toLowerCase();
  } catch {
    return url;
  }
}
