import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import BrandHeader from "../components/BrandHeader";
import Divider from "../components/Divider";
import Form from "../components/Form";
import FormHeading from "../components/FormHeading";
import DividerOr from "../components/DividerOr";
import Redirect from "../components/Redirect";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import Bg from "../components/Bg";



export default function Login() {
  const { register, handleSubmit } = useForm();
  const { loginHandler } = useAuth();
  async function submitHandler(data) {
    await loginHandler(data);
  }

  return (
    <main className="min-h-screen  flex items-center bg-background justify-center px-4 relative overflow-hidden">
      <Bg/>
      {/* Login Card */}
      <div
        className=" relative z-10 w-full max-w-110 bg-text rounded-2xl p-8 animate-fade-in"
        style={{
          boxShadow:
            "rgb(0 0 0 / 10%) 1px 20px 14px 0px, rgb(0 0 0 / 10%) -18px 20px 20px 4px",
        }}
      >
        <BrandHeader />
        <Divider />
        {/* Form heading */}

        <FormHeading title={"Sign In"} subtitle={"Sign in to your account."} />
        <Form
          register={register}
          handleSubmit={handleSubmit}
          submitHandler={submitHandler}
          isRegister={false}
        />

        <DividerOr />
        <div className="flex items-center justify-center mb-3">
          <ContinueWithGoogle />
        </div>
        <Redirect
          title={"Sign Up"}
          to="/register"
          subtitle={"Don't have an account?"}
        />
      </div>
    </main>
  );
}
