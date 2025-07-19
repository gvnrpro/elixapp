import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, User } from '../services/authService'

interface AuthContextType {
  user: User | null
  session: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error?: string }>
  signOut: () => Promise<{ error?: string }>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { session: currentSession, user: currentUser, error } = await authService.getCurrentSession()
      
      if (!error && currentSession && currentUser) {
        setSession(currentSession)
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    setLoading(true)
    try {
      const { session: newSession, user: newUser, error } = await authService.signIn(email, password)
      
      if (error) {
        return { error }
      }

      if (newSession && newUser) {
        setSession(newSession)
        setUser(newUser)
      }

      return {}
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: `Sign in failed: ${error.message}` }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, role: string): Promise<{ error?: string }> => {
    setLoading(true)
    try {
      const { error } = await authService.signUp(email, password, name, role)
      
      if (error) {
        return { error }
      }

      // After successful signup, sign in the user
      return await signIn(email, password)
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: `Sign up failed: ${error.message}` }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<{ error?: string }> => {
    setLoading(true)
    try {
      const { error } = await authService.signOut()
      
      setUser(null)
      setSession(null)
      
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: `Sign out failed: ${error.message}` }
    } finally {
      setLoading(false)
    }
  }

  const getAccessToken = (): string | null => {
    return session?.access_token || null
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getAccessToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}