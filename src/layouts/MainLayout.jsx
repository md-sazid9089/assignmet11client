import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import ParallaxBackground from "../components/ParallaxBackground";

const MainLayout = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-slate-950 dark:bg-slate-950 relative">
        <ParallaxBackground />
        <Navbar />
        <main className="relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default MainLayout;
