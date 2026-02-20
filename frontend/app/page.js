"use client";
import {
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Clock,
  BarChart2,
  MonitorPlay,
  Globe,
  MessageSquare,
  ShieldCheck,
  LayoutDashboard,
  Rocket,
  ChevronRight,
  Star,
  Check, ChevronLeft 
} from "lucide-react";
import { brandName } from "./contants";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Nav from './sections/Nav'
import Footer from "./sections/Footer";

const Home = () => {
  
  const { settings } = useSelector((state) => state.appSettings);
  
  const [index, setIndex] = useState(0);
const images = [
  "/images/pic1.jpeg",
  "/images/pic2.jpeg",
  "/images/pic3.jpeg",
];



useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, 5000);
  return () => clearInterval(interval);
}, []);

  
  return (
    <div className="font-sans bg-gradient-to-br from-gray-700 via-blue-900 to-indigo-400 text-gray-200 overflow-hidden">
      {/* Navigation */}
      <Nav/>

      {/* Hero Section */}
   
      <section className="relative h-screen w-full overflow-hidden">

        {/* Background Images Fade */}
        <div className="absolute inset-0">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          ))}
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Learn New Skills Online With{" "}
                <span className="text-indigo-400">EduMaster</span>
              </h1>
        
              <p className="text-xl text-gray-200 mb-8">
                Access 5,000+ courses from top instructors around the globe.
                Grow your skills today.
              </p>
        
              <div className="flex flex-wrap gap-4">
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all">
                  Get Started
                </button>
        
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all">
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </section>


      {/* Stats Section */}
<section className="relative py-24  overflow-hidden">  {/* Background Glow */}
  <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
  <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

  <div className="relative max-w-7xl mx-auto px-6">

    {/* Section Heading */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        Our Impact in Numbers
      </h2>
      <p className="text-gray-300 text-lg">
        Empowering learners worldwide with measurable success.
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Card 1 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg"
      >
        <Users className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
        <h3 className="text-5xl font-extrabold mb-2">50K+</h3>
        <p className="text-gray-300">Active Students</p>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg"
      >
        <BookOpen className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
        <h3 className="text-5xl font-extrabold mb-2">5K+</h3>
        <p className="text-gray-300">Courses Available</p>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg"
      >
        <Award className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
        <h3 className="text-5xl font-extrabold mb-2">300+</h3>
        <p className="text-gray-300">Expert Instructors</p>
      </motion.div>

      {/* Card 4 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 shadow-lg"
      >
        <Clock className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
        <h3 className="text-5xl font-extrabold mb-2">24/7</h3>
        <p className="text-gray-300">Learning Access</p>
      </motion.div>

    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-white font-bold mb-4">Why Choose {brandName}</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              We provide the best learning experience with cutting-edge
              technology and expert instructors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MonitorPlay className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl text-blue-500 font-bold mb-3">Interactive Lessons</h3>
              <p className="text-gray-600">
                Engaging video lessons with quizzes and hands-on exercises to
                reinforce learning.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl text-blue-500 font-bold mb-3">Learn Anywhere</h3>
              <p className="text-gray-600">
                Access courses on any device, anytime with our mobile-friendly
                platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl text-blue-500 font-bold mb-3">Community Support</h3>
              <p className="text-gray-600">
                Join discussion forums and get help from instructors and peers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl text-blue-500 font-bold mb-3">Certification</h3>
              <p className="text-gray-600">
                Earn recognized certificates to showcase your new skills.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl text-blue-500 font-bold mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress reports.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Rocket className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl text-blue-500 font-bold mb-3">Career Advancement</h3>
              <p className="text-gray-600">
                Gain skills that employers want with career-focused courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-white font-bold mb-4">Popular Courses</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Start learning with our most popular courses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="h-48 bg-indigo-100 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/random/600x400?education=${item}`}
                    alt="Course"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {item === 1
                        ? "Design"
                        : item === 2
                        ? "Development"
                        : "Business"}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-700">4.9</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-3">
                    {item === 1
                      ? "UI/UX Design Masterclass"
                      : item === 2
                      ? "Full Stack Web Development"
                      : "Digital Marketing Fundamentals"}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />{" "}
                      {item === 1 ? "12" : item === 2 ? "24" : "8"} Lessons
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />{" "}
                      {item === 1
                        ? "8h 30m"
                        : item === 2
                        ? "32h 15m"
                        : "6h 20m"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-indigo-600 font-bold">
                      {item === 1
                        ? "$89.99"
                        : item === 2
                        ? "$129.99"
                        : "$69.99"}
                    </span>
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      Enroll Now <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border-2 border-indigo-600 text-white bg-indigo-700 px-8 py-3 rounded-full font-medium hover:bg-indigo-50 hover:text-blue-600 transition-all">
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-white font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Hear from our students about their learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={`https://randomuser.me/api/portraits/${
                        item === 1 ? "women" : item === 2 ? "men" : "women"
                      }/${item}2.jpg`}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800">
                      {item === 1
                        ? "Sarah Johnson"
                        : item === 2
                        ? "Michael Chen"
                        : "Emma Rodriguez"}
                    </h4>
                    <p className="text-sm text-black opacity-80">
                      {item === 1
                        ? "UI Designer"
                        : item === 2
                        ? "Web Developer"
                        : "Marketing Specialist"}
                    </p>
                  </div>
                </div>
                <p className="mb-6 text-black">
                  {item === 1
                    ? "The courses transformed my design skills. The instructors are knowledgeable and the platform is easy to use."
                    : item === 2
                    ? "I landed my dream job after completing the Full Stack Development course. The hands-on projects were incredibly valuable."
                    : "The digital marketing course gave me practical skills I could apply immediately to grow my business."}
                </p>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-white font-bold mb-4">
              Simple, Transparent Pricing 
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              Choose the plan that works best for your learning goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-4xl text-blue-800 font-bold mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Perfect for casual learners</p>
              <div className="mb-8">
                <span className="text-4xl text-green-700 font-bold">$19</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Access to 100+ courses</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Basic support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Community access</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <Check className="h-5 w-5 mr-2" />
                  <span>No certificates</span>
                </li>
                <li className="flex items-center text-gray-500">
                  <Check className="h-5 w-5 mr-2" />
                  <span>No premium courses</span>
                </li>
              </ul>
              <button className="w-full border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition-all">
                Get Started
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-indigo-600 relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                MOST POPULAR
              </div>
              <h3 className="text-4xl text-blue-800 font-bold mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">For serious learners</p>
              <div className="mb-8">
                <span className="text-4xl text-green-700 font-bold">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Access to all courses</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Downloadable resources</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Completion certificates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Premium courses included</span>
                </li>
              </ul>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all">
                Get Started
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-4xl text-blue-800 font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For teams and organizations</p>
              <div className="mb-8">
                <span className="text-4xl text-green-700 font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Team dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Custom learning paths</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-black">Dedicated account manager</span>
                </li>
              </ul>
              <button className="w-full border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of students advancing their careers with our courses
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center">
              Get Started <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:bg-opacity-10 hover:text-blue-700 transition-all">
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
    <Footer/>
    </div>
  );
};

export default Home;
