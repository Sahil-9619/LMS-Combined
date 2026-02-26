"use client"

import { GraduationCap, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { brandName } from "../contants"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(()=>{
    const handleClick = () =>{
      setOpen(false)
    }
    if(open){
      document.addEventListener("click",handleClick)
    }
    return () =>{
      document.removeEventListener("click",handleClick)
    }
  })

  const links = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ]

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      
      {/* Glass Container */}
      <div className="relative backdrop-blur-2xl bg-[#283618]/60 border border-[#DDA15E]/40 rounded-2xl shadow-2xl px-8 py-4">

        <div className="relative flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#606C38] to-[#BC6C25] shadow-lg group-hover:scale-110 transition duration-300">
              <GraduationCap className="h-6 w-6 text-[#FEFAE0]" />
            </div>

            <Link
              href="/"
              className="text-2xl font-bold text-[#FEFAE0] tracking-wide"
            >
              {brandName}
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-10 text-[#FEFAE0] font-medium">
            {links.map((item, i) => (
              <Link
                key={i}
                href={item.path}
                className={`relative transition duration-300 ${
                  pathname === item.path
                    ? "text-[#DDA15E]"
                    : "hover:text-[#DDA15E]"
                }`}
              >
                {item.name}

                {pathname === item.path && (
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#DDA15E] rounded-full shadow-md"></span>
                )}
              </Link>
            ))}

            {/* CTA */}
            <Link href="/user/login">
              <button className="px-6 py-2 rounded-full font-semibold text-[#FEFAE0] bg-[#BC6C25] hover:bg-[#DDA15E] transition-all duration-300 shadow-lg">
                Sign Up
              </button>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#FEFAE0]"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden mt-3 backdrop-blur-2xl bg-[#283618]/90 border border-[#DDA15E]/40 rounded-2xl shadow-lg transition-all duration-500 overflow-hidden ${
          open ? "max-h-[600px] py-6 px-6" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-6 text-[#FEFAE0] font-medium">
          {links.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              onClick={() => setOpen(false)}
              className="hover:text-[#DDA15E] transition"
            >
              {item.name}
            </Link>
          ))}

          <Link href="/user/login">
            <button className="mt-4 bg-[#BC6C25] hover:bg-[#DDA15E] py-2 rounded-full text-[#FEFAE0] font-semibold transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar