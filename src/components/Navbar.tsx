import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Briefcase, Menu, X, User, Truck } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "../store/cart";
import { useWholesale } from "../store/wholesale";
import { useOrders } from "../store/orders";
import { useAuth } from "../store/auth";

const links = [
  { to: "/retail", label: "Retail" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/try-on", label: "AI Try-On" },
  { to: "/orders", label: "Orders" },
  { to: "/admin", label: "Admin" },
];

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink"
    >
      {count}
    </motion.span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const wholesaleCount = useWholesale((s) => s.count());
  const activeOrders = useOrders((s) => s.orders.filter((o) => o.status !== "delivered").length);
  const user = useAuth((s) => s.user);

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
                `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-gold" : "text-cream/70 hover:text-cream"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/orders" className="relative rounded-lg p-2 text-cream/80 hover:text-gold" aria-label="Orders">
            <Truck size={20} />
            <Badge count={activeOrders} />
          </Link>
          <Link to="/wholesale" className="relative rounded-lg p-2 text-cream/80 hover:text-gold" aria-label="Wholesale order">
            <Briefcase size={20} />
            <Badge count={wholesaleCount} />
          </Link>
          <Link to="/cart" className="relative rounded-lg p-2 text-cream/80 hover:text-gold" aria-label="Cart">
            <ShoppingBag size={20} />
            <Badge count={cartCount} />
          </Link>

          {user ? (
            <span className="hidden items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm text-cream/80 sm:flex">
              <User size={15} className="text-gold" /> {user.name.split(" ")[0]}
            </span>
          ) : (
            <Link to="/login" className="btn-ghost hidden h-9 text-sm sm:inline-flex">
              Sign in
            </Link>
          )}

          <button className="rounded-lg p-2 text-cream/80 hover:text-gold md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line/70 bg-ink md:hidden"
          >
            <div className="flex flex-col p-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-sm font-medium ${isActive ? "text-gold" : "text-cream/80"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost mt-2 h-11">
                {user ? user.name.split(" ")[0] : "Sign in"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
