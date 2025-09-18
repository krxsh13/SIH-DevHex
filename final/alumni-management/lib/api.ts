/**
 * API client for Alumni Management System
 * Handles all backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    timestamp: string
  }
}

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: string
}

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: string
  isActive: boolean
  profile?: any
  createdAt: string
  updatedAt: string
}

interface AuthResponse {
  user: User
  token: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            message: 'An error occurred',
            code: 'UNKNOWN_ERROR',
            timestamp: new Date().toISOString()
          }
        }
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          code: 'NETWORK_ERROR',
          timestamp: new Date().toISOString()
        }
      }
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth-token', token)
      } else {
        localStorage.removeItem('auth-token')
      }
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (response.success && response.data?.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile')
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async getAllUsers(): Promise<ApiResponse<{ users: User[]; pagination: any }>> {
    return this.request<{ users: User[]; pagination: any }>('/auth/users')
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>('/health')
  }

  // Logout (client-side only)
  logout() {
    this.setToken(null)
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type { ApiResponse, LoginRequest, SignupRequest, User, AuthResponse }
