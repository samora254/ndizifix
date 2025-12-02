import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface WatchProgress {
  videoId: string;
  progress: number;
  lastWatched: string;
  completed: boolean;
}

interface AppState {
  likedVideoIds: string[];
  watchProgress: WatchProgress[];
  hasSeenLanding: boolean;
  hasActiveSubscription: boolean;
  subscriptionExpiryDate?: string;
}

const STORAGE_KEY = '@app_state';

export const [AppStateProvider, useAppState] = createContextHook(() => {
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);
  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>([]);
  const [hasSeenLanding, setHasSeenLanding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionExpiryDate, setSubscriptionExpiryDate] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadState();
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('[Auth] Session found, user logged in:', session.user.email);
        setUser(session.user);
        setIsLoggedIn(true);
      } else {
        console.log('[Auth] No session found');
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('[Auth] Auth state changed:', _event, session?.user?.email);
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setHasActiveSubscription(false);
          setSubscriptionExpiryDate(undefined);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('[Auth] Error initializing auth:', error);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      saveState(likedVideoIds, watchProgress, hasSeenLanding, hasActiveSubscription, subscriptionExpiryDate);
    }
  }, [likedVideoIds, watchProgress, hasSeenLanding, hasActiveSubscription, subscriptionExpiryDate, isLoaded]);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: AppState = JSON.parse(stored);
        setLikedVideoIds(state.likedVideoIds || []);
        setWatchProgress(state.watchProgress || []);
        setHasSeenLanding(state.hasSeenLanding || false);
        setHasActiveSubscription(state.hasActiveSubscription || false);
        setSubscriptionExpiryDate(state.subscriptionExpiryDate);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('[AppState] Error loading state:', error);
      setIsLoaded(true);
    }
  };

  const saveState = async (newLikedIds: string[], newProgress: WatchProgress[], seenLanding: boolean, subscription: boolean, expiryDate?: string) => {
    try {
      const state: AppState = {
        likedVideoIds: newLikedIds,
        watchProgress: newProgress,
        hasSeenLanding: seenLanding,
        hasActiveSubscription: subscription,
        subscriptionExpiryDate: expiryDate,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[AppState] Error saving state:', error);
    }
  };

  const toggleLike = useCallback((videoId: string) => {
    setLikedVideoIds((prev) => {
      const isLiked = prev.includes(videoId);
      const newLikedIds = isLiked 
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      
      return newLikedIds;
    });
  }, []);

  const isLiked = useCallback((videoId: string) => {
    return likedVideoIds.includes(videoId);
  }, [likedVideoIds]);

  const updateWatchProgress = useCallback((videoId: string, progress: number, completed: boolean) => {
    setWatchProgress((prev) => {
      const existing = prev.find((p) => p.videoId === videoId);
      let newProgress: WatchProgress[];

      if (completed) {
        newProgress = prev.filter((p) => p.videoId !== videoId);
      } else {
        if (existing) {
          newProgress = prev.map((p) =>
            p.videoId === videoId
              ? { ...p, progress, lastWatched: new Date().toISOString(), completed }
              : p
          );
        } else {
          newProgress = [
            ...prev,
            {
              videoId,
              progress,
              lastWatched: new Date().toISOString(),
              completed,
            },
          ];
        }
      }

      return newProgress;
    });
  }, []);

  const getWatchProgress = useCallback((videoId: string) => {
    return watchProgress.find((p) => p.videoId === videoId);
  }, [watchProgress]);

  const continueWatchingVideos = useMemo(() => {
    return watchProgress
      .filter((p) => !p.completed)
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());
  }, [watchProgress]);

  const markLandingAsSeen = useCallback(() => {
    setHasSeenLanding(true);
  }, []);

  const login = useCallback(() => {
    console.log('[Auth] User logged in');
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('[Auth] User logging out');
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setHasActiveSubscription(false);
      setSubscriptionExpiryDate(undefined);
      setUser(null);
    } catch (error) {
      console.error('[Auth] Error signing out:', error);
    }
  }, []);

  const activateSubscription = useCallback((expiryDate: string) => {
    console.log('[Subscription] Subscription activated until:', expiryDate);
    setHasActiveSubscription(true);
    setSubscriptionExpiryDate(expiryDate);
  }, []);

  const checkSubscriptionStatus = useCallback(() => {
    if (!subscriptionExpiryDate) {
      return false;
    }
    const now = new Date();
    const expiry = new Date(subscriptionExpiryDate);
    const isActive = now < expiry;
    
    if (!isActive && hasActiveSubscription) {
      console.log('[Subscription] Subscription expired');
      setHasActiveSubscription(false);
    }
    
    return isActive;
  }, [subscriptionExpiryDate, hasActiveSubscription]);

  return {
    likedVideoIds,
    watchProgress,
    continueWatchingVideos,
    hasSeenLanding,
    isLoggedIn,
    hasActiveSubscription,
    subscriptionExpiryDate,
    isLoaded,
    user,
    toggleLike,
    isLiked,
    updateWatchProgress,
    getWatchProgress,
    markLandingAsSeen,
    login,
    logout,
    activateSubscription,
    checkSubscriptionStatus,
  };
});
