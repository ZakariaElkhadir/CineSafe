import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface MovieCardProps {
  title: string
  image: string
  href: string
}

export function MovieCard({ title, image, href }: MovieCardProps) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden transition-all hover:scale-105">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3]">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-2">
            <h3 className="text-sm font-medium text-black truncate">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

