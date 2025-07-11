import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Clock, DollarSign, Star, Upload, Send, 
  Bell, User, Settings, LogOut, ChevronDown, Calendar,
  Briefcase, TrendingUp, Award, Globe, Zap, Moon, Sun,
  FileText, CheckCircle, XCircle, AlertCircle, Wallet,
  CreditCard, Bitcoin, Download, Eye, MessageCircle
} from 'lucide-react';

const FreelancerDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [filterType, setFilterType] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock data - in real app, this would come from API
  const [availableJobs, setAvailableJobs] = useState([
    {
      id: 1,
      title: "React.js Developer for E-commerce Platform",
      description: "Need experienced React developer to build modern e-commerce frontend with payment integration",
      budget: "$800-1200",
      deadline: "2025-07-20",
      type: "development",
      platform: "Upwork",
      tags: ["React", "JavaScript", "E-commerce", "Payment"],
      urgency: "high",
      clientRating: 4.8,
      appliedCount: 12,
      estimatedHours: "40-60",
      status: "available"
    },
    {
      id: 2,
      title: "Logo Design for Crypto Startup",
      description: "Modern, minimalist logo design for blockchain startup. Need creative and professional approach",
      budget: "$300-500",
      deadline: "2025-07-18",
      type: "design",
      platform: "Fiverr",
      tags: ["Logo", "Crypto", "Branding", "Minimalist"],
      urgency: "medium",
      clientRating: 4.5,
      appliedCount: 8,
      estimatedHours: "10-20",
      status: "available"
    },
    {
      id: 3,
      title: "Content Writer for Tech Blog",
      description: "Write 10 high-quality articles about AI, blockchain, and web development trends",
      budget: "$400-600",
      deadline: "2025-07-25",
      type: "content",
      platform: "LinkedIn",
      tags: ["Writing", "Tech", "AI", "Blockchain"],
      urgency: "low",
      clientRating: 4.9,
      appliedCount: 15,
      estimatedHours: "20-30",
      status: "available"
    }
  ]);

  const [myJobs, setMyJobs] = useState([
    {
      id: 4,
      title: "Mobile App UI/UX Design",
      budget: "$900",
      deadline: "2025-07-22",
      type: "design",
      platform: "Telegram",
      status: "in_progress",
      progress: 65,
      clientFeedback: "Great work so far! Looking forward to final delivery.",
      timeSpent: "15 hours"
    },
    {
      id: 5,
      title: "WordPress Plugin Development",
      budget: "$600",
      deadline: "2025-07-16",
      type: "development",
      platform: "Freelancer",
      status: "delivered",
      progress: 100,
      clientFeedback: "Excellent work! Will hire again.",
      rating: 5,
      timeSpent: "25 hours"
    }
  ]);

  const [userStats, setUserStats] = useState({
    totalEarnings: 5240,
    completedJobs: 23,
    successRate: 96,
    avgRating: 4.8,
    activeJobs: 3,
    pendingPayments: 1200
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'job_accepted', message: 'Your application for "React Developer" was accepted!', time: '2 hours ago', read: false },
    { id: 2, type: 'payment', message: 'Payment of $600 has been processed to your wallet', time: '1 day ago', read: false },
    { id: 3, type: 'deadline', message: 'Project "Mobile App UI" deadline is tomorrow', time: '1 day ago', read: true }
  ]);

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'text-green-400 bg-green-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      case 'delivered': return 'text-purple-400 bg-purple-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || job.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch(sortBy) {
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      case 'budget':
        return parseInt(b.budget.split('-')[1] || b.budget.replace(/[^0-9]/g, '')) - 
               parseInt(a.budget.split('-')[1] || a.budget.replace(/[^0-9]/g, ''));
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const JobCard = ({ job, onApply, isMyJob = false }) => (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
         onClick={() => setSelectedJob(job)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {job.title}
          </h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>
            {job.description}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency || 'medium')}`}>
            {job.urgency === 'high' ? 'فوری' : job.urgency === 'medium' ? 'متوسط' : 'عادی'}
          </span>
          {isMyJob && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status === 'in_progress' ? 'در حال انجام' : job.status === 'delivered' ? 'تحویل شده' : 'تکمیل شده'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {job.budget}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {job.deadline}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {job.platform}
            </span>
          </div>
        </div>
        {isMyJob && job.progress !== undefined && (
          <div className="flex items-center space-x-2">
            <div className={`w-16 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {job.progress}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {job.tags && job.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={`px-2 py-1 rounded-md text-xs ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              {tag}
            </span>
          ))}
        </div>
        {!isMyJob && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-400 hover:to-purple-400 transition-all duration-300 flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>درخواست انجام</span>
          </button>
        )}
      </div>
    </div>
  );

  const StatsCard = ({ icon: Icon, title, value, change, color }) => (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>{title}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {change && (
            <p className={`text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
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

      {/* Header */}
      <header className={`relative z-50 ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} backdrop-blur-xl border-b ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                K
              </div>
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                KARDASH
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors relative`}
                >
                  <Bell className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}
                >
                  <User className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                  <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Wallet}
            title="کل درآمد"
            value={`$${userStats.totalEarnings.toLocaleString()}`}
            change={12}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatsCard
            icon={Briefcase}
            title="پروژه‌های تکمیل شده"
            value={userStats.completedJobs}
            change={8}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatsCard
            icon={Star}
            title="امتیاز میانگین"
            value={userStats.avgRating}
            change={2}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
          <StatsCard
            icon={TrendingUp}
            title="نرخ موفقیت"
            value={`${userStats.successRate}%`}
            change={5}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-6 mb-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : isDarkMode
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-black/10 text-gray-600 hover:bg-black/20'
            }`}
          >
            پروژه‌های در دسترس
          </button>
          <button
            onClick={() => setActiveTab('my_jobs')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'my_jobs'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : isDarkMode
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-black/10 text-gray-600 hover:bg-black/20'
            }`}
          >
            پروژه‌های من
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'earnings'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : isDarkMode
                ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                : 'bg-black/10 text-gray-600 hover:bg-black/20'
            }`}
          >
            درآمد و پرداخت
          </button>
        </div>

        {/* Available Jobs Tab */}
        {activeTab === 'available' && (
          <div>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="جستجو در پروژه‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-white/30 text-gray-900 placeholder-gray-500'} backdrop-blur-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/20 border-white/30 text-gray-900'} backdrop-blur-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              >
                <option value="deadline">مرتب‌سازی بر اساس مهلت</option>
                <option value="budget">مرتب‌سازی بر اساس بودجه</option>
                <option value="type">مرتب‌سازی بر اساس نوع</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/20 border-white/30 text-gray-900'} backdrop-blur-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              >
                <option value="all">همه پروژه‌ها</option>
                <option value="development">توسعه</option>
                <option value="design">طراحی</option>
                <option value="content">محتوا</option>
              </select>
            </div>

            {/* Jobs Grid */}
            <div className="grid gap-6">
              {sortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={(job) => {
                    // Handle job application
                    alert(`درخواست انجام پروژه "${job.title}" ارسال شد!`);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === 'my_jobs' && (
          <div className="grid gap-6">
            {myJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isMyJob={true}
                onApply={() => {}}
              />
            ))}
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Earnings Summary */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                خلاصه درآمد
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    کل درآمد
                  </span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${userStats.totalEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    پرداخت‌های در انتظار
                  </span>
                  <span className={`font-bold text-yellow-400`}>
                    ${userStats.pendingPayments.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    کمیسیون کارداش
                  </span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    8%
                  </span>
                </div>
              </div>
            </div>

            {/* Payout Methods */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                روش‌های پرداخت
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
                  <div className="flex items-center space-x-3">
                    <Bitcoin className="w-5 h-5 text-orange-400" />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Bitcoin
                    </span>
                  </div>
                  <span className="text-green-400 text-sm">فعال</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-blue-400" />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      کیف پول کریپتو
                    </span>
                  </div>
                  <span className="text-green-400 text-sm">فعال</span>
                </div>
                <button className="w-full p-3 border-2 border-dashed border-gray-400 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors">
                  + افزودن روش پرداخت جدید
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl ${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border ${isDarkMode ? 'border-white/20' : 'border-white/30'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedJob.title}
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} transition-colors`}
              >
                <XCircle className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedJob.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>بودجه:</span>
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedJob.budget}
                  </p>
                </div>
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>مهلت:</span>
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedJob.deadline}
                  </p>
                </div>
              </div>

              