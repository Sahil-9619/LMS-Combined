import React from 'react'
import Nav from '../sections/Nav.jsx'
import Footer from '../sections/Footer.jsx'

const page = () => {
  return (
    <div className='bg-gradient-to-br from-gray-700 via-blue-900 to-indigo-400 text-gray-200 overflow-hidden'>
      <Nav/>
<section className="py-24 ">
  <div className="max-w-7xl mx-auto px-6 space-y-32">
    

    {[
      { img: "/images/pic1.jpeg", title: "Interactive Classrooms" },
      { img: "/images/pic2.jpeg", title: "Hands-on Workshops" },
      { img: "/images/pic3.jpeg", title: "Smart Learning Tools" },
      { img: "/images/pic4.jpeg", title: "Expert Instructors" },
      { img: "/images/pic5.jpeg", title: "Team Collaboration" },
      { img: "/images/pic6.jpeg", title: "Practical Projects" },
      { img: "/images/pic7.jpeg", title: "Modern Labs" },
      { img: "/images/pic8.jpeg", title: "Student Success" },
      { img: "/images/pic9.jpeg", title: "Live Sessions" },
      { img: "/images/pic10.jpeg", title: "Career Growth" },
    ].map((item, index) => (
      
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
            At EduMaster, we focus on delivering real-world knowledge through
            practical exposure and modern teaching methods. Our environment
            fosters innovation, creativity, and collaboration to help students
            achieve excellence in their academic and professional journey.
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
