import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { pageTransition } from "./lib/motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toaster from "./components/Toaster";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Retail from "./pages/Retail";
import Wholesale from "./pages/Wholesale";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import TryOn from "./pages/TryOn";

// Admin pulls in Recharts — load it on demand to keep the initial bundle lean.
const Admin = lazy(() => import("./pages/Admin"));

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}

function Loader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-gold" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto grid max-w-md place-items-center gap-4 px-6 py-32 text-center">
      <p className="text-display text-6xl font-semibold text-gold">404</p>
      <h1 className="text-2xl font-medium">This page got lost in the weave.</h1>
      <Link to="/" className="btn-gold h-11">Back home</Link>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      {!isAuth && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Page><Home /></Page>} />
              <Route path="/signup" element={<Page><Signup /></Page>} />
              <Route path="/login" element={<Page><Login /></Page>} />
              <Route path="/retail" element={<Page><Retail /></Page>} />
              <Route path="/wholesale" element={<Page><Wholesale /></Page>} />
              <Route path="/product/:id" element={<Page><ProductDetail /></Page>} />
              <Route path="/cart" element={<Page><Cart /></Page>} />
              <Route path="/orders" element={<Page><Orders /></Page>} />
              <Route path="/orders/:id" element={<Page><OrderTracking /></Page>} />
              <Route path="/try-on" element={<Page><TryOn /></Page>} />
              <Route path="/admin" element={<Page><Admin /></Page>} />
              <Route path="*" element={<Page><NotFound /></Page>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isAuth && <Footer />}
      <Toaster />
    </div>
  );
}
