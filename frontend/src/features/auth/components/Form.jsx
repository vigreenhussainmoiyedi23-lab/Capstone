import { useSelector as useAppSelector } from "react-redux";
import ShowError from "../../../commonComponents/ShowError";
import Input from "./Input";
import { Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Form = ({ register, handleSubmit, submitHandler, isRegister }) => {
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-4"
    >
      {isRegister && (
        <Input
          register={register}
          name="username"
          type="text"
          placeholder="Choose a username"
          icon={<User className="w-4 h-4" />}
        />
      )}

      <Input
        register={register}
        name="email"
        type="email"
        placeholder="alex@domain.com"
        icon={<Mail className="w-4 h-4" />}
      />

      <Input
        register={register}
        name="password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock className="w-4 h-4" />}
      />

      <ShowError error={error || ""} />

      {!isRegister && (
        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-xs text-text-muted hover:text-gold transition-colors font-sans"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full h-11 rounded-xl font-semibold text-sm tracking-wide text-[#0a0e1a] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        style={{
          background:
            "linear-gradient(135deg, #d4a435 0%, #c9a84c 50%, #b8922e 100%)",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#0a0e1a]" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{isRegister ? "Create Account" : "Sign In to Studio"}</span>
            <ArrowRight className="w-4 h-4 text-[#0a0e1a]" />
          </>
        )}
      </button>
    </form>
  );
};

export default Form;
