"use client";

import React, { useState } from "react";
import { Home, Compass, Info, Heart, Settings, Menu, X, Film } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/contexts/FavoritesContext";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/about", icon: Info, label: "About" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { totalFavorites } = useFavorites();

  React.useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      {pathname !== "/explore" && !pathname.startsWith("/movies") && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900/90 border border-gray-700 rounded-xl text-white backdrop-blur-sm transition-all hover:border-cyan-500/50"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`
          fixed top-0 left-0 lg:top-4 lg:left-4
          h-full lg:h-[calc(100vh-2rem)] w-64
          z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-full glass-dark rounded-none lg:rounded-2xl shadow-2xl border-r lg:border border-gray-800 flex flex-col">
          {/* Logo */}
          <div className="p-6 pb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg glow-cyan-sm flex-shrink-0">
                <Film size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CineSafe</h1>
            </div>
            <p className="text-xs text-gray-500 ml-12">Family-safe movies</p>
          </div>

          {/* Nav links */}
          <ul className="flex-1 px-3 space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative
                      ${isActive
                        ? "bg-cyan-500/15 text-cyan-400 font-medium"
                        : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full" />
                    )}
                    <Icon size={18} className={isActive ? "text-cyan-400" : "group-hover:text-white"} />
                    <span className="text-sm">{label}</span>
                    {label === "Favorites" && totalFavorites > 0 && (
                      <span className="ml-auto bg-cyan-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {totalFavorites}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Settings */}
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => alert("Settings coming soon!")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-800/60 hover:text-white transition-all duration-200 group"
            >
              <Settings size={18} className="group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
