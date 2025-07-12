import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Google } from 'lucide-react';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  setUserRole: (role: 'freelancer' | 'admin') => void;
  setUser: (user: any) => void;
  isDarkMode: boolean;
}

const Login = ({ setIsLoggedIn, setUserRole, setUser, isDarkMode }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock authentication - replace with actual API call
      if (email === 'admin@kardash.com' && password === 'admin123') {
        const userData = {
          id: '1',
          email: 'admin@kardash.com',
          role: 'admin' as const,
          name: 'ادمین سیستم'
        };
        
        localStorage.setItem('authToken', 'mock-admin-token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setUserRole('admin');
        setIsLoggedIn(true);
        navigate('/admin');
      } else if (email === 'freelancer@kardash.com' && password === 'freelancer123') {
        const userData = {
          id: '2',
          email: 'freelancer@kardash.com',
          role: 'freelancer' as const,
          name: 'علی محمدی'
        };
        
        localStorage.setItem('authToken', 'mock-freelancer-token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setUserRole('freelancer');
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        setError('ایمیل یا رمز عبور اشتباه است');
      }
    } catch (error) {
      setError('خطا در ورود. لطفاً دوباره تلاش کنید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    alert('ورود با گوگل به زودی فعال خواهد شد');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4`}>
            K
          </div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            خوش آمدید
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            وارد حساب کاربری خود شوید
          </p>
        </div>

        {/* Login Form */}
        <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-white/20'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-white/20'} shadow-2xl`}>
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                ایمیل
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                رمز عبور
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-10 pr-12 py-3 rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="رمز عبور خود را وارد کنید"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-blue-400 hover:to-purple-400 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogIn className="w-6 h-6" />
              )}
              <span>{isLoading ? 'در حال ورود...' : 'ورود'}</span>
            </button>
          </form>

          <div className={`mt-6 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            حساب کاربری ندارید؟{' '}
            <button
              onClick={() => navigate('/signup')}
              className={`font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              ثبت نام کنید
            </button>
          </div>

          <div className="relative flex items-center justify-center my-8">
            <div className={`absolute inset-x-0 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <span className={`relative z-10 px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              یا
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className={`w-full py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'} font-medium text-lg transition-colors flex items-center justify-center space-x-2`}
          >
            <Google className="w-6 h-6" />
            <span>ورود با گوگل</span>
          </button>

          {/* Demo Credentials */}
          <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'} text-sm`}>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              اطلاعات تست:
            </p>
            <div className="space-y-1 text-xs">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>ادمین:</strong> admin@kardash.com / admin123
              </p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>فریلنسر:</strong> freelancer@kardash.com / freelancer123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 