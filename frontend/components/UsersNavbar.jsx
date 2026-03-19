"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  CreditCard,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminServices } from "@/services/admin/admin.service";
import { brandName } from "@/app/contants";
import { useSelector } from "react-redux";



const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);


  const profileRef = useRef(null);

  // ✅ Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await adminServices.getDashborddata();
        const backendMenu = res?.menu || [];

        const mapped = backendMenu.map((item) => {
          if (item === "Dashboard")
            return { name: "Dashboard", path: "user/dashboard", icon: <LayoutDashboard size={18} /> };
          if (item === "Fee Payment")
            return { name: "Fee Payment", path: "user/fee_payment", icon: <CreditCard size={18} /> };

          return {
            name: item,
            path: `/${item.toLowerCase().replace(/\s+/g, "-")}`,
            icon: <LayoutDashboard size={18} />,
          };
        });

        setLinks([
          ...mapped,
          { name: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={18} /> },
          { name: "Fee Payment", path: "/user/fee_payment", icon: <CreditCard size={18} /> },
          { name: "My Profile", path: "/user/myprofile", icon: <User size={18} /> },
        ]);
      } catch (err) {
        console.error(err);

        setLinks([
          { name: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={18} /> },
          { name: "Fee Payment", path: "/user/fee_payment", icon: <CreditCard size={18} /> },
          { name: "My Profile", path: "/user/myprofile", icon: <User size={18} /> },
        ]);
      }
    };

    fetchMenu();
  }, []);





const getInitials = (name) => {
  if (!name) return "...";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

  // close dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const profileItems = [
    { name: "Settings", icon: <Settings size={16} /> },
    { name: "Help Support", icon: <HelpCircle size={16} /> },
    { name: "Sign Out", icon: <LogOut size={16} />, color: "text-red-500" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-cyan-900 shadow-lg">

      <div className="w-full px-6 py-3 flex justify-between items-center">

        {/* LEFT - Logo */}
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" className="h-8" />
          <span className="text-white font-bold text-xl">{brandName}</span>
        </div>

        {/* CENTER - Menu */}
        <div className="hidden lg:flex items-center gap-2 bg-white/10 p-1 rounded-2xl">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${pathname === item.path
                  ? "bg-white text-cyan-900"
                  : "text-white hover:bg-white/10"
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT - Actions */}
        <div className="flex items-center gap-3">

          {/* Bell */}
          <button className="relative p-2 text-white hover:bg-white/10 rounded-full">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
  onClick={() => setProfileOpen(!profileOpen)}
  className="flex items-center gap-2 p-1 pr-2 hover:bg-white/10 rounded-full"
>
  <div className="w-8 h-8 bg-white text-cyan-900 font-bold flex items-center justify-center rounded-full">
    {getInitials(user?.name)}
  </div>

  <span className="text-white text-sm hidden sm:block">
    {user?.name || "Loading..."}
  </span>

  <ChevronDown size={14} className="text-white" />
</button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2">
                {profileItems.map((item) => (
                  <button
                    key={item.name}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 ${item.color || ""
                      }`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-cyan-800 px-6 py-4 space-y-2">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="block text-white py-2"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;