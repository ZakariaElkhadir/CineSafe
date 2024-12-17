'use client';
import React from 'react'
import { useState } from 'react'
import { Home, Compass, Film, Heart, Settings, Menu, X} from 'lucide-react'

function sideBar() {
    const [isOpen, setIsOpen] = useState(false)
    return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

<nav className={`
        fixed lg:relative 
        w-64 min-h-screen bg-gray-800 text-white
        p-6 z-50 transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:ml-20 lg:-mt-12 rounded-2xl
      `}>
          <div className="mb-12">
            <h1 className="text-4xl font-bold mt-4 mb-2">CineSafe</h1>
            <div className="w-16 h-1 bg-sky-500 mx-auto rounded-full"></div>
          </div>

          <ul className="space-y-6">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Home size={20} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Compass size={20} />
                <span>Explore</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Film size={20} />
                <span>Movies</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-500 rounded-lg transition-all"
              >
                <Heart size={20} />
                <span>Favorites</span>
              </a>
            </li>
          </ul>

          <div className=" pt-6 border-t border-gray-700 mt-8">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:bg-teal-600 rounded-lg transition-all"
            >
              <Settings size={20} />
              <span>Settings</span>
            </a>
          </div>
        </nav>
    </>
  )
}

export default sideBar;