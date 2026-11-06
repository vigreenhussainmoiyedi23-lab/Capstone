import { useSelector as useAppSelector } from "react-redux";
import ShowError from "../../../commonComponents/ShowError";
import Input from "./Input";
import { Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

const Form = ({ register, handleSubmit, submitHandler, isRegister }) => {
  const error=useAppSelector(state=>state.auth.error)
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
          placeholder="Enter your username"
          icon={<User width={16} />}
          />
        )
        }

      <Input
        register={register}
        name="email"
        type="email"
        placeholder="Enter your email"
        icon={<Mail width={16} />}
        />

      <Input
        register={register}
        name="password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock width={16} />}
        />
      <ShowError error={error || ""}/>
      {!isRegister && (
        <div className="flex justify-end hover:text-background-light text-white">
          <Link to={"/forgot-password"} className="text-xs transition-colors">
            Forgot password?
          </Link>
        </div>
      )}
      <button
        type="submit"
        className="bg-primary text-white teko tracking-[0.1rem] text-lg    font-bold mt-1 h-12 w-full rounded-lg "
        >
        {isRegister ? "Sign Up" : "Sign In"}
      </button>
    </form>
  )
}

export default Form;
