import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return {
    user: { name: 'User' },
    signOut: async () => ({ error: null }),
    loading: false
  };
}
