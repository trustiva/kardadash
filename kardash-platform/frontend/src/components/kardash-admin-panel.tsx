import React, { useState, useEffect } from 'react';
import {
  Users, Settings, Briefcase, DollarSign, Bot, AlertTriangle,
  CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Search, Filter,
  TrendingUp, BarChart3, Activity, Shield, Globe, Zap, Moon, Sun,
  UserCheck, UserX, Clock, Star, Award, CreditCard, Download,
  MessageSquare, Bell, LogOut, ChevronDown, ArrowUp, ArrowDown
} from 'lucide-react';
import apiFetch from '../api/apiClient';

interface AdminPanelProps {
  user?: any;
  onLogout?: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (value: boolean) => void;
}

const AdminPanel = ({ user, onLogout, isDarkMode: propIsDarkMode, setIsDarkMode: propSetIsDarkMode }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode ?? true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for real data
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [jobs, setJobs] = useState<any[]>([]);
  const [botAccounts, setBotAccounts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'dashboard') {
          const stats = await apiFetch('/dashboard/overview');
          setDashboardStats(stats);
        } else if (activeTab === 'jobs') {
          const jobsData = await apiFetch(`/jobs/?search=${searchQuery}&status=${filterStatus === 'all' ? '' : filterStatus}`);
          setJobs(jobsData);
        } else if (activeTab === 'bots') {
          const botsData = await apiFetch('/bot-accounts/');
          setBotAccounts(botsData);
        } else if (activeTab === 'users') {
          const usersData = await apiFetch('/users/');
          setUsers(usersData);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, searchQuery, filterStatus]);

  // Mock data for jobs
  // const jobs = [
  //   {
  //     id: 1,
  //     title: 'طراحی وبسایت فروشگاهی',
  //     description: 'نیاز به طراحی یک وبسایت فروشگاهی مدرن',
  //     budget: 800,
  //     platform: 'Upwork',
  //     status: 'فعال',
  //     posted: '2024-01-10',
  //     applications: 12,
  //     urgent: true
  //   },
  //   {
  //     id: 2,
  //     title: 'توسعه اپلیکیشن موبایل',
  //     description: 'توسعه اپلیکیشن iOS و Android',
  //     budget: 1500,
  //     platform: 'Freelancer',
  //     status: 'فعال',
  //     posted: '2024-01-08',
  //     applications: 8,
  //     urgent: false
  //   },
  //   {
  //     id: 3,
  //     title: 'طراحی لوگو',
  //     description: 'طراحی لوگوی خلاقانه برای استارتاپ',
  //     budget: 300,
  //     platform: 'Fiverr',
  //     status: 'تکمیل شده',
  //     posted: '2024-01-05',
  //     applications: 15,
  //     urgent: true
  //   }
  // ];

  // Mock data for bots
  // const bots = [
  //   {
  //     id: 1,
  //     name: 'Upwork Scraper Bot',
  //     platform: 'Upwork',
  //     status: 'فعال',
  //     jobsScraped: 245,
  //     lastActive: '2 ساعت پیش',
  //     successRate: 98
  //   },
  //   {
  //     id: 2,
  //     name: 'Fiverr Auto-Applier',
  //     platform: 'Fiverr',
  //     status: 'متوقف شده',
  //     jobsApplied: 156,
  //     lastActive: '1 روز پیش',
  //     successRate: 85
  //   },
  //   {
  //     id: 3,
  //     name: 'Freelancer Bot',
  //     platform: 'Freelancer',
  //     status: 'فعال',
  //     jobsScraped: 189,
  //     lastActive: '30 دقیقه پیش',
  //     successRate: 92
  //   }
  // ];

  // Mock data for users
  // const users = [
  //   {
  //     id: 1,
  //     name: 'علی محمدی',
  //     email: 'ali@example.com',
  //     role: 'فریلنسر',
  //     status: 'فعال',
  //     joined: '2023-12-01',
  //     completedJobs: 15,
  //     totalEarnings: 2500
  //   },
  //   {
  //     id: 2,
  //     name: 'سارا احمدی',
  //     email: 'sara@example.com',
  //     role: 'فریلنسر',
  //     status: 'فعال',
  //     joined: '2023-11-15',
  //     completedJobs: 8,
  //     totalEarnings: 1200
  //   },
  //   {
  //     id: 3,
  //     name: 'محمد رضایی',
  //     email: 'mohammad@example.com',
  //     role: 'ادمین',
  //     status: 'فعال',
  //     joined: '2023-10-01',
  //     completedJobs: 0,
  //     totalEarnings: 0
  //   }
  // ];

  // const stats = {
  //   totalJobs: 1250,
  //   activeJobs: 342,
  //   totalUsers: 567,
  //   totalEarnings: 125000.50,
  //   monthlyEarnings: 15000.25,
  //   commissionRate: 0.15
  // };

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
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              A
            </div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              KARDASH Admin
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ا</span>
              </div>
              <span className="font-medium">ادمین سیستم</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} mb-8`}>
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>داشبورد</span>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>مدیریت پروژه‌ها</span>
            </button>
            <button
              onClick={() => setActiveTab('bots')}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'bots'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Bot className="w-5 h-5" />
              <span>مدیریت بات‌ها</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Users className="w-5 h-5" />
              <span>مدیریت کاربران</span>
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'earnings'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>درآمد</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>تنظیمات</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>کل پروژه‌ها</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dashboardStats.totalJobs || '0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>پروژه‌های فعال</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dashboardStats.activeJobs || '0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>کل کاربران</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dashboardStats.totalUsers || '0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>کل درآمد</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${dashboardStats.totalEarnings || '0.00'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                فعالیت‌های اخیر
              </h3>
              <div className="space-y-4">
                {/* This section will need to be updated to fetch recent activity from API */}
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      پروژه جدید اضافه شد
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      طراحی وبسایت فروشگاهی - 2 ساعت پیش
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      پروژه تکمیل شد
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      توسعه اپلیکیشن موبایل - 5 ساعت پیش
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      بات جدید فعال شد
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Upwork Scraper Bot - 1 روز پیش
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                مدیریت پروژه‌ها
              </h2>
              <button
                onClick={() => setShowAddJobModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>افزودن پروژه جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {job.title}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                        {job.description}
                      </p>
                    </div>
                    {job.urgent && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg">
                        فوری
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${job.budget}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        بودجه
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      job.status === 'فعال' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {job.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Globe className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.platform}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.applications} درخواست
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 px-3 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>مشاهده</span>
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-1">
                      <Edit className="w-4 h-4" />
                      <span>ویرایش</span>
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1">
                      <Trash2 className="w-4 h-4" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bots Tab */}
        {activeTab === 'bots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                مدیریت بات‌ها
              </h2>
              <button
                onClick={() => setShowAddBotModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>افزودن بات جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {botAccounts.map((bot) => (
                <div
                  key={bot.id}
                  className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {bot.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        پلتفرم: {bot.platform}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      bot.status === 'فعال' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {bot.status}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        آخرین فعالیت:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {bot.lastActive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        نرخ موفقیت:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {bot.successRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {bot.jobsScraped ? 'پروژه‌های جمع‌آوری شده:' : 'درخواست‌های ارسال شده:'}
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {bot.jobsScraped || bot.jobsApplied}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                      bot.status === 'فعال'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}>
                      {bot.status === 'فعال' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{bot.status === 'فعال' ? 'متوقف کردن' : 'فعال کردن'}</span>
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
                      <Settings className="w-4 h-4" />
                      <span>تنظیمات</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              مدیریت کاربران
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {user.name}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      user.role === 'ادمین' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        وضعیت:
                      </span>
                      <span className={`text-sm font-medium ${
                        user.status === 'فعال' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        تاریخ عضویت:
                      </span>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.joined}
                      </span>
                    </div>
                    {user.role === 'فریلنسر' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            پروژه‌های تکمیل شده:
                          </span>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.completedJobs}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            کل درآمد:
                          </span>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${user.totalEarnings}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 px-3 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>مشاهده</span>
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-1">
                      <Edit className="w-4 h-4" />
                      <span>ویرایش</span>
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>مسدود</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Tab (Placeholder) */}
        {activeTab === 'earnings' && (
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} text-center`}>
            <DollarSign className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              مدیریت درآمد و پرداخت‌ها
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              این بخش به زودی برای رصد دقیق درآمد پلتفرم و مدیریت پرداخت‌ها تکمیل خواهد شد.
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-all">
              مشاهده گزارشات مالی
            </button>
          </div>
        )}

        {/* Settings Tab (Placeholder) */}
        {activeTab === 'settings' && (
          <div className={`p-8 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} text-center`}>
            <Settings className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              تنظیمات سیستم
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              این بخش شامل تنظیمات عمومی پلتفرم، کمیسیون‌ها و سایر پیکربندی‌ها خواهد بود.
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-400 hover:to-purple-400 transition-all">
              ویرایش تنظیمات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 