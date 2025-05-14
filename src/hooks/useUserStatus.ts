
// Create a new hook to manage user status locally instead of using the database

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserStatus = (userId: string | undefined) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'away'>('offline');
  const [lastActive, setLastActive] = useState<Date>(new Date());

  // Update status to online when component mounts
  useEffect(() => {
    if (!userId) return;
    
    const updateStatus = async () => {
      try {
        setStatus('online');
        setLastActive(new Date());
        
        // Store in localStorage instead of database to avoid permission issues
        localStorage.setItem(`user_status_${userId}`, JSON.stringify({
          status: 'online',
          lastActive: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error updating status:', error);
      }
    };
    
    // Load from localStorage if exists
    const savedStatus = localStorage.getItem(`user_status_${userId}`);
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        setStatus(parsed.status);
        setLastActive(new Date(parsed.lastActive));
      } catch (e) {
        // If parsing fails, update with new status
        updateStatus();
      }
    } else {
      updateStatus();
    }
    
    // Set up activity tracking
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleActivity = () => {
      if (status !== 'online') {
        setStatus('online');
        setLastActive(new Date());
        
        localStorage.setItem(`user_status_${userId}`, JSON.stringify({
          status: 'online',
          lastActive: new Date().toISOString()
        }));
      }
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    // Set up inactivity detection
    const inactivityTimeout = setTimeout(() => {
      setStatus('away');
      localStorage.setItem(`user_status_${userId}`, JSON.stringify({
        status: 'away',
        lastActive: lastActive.toISOString()
      }));
    }, 5 * 60 * 1000); // 5 minutes
    
    // Clean up
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(inactivityTimeout);
      
      // Set offline on unmount
      localStorage.setItem(`user_status_${userId}`, JSON.stringify({
        status: 'offline',
        lastActive: new Date().toISOString()
      }));
    };
  }, [userId]);

  const updateStatus = (newStatus: 'online' | 'offline' | 'away') => {
    if (!userId) return;
    
    setStatus(newStatus);
    setLastActive(new Date());
    
    localStorage.setItem(`user_status_${userId}`, JSON.stringify({
      status: newStatus,
      lastActive: new Date().toISOString()
    }));
  };
  
  return {
    status,
    lastActive,
    updateStatus
  };
};
