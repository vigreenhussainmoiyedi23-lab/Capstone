import { useSelector as useAppSelector } from "react-redux";
import Unauthorzed from "../commonComponents/Unauthorzed";

const ProtectedLayout = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Unauthorzed />;
  return <>{children}</>;
};

export default ProtectedLayout;
