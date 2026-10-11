import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { publicApi } from "../../api/public.api.js";
import { detectPlatform } from "../../lib/social.js";

export default function Footer() {
  const [config, setConfig] = useState({ whatsappNumber: null, socialLinks: [] });

  useEffect(() => {
    publicApi
      .getStoreConfig()
      .then((c) =>
        setConfig({ whatsappNumber: c.whatsappNumber || null, socialLinks: c.socialLinks || [] })
      )
      .catch(() => {}); // footer simply shows no contact icons if the API is unreachable
  }, []);

  // WhatsApp first (it's the same number orders go to), then every social link
  // with the icon of the platform its domain belongs to.
  const contacts = [];
  if (config.whatsappNumber) {
    contacts.push({
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/${config.whatsappNumber}`,
      Icon: FaWhatsapp,
    });
  }
  config.socialLinks.forEach((url) => {
    const platform = detectPlatform(url);
    contacts.push({ key: url, label: platform.label, href: url, Icon: platform.icon });
  });

  return (
    <footer className="mt-16 border-t border-nude/60 bg-blush/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <img
          src="/logo.png"
          alt="Make up by mona"
          width="640"
          height="527"
          loading="lazy"
          className="mx-auto h-32 w-auto sm:h-40"
        />
        <p className="mt-3 text-sm text-ink-soft">Skincare · Makeup Boxes · Beauty Accessories</p>

        {contacts.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-ink">Stay in touch</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Follow us for new arrivals, or message us anytime.
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {contacts.map(({ key, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-rosegold-dark ring-1 ring-nude/60 transition-colors hover:bg-rosegold hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-8 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} Make up by mona. Orders are coordinated directly via WhatsApp.
        </p>
      </div>
    </footer>
  );
}
