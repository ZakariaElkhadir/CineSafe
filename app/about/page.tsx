"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4  lg:pl-72">
      <motion.div
        className="max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="p-8 md:p-12">
          <motion.header
            className="text-center sm:text-left mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What is CineSafe?
            </h2>
            <motion.div
              className="h-1 w-20 bg-blue-500 hidden sm:block"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.header>

          <motion.main
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.p
              className="text-lg md:text-xl text-gray-300 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              CineSafe is your go-to platform for discovering family-friendly
              movies, making it easier to ensure a safe and enjoyable viewing
              experience for everyone.
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-gray-300 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              While CineSafe does not stream movies, it provides detailed
              information about whether a movie is suitable for your family.
              Additionally, it includes a brief synopsis of the movie&#39;s
              storyline, helping you make informed decisions before watching.
            </motion.p>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Link
                href="/explore"
                className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
              >
                Explore Movies
              </Link>
            </motion.div>
          </motion.main>
        </div>
      </motion.div>
    </div>
  );
}
