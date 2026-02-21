"use client";

import { motion } from "framer-motion";
import Nav from "../sections/Nav";
import Footer from "../sections/Footer";
import Link from "next/link";

export default function AboutPage() {

  const teamMembers = [
  {
    name: "Sahil Kumar",
    role: "Developer",
    image: "./images/coding.jpg"
  },
  {
    name: "Harsh Raj",
    role: "Academic Lead",
    image: "./images/edu.png"
  },
  {
    name: "Team Member",
    role: "Engineering Lead",
    image: "./images/uiux.jpg"
  }
];

  return (
<main className="bg-gradient-to-br from-gray-700 via-blue-900 to-indigo-400 text-gray-100 overflow-hidden">
      <Nav />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[95vh] flex items-center px-6">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        />

        <div className="absolute inset-0 " />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="uppercase tracking-widest text-indigo-400 text-sm mb-4">
              About EducationJal
            </p>

            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Built for learners
              <br />
              <span className="text-indigo-400">who want more.</span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We created EducationJal to move beyond passive learning.
              Our platform focuses on practical execution, real-world
              skill building, and measurable growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= WHY WE EXIST ================= */}
      <section className="py-28 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-cyan-400 font-bold mb-8">
              Education is evolving.
              <br />
              We chose to evolve with it.
            </h2>

            <p className="text-white leading-relaxed mb-6">
              Traditional systems often prioritize theory over application.
              Industry demands practical ability. We bridge that gap.
            </p>

            <p className="text-white leading-relaxed">
              Every course is structured around implementation,
              not just information. We care about what you can build,
              not what you can memorize.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden"
          >
            <img
              src="/images/edu.png"
              alt="Learning"
              className="w-full h-auto object-contain "
            />
          </motion.div>

        </div>
      </section>

      {/* ================= DIFFERENCE STRIP ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="grid md:grid-cols-3 gap-12">

            <Difference
              title="Execution First"
              text="Projects, simulations, and applied learning instead of passive video consumption."
            />

            <Difference
              title="Industry Designed"
              text="Courses shaped with real professionals to reflect current market needs."
            />

            <Difference
              title="Outcome Focused"
              text="We measure success by skill mastery, not course completion."
            />

          </div>

        </div>
      </section>

      {/* ================= NUMBERS ================= */}
      <section className="py-28 px-6 bg-transparent">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-16">
            Our impact so far
          </h2>

          <div className="grid md:grid-cols-4 gap-12">

            <Stat number="1.2M+" label="Active Learners" />
            <Stat number="6,000+" label="Courses Delivered" />
            <Stat number="500+" label="Industry Experts" />
            <Stat number="95%" label="Completion Rate" />

          </div>

        </div>
      </section>

      {/* ================= TEAM (Minimal) ================= */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl font-bold mb-6">
              The people behind the platform
            </h2>
            <p className="text-white leading-relaxed">
              A focused team of educators, technologists,
              and industry professionals committed to building
              a modern learning ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">

            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                whileHover={{ member: -10 }}
                className="group"
              >
                <div className="rounded-2xl overflow-hidden mb-6">
                  <img
                    src={member.image}
                    className="w-full h-[350px] object-cover group-hover:scale-105 transition duration-500"
                    alt="Team"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-200 text-sm">{member.role}</p>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* ================= FINAL STATEMENT ================= */}
      <section className="py-28 px-6 bg-transparent text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Education should create capability.
            <br />
            Not just certificates.
          </h2>

          
            <Link 
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-10 py-4 rounded-full text-lg font-medium transition"
            href="/courses"> Explore Courses</Link>
          
        </div>
      </section>

      <Footer />

    </main>
  );
}

/* ================= COMPONENTS ================= */

function Difference({ title, text }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-cyan-400 ">
        {title}
      </h3>
      <p className="text-white leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <h3 className="text-5xl font-bold text-cyan-400 mb-4">
        {number}
      </h3>
      <p className="text-white uppercase tracking-wider text-sm">
        {label}
      </p>
    </div>
  );
}