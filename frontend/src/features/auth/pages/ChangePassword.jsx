import { Lock } from "lucide-react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useSelector as useAppSelector } from "react-redux";
import ShowError from "../../../commonComponents/ShowError";

const ChangePassword = () => {
  const { register, handleSubmit, reset } = useForm();
  const { changePasswordHandler } = useAuth();
  const submitHandler = async (data) => {
    try {
      const response = await changePasswordHandler(data);
      if (response?.success) reset();
    } catch (error) {}
  };
  const error = useAppSelector((state) => state.auth.error);
  return (
    <div className="min-h-screen flex items-center bg-background justify-center px-4 relative overflow-hidden">
      <form
        className="flex max-w-110 flex-col gap-4 bg-text w-full rounded-2xl py-15 items-center justify-center"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-2xl font-bold text-white mb-1">
          Change Your Password
        </h1>
        <Input
          register={register}
          name="oldPassword"
          type="password"
          placeholder="Enter your old password"
          icon={<Lock width={16} />}
        />
        <Input
          register={register}
          name="newPassword"
          type="password"
          placeholder="Enter your new password"
          icon={<Lock width={16} />}
        />
        <button
          type="submit"
          className="bg-gold-dark text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        <ShowError error={error || ""} />
      </form>
    </div>
  );
};

export default ChangePassword;
