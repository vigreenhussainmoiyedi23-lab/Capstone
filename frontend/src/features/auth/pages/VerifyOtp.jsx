import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const VerifyOtp = () => {
  const { verifyOtpHandler, resendOtpHandler } = useAuth();

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
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move to next input
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e,
    index,
  ) => {
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

      verifyOtpHandler(code).finally(() => {
        setLoading(false);
      });
    }
  }, [otp]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-center text-3xl font-bold text-white">
          Verify OTP
        </h1>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Enter the 6-digit verification code
        </p>

        <div className="mt-8 flex justify-center gap-3">
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
              className="h-14 w-14 rounded-xl border border-zinc-700 bg-zinc-800 text-center text-2xl font-semibold text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {canResend ? "Resend OTP" : `Resend in ${secondsLeft}s`}
        </button>
        {loading && (
          <p className="mt-6 text-center text-sm text-blue-400">Verifying...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
