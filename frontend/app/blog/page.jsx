"use client";

import { motion } from "framer-motion";
import Nav from "../sections/Nav";
import Footer from "../sections/Footer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Blog() {

    const blogPosts = [
  {
    id: 1,
    img: "/images/blog1.png",
    category: "Development",
    title: "How to Build Real Projects That Impress Recruiters",
    excerpt:
      "Practical advice on creating portfolio-ready applications that demonstrate real skill.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    id: 2,
    img: "/images/blog2.png",
    category: "Design",
    title: "UI/UX Principles Every Beginner Should Know",
    excerpt:
      "Learn the core design fundamentals that make digital products intuitive and beautiful.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    id: 3,
    img: "/images/blog3.png",
    category: "Career",
    title: "How to Crack Technical Interviews in 2026",
    excerpt:
      "Smart strategies to prepare for coding rounds and technical discussions effectively.",
    readTime: "7 min read",
    date: "April 2026",
  },
  {
    id: 4,
    img: "/images/blog4.png",
    category: "Data",
    title: "Why Data Science Is Still a Top Career Choice",
    excerpt:
      "Explore the growing demand and opportunities in the data-driven world.",
    readTime: "4 min read",
    date: "April 2026",
  },
  {
    id: 5,
    img: "/images/blog5.png",
    category: "Marketing",
    title: "Digital Marketing Trends You Shouldn’t Ignore",
    excerpt:
      "Stay ahead with the latest growth strategies and online marketing techniques.",
    readTime: "5 min read",
    date: "March 2026",
  },
  {
    id: 6,
    img: "/images/blog6.png",
    category: "Productivity",
    title: "How to Stay Consistent While Learning Online",
    excerpt:
      "Proven techniques to maintain discipline and complete your online courses.",
    readTime: "3 min read",
    date: "March 2026",
  },
];

const popularPosts = [
  {
    id: 1,
    title: "Top 15 React Interview Questions in 2026",
    img : '/images/popular1.png',
    excerpt:
      "A curated list of frequently asked interview questions with practical answers.",
  },
  {
    id: 2,
    title: "Next.js vs React: What Should You Learn in 2026?",
    img : '/images/popular2.png',
    excerpt:
       "A practical comparison of Next.js and React to help you choose the right path for your career.",
  },
];

  return (
    <main className="bg-gradient-to-br from-gray-700 via-blue-900 to-indigo-400 text-gray-100 overflow-hidden">

      <Nav />

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="uppercase tracking-widest text-indigo-300 text-sm mb-4">
              Educational Blog
            </p>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Practical insights for
              <br />
              modern learners.
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed">
              Career guidance, technical roadmaps, industry trends,
              and learning strategies — designed to help you grow faster.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================= FEATURED POST ================= */}
      <section className="pb-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div className="rounded-3xl overflow-hidden">
            <img
              src="/images/featuredev.png"
              alt="Featured"
              className="w-full h-[450px] object-contain"
            />
          </div>

          <div>
            <p className="text-indigo-300 text-sm mb-4 uppercase tracking-wide">
              Featured
            </p>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              The Complete Roadmap to Becoming
              a Full Stack Developer in 2026
            </h2>

            <p className="text-gray-300 leading-relaxed mb-6">
              A structured, step-by-step guide covering frontend,
              backend, deployment, and portfolio building —
              without wasting time on outdated resources.
            </p>

            <button className="flex items-center gap-2 text-indigo-300 hover:text-white transition">
              Read Article <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4">

          {[
            "All",
            "Career Guidance",
            "Development",
            "Data Science",
            "Study Tips",
            "Industry Trends",
          ].map((cat, i) => (
            <button
              key={i}
              className="px-5 py-2 rounded-full border border-white/30 text-sm hover:bg-white/10 transition"
            >
              {cat}
            </button>
          ))}

        </div>
      </section>

      {/* ================= LATEST ARTICLES GRID ================= */}
      <section className="pb-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-12">

          {blogPosts.map((item) => (
            <motion.article
              key={item.id}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="rounded-2xl overflow-hidden mb-5">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[250px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <p className="text-indigo-300 text-xs mb-3 uppercase tracking-wide">
                {item.category}
              </p>

              <h3 className="text-xl font-semibold mb-3 leading-snug">
                {item.title}
              </h3>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {item.excerpt}
              </p>

              <span className="text-gray-400 text-xs">
                {item.readTime} • {item.date}
              </span>
            </motion.article>
          ))}

        </div>
      </section>

      {/* ================= POPULAR POSTS ================= */}
      <section className="pb-28 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold mb-12">
            Popular This Month
          </h2>

          <div className="grid md:grid-cols-2 gap-10">

            {popularPosts.map((item) => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-80 h-60 rounded-xl overflow-hidden">
                  <img
                    src={item.img}
                    className="w-full h-full object-contain"
                    alt="Popular"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {item.excerpt}
                    </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-6">
            Get smarter every week.
          </h2>

          <p className="text-gray-300 mb-10">
            Join our newsletter for curated learning resources,
            career advice, and industry updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white outline-none w-full sm:w-auto"
            />
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition">
              Subscribe
            </button>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 px-6 bg-white/5 text-center">
        <div className="max-w-3xl mx-auto">

          <h2 className="text-4xl font-bold mb-6">
            Ready to apply what you learn?
          </h2>

          <p className="text-gray-300 mb-10">
            Explore our structured courses and start building
            real-world skills today.
          </p>

          <Link 
          href="/courses"
          className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 rounded-full text-lg font-medium transition">
            Explore Courses
          </Link>

        </div>
      </section>

      <Footer />

    </main>
  );
}