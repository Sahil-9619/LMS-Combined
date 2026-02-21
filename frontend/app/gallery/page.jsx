import React from 'react'
import Nav from '../sections/Nav.jsx'
import Footer from '../sections/Footer.jsx'

const page = () => {

  const galleryData = [
  {
    id: 1,
    img: "/images/class.png",
    title: "Interactive Classrooms",
    description:
      "Engaging classroom environments designed to encourage active participation and collaborative learning.",
  },
  {
    id: 2,
    img: "/images/workshops.png",
    title: "Hands-on Workshops",
    description:
      "Practical workshops that help students apply theoretical knowledge to real-world scenarios.",
  },
  {
    id: 3,
    img: "/images/smartLearning.png",
    title: "Smart Learning Tools",
    description:
      "Advanced digital tools and platforms that enhance productivity and modern learning experiences.",
  },
  {
    id: 4,
    img: "/images/instructor.png",
    title: "Expert Instructors",
    description:
      "Learn from industry professionals with years of experience and real-world expertise.",
  },
  {
    id: 5,
    img: "/images/team.png",
    title: "Team Collaboration",
    description:
      "Encouraging teamwork and group projects to develop communication and leadership skills.",
  },
  {
    id: 6,
    img: "/images/projects.png",
    title: "Practical Projects",
    description:
      "Build portfolio-ready projects that demonstrate your skills and impress recruiters.",
  },
  {
    id: 7,
    img: "/images/modernLab.png",
    title: "Modern Labs",
    description:
      "State-of-the-art laboratories equipped with the latest technology for hands-on training.",
  },
  {
    id: 8,
    img: "/images/stsuccess.png",
    title: "Student Success",
    description:
      "A strong focus on student growth, achievements, and measurable learning outcomes.",
  },
  {
    id: 9,
    img: "/images/livesession.png",
    title: "Live Sessions",
    description:
      "Interactive live classes with Q&A sessions to ensure real-time engagement and clarity.",
  },
  {
    id: 10,
    img: "/images/career.png",
    title: "Career Growth",
    description:
      "Structured career guidance and mentorship to help students achieve professional success.",
  },
]


  return (
    <div className='bg-gradient-to-br from-gray-700 via-blue-900 to-indigo-400 text-gray-200 overflow-hidden'>
      <Nav/>
<section className="py-24 ">
  <div className="max-w-7xl mx-auto px-6 space-y-32">
    

    {galleryData.map((item, index) => (
      
      <div
        key={index}
        className={`grid md:grid-cols-2 gap-16 items-center ${
          index % 2 !== 0 ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Image */}
        <div className={`relative group overflow-hidden rounded-3xl shadow-2xl ${index % 2 !== 0 ? "md:order-2" : ""}`}>
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-[450px] object-cover transform group-hover:scale-105 transition duration-700"
          />
        </div>

        {/* Description */}
        <div className={`${index % 2 !== 0 ? "md:order-1" : ""}`}>
          <h2 className="text-4xl text-cyan-500 font-bold  mb-6">
            {item.title}
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed">
            {item.description}
          </p>

          <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition">
            Learn More
          </button>
        </div>
      </div>

    ))}

  </div>
</section>
<Footer/>
    </div>
  )
}

export default page
