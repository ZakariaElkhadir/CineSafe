import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export function SearchBar() {
  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search"
        className="pl-3 pr-10 w-[500px] bg-gray-800 rounded-3xl"
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-200 " />
    </div>
  )
}
