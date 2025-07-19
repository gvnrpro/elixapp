import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: any }) {
  return (
    <div>
      {children}
    </div>
  );
}

export function useAuth() {
  return {
    user: { name: 'User' },
    signOut: async () => ({ error: null }),
    loading: false
  };
}
