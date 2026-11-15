
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth.js";
import BrandHeader from "../components/BrandHeader.jsx";
import Form from "../components/Form.jsx";
import FormHeading from "../components/FormHeading.jsx";
import DividerOr from "../components/DividerOr.jsx";
import Redirect from "../components/Redirect.jsx";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
import Bg from "../components/Bg.jsx";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { loginHandler } = useAuth();
 
  async function submitHandler(data) {
    await loginHandler(data);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0e1a]">
      <Bg />

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-130 bg-[#0f1422]/90 border border-[rgba(201,168,76,0.18)] rounded-2xl p-7 md:p-8 backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] transition-all"
        style={{
          boxShadow:
            "0 0 0 1px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(201,168,76,0.06)",
        }}
      >
        <BrandHeader />

        <FormHeading
          title="Sign In"
          subtitle="Access your studio workspaces and autonomous environments."
        />

        <Form
          register={register}
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          isRegister={false}
        />

        <DividerOr />

        <div className="flex items-center justify-center mb-1">
          <ContinueWithGoogle />
        </div>

        <Redirect
          title="Sign Up"
          to="/register"
          subtitle="New to Forge AI?"
        />
      </div>
    </main>
  );
}
