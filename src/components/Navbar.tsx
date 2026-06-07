import { Link, NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import Logo from "./Logo";

const links = [
  { to: "/retail", label: "Retail" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/try-on", label: "Try-On" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-gold" : "text-cream/70 hover:text-cream"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-lg p-2 text-cream/80 hover:text-gold">
            <ShoppingBag size={20} />
          </Link>
          <Link to="/login" className="btn-ghost h-9 text-sm">Sign in</Link>
        </div>
      </nav>
    </header>
  );
}
