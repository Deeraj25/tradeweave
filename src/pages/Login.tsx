import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Smartphone, Eye, EyeOff } from "lucide-react";
import { AuthHero, SocialButton, InputGroup, GoogleIcon } from "../components/AuthParts";
import { MobileFlow } from "./Signup";
import { useAuth } from "../store/auth";
import { useToast } from "../store/toast";

export default function Login() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const push = useToast((s) => s.push);

  const [mode, setMode] = useState<"email" | "mobile">("email");
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const finish = (user: { name: string; email?: string; phone?: string }) => {
    signIn(user);
    push(`Welcome back!`, "success");
    navigate("/");
  };

  return (
    <main className="flex min-h-screen w-full bg-ink p-2 selection:bg-gold/30 lg:h-screen lg:overflow-hidden lg:p-4">
      <AuthHero
        heading="Welcome back"
        subline="Sign in to pick up where you left off — your cart and orders are waiting."
        steps={[
          { text: "Verify your identity", active: true },
          { text: "Sync your cart" },
          { text: "Continue trading" },
        ]}
      />

      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-10 sm:px-12 lg:overflow-hidden lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-7"
        >
          <div className="lg:hidden">
            <Link to="/" className="text-display text-2xl font-semibold">
              Trade<span className="text-gold">weave</span>
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-medium tracking-tight">Log in</h1>
            <p className="mt-1 text-sm text-cream/40">Good to see you again.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon={<GoogleIcon size={18} />} label="Google" onClick={() => finish({ name: "Google User", email: "you@gmail.com" })} />
            <SocialButton icon={<Smartphone size={18} className="text-gold" />} label="Mobile" onClick={() => { setMode("mobile"); setOtpSent(false); }} />
          </div>

          <div className="relative flex items-center">
            <div className="h-px flex-1 bg-line" />
            <span className="bg-ink px-4 text-xs font-medium uppercase tracking-widest text-cream/40">Or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          {mode === "email" ? (
            <form onSubmit={(e) => { e.preventDefault(); finish({ name: "Member", email }); }} className="space-y-5">
              <InputGroup label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
              <InputGroup
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                trailing={
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="text-cream/40 hover:text-gold">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <button type="submit" className="btn-gold mt-2 h-14 w-full text-base">Log in</button>
            </form>
          ) : (
            <MobileFlow
              phone={phone}
              setPhone={setPhone}
              otp={otp}
              setOtp={setOtp}
              otpSent={otpSent}
              onSend={() => { if (phone.replace(/\D/g, "").length >= 10) { setOtpSent(true); push("OTP sent: use 123456 (demo)"); } else push("Enter a valid 10-digit number", "error"); }}
              onVerify={() => { if (otp.length >= 4) finish({ name: "Mobile User", phone }); else push("Enter the 6-digit code", "error"); }}
              onBack={() => setMode("email")}
            />
          )}

          <p className="text-center text-sm text-cream/50">
            New here?{" "}
            <Link to="/signup" className="font-medium text-gold hover:underline">Create an account</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
