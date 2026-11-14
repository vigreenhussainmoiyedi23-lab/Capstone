import React from "react";
import PublicNavbar from "../components/PublicNavbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-bold font-serif text-gold mb-2">
          User Dashboard
        </h1>
        <p className="text-text-muted text-sm ">
          User dashboard where all user projects and studio sandboxes will be managed.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

