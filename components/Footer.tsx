'use client'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .glow-border {
          box-shadow: 0 -4px 10px -1px rgba(0, 255, 255, 0.2), 0 -2px 6px -1px rgba(0, 255, 255, 0.12);
        }
      `}</style>
      <footer className="bg-gray-900 border-t-2 border-cyan-500 text-white py-8 glow-border">
        <div className="container mx-auto px-4 pl-auto lg:pl-72">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">CineSafe</h3>
              <p className="text-sm text-gray-400">&copy; 2025 CineSafe. All rights reserved.</p>
              <p className="text-sm">
                For business inquiries, contact me at{" "}
                <a href="mailto:zelkhadir5@gmail.com" className="underline hover:text-cyan-500 transition-colors">
                  zelkhadir5@gmail.com
                </a>
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="text-sm hover:text-cyan-500 transition-colors">Home</Link>
                <Link href="/about" className="text-sm hover:text-cyan-500 transition-colors">About</Link>
                <Link href="/explore" className="text-sm hover:text-cyan-500 transition-colors">Explore</Link>
                <Link href="#" className="text-sm hover:text-cyan-500 transition-colors">Contact</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Connected</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-cyan-500 transition-colors" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-cyan-500 transition-colors" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-cyan-500 transition-colors" aria-label="Twitter">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email-input" className="sr-only">Email address</label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  Subscribe to Newsletter
                </Button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

