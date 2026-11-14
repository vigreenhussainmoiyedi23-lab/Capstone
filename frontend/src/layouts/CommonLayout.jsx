import React from "react";
import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <section className="min-h-screen relative bg-[#0a0e1a]">
      <Outlet />
    </section>
  );
};

export default CommonLayout;
