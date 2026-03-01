"use client"

import { GraduationCap, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { brandName } from "../contants"
import logo from "../../public/images/logo.png"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleClick = () => {
      setOpen(false)
    }
    if (open) {
      document.addEventListener("click", handleClick)
    }
    return () => {
      document.removeEventListener("click", handleClick)
    }
  })

  const links = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">

      {/* Glass Container */}
      <div className="relative backdrop-blur-2xl bg-[rgba(23,143,158,0.15)] border border-[#46B7C3]/40 rounded-2xl shadow-2xl px-8 py-4">

        <div className="relative flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className=" bg-white/50 rounded-xl h-10 w-10 shadow-lg flex items-center justify-center group-hover:scale-110 transition duration-300">
              <img src="/images/logo.png" alt="Logo"
              className="w-8 h-8 scale-[2.5]" />
            </div>

            <Link
              href="/"
              className="text-2xl font-bold text-cyan-600 tracking-wide"
            >
              {brandName}
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-10 text-white font-medium">
            {links.map((item, i) => (
              <Link
                key={i}
                href={item.path}
                className={`relative transition duration-300 ${
                  pathname === item.path
                    ? "text-[#178F9E]"
                    : "hover:text-[#178F9E]"
                }`}
              >
                {item.name}

                {pathname === item.path && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#178F9E] rounded-full shadow-md"></span>
                )}
              </Link>
            ))}

            {/* CTA */}
            <Link href="/user/login">
              <button className="px-6 py-2 rounded-full font-semibold text-white bg-[#178F9E] hover:bg-[#0F6F7C] transition-all duration-300 shadow-lg">
                Sign Up
              </button>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#178F9E]"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden mt-3 backdrop-blur-2xl bg-[rgba(23,143,158,0.25)] border border-[#46B7C3]/40 rounded-2xl shadow-lg transition-all duration-500 overflow-hidden ${
          open ? "max-h-[600px] py-6 px-6" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-6 text-white font-medium">
          {links.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              onClick={() => setOpen(false)}
              className="hover:text-[#178F9E] transition"
            >
              {item.name}
            </Link>
          ))}

          <Link href="/user/login">
            <button className="mt-4 bg-[#178F9E] hover:bg-[#0F6F7C] py-2 rounded-full text-white font-semibold transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar