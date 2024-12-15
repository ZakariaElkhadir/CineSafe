import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
function Slider() {
  return (
    <section className="slider">
      <div className="container">
        <div className="slider__content">
          <div className="slider__image relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            <Image
              className="object-cover object-center w-full h-[480px] rounded-2xl"
              src="/images/flow-movie-poster.webp"
              alt="Flow Movie Poster"
              width={500}
              height={500}
              priority
            />
            <div className="absolute bottom-0 left-0 p-8 text-white text-left">
              <div className="flex gap-3">
                <h3 className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                  Adventure
                </h3>
                <h3 className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                  Animation
                </h3>
              </div>
              <h2 className="slider__title text-6xl font-bold mb-4">Flow</h2>
              <p className="slider__description max-w-2xl mb-6 text-gray-200 ">
                Cat is a solitary animal, but as its home is devastated by a
                great flood, he finds refuge on a boat populated by various
                species, and will have to team up with them despite their
                differences.
              </p>
              <button className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-sky-500/50 hover:scale-105">
                <Play size={20} className="text-white" />
                <span>Watch Movie</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Slider;
