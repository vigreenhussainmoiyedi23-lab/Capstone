import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch as useAppDispatch } from "react-redux";
import { setAccessToken } from "../authSlice.js";
import { Loader2 } from "lucide-react";
import BrandHeader from "../components/BrandHeader.jsx";
import Bg from "../components/Bg.jsx";

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
    navigate("/dashboard");
  }, [dispatch, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0e1a]">
      <Bg />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <BrandHeader />
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
        <p className="text-sm font-mono tracking-widest uppercase text-text-muted">
          Authenticating with Google...
        </p>
      </div>
    </div>
  );
};

export default GoogleSuccess;
