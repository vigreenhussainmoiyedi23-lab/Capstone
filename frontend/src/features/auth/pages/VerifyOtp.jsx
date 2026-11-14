import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck, RotateCcw, Loader2 } from "lucide-react";
import BrandHeader from "../components/BrandHeader";
import FormHeading from "../components/FormHeading";
import Bg from "../components/Bg";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const { verifyOtpHandler, resendOtpHandler } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);
  const [canResend, setCanResend] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setSecondsLeft(30);

    await resendOtpHandler();

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newOtp = [...otp];
    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  useEffect(() => {
    const code = otp.join("");
    if (code.length === 6 && !loading) {
      setLoading(true);
      verifyOtpHandler(code)
        .then(() => {
          navigate("/dashboard");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [otp, loading, verifyOtpHandler, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0e1a]">
      <Bg />

      <div
        className="relative z-10 w-full max-w-[520px] bg-[#0f1422]/90 border border-[rgba(201,168,76,0.18)] rounded-2xl p-7 md:p-8 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] text-center"
        style={{
          boxShadow:
            "0 0 0 1px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.06)",
        }}
      >
        <BrandHeader />

        <div className="mx-auto my-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/30">
          <ShieldCheck className="h-7 w-7 text-gold" />
        </div>

        <FormHeading
          title="Verify Code"
          subtitle="Enter the 6-digit verification code sent to your registered email."
        />

        {/* 6 Digit Inputs */}
        <div className="my-6 flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="h-12 w-11 sm:h-14 sm:w-13 rounded-xl border border-[rgba(201,168,76,0.2)] bg-[#0a0e1a] text-center text-xl font-mono font-bold text-white outline-none transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/30 shadow-inner"
            />
          ))}
        </div>

        {/* Resend Action */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {canResend ? "Resend Verification Code" : `Resend available in ${secondsLeft}s`}
            </span>
          </button>

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gold font-mono animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying credentials...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
