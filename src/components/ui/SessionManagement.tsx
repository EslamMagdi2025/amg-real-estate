import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon,
  DeviceTabletIcon,
  MapPinIcon,
  ClockIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface UserSession {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  country?: string;
  city?: string;
  lastActivity: string;
  createdAt: string;
  current?: boolean;
}

const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions');
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId);
    
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
      }
    } catch (error) {
      console.error('Error terminating session:', error);
    } finally {
      setTerminatingSession(null);
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ terminateAll: true }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Keep only current session
        setSessions(prev => prev.filter(session => session.current));
      }
    } catch (error) {
      console.error('Error terminating all sessions:', error);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return DevicePhoneMobileIcon;
      case 'tablet':
        return DeviceTabletIcon;
      default:
        return ComputerDesktopIcon;
    }
  };

  const formatLastActivity = (date: string) => {
    const now = new Date();
    const lastActivity = new Date(date);
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 5) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  useEffect(() => {
    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              الجلسات النشطة
            </h3>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={terminateAllOtherSessions}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              إنهاء الجلسات الأخرى
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm">
          إدارة الأجهزة التي تم تسجيل الدخول منها
        </p>
      </div>

      <div className="p-6">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد جلسات نشطة</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {sessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceType);
                const isTerminating = terminatingSession === session.id;
                
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`relative p-4 rounded-lg border transition-all duration-200 ${
                      session.current 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse flex-1">
                        <div className={`p-3 rounded-lg ${
                          session.current 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          <DeviceIcon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {session.deviceName || 'جهاز غير معروف'}
                            </h4>
                            {session.current && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                الجلسة الحالية
                              </span>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            {session.browser && (
                              <p>{session.browser} • {session.os}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                              {session.ipAddress && (
                                <div className="flex items-center space-x-1 space-x-reverse">
                                  <MapPinIcon className="w-3 h-3" />
                                  <span>{session.ipAddress}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-1 space-x-reverse">
                                <ClockIcon className="w-3 h-3" />
                                <span>{formatLastActivity(session.lastActivity)}</span>
                              </div>
                              
                              {session.city && session.country && (
                                <span>{session.city}, {session.country}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {!session.current && (
                        <button
                          onClick={() => terminateSession(session.id)}
                          disabled={isTerminating}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            isTerminating
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          {isTerminating ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <XMarkIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3 space-x-reverse">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800 mb-1">
                نصائح الأمان
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• تأكد من تسجيل الخروج من الأجهزة العامة</li>
                <li>• راجع الجلسات النشطة بانتظام</li>
                <li>• أنه أي جلسة مشبوهة فوراً</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;