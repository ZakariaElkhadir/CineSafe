"use client";

import { Facebook, Instagram, Twitter, Film, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="lg:pl-72 bg-[hsl(220,20%,6%)] border-t border-gray-800/80 text-white">
      <div className="px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <Film size={15} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">CineSafe</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Discover family-safe movies rated G, PG, and PG-13. Curated for
              families, powered by OMDB.
            </p>
            <p className="text-xs text-gray-600">© 2025 CineSafe. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Navigation</h3>
            <nav className="flex flex-col space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/explore", label: "Explore" },
                { href: "/favorites", label: "My Favorites" },
                { href: "/about", label: "About" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Connect</h3>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-gray-700 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a
                href="mailto:zelkhadir5@gmail.com"
                className="hover:text-cyan-400 transition-colors"
              >
                zelkhadir5@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
