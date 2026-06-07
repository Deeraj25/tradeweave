import type { ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import TryOn from "./pages/TryOn";
import Admin from "./pages/Admin";

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

export default function App() {
  const location = useLocation();
  // Auth pages are full-bleed (no navbar/footer chrome)
  const isAuth = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      {!isAuth && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/signup" element={<Page><Signup /></Page>} />
            <Route path="/login" element={<Page><Login /></Page>} />
            <Route path="/retail" element={<Page><Retail /></Page>} />
            <Route path="/wholesale" element={<Page><Wholesale /></Page>} />
            <Route path="/product/:id" element={<Page><ProductDetail /></Page>} />
            <Route path="/cart" element={<Page><Cart /></Page>} />
            <Route path="/try-on" element={<Page><TryOn /></Page>} />
            <Route path="/admin" element={<Page><Admin /></Page>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuth && <Footer />}
      <Toaster />
    </div>
  );
}
