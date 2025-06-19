import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authCommonService } from '@/services/auth/common.service';

export const useAutoRefreshToken = () => {
  const { user, refreshToken } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.access_token) {
      // Clear interval if no user
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkAndRefresh = async () => {
      if (!user.access_token) return;

      try {
        if (authCommonService.shouldRefreshToken(user.access_token)) {
          await refreshToken();
        }
      } catch (error) {
        console.error('Auto refresh token failed:', error);
      }
    };

    // Check immediately
    checkAndRefresh();

    // Set up interval to check every minute
    intervalRef.current = setInterval(checkAndRefresh, 60 * 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user?.access_token, refreshToken]);

  // Also refresh on focus
  useEffect(() => {
    if (!user?.access_token) return;

    const handleFocus = async () => {
      try {
        if (authCommonService.shouldRefreshToken(user.access_token)) {
          await refreshToken();
        }
      } catch (error) {
        console.error('Auto refresh token on focus failed:', error);
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.access_token, refreshToken]);
};