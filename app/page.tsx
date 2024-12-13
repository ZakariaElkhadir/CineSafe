"use client";
import { SearchBar } from "../components/search-bar";
import { Bell, ArrowDown } from "lucide-react";
function page() {
  return (
    <>
      <header>
          <div className="p-4 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div className="header__list">
                <button className="w-16 h-9 flex items-center justify-center bg-sky-900 rounded-full">
                  All <ArrowDown />
                </button>
              </div>
              <SearchBar/>
              <div className="Header__notification">
                <button className="w-9 h-9 flex items-center justify-center  rounded-full bg-sky-900">
                  <Bell className="rounded-full " />
                </button>
              </div>
            </div>
          </div>
      </header>
    </>
  );
}

export default page;
