import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line/70 bg-ink-soft/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-cream/50">Where trade weaves together. Direct B2B & retail — no middlemen.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>Retail</li><li>Wholesale</li><li>AI Try-On</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">Coming soon</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>Real-time tracking</li><li>Warranty support</li><li>Offline POS billing</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">Company</h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>About</li><li>Investors</li><li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Tradeweave — Phase 1 prototype.
      </div>
    </footer>
  );
}
