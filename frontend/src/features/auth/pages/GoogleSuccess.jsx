import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch as useAppDispatch } from "react-redux";
import { setAccessToken } from "../authSlice";

const GoogleSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }
    dispatch(setAccessToken(accessToken));
    navigate("/");
  }, []);

  return <p>Signing you in...</p>;
};

export default GoogleSuccess;
