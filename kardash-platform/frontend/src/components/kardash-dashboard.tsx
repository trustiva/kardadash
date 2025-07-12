import React, { useState, useEffect } from 'react';
import apiFetch from '../api/apiClient';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  X, 
  ChevronRight, 
  Upload, 
  MessageCircle, 
  Zap, 
  Calendar, 
  MapPin, 
  Briefcase,
  Moon,
  Sun,
  AlertCircle
} from 'lucide-react';

interface KardashDashboardProps {
  user?: any;
  onLogout?: () => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (value: boolean) => void;
}

const KardashDashboard = ({ user, onLogout, isDarkMode: propIsDarkMode, setIsDarkMode: propSetIsDarkMode }: KardashDashboardProps) => {
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode ?? true);

  // API data states
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch('/dashboard/freelancer/stats'),
      apiFetch('/jobs/available'),
      apiFetch('/jobs/my'),
    ])
      .then(([statsData, availableJobsData, myJobsData]) => {
        setStats(statsData);
        setAvailableJobs(availableJobsData);
        setMyJobs(myJobsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filtered jobs
  const filteredJobs = availableJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply to job
  const handleApply = async (jobId: number, proposal: string, bidAmount: number) => {
    setApplyLoading(true);
    setApplyError(null);
    setApplySuccess(null);
    try {
      await apiFetch(`/jobs/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify({ proposal, bid_amount: bidAmount }),
      });
      setApplySuccess('درخواست شما با موفقیت ارسال شد!');
      // Optionally refetch jobs or update UI
    } catch (err: any) {
      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  }
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="ml-4 text-xl text-red-500">خطا: {error}</p>
      </div>
    );
  }

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
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user?.name?.[0] || 'ع'}</span>
              </div>
              <span className="font-medium">{user?.name || 'کاربر'}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>کل درآمد</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${stats?.total_earnings?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>پروژه‌های تکمیل شده</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.completed_jobs || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>نرخ موفقیت</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.success_rate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>پروژه‌های فعال</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.active_jobs || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} mb-8`}>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'available'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              پروژه‌های موجود
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'my'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              پروژه‌های من
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'earnings'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : `${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              درآمدها
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="جستجو در پروژه‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-gray-300 text-gray-900 placeholder-gray-500'} border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/20 border-gray-300 text-gray-900'} border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="newest">جدیدترین</option>
                  <option value="oldest">قدیمی‌ترین</option>
                  <option value="budget-high">بودجه بالا</option>
                  <option value="budget-low">بودجه پایین</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`px-4 py-3 rounded-xl ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white/20 border-gray-300 text-gray-900'} border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">همه</option>
                  <option value="urgent">فوری</option>
                  <option value="web">طراحی وب</option>
                  <option value="mobile">موبایل</option>
                  <option value="design">طراحی</option>
                </select>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} cursor-pointer transition-all duration-300 hover:scale-105`}
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
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.rating}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Briefcase className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.platform}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.posted}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded-lg ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        +{job.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my' && (
          <div className="space-y-6">
            {myJobs.map((job) => (
              <div
                key={job.id}
                className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      {job.title}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {job.description}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    job.status === 'در حال انجام' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {job.status}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${job.budget}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {job.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      پیشرفت
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {job.progress}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all duration-300">
                    مشاهده جزئیات
                  </button>
                  {job.status === 'در حال انجام' && (
                    <button className="flex-1 py-2 px-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-all duration-300">
                      تحویل پروژه
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-100/50 to-pink-100/50'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                خلاصه درآمد
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    ${stats?.total_earnings?.toLocaleString() || '0'}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    کل درآمد
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {stats?.completed_jobs || 0}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    پروژه تکمیل شده
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    ${Math.round((stats?.total_earnings || 0) / (stats?.completed_jobs || 1))}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    میانگین درآمد
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Earnings data will be fetched from API */}
              {/* For now, we'll show a placeholder or a simple list */}
              {/* In a real app, you'd map over earnings data from the API */}
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      دی 1402
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      8 پروژه
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${Math.floor(Math.random() * 1000) + 500}
                    </div>
                    <div className={`text-sm text-green-400`}>
                      پرداخت شده
                    </div>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      آذر 1402
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      6 پروژه
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${Math.floor(Math.random() * 800) + 300}
                    </div>
                    <div className={`text-sm text-green-400`}>
                      پرداخت شده
                    </div>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      آبان 1402
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      12 پروژه
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${Math.floor(Math.random() * 1500) + 1000}
                    </div>
                    <div className={`text-sm text-green-400`}>
                      پرداخت شده
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedJob.title}
                </h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    توضیحات پروژه
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {selectedJob.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                      بودجه
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${selectedJob.budget}
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                      پلتفرم
                    </div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedJob.platform}
                    </div>
                  </div>
                </div>

                {selectedJob.skills && (
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      مهارت‌های مورد نیاز
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.rating && (
                  <div className="flex items-center space-x-2">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      امتیاز کارفرما:
                    </span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedJob.rating} <Star className="w-4 h-4 inline-block text-yellow-400" />
                    </span>
                  </div>
                )}
              </div>

              {selectedJob.isMyJob && (
                <>
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        پیشرفت پروژه
                      </span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedJob.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedJob.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col space-y-3">
                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300 flex items-center justify-center space-x-2">
                      <Upload className="w-6 h-6" />
                      <span>تحویل پروژه</span>
                    </button>
                    <button className={`w-full py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'} font-medium text-lg transition-colors flex items-center justify-center space-x-2`}>
                      <MessageCircle className="w-6 h-6" />
                      <span>گفتگو با کارفرما</span>
                    </button>
                  </div>
                </>
              )}
              {!selectedJob.isMyJob && (
                <div className="mt-6">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    درخواست انجام پروژه
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const proposal = (e.target as any).proposal.value;
                    const bidAmount = (e.target as any).bidAmount.value;
                    handleApply(selectedJob.id, proposal, bidAmount);
                  }} className="space-y-4">
                    {applyError && (
                      <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">خطا!</strong>
                        <span className="block sm:inline"> {applyError}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                          <button onClick={() => setApplyError(null)} className="text-red-100">
                            <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.759 3.152a1.2 1.2 0 0 1 0 1.698z"/></svg>
                          </button>
                        </span>
                      </div>
                    )}
                    {applySuccess && (
                      <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">موفقیت!</strong>
                        <span className="block sm:inline"> {applySuccess}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                          <button onClick={() => setApplySuccess(null)} className="text-green-100">
                            <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"/></svg>
                          </button>
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="proposal" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>پیشنهاد پیشرفته:</label>
                      <textarea
                        id="proposal"
                        rows={4}
                        className={`w-full pl-3 pr-3 py-2 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-gray-300 text-gray-900 placeholder-gray-500'} border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="توضیحات درخواست و پیشنهادات..."
                      ></textarea>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="bidAmount" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>مبلغ پیشنهادی:</label>
                      <input
                        type="number"
                        id="bidAmount"
                        min="0"
                        className={`w-full pl-3 pr-3 py-2 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-gray-300 text-gray-900 placeholder-gray-500'} border backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="مبلغ پیشنهادی (اختیاری)"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={applyLoading}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyLoading ? 'در حال ارسال...' : 'ارسال درخواست'}
                      {applyLoading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KardashDashboard; 