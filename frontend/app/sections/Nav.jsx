import { GraduationCap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { brandName } from "../contants";
const nav = () => {
  return (
    <div>
      <nav className=" w-full bg-transparent  shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <Link href="/" className="ml-2 text-2xl font-bold">
               {brandName}
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-white">
              <Link
                href="/"
                className="text- hover:text-indigo-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/courses"
                className=" hover:text-indigo-600 font-medium"
              >
                Courses
              </Link>
              <Link
                href="#"
                className="hover:text-indigo-600 font-medium"
              >
                Blog
              </Link>
              <Link
                href="/gallery"
                className="hover:text-indigo-600 font-medium"
              >
                Gallery
              </Link>
              <Link
                href="#"
                className=" hover:text-indigo-600 font-medium"
              >
                About
              </Link>
              <Link href="/">
                <button className=" hover:text-indigo-600 font-medium">
                  Contact
                </button>
              </Link>
              <Link href="/user/login">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all">
                  Sign Up
                </button>
              </Link>{" "}
            </div>

            <button className="md:hidden text-gray-700">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default nav
