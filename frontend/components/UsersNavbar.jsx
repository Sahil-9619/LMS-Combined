"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, 
  ClipboardList, 
  User, 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  Bell, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Clock
} from 'lucide-react';

// Mocking constants and Next.js components for the standalone environment
const brandName = "EduPortal";
const Link = ({ href, children, className }) => (
  <a href={href} className={className} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Refs for detecting clicks outside
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle clicks anywhere on the page to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile if clicking outside profile container
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // Close mobile menu if clicking outside the nav area
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Attendance', icon: <Clock size={18} /> },
    { name: 'Fee Payment', icon: <CreditCard size={18} /> },
    { name: 'Fee Status', icon: <ClipboardList size={18} /> },
    { name: 'Timetable', icon: <Calendar size={18} /> },
    { name: 'Results', icon: <GraduationCap size={18} /> },
  ];

  const profileItems = [
    { name: 'My Account Details', icon: <User size={16} /> },
    { name: 'Settings', icon: <Settings size={16} /> },
    { name: 'Help Support', icon: <HelpCircle size={16} /> },
    { name: 'Sign Out', icon: <LogOut size={16} />, color: 'text-red-500' },
  ];

  // Helper to toggle profile and ensure mobile menu is closed
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Helper to toggle mobile menu and ensure profile is closed
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };
   const username = "Sahil";
const getGreeting = (username) => {
  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return `${greeting}`;
};
  return (
    <div >
      {/* Navigation */}
      <nav 
        ref={mobileMenuRef}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-cyan-900/95 backdrop-blur-md shadow-lg py-2' : 'bg-cyan-800 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-lg">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-15 h-7 scale-125 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>';
                  }}
                />
              </div>

              <Link
                href="/"
                className="text-2xl font-bold text-white tracking-wide"
              >
                {brandName}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-white/10 p-1 rounded-2xl">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsProfileOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === item.name
                      ? 'bg-white text-cyan-800 shadow-md'
                      : 'text-cyan-50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="relative p-2 text-cyan-100 hover:bg-white/10 rounded-full transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full ring-2 ring-cyan-800"></span>
              </button>

              <div className="relative" ref={profileRef}>
                <button 
                  onClick={toggleProfile}
                  className="flex items-center gap-2 p-1 pr-3 hover:bg-white/10 rounded-full transition-colors group"
                >
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-800 font-bold border border-cyan-200">
                    SK
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-none">Sahil Kumar</p>
                    <p className="text-[10px] text-cyan-200">ID: #2940</p>
                  </div>
                  <ChevronDown size={14} className={`text-cyan-200 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account</p>
                    </div>
                    {profileItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setIsProfileOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${item.color || 'text-slate-600'}`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen bg-cyan-900 border-t border-white/10' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  activeTab === item.name
                    ? 'bg-white text-cyan-900 shadow-inner'
                    : 'text-cyan-50 hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10">
               <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 font-medium hover:bg-rose-900/30 transition-all">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default App;