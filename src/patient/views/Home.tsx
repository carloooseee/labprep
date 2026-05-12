import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon,
  BuildingOfficeIcon, 
  BellAlertIcon,
  UserIcon,
  DocumentTextIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

export default function Home() {
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning!' : hour < 18 ? 'Good Afternoon!' : 'Good Evening!';

  const heroSlides = [
    {
      title: "Welcome to LABPrep",
      subtitle: greeting,
      description: "Your premium health preparation companion.",
      icon: <SparklesIcon className="w-24 h-24" />,
      gradient: "from-[#417af0] to-[#27c463]",
      link: null
    },
    {
      title: "Easy Preparation",
      subtitle: "Step-by-Step",
      description: "Follow clear instructions for your laboratory tests.",
      icon: <DocumentTextIcon className="w-24 h-24" />,
      gradient: "from-[#6366f1] to-[#a855f7]",
      link: "/patient/test-guides"
    },
    {
      title: "Smart Reminders",
      subtitle: "Stay Notified",
      description: "Get notified about fasting times and schedules.",
      icon: <BellAlertIcon className="w-24 h-24" />,
      gradient: "from-[#f59e0b] to-[#ef4444]",
      link: "/patient/notifications"
    },
    {
      title: "Personalize Profile",
      subtitle: "Your Identity",
      description: "Keep your health information up to date for better care.",
      icon: <UserIcon className="w-24 h-24" />,
      gradient: "from-[#3b82f6] to-[#60a5fa]",
      link: "/patient/profile"
    },
    {
      title: "Find Hospitals",
      subtitle: "Medical Centers",
      description: "Locate accredited diagnostic centers near your location.",
      icon: <BuildingOfficeIcon className="w-24 h-24" />,
      gradient: "from-[#10b981] to-[#34d399]",
      link: "/patient/hospitals"
    }
  ];

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    } else if (isRightSwipe) {
      setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="pt-8 pb-24 relative overflow-hidden">


      <div className="relative z-10 px-6 pt-2">

        {/* Hero Card Carousel */}
        <div 
          className={`bg-gradient-to-r ${heroSlides[currentHeroSlide].gradient} rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden transition-all duration-700 h-[210px] flex flex-col justify-center`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {heroSlides[currentHeroSlide].link ? (
            <Link to={heroSlides[currentHeroSlide].link!} className="absolute inset-0 z-20"></Link>
          ) : null}
          
          <div key={`icon-${currentHeroSlide}`} className="absolute top-0 right-0 p-4 opacity-20 animate-in zoom-in duration-700">
            {heroSlides[currentHeroSlide].icon}
          </div>
          <div className="relative z-10 pointer-events-none">
            <span key={`sub-${currentHeroSlide}`} className="text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-in slide-in-from-bottom-2 duration-500 block">
              {heroSlides[currentHeroSlide].subtitle}
            </span>
            <h2 key={`title-${currentHeroSlide}`} className="text-3xl font-display font-bold mt-4 leading-tight animate-in slide-in-from-bottom-3 duration-700">
              {heroSlides[currentHeroSlide].title}
            </h2>
            <div key={`desc-${currentHeroSlide}`} className="flex items-center mt-4 space-x-2 animate-in slide-in-from-bottom-4 duration-1000">
              <span className="font-body text-sm font-medium opacity-90">{heroSlides[currentHeroSlide].description}</span>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-6 right-8 flex space-x-2 z-30">
            {heroSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentHeroSlide(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold font-display text-[var(--color-on-surface)] mb-4">Quick Actions</h3>
        <div className="flex flex-col space-y-3">
          <Link to="/patient/profile" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-blue-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Profile</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
          
          {/* <Link to="/patient/hospitals" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-emerald-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <BeakerIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Test</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link> */}
          
          <Link to="/patient/hospitals" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-purple-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Hospitals</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link to="/patient/notifications" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-amber-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <BellAlertIcon className="w-6 h-6" />
              </div>
              <span className="font-bold font-display text-gray-800">Reminders</span>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link to="/patient/general-guidelines" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#e5e9eb] border-t-4 border-t-blue-500 hover:scale-[1.01] transition-transform overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold font-display text-gray-800 leading-tight">What to do</span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">general</span>
              </div>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Laboratory Test Categories Section Removed */}

      </div>
    </div>
  );
}
