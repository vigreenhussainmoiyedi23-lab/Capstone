import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import BrandHeader from "../components/BrandHeader";
import Form from "../components/Form";
import FormHeading from "../components/FormHeading";
import DividerOr from "../components/DividerOr";
import Divider from "../components/Divider";
import Redirect from "../components/Redirect";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import Bg from "../components/Bg";



export default function Register() {
  const { register, handleSubmit } = useForm();
  const { RegisterHandler } = useAuth();
  async function submitHandler(data) {
    await RegisterHandler(data);
  }

  return (
    <main className="min-h-screen  bg-background flex   items-center justify-center   px-2 md:px-20 relative overflow-hidden">
      <Bg/>
      {/* Card */}
      <div
        className="bg-text relative z-10 w-full max-w-110 rounded-2xl p-8 animate-fade-in"
        style={{
          boxShadow:
            "0 0 0 1px rgba(168,85,247,0.08), 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(168,85,247,0.05)",
        }}
      >
        <BrandHeader />
        <Divider />

        <FormHeading title={"Sign Up"} subtitle={"Create your account."} />
        <Form
          register={register}
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          isRegister
        />

        <DividerOr />
        <div className="flex items-center justify-center mb-3">
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
