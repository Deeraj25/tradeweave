import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Smartphone, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AuthHero, SocialButton, InputGroup, GoogleIcon } from "../components/AuthParts";
import { useAuth } from "../store/auth";
import { useToast } from "../store/toast";

export default function Signup() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const push = useToast((s) => s.push);

  const [mode, setMode] = useState<"email" | "mobile">("email");
  const [showPw, setShowPw] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const finish = (user: { name: string; email?: string; phone?: string }) => {
    signIn(user);
    push(`Welcome to Tradeweave, ${user.name.split(" ")[0]}!`, "success");
    navigate("/");
  };

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();
    finish({ name: `${first || "New"} ${last}`.trim(), email });
  };

  return (
    <main className="flex min-h-screen w-full bg-ink p-2 selection:bg-gold/30 lg:h-screen lg:overflow-hidden lg:p-4">
      <AuthHero
        heading="Join Tradeweave"
        subline="Follow these 3 quick phases to start trading on the network."
        steps={[
          { text: "Create your account", active: true },
          { text: "Tell us your style" },
          { text: "Start trading" },
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
            <h1 className="text-3xl font-medium tracking-tight">Create new profile</h1>
            <p className="mt-1 text-sm text-cream/40">Input your basic details to begin the journey.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={<GoogleIcon size={18} />}
              label="Google"
              onClick={() => finish({ name: "Google User", email: "you@gmail.com" })}
            />
            <SocialButton
              icon={<Smartphone size={18} className="text-gold" />}
              label="Mobile"
              onClick={() => { setMode("mobile"); setOtpSent(false); }}
            />
          </div>

          <div className="relative flex items-center">
            <div className="h-px flex-1 bg-line" />
            <span className="bg-ink px-4 text-xs font-medium uppercase tracking-widest text-cream/40">Or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          {mode === "email" ? (
            <form onSubmit={createAccount} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="First name" placeholder="Aria" value={first} onChange={setFirst} />
                <InputGroup label="Last name" placeholder="Mehta" value={last} onChange={setLast} />
              </div>
              <InputGroup label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
              <InputGroup
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                helper="Requires at least 8 symbols."
                trailing={
                  <button type="button" onClick={() => setShowPw((s) => !s)} className="text-cream/40 hover:text-gold">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <button type="submit" className="btn-gold mt-2 h-14 w-full text-base">Create account</button>
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
            Member of the team?{" "}
            <Link to="/login" className="font-medium text-gold hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export function MobileFlow({
  phone, setPhone, otp, setOtp, otpSent, onSend, onVerify, onBack,
}: {
  phone: string; setPhone: (v: string) => void; otp: string; setOtp: (v: string) => void;
  otpSent: boolean; onSend: () => void; onVerify: () => void; onBack: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-cream/50 hover:text-gold">
        <ArrowLeft size={14} /> Back to email
      </button>
      <InputGroup label="Mobile number" type="tel" placeholder="+91 98765 43210" value={phone} onChange={setPhone} />
      {!otpSent ? (
        <button onClick={onSend} className="btn-gold h-14 w-full text-base">Send OTP</button>
      ) : (
        <>
          <InputGroup label="Enter OTP" placeholder="6-digit code" value={otp} onChange={setOtp} helper="Demo code: 123456" />
          <button onClick={onVerify} className="btn-gold h-14 w-full text-base">Verify & continue</button>
        </>
      )}
    </motion.div>
  );
}
