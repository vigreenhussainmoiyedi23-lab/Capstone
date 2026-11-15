import React from "react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useSelector as useAppSelector } from "react-redux";
import ShowError from "../../../commonComponents/ShowError";
import BrandHeader from "../components/BrandHeader";
import FormHeading from "../components/FormHeading";
import Bg from "../components/Bg";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const { forgotHandler } = useAuth();
  const { error, isLoading } = useAppSelector((state) => state.auth);

  const submitHandler = async (data) => {
    try {
      await forgotHandler(data);
    } catch (err) { }
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0e1a]">
      <Bg />

      <div
        className="relative z-10 max-w-130 w-full  bg-[#0f1422]/90 border border-[rgba(201,168,76,0.18)] rounded-2xl p-7 md:p-8 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.06)",
        }}
      >
        <BrandHeader />

        <FormHeading
          title="Forgot Password"
          subtitle="Enter your verified email address and we'll send you recovery instructions."
        />

        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
          <Input
            register={register}
            name="email"
            type="email"
            placeholder="alex@domain.com"
            icon={<Mail className="w-4 h-4" />}
          />

          <ShowError error={error || ""} />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full h-11 rounded-xl font-semibold text-sm tracking-wide text-[#0a0e1a] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
            }}
          >
            <span>Send Reset Instructions</span>
            <Send className="w-4 h-4 text-[#0a0e1a]" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[rgba(201,168,76,0.1)] text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-gold transition-colors font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
