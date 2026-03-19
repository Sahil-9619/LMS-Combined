"use client"
import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  BookOpen,
  CreditCard,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  Award
} from "lucide-react";
import { useRouter } from "next/navigation";
import { admissionService } from "@/services/admission.service";
import { useSelector } from "react-redux";

const App = () => {
  const router = useRouter();
  const [hasAdmission, setHasAdmission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  // Primary Theme Color constant
  const primaryColor = "#0E94A5";

  // Stats Data - Updated to match the Vigyan Academy Teal palette
  const stats = [
    { label: "Attendance", value: "88%", icon: CheckCircle, color: "text-[#0E94A5]", bg: "bg-[#0E94A5]/10" },
    { label: "Tests Taken", value: "14", icon: Award, color: "text-[#0E94A5]", bg: "bg-[#0E94A5]/10" },
    { label: "Pending Fees", value: "₹2,500", icon: CreditCard, color: "text-[#0E94A5]", bg: "bg-[#0E94A5]/10" },
    { label: "Class Rank", value: "12th", icon: TrendingUp, color: "text-[#0E94A5]", bg: "bg-[#0E94A5]/10" },
  ];

  const upcomingClasses = [
    { subject: "Mathematics", topic: "Integration by Parts", time: "10:30 AM", room: "Hall A" },
    { subject: "Chemistry", topic: "Organic Synthesis", time: "01:15 PM", room: "Room 204" },
  ];


  useEffect(() => {
    const checkAdmission = async () => {
      try {
        const res = await admissionService.checkAdmission();

        console.log("ADMISSION RESPONSE 👉", res);

        const admitted =
          res?.hasAdmission === true ||
          res?.data?.hasAdmission === true ||
          !!res?.student ||
          !!res?.data?.student;

        setHasAdmission(admitted);
      } catch (err) {
        console.error("ERROR ❌", err);
        setHasAdmission(false);
      }
    };

    checkAdmission();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0E94A5] border-t-transparent"></div>
          <p className="text-gray-500 font-medium animate-pulse">Vigyan Academy Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-slate-900 font-sans pb-12">
      <main className="pt-24 px-4 sm:px-6 lg:px-8 mx-auto">

        {/* Header Greeting */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#0E94A5] font-semibold text-sm mb-1">
              <span className="w-8 h-[2px] bg-[#0E94A5]"></span>
              VIGYAN ACADEMY PORTAL
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {getGreeting()}, {user?.firstName || user?.name || "User"}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Empowering your journey with "विज्ञानं सर्वस्य मूलम्"</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-cyan-100">
            <div className="h-12 w-12 bg-[#0E94A5] rounded-xl flex items-center justify-center text-white shadow-md">
              <User size={24} />
            </div>
            <div className="pr-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Batch</p>
              <p className="text-sm font-bold text-slate-700">{user.batch}</p>
            </div>
          </div>
        </header>
      <hr className="py-3"></hr>
        {/* ADMISSION BANNER */}
        {!hasAdmission && (
          <div className="mb-10 relative overflow-hidden rounded-3xl border border-cyan-100  bg-white shadow-xl shadow-[#0E94A5]/5">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-50 rounded-full opacity-40"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 gap-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex-shrink-0 p-4 bg-cyan-100 rounded-2xl text-[#0E94A5]">
                  <AlertCircle size={32} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-slate-900">Admission Process Pending</h3>
                  <p className="text-slate-600 mt-2 max-w-xl leading-relaxed">
                    Finalize your enrollment to access
                    <span className="font-bold text-[#0E94A5]"> digital study materials, attendance reports, </span> and
                    <span className="font-bold text-[#0E94A5]"> detailed test analytics.</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/admission")}
                className="group flex items-center gap-3 whitespace-nowrap bg-[#0E94A5] hover:bg-[#087a87] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-100"
              >
                Get Admission Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>
          
        )}
        

        {/* Stats Grid */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-cyan-50 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Current</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            {/* Schedule Card */}
            <section className="bg-white rounded-3xl border border-cyan-50 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-cyan-50 flex items-center justify-between bg-cyan-50/20">
                <h2 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#0E94A5] rounded-full"></div>
                  Today's Schedule
                </h2>
                <button className="text-xs font-bold text-[#0E94A5] uppercase tracking-wider">
                  Full Calendar
                </button>
              </div>
              <div className="divide-y divide-cyan-50">
                {upcomingClasses.map((item, idx) => (
                  <div key={idx} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-cyan-50/10 transition-colors">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center justify-center bg-white border border-cyan-100 rounded-2xl p-4 min-w-[90px]">
                        <Clock size={18} className="text-[#0E94A5] mb-1 opacity-70" />
                        <span className="text-sm font-black text-slate-800">{item.time}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{item.subject}</h4>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                          <BookOpen size={14} className="text-[#0E94A5]" />
                          {item.topic}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0E94A5] bg-cyan-50 px-4 py-2 rounded-xl border border-cyan-100">
                      <MapPin size={14} />
                      {item.room}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Card */}
            <section className="bg-white rounded-3xl border border-cyan-50 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-2 h-6 bg-[#0E94A5] rounded-full"></div>
                  Performance Analytics
                </h2>
                <select className="text-xs font-bold border-none bg-cyan-50 text-[#0E94A5] rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="aspect-[21/9] w-full bg-cyan-50/30 rounded-2xl border-2 border-dashed border-cyan-100 flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <TrendingUp className="text-[#0E94A5] opacity-30" size={32} />
                </div>
                <p className="text-slate-500 font-bold">Analytics Pending</p>
                <p className="text-slate-400 text-sm mt-1">Charts will update after your first evaluation.</p>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Notice Board */}
            <section className="bg-white rounded-3xl border border-cyan-50 shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-cyan-50 bg-[#0F3B45] text-white">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Notice Board</h2>
                  <div className="h-2 w-2 bg-[#0E94A5] rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-grow">
                {[
                  { title: "Weekly Mock Test Schedule", date: "Oct 24", type: "Exam" },
                  { title: "Holiday: Diwali Break", date: "Oct 22", type: "Holiday" },
                  { title: "Physics Lab Manual Uploaded", date: "Oct 20", type: "Material" }
                ].map((notice, idx) => (
                  <div key={idx} className="p-6 border-b border-cyan-50 hover:bg-cyan-50/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-cyan-50 text-[#0E94A5]">
                        {notice.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">{notice.date}</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-700 hover:text-[#0E94A5] transition-colors">{notice.title}</h5>
                  </div>
                ))}
              </div>
              <button className="w-full py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                All Notices
              </button>
            </section>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-[#0E94A5] to-[#0A6B78] rounded-3xl p-8 text-white shadow-xl shadow-cyan-100">
              <h4 className="font-bold text-lg mb-2">Help & Support</h4>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">Questions about your batch or fees? Talk to our administrator.</p>
              <button className="w-full py-3 bg-white text-[#0E94A5] font-bold rounded-2xl shadow-sm hover:bg-cyan-50 transition-colors">
                Contact Admin
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App; 