"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    BookOpen,
    Star,
    Users,
    Tag,
    Clock,
    Check,
    UserCheck,
    Award,
    ChevronRight,
} from "lucide-react";
import Nav from '../sections/Nav.jsx'
import Footer from '../sections/Footer.jsx'

/*
  NOTE:
  - This component uses images from /images/... (public folder). Replace with your images or CDN.
  - Tailwind must be set up in the project.
*/

const sampleCourses = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title:
        i % 3 === 0
            ? "Full-Stack Web Development"
            : i % 3 === 1
                ? "Introduction to Data Science"
                : "UI/UX Design Essentials",
    category: i % 3 === 0 ? "Development" : i % 3 === 1 ? "Data" : "Design",
    lessons: 8 + i,
    duration: `${5 + i}h ${i * 5}m`,
    rating: (4.5 + (i % 5) * 0.1).toFixed(1),
    price: i % 4 === 0 ? 0 : i % 3 === 0 ? 49 : 29,
    featured: i % 4 === 0, // some featured / best
    img: `/images/course${(i % 6) + 1}.jpg`, // put images in public/images/course1.jpg ... course6.jpg
}));

export default function CoursesPage() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [onlyFree, setOnlyFree] = useState(false);
    const [sort, setSort] = useState("relevance");

    const categories = ["All", "Development", "Data", "Design", "Business", "Marketing"];

    const filtered = useMemo(() => {
        return sampleCourses
            .filter((c) => (category === "All" ? true : c.category === category))
            .filter((c) => (onlyFree ? c.price === 0 : true))
            .filter((c) =>
                query.trim() ? c.title.toLowerCase().includes(query.toLowerCase()) : true
            )
            .sort((a, b) => {
                if (sort === "rating") return b.rating - a.rating;
                if (sort === "price") return a.price - b.price;
                return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
            });
    }, [query, category, onlyFree, sort]);

    return (
        <main className=" bg-gradient-to-br from-gray-700 via-blue-900 to-indigo-400 text-gray-100 overflow-hidden">

            {/* HERO / SEARCH */}
            <Nav />
            <section className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                                Advance your career — learn in-demand skills
                            </h1>
                            <p className="text-lg text-gray-300 mb-6">
                                Expert-led online courses, professional certificates and career tracks — learn at your pace.
                            </p>

                            <div className="flex items-center gap-3 bg-white rounded-full shadow-sm px-4 py-2">
                                <Search className="h-5 w-5 text-gray-400" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search courses, topics or instructors"
                                    className="flex-1 bg-transparent outline-none px-2 text-sm"
                                />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="bg-transparent text-sm outline-none"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        setQuery("");
                                        setCategory("All");
                                        setOnlyFree(false);
                                        setSort("relevance");
                                    }}
                                    className="text-indigo-600 font-medium text-sm"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="mt-4 flex gap-4 items-center text-sm text-gray-300">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} className="h-4 w-4" />
                                    Free courses only
                                </label>

                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-sm text-gray-300">Sort</span>
                                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm outline-none bg-white rounded px-2 py-1 shadow-sm text-black">
                                        <option value="relevance">Relevance</option>
                                        <option value="rating">Top rated</option>
                                        <option value="price">Price: low → high</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT: Featured subscription / best offer */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-4xl text-blue-700 font-bold ">EduMaster Plus</h3>
                                        <p className="text-sm text-gray-500">Unlimited access to most courses — monthly or yearly</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-extrabold text-indigo-600">₹699</div>
                                        <div className="text-xs text-gray-400">/ month</div>
                                    </div>
                                </div>

                                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Unlimited access</li>
                                    <li className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-green-500" /> Certificate of completion</li>
                                    <li className="flex items-center gap-2"><Award className="h-4 w-4 text-green-500" /> Career resources</li>
                                </ul>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition">
                                        Start Free Trial
                                    </button>
                                    <button className="px-4 py-2 rounded-full border border-gray-200 text-gray-700">Compare Plans</button>
                                </div>

                                <div className="mt-4 text-xs text-gray-400">Try 7 days free on selected plans — cancel anytime.</div>
                            </div>

                            {/* quick stats */}
                            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                                <div className="bg-white/80 rounded-lg p-3">
                                    <div className="text-sm text-gray-500">Students</div>
                                    <div className="font-bold text-indigo-600">1.2M+</div>
                                </div>
                                <div className="bg-white/80 rounded-lg p-3">
                                    <div className="text-sm text-gray-500">Courses</div>
                                    <div className="font-bold text-indigo-600">6K+</div>
                                </div>
                                <div className="bg-white/80 rounded-lg p-3">
                                    <div className="text-sm text-gray-500">Instructors</div>
                                    <div className="font-bold text-indigo-600">500+</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES (icons + quick filters) */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-4 items-center justify-center">
                        {["All", "Development", "Data", "Design", "Business", "Marketing"].map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-4 py-2 rounded-full text-sm font-medium ${category === c ? "bg-indigo-600 text-white" : "bg-white text-gray-700 shadow-sm"}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED / BEST COURSES */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl text-white font-bold">Best picks for you</h2>
                        <a href="#all-courses" className="text-white font-medium text-sm flex items-center gap-2">See all <ChevronRight className="h-4 w-4" /></a>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {filtered.slice(0, 3).map((c) => (
                            <motion.article key={c.id} whileHover={{ scale: 1.02 }} className="bg-white text-blue-600 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                <div className="h-44 bg-gray-100 overflow-hidden">
                                    <img src={c.img} alt={c.title} className="w-full h-full object-cover transform transition duration-500 hover:scale-110" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">{c.category}</span>
                                        {c.featured && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">Best</span>}
                                    </div>
                                    <h3 className="font-semibold mb-2 text-white">{c.title}</h3>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-yellow-400" />
                                            <span>{c.rating}</span>
                                        </div>
                                        <div>
                                            {c.price === 0 ? <span className="text-green-600 font-semibold">Free</span> : <span className="font-bold text-indigo-600">₹{c.price}</span>}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm">Enroll</button>
                                        <button className="px-3 py-2 rounded-md border border-gray-200 text-sm">Preview</button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ALL COURSES GRID */}
            <section id="all-courses" className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-baseline justify-between mb-6">
                        <h2 className="text-2xl text-white font-bold">All Courses</h2>
                        <div className="text-sm text-gray-600">{filtered.length} results</div>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filtered.map((c) => (
                                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white text-blue-600 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    <div className="h-40 bg-gray-100 overflow-hidden">
                                        <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-500">{c.category}</span>
                                            <span className="text-xs text-gray-400">{c.lessons} lessons</span>
                                        </div>
                                        <h3 className="font-semibold mb-2 text-white">{c.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                            A beginner-friendly course to master core concepts and practical skills.
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-700 font-semibold">{c.price === 0 ? "Free" : `₹${c.price}`}</div>
                                            <button className="text-indigo-600 text-sm font-medium">View</button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* SUBSCRIPTION PLANS */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl text-white font-bold">Subscription Plans</h2>
                        <p className="text-gray-300">Choose a plan that fits your learning goals</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <PlanCard title="Free" price="0" perks={["Limited courses", "Community support"]} highlight={true} />
                        <PlanCard title="Pro Monthly" price="699" perks={["Unlimited courses", "Certificate", "Priority support"]} highlight={true} />
                        <PlanCard title="Enterprise" price="2499" perks={["Team seats", "Admin dashboard", "SAML SSO"]} highlight={true} />
                    </div>
                </div>
            </section>

            {/* FREE COURSES */}
            <section className="py-16 ">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl text-white font-bold">Free Courses</h2>
                        <a href="#all-courses" className="text-white text-sm">Browse all free</a>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {sampleCourses.filter((c) => c.price === 0).map((c) => (
                            <div key={c.id} className="bg-white rounded-xl shadow p-4 ">
                                <div className="h-36 overflow-hidden rounded-md mb-3">
                                    <img src={c.img} alt={c.title} className="w-full h-full object-cover text-blue-500" />
                                </div>
                                <div className="font-semibold text-blue-600">{c.title}</div>
                                <div className="text-sm text-gray-500">{c.category}</div>
                                <div className="mt-3">
                                    <button className="w-full bg-green-600 text-white px-3 py-2 rounded-md">Start Free</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-16 ">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl text-white font-bold">What learners say</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {["Sarah — UI Designer", "Akash — Data Analyst", "Priya — Developer"].map((t, i) => (
                            <motion.blockquote key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-50 p-6 rounded-xl">
                                <p className="text-gray-700 mb-4">
                                    “This platform helped me transition into a new career with practical projects and career support.”
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div>{t}</div>
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="h-4 w-4" />
                                        <span className="ml-1">4.9</span>
                                    </div>
                                </div>
                            </motion.blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-12 text-black">
                <div className="max-w-4xl mx-auto px-6">
                    <h3 className="text-2xl font-bold  text-white mb-6">Frequently asked questions</h3>
                    <details className="mb-3 bg-white p-4 rounded-lg shadow-sm">
                        <summary className="font-medium cursor-pointer">What is EduMaster Plus?</summary>
                        <div className="mt-2 text-gray-600">A subscription giving unlimited access to most courses and certificates.</div>
                    </details>
                    <details className="mb-3 bg-white p-4 rounded-lg shadow-sm">
                        <summary className="font-medium cursor-pointer">Do you offer refunds?</summary>
                        <div className="mt-2 text-gray-600">Yes — within 14 days for most purchases.</div>
                    </details>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl text-white font-bold mb-4">Ready to start learning?</h2>
                    <p className="text-gray-600 mb-6">Join thousands of learners and level up your skills today.</p>
                    <div className="flex items-center justify-center gap-4">
                        <button className="bg-indigo-600 text-white px-6 py-3 rounded-full">Get Started</button>
                        <button className="px-6 py-3 rounded-full border border-gray-200">Contact Sales</button>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}

/* ----------------- Helper components ----------------- */

function PlanCard({ title, price, perks = [], highlight = false }) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className={`rounded-2xl p-6 shadow ${highlight ? "border-2 border-indigo-600 bg-white" : "bg-white/90 border border-gray-100"}`}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl text-purple-800 font-bold">{title}</h4>
                <div className="text-2xl font-bold text-green-600">{price === "0" ? "Free" : `₹${price}`}</div>
            </div>
            <ul className="text-sm text-gray-900 space-y-2 mb-4">
                {perks.map((p, i) => (
                    <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> {p}</li>
                ))}
            </ul>
            <button className={`w-full py-2 rounded-full ${highlight ? "bg-indigo-600 text-white" : "border border-gray-200"}`}>Choose plan</button>
        </motion.div>
    );
}