import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import Form from "../components/Form";
import FormHeading from "../components/FormHeading";
import DividerOr from "../components/DividerOr";
import Redirect from "../components/Redirect";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import Bg from "../components/Bg";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { RegisterHandler } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  async function submitHandler(data) {
    await RegisterHandler(data);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0e1a]">
      <Bg />

      {/* Register Card */}
      <div
        className="relative z-10 w-full max-w-130  bg-[#0f1422]/90 border border-[rgba(201,168,76,0.18)] rounded-2xl p-7 md:p-8 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] transition-all"
        style={{
          boxShadow:
            "0 0 0 1px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.06)",
        }}
      >
        <BrandHeader />

        <FormHeading
          title="Create Account"
          subtitle="Start building autonomous full-stack applications with Forge AI."
        />

        <Form
          register={register}
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          isRegister={true}
        />

        <DividerOr />

        <div className="flex items-center justify-center mb-1">
          <ContinueWithGoogle />
        </div>

        <Redirect
          title="Sign In"
          to="/login"
          subtitle="Already have an account?"
        />
      </div>
    </main>
  );
}
