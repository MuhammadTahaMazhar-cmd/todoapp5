'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Shield,
  Smartphone,
  ArrowRight,
  BarChart3,
  Calendar,
  Target,
  Heart,
  Rocket,
  CheckSquare,
  Sun,
  Moon,
  CheckCircle,
  ChevronDown,
  Users,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Inspirational Quotes about Productivity (for landing page)
const inspirationalQuotes = [
  {
    quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    translation: "",
    source: "Paul J. Meyer",
    author: "Productivity Expert"
  },
  {
    quote: "The key is in not spending time, but in investing it.",
    translation: "",
    source: "Stephen R. Covey",
    author: "Author & Speaker"
  },
  {
    quote: "Success is where preparation and opportunity meet.",
    translation: "",
    source: "Bobby Unser",
    author: "Racing Legend"
  },
  {
    quote: "You may delay, but time will not.",
    translation: "",
    source: "Benjamin Franklin",
    author: "American Polymath"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    translation: "",
    source: "Walt Disney",
    author: "Entrepreneur"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    translation: "",
    source: "Sam Levenson",
    author: "Comedian & Author"
  }
];

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [darkMode, setDarkMode] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  // Show all quotes on landing page (5-6 quotes)
  const displayedQuotes = inspirationalQuotes;

  // Auto-change quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % displayedQuotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, [displayedQuotes.length]);

  useEffect(() => {
    // Initialize theme
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);


  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSections((prev) => new Set(prev).add(sectionId));
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => {
        if (section.id) {
          observer.observe(section);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
            </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-playfair underline-gradient">
                TaskMaster
              </span>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Link
                href="#features"
                className="text-sm font-semibold text-slate-700 hover:text-purple-400 dark:text-slate-200 dark:hover:text-purple-300 transition-colors relative group"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 dark:bg-purple-300 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {/* Features Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setFeaturesDropdownOpen(true)}
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
              >
                <button className="text-sm font-semibold text-slate-700 hover:text-purple-400 dark:text-slate-200 dark:hover:text-purple-300 transition-colors relative group flex items-center gap-1">
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 dark:bg-purple-300 group-hover:w-full transition-all duration-300"></span>
                </button>
                {featuresDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-slate-200 dark:border-zinc-800 py-2 z-50">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-900 border-l border-t border-slate-200 dark:border-zinc-800 rotate-45"></div>
                    <Link
                      href="/tasks"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors relative z-10"
                      onClick={() => setFeaturesDropdownOpen(false)}
                    >
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                      Tasks
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors relative z-10"
                      onClick={() => setFeaturesDropdownOpen(false)}
                    >
                      <Target className="w-4 h-4 text-purple-400" />
                      Dashboard
                    </Link>
                    <Link
                      href="/calendar"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors relative z-10"
                      onClick={() => setFeaturesDropdownOpen(false)}
                    >
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Calendar
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="#about"
                className="text-sm font-semibold text-slate-700 hover:text-purple-400 dark:text-slate-200 dark:hover:text-purple-300 transition-colors relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 dark:bg-purple-300 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
              </button>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="text-sm font-semibold text-slate-700 hover:text-purple-400 dark:text-slate-200 dark:hover:text-purple-300 hidden sm:block"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signin">
                <Button className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg">
                Get Started
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background - Pastel Purple */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-100/50 to-purple-50 dark:from-zinc-900 dark:via-purple-950/30 dark:to-zinc-900"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/60 dark:bg-purple-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/50 dark:bg-purple-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-200/40 dark:bg-purple-900/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-zinc-800 mb-8 shadow-lg animate-scale-in">
                <CheckSquare className="w-4 h-4 text-purple-400 dark:text-purple-300 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your Ultimate Task Management Solution
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-6 animate-fade-in-up animate-delay-100 font-playfair">
                Boost Your Productivity,
                <span className="block bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mt-2 underline-gradient">
                  Master Your Tasks
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed animate-fade-in-up animate-delay-200">
                Organize your tasks with{' '}
                <span className="font-semibold text-slate-900 dark:text-white underline-purple">beautiful simplicity</span>.
                Stay focused, increase productivity, and achieve your goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-in-up animate-delay-300">
                <Link href="/signin">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all text-lg px-8 py-6"
                  >
                    Start Productivity Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold text-slate-700 dark:text-slate-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-500"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 animate-fade-in-up animate-delay-400">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-zinc-800 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">100%</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Task Completion</div>
                </div>
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-zinc-800 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">∞</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Tasks</div>
                </div>
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-zinc-800 shadow-lg transform hover:scale-105 transition-transform">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">24/7</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Availability</div>
                </div>
              </div>
            </div>

            {/* Right Visual - Task Visualization */}
            <div className="relative hidden lg:block animate-fade-in-right animate-delay-200">
              <div className="relative animate-float">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>

                {/* Main Card with Task List */}
                <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-zinc-800 transform hover:scale-105 transition-transform duration-500">
                  {/* Task List Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-playfair underline-purple">
                      Today's Tasks
                    </h3>
                  </div>

                  {/* Sample Task List */}
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700">
                        <div className="w-5 h-5 border-2 border-slate-300 dark:border-zinc-600 rounded flex items-center justify-center">
                          {item === 1 && <CheckCircle className="w-3 h-3 text-green-500" />}
                        </div>
                        <span className={`text-slate-700 dark:text-slate-300 ${item === 1 ? 'line-through text-slate-400 dark:text-zinc-500' : ''}`}>
                          {item === 1 ? 'Complete project proposal' : 
                           item === 2 ? 'Schedule team meeting' :
                           item === 3 ? 'Review quarterly reports' :
                           'Prepare presentation slides'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quotes Section - Auto Changing Carousel */}
      <section id="quotes" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-reveal ${visibleSections.has('quotes') ? 'revealed' : ''}`}>
        <div className={`text-center mb-12 ${visibleSections.has('quotes') ? 'animate-fade-in-down opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-playfair underline-gradient">
            Productivity Quotes
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Words that inspire and motivate productivity
          </p>
        </div>

        {/* Auto-changing Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentQuoteIndex * 100}%)` }}
            >
              {displayedQuotes.map((quote, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-950/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 border border-purple-200/50 dark:border-purple-800/30 shadow-lg"
                >
                  <CheckSquare className="w-10 h-10 text-purple-400 dark:text-purple-300 mb-6 mx-auto" />
                  <blockquote className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white mb-6 font-playfair leading-relaxed text-center">
                    "{quote.quote}"
                  </blockquote>
                  {quote.translation && (
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-4 italic text-center">
                      "{quote.translation}"
                    </p>
                  )}
                  <p className="text-sm text-purple-400 dark:text-purple-300 font-semibold text-center">
                    — {quote.author}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {displayedQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuoteIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentQuoteIndex === index
                    ? 'w-3 h-3 bg-purple-500 dark:bg-purple-400'
                    : 'w-2 h-2 bg-purple-300 dark:bg-purple-700 hover:bg-purple-400 dark:hover:bg-purple-600'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Task Management Section */}
      <section id="tasks" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-reveal ${visibleSections.has('tasks') ? 'revealed' : ''}`}>
        <div className={`text-center mb-16 ${visibleSections.has('tasks') ? 'animate-fade-in-down opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-playfair underline-gradient mb-4">
            Manage Your Tasks Efficiently
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Organize your daily activities and boost your productivity with our powerful tools
          </p>
        </div>

        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${visibleSections.has('tasks') ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          {/* Dashboard Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-playfair mb-3">
              Dashboard
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Add tasks, track progress & manage todos in your personal dashboard
            </p>
            <Link href="/signin" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold hover:gap-2 transition-all">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-800/30 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <CheckSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-playfair mb-3">
              Task Management
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create, organize, and prioritize your tasks with our intuitive interface
            </p>
            <Link href="/tasks" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold hover:gap-2 transition-all">
              Manage Tasks
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 rounded-2xl p-8 border border-pink-200/50 dark:border-pink-800/30 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-playfair mb-3">
              Calendar View
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Schedule your tasks and visualize your plans with our calendar view
            </p>
            <Link href="/calendar" className="inline-flex items-center text-pink-600 dark:text-pink-400 font-semibold hover:gap-2 transition-all">
              View Calendar
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-800/30 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-playfair mb-3">
              Analytics
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Track your productivity and get insights to improve your efficiency
            </p>
            <Link href="/dashboard" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-2 transition-all">
              View Analytics
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-reveal ${visibleSections.has('features') ? 'revealed' : ''}`}>
        <div className={`text-center mb-16 ${visibleSections.has('features') ? 'animate-fade-in-down opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-playfair underline-gradient mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to manage your tasks and boost your productivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${visibleSections.has('features') ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-purple">
              Secure & Private
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Your task data is encrypted and stored securely. We never share your personal information.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${visibleSections.has('features') ? 'animate-fade-in-up opacity-100' : 'opacity-0'} animate-delay-100`}>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-purple">
              Cross-Platform Sync
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Access your tasks from any device. Your progress syncs seamlessly across platforms.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${visibleSections.has('features') ? 'animate-fade-in-up opacity-100' : 'opacity-0'} animate-delay-200`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-purple">
              Task Analytics
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Track your productivity and get insights to improve your task management efficiency.
            </p>
          </div>

          {/* Feature 4 */}
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${visibleSections.has('features') ? 'animate-fade-in-up opacity-100' : 'opacity-0'} animate-delay-300`}>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-purple">
              Personalized Organization
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Customize your task management experience to fit your unique workflow.
            </p>
          </div>

          {/* Feature 5 */}
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${visibleSections.has('features') ? 'animate-fade-in-up opacity-100' : 'opacity-0'} animate-delay-400`}>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-purple">
              Smart Scheduling
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Plan your tasks and set reminders to maintain consistent productivity habits.
            </p>
          </div>

          {/* Feature 6 */}
          <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-slate-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 ${visibleSections.has('features') ? 'animate-fade-in-up opacity-100' : 'opacity-0'} animate-delay-500`}>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center mb-6">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-playfair underline-purple">
              Fast & Intuitive
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Designed for speed and ease of use. Focus on productivity, not navigation.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-reveal ${visibleSections.has('about') ? 'revealed' : ''}`}>
        <div className={`text-center mb-16 ${visibleSections.has('about') ? 'animate-fade-in-down opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-playfair underline-gradient mb-4">
            About TaskMaster
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our mission is to help you organize, prioritize, and accomplish your tasks efficiently
          </p>
        </div>

        <div className={`bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-950/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 border border-purple-200/50 dark:border-purple-800/30 shadow-lg ${visibleSections.has('about') ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-playfair underline-purple">
                Your Personal Productivity Companion
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                TaskMaster is designed to be your ultimate productivity companion. Whether you're a student, professional, or entrepreneur, 
                our platform helps you organize your tasks, track your progress, and achieve your goals with ease.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                We believe that productivity should be achievable and accessible. That's why we've created a platform that focuses on 
                simplicity and functionality, allowing you to spend more time accomplishing tasks and less time managing them.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Free to Use
                </div>
                <div className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                  No Ads
                </div>
                <div className="px-4 py-2 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Open Source
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-2xl">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <CheckSquare className="w-24 h-24 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-reveal ${visibleSections.has('cta') ? 'revealed' : ''}`}>
        <div className={`bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 md:p-16 text-center ${visibleSections.has('cta') ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-playfair underline-gradient-light">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already improved their task management with TaskMaster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signin">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all text-lg px-8 py-6"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/tasks">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all text-lg px-8 py-6"
              >
                Explore Tasks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-playfair">
                  TaskMaster
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Your ultimate task management solution to organize, prioritize, and accomplish your goals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 font-playfair underline-purple">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/tasks" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Task Management</Link></li>
                <li><Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Dashboard</Link></li>
                <li><Link href="/calendar" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Calendar</Link></li>
                <li><Link href="/analytics" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 font-playfair underline-purple">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 font-playfair underline-purple">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Community</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Feedback</Link></li>
                <li><Link href="#" className="text-slate-600 dark:text-slate-400 hover:text-purple-400 dark:hover:text-purple-300 text-sm transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-zinc-800 mt-12 pt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2024 TaskMaster. All rights reserved. Made with ❤️ for productivity enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}