export default function Footer() {
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
        <p className="mt-4 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} Make up by mona. Orders are coordinated directly via WhatsApp.
        </p>
      </div>
    </footer>
  );
}