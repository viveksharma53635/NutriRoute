// components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ isLoggedIn }) => {
  const location = useLocation();
  const isProfileRoute = location.pathname === "/profile";
  const fullWidthRoutes = [
    "/",
    "/profile",
    "/dashboard",
    "/userdashboard",
    "/track-progress",
    "/analytics",
    "/diet-planner",
    "/healthy-recipes",
    "/healthy-menus"
  ];
  const isFullWidthRoute = fullWidthRoutes.includes(location.pathname);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <main className={isFullWidthRoute ? "profile-main-wrapper" : "container mt-4"}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
