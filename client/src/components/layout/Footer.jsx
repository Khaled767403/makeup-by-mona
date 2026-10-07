export default function Footer() {
  return (
    <footer className="mt-16 border-t border-nude/60 bg-blush/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">Make up by mona</p>
        <p className="mt-1 text-sm text-ink-soft">Skincare · Makeup Boxes · Beauty Accessories</p>
        <p className="mt-4 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} Make up by mona. Orders are coordinated directly via WhatsApp.
        </p>
      </div>
    </footer>
  );
}
