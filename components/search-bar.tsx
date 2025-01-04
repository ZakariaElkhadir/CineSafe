import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search"
        className="pl-3 pr-10 w-full sm:w-[300px] md:w-[400px] lg:w-[500px] bg-gray-800 rounded-3xl"
      />

      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
        onClick={() => {
          console.log("Search clicked");
        }}
      >
        <Search className="h-4 w-4 text-gray-200" />
      </button>
    </div>
  );
}
