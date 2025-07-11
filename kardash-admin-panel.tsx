import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Briefcase, DollarSign, Bot, AlertTriangle,
  CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Search, Filter,
  TrendingUp, BarChart3, Activity, Shield, Globe, Zap, Moon, Sun,
  UserCheck, UserX, Clock, Star, Award, CreditCard, Download,
  MessageSquare, Bell, LogOut, ChevronDown, ArrowUp, ArrowDown
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data - in real app, this would come from API
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 1247,
    activeJobs: 384,
    completedJobs: 863,
    totalUsers: 2156,
    activeUsers: 428,
    totalEarnings: 45280,
    pendingPayouts: 8560,
    platformCommission: 3624,
    successRate: 94.2,
    avgCompletionTime: 4.2
  });

  const [recentJobs, setRecentJobs] = useState([
    {
      id: 1,
      title: "React.js Developer for E-commerce Platform",
      originalPlatform: "Upwork",
      botAccount: "TechBot_01",
      assignedTo: "احمد محمدی",
      status: "in_progress",
      budget: 1200,
      commission: 96,
      deadline: "2025-07-20",
      appliedAt: "2025-07-12 10:30",
      clientResponse: "پروژه پذیرفته شد",
      urgency: "high"
    },
    {
      id: 2,
      title: "Logo Design for Crypto Startup",
      originalPlatform: "Fiverr",
      botAccount: "DesignBot_03",
      assignedTo: "مریم احمدی",
      status: "completed",
      budget: 450,
      commission: 36,
      deadline: "2025-07-18",
      appliedAt: "2025-07-11 14:15",
      clientResponse: "عالی بود!",
      urgency: "medium"
    },
    {
      id: 3,
      title: "Content Writer for Tech Blog",
      originalPlatform: "LinkedIn",
      botAccount: "ContentBot_02",
      assignedTo: null,
      status: "available",
      budget: 600,
      commission: 48,
      deadline: "2025-07-25",
      appliedAt: "2025-07-12 09:45",
      clientResponse: "منتظر پروپوزال",
      urgency: "low"
    }
  ]);

  const [botAccounts, setBotAccounts] = useState([
    {
      id: 1,
      name: "TechBot_01",
      platform: "Upwork",
      status: "active",
      jobsApplied: 45,
      successRate: 87,
      lastActivity: "2025-07-12 11:30",
      profile: "Senior React Developer with 5+ years experience"
    },
    {
      id: 2,
      name: "DesignBot_03",
      platform: "Fiverr",
      status: "active",
      jobsApplied: 32,
      successRate: 92,
      lastActivity: "2025-07-12 10:15",
      profile: "Creative designer specializing in logos and branding"
    },
    {
      id: 3,
      name: "ContentBot_02",
      platform: "LinkedIn",
      status: "paused",
      jobsApplied: 28,
      successRate: 78,
      lastActivity: "2025-07-11 16:45",
      profile: "Technical content writer and SEO specialist"
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "احمد محمدی",
      email: "ahmad@example.com",
      role: "freelancer",
      joinDate: "2025-03-15",
      completedJobs: 23,
      earnings: 5240,
      successRate: 96,
      status: "active",
      lastLogin: "2025-07-12 09:30"
    },
    {
      id: 2,
      name: "مریم احمدی",
      email: "maryam@example.com",
      role: "freelancer",
      joinDate: "2025-02-20",
      completedJobs: 18,
      earnings: 3890,
      successRate: 89,
      status: "active",
      lastLogin: "2025-07-11 14:20"
    },
    {
      id: 3,
      name: "علی رضایی",
      email: "ali@example.com",
      role: "freelancer",
      joinDate: "2025-04-10",
      completedJobs: 12,
      earnings: 2150,
      successRate: 94,
      status: "suspended",
      lastLogin: "2025-07-10 11:45"
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      case 'completed': return 'text-purple-400 bg-purple-400/20';
      case 'available': return 'text-yellow-400 bg-yellow-400/20';
      case 'paused': return 'text-orange-400 bg-orange-400/20';
      case 'suspended': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const StatsCard = ({ icon: Icon, title, value, change, color, subtitle }) => (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
              {subtitle && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <div className={`flex items-center text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const JobRow = ({ job }) => (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
              {job.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status === 'in_progress' ? 'در حال انجام' : 
               job.status === 'completed' ? 'تکمیل شده' :
               job.status === 'available' ? 'آماده' : job.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}>
              {job.urgency === 'high' ? 'فوری' : job.urgency === 'medium' ? 'متوسط' : 'عادی'}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              پلتفرم: {job.originalPlatform}
            </span>
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              بات: {job.botAccount}
            </span>
            {job.assignedTo && (
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                انجام‌دهنده: {job.assignedTo}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${job.budget}
            </div>
            <div className="text-sm text-green-400">
              کمیسیون: ${job.commission}
            </div>
          </div>
          <div className="flex space-x-2">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200'} transition-colors`}>
              <Eye className="w-4 h-4 text-blue-400" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200'} transition-colors`}>
              <Edit className="w-4 h-4 text-green-400" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-red-100 hover:bg-red-200'} transition-colors`}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BotAccountCard = ({ bot }) => (
    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg ${bot.status === 'active' ? 'bg-green-500' : 'bg-orange-500'} flex items-center justify-center`}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {bot.name}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {bot.platform}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bot.status)}`}>
          {bot.status === 'active' ? 'فعال' : 'متوقف'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            درخواست‌های ارسالی
          </span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {bot.jobsApplied}
          </span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            نرخ موفقیت
          </span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {bot.successRate}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            آخرین فعالیت
          </span>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {bot.lastActivity}
          </span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
          {bot.profile}
        </p>
        <div className="flex space-x-2">
          <button className={`flex-1 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200'} text-blue-400 text-sm transition-colors`}>
            تنظیمات
          </button>
          <button className={`flex-1 px-3 py-2 rounded-lg ${bot.status === 'active' ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'} text-sm transition-colors`}>
            {bot.status === 'active' ? 'توقف' : 'فعال‌سازی'}
          </button>
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
                KARDASH - پنل ادمین
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold`}>
                  A
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ادمین
                </span>
              </div>
              
              <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}>
                <LogOut className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'داشبورد', icon: BarChart3 },
            { id: 'jobs', label: 'مدیریت پروژه‌ها', icon: Briefcase },
            { id: 'bots', label: 'بات‌ها', icon: Bot },
            { id: 'users', label: 'کاربران', icon: Users },
            { id: 'earnings', label: 'درآمد', icon: DollarSign },
            { id: 'settings', label: 'تنظیمات', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-black/10 text-gray-600 hover:bg-black/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={Briefcase}
                title="کل پروژه‌ها"
                value={dashboardStats.totalJobs}
                change={8}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
                subtitle="در کل سیستم"
              />
              <StatsCard
                icon={Activity}
                title="پروژه‌های فعال"
                value={dashboardStats.activeJobs}
                change={12}
                color="bg-gradient-to-br from-green-500 to-green-600"
                subtitle="در حال انجام"
              />
              <StatsCard
                icon={Users}
                title="کاربران فعال"
                value={dashboardStats.activeUsers}
                change={5}
                color="bg-gradient-to-br from-purple-500 to-purple-600"
                subtitle={`از ${dashboardStats.totalUsers} کاربر`}
              />
              <StatsCard
                icon={DollarSign}
                title="کل درآمد"
                value={`$${dashboardStats.totalEarnings}`}
                change={15}
                color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                subtitle="درآمد کل سیستم"
              />
            </div>

            {/* Performance Metrics */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  عملکرد سیستم
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      نرخ موفقیت
                    </span>
                    <span className={`font-bold text-green-400`}>
                      {dashboardStats.successRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      میانگین زمان تکمیل
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dashboardStats.avgCompletionTime} روز
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      کمیسیون پلتفرم
                    </span>
                    <span className={`font-bold text-purple-400`}>
                      ${dashboardStats.platformCommission}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  پرداخت‌های در انتظار
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      مبلغ کل
                    </span>
                    <span className={`font-bold text-yellow-400`}>
                      ${dashboardStats.pendingPayouts}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      تعداد درخواست‌ها
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      23
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-all">
                    پردازش پرداخت‌ها
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Management Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/20 border-white/30 text-gray-900'} backdrop-blur-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="available">آماده</option>
                <option value="in_progress">در حال انجام</option>
                <option value="completed">تکمیل شده</option>
              </select>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-all flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>پروژه جدید</span>
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Bot Management Tab */}
        {activeTab === 'bots' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                مدیریت بات‌ها
              </h2>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-