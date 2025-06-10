import { useState, useEffect } from 'react';

type Role = 'teacher' | 'student' | 'admin' | null;

export function useAuth() {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual role fetching from your auth system
    // This is just a placeholder that assumes teacher role
    setRole('teacher');
    setLoading(false);
  }, []);

  return {
    role,
    loading,
    isAuthenticated: role !== null
  };
} 