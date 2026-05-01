import Image from "next/image"
import Link from "next/link"
import { Film } from "lucide-react"

// explore grid cards
interface MovieCardProps {
  title: string
  image: string
  href: string
  year?: string
}

export function MovieCard({ title, image, href, year }: MovieCardProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700/50 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer">
        {/* Poster */}
        <div className="relative aspect-[2/3]">
          {image && image !== "/default-poster.jpg" ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-700">
              <Film className="h-10 w-10 text-gray-600" />
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-sm font-semibold line-clamp-2">{title}</p>
            {year && <p className="text-gray-300 text-xs mt-0.5">{year}</p>}
          </div>
        </div>
        {/* Title below poster (visible always) */}
        <div className="p-2.5">
          <h3 className="text-sm font-medium text-white truncate">{title}</h3>
          {year && <p className="text-xs text-gray-500 mt-0.5">{year}</p>}
        </div>
      </div>
    </Link>
  )
}
