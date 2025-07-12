import React, { useState, useEffect } from 'react';
import { ChevronRight, Globe, Zap, Shield, Users, ArrowRight, Moon, Sun, Play, Star, TrendingUp } from 'lucide-react';

const KardashLanding = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(bannerInterval);
  }, []);

  const platforms = [
    { name: 'Telegram', icon: '📱', color: 'from-blue-400 to-blue-600' },
    { name: 'Upwork', icon: '💼', color: 'from-green-400 to-green-600' },
    { name: 'LinkedIn', icon: '🔗', color: 'from-blue-500 to-blue-700' },
    { name: 'Fiverr', icon: '🎯', color: 'from-green-500 to-green-700' },
    { name: 'Freelancer', icon: '⚡', color: 'from-orange-400 to-orange-600' },
    { name: 'CryptoJob', icon: '₿', color: 'from-yellow-400 to-yellow-600' }
  ];

  const jobCards = [
    { title: 'React Developer', price: '$500', urgent: true },
    { title: 'Logo Design', price: '$200', urgent: false },
    { title: 'Content Writer', price: '$300', urgent: true },
    { title: 'Mobile App UI', price: '$800', urgent: false },
    { title: 'SEO Specialist', price: '$400', urgent: true },
    { title: 'Crypto Expert', price: '$1200', urgent: false }
  ];

  const Banner1 = () => (
    <div className={`relative overflow-hidden rounded-3xl ${isDarkMode ? 'bg-gradient-to-br from-slate-900/90 to-purple-900/90' : 'bg-gradient-to-br from-blue-50/90 to-purple-50/90'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} transition-all duration-1000 ${currentBanner === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
      <div className="relative p-12 flex items-center justify-between">
        <div className="flex-1 space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              شکار خودکار پروژه‌ها
            </span>
          </div>
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
            هوش مصنوعی کارداش
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              پروژه‌هات رو پیدا می‌کنه
            </span>
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md`}>
            از تمام پلتفرم‌های فریلنسری دنیا، بهترین پروژه‌ها رو جمع می‌کنیم و با کریپتو پرداخت می‌کنیم
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="relative">
            {/* Central Cube */}
            <div className={`w-32 h-32 ${isDarkMode ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' : 'bg-gradient-to-br from-blue-200/50 to-purple-200/50'} backdrop-blur-xl border ${isDarkMode ? 'border-white/20' : 'border-white/30'} rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500`}>
              <div className={`text-3xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>🧠</div>
            </div>
            
            {/* Floating Platforms */}
            {platforms.map((platform, index) => (
              <div
                key={platform.name}
                className={`absolute w-16 h-16 bg-gradient-to-br ${platform.color} rounded-xl shadow-lg flex items-center justify-center text-white font-bold transform transition-all duration-1000 hover:scale-110`}
                style={{
                  top: `${50 + 60 * Math.sin((index * 2 * Math.PI) / platforms.length)}px`,
                  left: `${50 + 60 * Math.cos((index * 2 * Math.PI) / platforms.length)}px`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <span className="text-xl">{platform.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Banner2 = () => (
    <div className={`relative overflow-hidden rounded-3xl ${isDarkMode ? 'bg-gradient-to-br from-purple-900/90 to-pink-900/90' : 'bg-gradient-to-br from-purple-50/90 to-pink-50/90'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} transition-all duration-1000 ${currentBanner === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
      <div className="relative p-12 flex items-center justify-between">
        <div className="flex-1 space-y-6">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'} animate-pulse`}></div>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              دنیای بی‌انتهای پروژه‌ها
            </span>
          </div>
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
            وارد دنیای
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              فریلنسری آینده شو
            </span>
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md`}>
            هزاران پروژه منتظر تو هستن. فقط کافیه قدم بزاری و شروع کنی
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="relative">
            {/* Glowing Portal */}
            <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border-4 ${isDarkMode ? 'border-purple-400/50' : 'border-purple-300/50'} shadow-2xl flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-spin"></div>
              <div className={`relative z-10 text-4xl ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>🌟</div>
            </div>
            
            {/* Floating Job Cards */}
            {jobCards.map((job, index) => (
              <div
                key={index}
                className={`absolute w-20 h-12 ${isDarkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-md rounded-lg border ${isDarkMode ? 'border-white/20' : 'border-white/30'} shadow-lg flex flex-col items-center justify-center text-xs font-medium transform transition-all duration-1000 hover:scale-110`}
                style={{
                  top: `${20 + 80 * Math.sin((index * 2 * Math.PI) / jobCards.length)}px`,
                  left: `${20 + 80 * Math.cos((index * 2 * Math.PI) / jobCards.length)}px`,
                  animationDelay: `${index * 0.3}s`
                }}
              >
                <div className={`${isDarkMode ? 'text-white' : 'text-gray-800'} truncate w-full text-center`}>
                  {job.title}
                </div>
                <div className={`${job.urgent ? 'text-red-400' : 'text-green-400'} font-bold`}>
                  {job.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 p-6 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-xl border-b ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              K
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              KARDASH
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
            <button className={`px-4 py-2 rounded-lg ${isDarkMode ? 'text-white border border-white/20 hover:bg-white/10' : 'text-gray-900 border border-gray-300 hover:bg-gray-100'} transition-colors`}>
              ورود
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Banner Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0">
            <Banner1 />
          </div>
          <div className="absolute inset-0">
            <Banner2 />
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 mb-20">
          <button className={`group flex-1 p-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ${isDarkMode ? 'hover:from-blue-400 hover:to-purple-400' : ''}`}>
            <div className="flex items-center justify-center space-x-4">
              <Zap className="w-8 h-8 group-hover:animate-pulse" />
              <span>کار بگیر</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-sm opacity-80 mt-2">
              هزاران پروژه آماده در انتظار تو
            </div>
          </button>
          
          <button className={`group flex-1 p-8 rounded-2xl ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/10 hover:bg-black/20 text-gray-900'} backdrop-blur-xl border ${isDarkMode ? 'border-white/20' : 'border-white/30'} font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-center space-x-4">
              <Play className="w-8 h-8 group-hover:animate-pulse" />
              <span>یاد بگیر</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-sm opacity-80 mt-2">
              راهنمای کامل استفاده از پلتفرم
            </div>
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} hover:scale-105 transition-transform duration-300`}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              پرداخت امن با کریپتو
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              تمام پرداخت‌ها با ارزهای دیجیتال انجام می‌شه و محدودیت تحریم نداری
            </p>
          </div>

          <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} hover:scale-105 transition-transform duration-300`}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              پروژه‌های جهانی
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              از بیش از 20 پلتفرم مختلف، بهترین پروژه‌ها رو برات پیدا می‌کنیم
            </p>
          </div>

          <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} hover:scale-105 transition-transform duration-300`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              درآمد بالا
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              با هوش مصنوعی کارداش، بهترین پروژه‌ها رو انتخاب کن و درآمد بالا داشته باش
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-100/50 to-pink-100/50'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} text-center`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                1000+
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                پروژه فعال
              </div>
            </div>
            <div>
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                500+
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                فریلنسر موفق
              </div>
            </div>
            <div>
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                $2M+
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                پرداخت شده
              </div>
            </div>
            <div>
              <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                98%
              </div>
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                رضایت کاربران
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 mt-20 p-8 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-xl border-t ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            KARDASH - آینده فریلنسری ایران
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            ساخته شده با ❤️ برای فریلنسرهای ایرانی
          </p>
        </div>
      </footer>
    </div>
  );
};

export default KardashLanding; 