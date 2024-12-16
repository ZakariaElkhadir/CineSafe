import { MovieCard } from "./movie-card"

const movies = [
  {
    title: "dr.strange",
    image: "/images/movies/dr.strange-poster.jpg",
    href: "/movies/carry-on"
  },
  {
    title: "Spiderwick",
    image: "/images/movies/spiderwick-poster.jpg",
    href: "/movies/mary"
  },
  {
    title: "Intersteler",
    image: "/images/movies/intersteler-poster.jpg",
    href: "/movies/outer-banks"
  },
  {
    title: "Zathura",
    image: "/images/movies/zathura-poster.jpg",
    href: "/movies/blacklist"
  },
  {
    title: "Home Alone",
    image: "/images/movies/homealone-poster.webp",
    href: "/movies/flow"
  },
  {
    title: "Spider-Man",
    image: "/images/movies/spiderman-poster.jpg",
    href: "/movies/flow"
  },
  {
    title: "Brave",
    image: "/images/movies/brave-poster.jpg",
    href: "/movies/flow"
  },
  {
    title: "Kung Fu Panda",
    image: "/images/movies/panda-poster.jpg",
    href: "/movies/flow"
  }
  
];

export default function MovieGrid() {
  return (
    <div className=" min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl text-left font-bold text-white mb-6">You might like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.title}
              title={movie.title}
              image={movie.image}
              href={movie.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}