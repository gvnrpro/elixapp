import { supabase } from '../utils/supabase/client'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export interface User {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export interface AuthResponse {
  user?: User
  session?: any
  error?: string
}

class AuthService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-7a1baec9`

  async signUp(email: string, password: string, name: string, role: string = 'site_manager'): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name, role })
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Signup failed' }
      }

      return { user: data.user }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: `Network error during signup: ${error.message}` }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error: `Sign in failed: ${error.message}` }
      }

      return { 
        session: data.session,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          role: data.user.user_metadata?.role || 'site_manager',
          created_at: data.user.created_at || ''
        } : undefined
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: `Network error during sign in: ${error.message}` }
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { error: `Sign out failed: ${error.message}` }
      }
      return {}
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: `Network error during sign out: ${error.message}` }
    }
  }

  async getCurrentSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error || !data.session) {
        return { error: 'No active session' }
      }

      return { 
        session: data.session,
        user: data.session.user ? {
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.user_metadata?.name || '',
          role: data.session.user.user_metadata?.role || 'site_manager',
          created_at: data.session.user.created_at || ''
        } : undefined
      }
    } catch (error) {
      console.error('Session check error:', error)
      return { error: `Error checking session: ${error.message}` }
    }
  }

  async getProfile(accessToken: string): Promise<{ profile?: User; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch profile' }
      }

      return { profile: data.profile }
    } catch (error) {
      console.error('Profile fetch error:', error)
      return { error: `Network error fetching profile: ${error.message}` }
    }
  }
}

export const authService = new AuthService()