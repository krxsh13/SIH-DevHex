# Frontend Integration Guide

## 🚀 Connecting Frontend to Alumni Management Backend

### Option 1: React/Next.js Integration

#### 1. Create API Service Layer

```javascript
// frontend/src/services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token automatically
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async getProfile() {
    return this.apiCall('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.apiCall(`/auth/users?${queryString}`);
  }

  logout() {
    this.removeAuthToken();
  }
}

export default new ApiService();
```

#### 2. React Components Examples

```jsx
// frontend/src/components/RegisterForm.jsx
import React, { useState } from 'react';
import ApiService from '../services/api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.register(formData);
      console.log('Registration successful:', response.data);
      
      // Redirect to dashboard or login
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
```

```jsx
// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import ApiService from '../services/api';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await ApiService.login(credentials);
      console.log('Login successful:', response.data);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

```jsx
// frontend/src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profile: {
      bio: '',
      graduationYear: '',
      degree: '',
      currentJob: {
        title: '',
        company: '',
      },
      location: {
        city: '',
        country: '',
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await ApiService.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await ApiService.updateProfile(profile);
      setMessage('Profile updated successfully!');
      console.log('Profile updated:', response.data);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setProfile(prev => {
        const updated = { ...prev };
        let current = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
      
      {message && (
        <div className={`border px-4 py-3 rounded mb-4 ${
          message.includes('Error') 
            ? 'bg-red-100 border-red-400 text-red-700'
            : 'bg-green-100 border-green-400 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Bio
        </label>
        <textarea
          name="profile.bio"
          value={profile.profile?.bio || ''}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Graduation Year
          </label>
          <input
            type="number"
            name="profile.graduationYear"
            value={profile.profile?.graduationYear || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Degree
          </label>
          <input
            type="text"
            name="profile.degree"
            value={profile.profile?.degree || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="profile.currentJob.title"
            value={profile.profile?.currentJob?.title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Company
          </label>
          <input
            type="text"
            name="profile.currentJob.company"
            value={profile.profile?.currentJob?.company || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default ProfileForm;
```

#### 3. Environment Configuration

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Option 2: Vanilla JavaScript/HTML

```html
<!-- frontend/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alumni Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div class="container mx-auto px-4 py-8">
        <div id="app">
            <!-- Registration Form -->
            <div id="register-form" class="max-w-md mx-auto">
                <h2 class="text-2xl font-bold mb-6">Register</h2>
                <form id="registration-form">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" id="email" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" id="password" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                        <input type="text" id="firstName" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                        <input type="text" id="lastName" required class="w-full px-3 py-2 border rounded-lg">
                    </div>
                    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Register
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        const API_BASE_URL = 'http://localhost:5000/api';

        // API Service
        class ApiService {
            static async register(userData) {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'Registration failed');
                }

                return data;
            }

            static async login(credentials) {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'Login failed');
                }

                // Store token
                localStorage.setItem('authToken', data.data.token);
                return data;
            }
        }

        // Registration Form Handler
        document.getElementById('registration-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
            };

            try {
                const response = await ApiService.register(formData);
                alert('Registration successful!');
                console.log('User registered:', response.data);
                
                // Redirect or show success message
                window.location.href = '/dashboard.html';
            } catch (error) {
                alert(`Registration failed: ${error.message}`);
            }
        });
    </script>
</body>
</html>
```

### Option 3: Vue.js Integration

```javascript
// frontend/src/services/api.js (Vue)
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

export default {
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  },

  async getProfile() {
    return apiClient.get('/auth/profile');
  },

  async updateProfile(profileData) {
    return apiClient.put('/auth/profile', profileData);
  },

  logout() {
    localStorage.removeItem('authToken');
  },
};
```

## 🔧 Setup Instructions

### 1. Start Backend Server
```bash
cd alumini-backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Configure Frontend
- Set API URL to `http://localhost:5000/api`
- Handle CORS (already configured in backend)
- Implement authentication token storage

### 3. Test Connection
```javascript
// Test API connection
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('API connected:', data));
```

## 🚀 Deployment Options

### Development
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### Production
- Backend: Deploy to Heroku, Railway, or VPS
- Frontend: Deploy to Vercel, Netlify, or static hosting
- Update CORS settings in backend `.env`

## 🔒 Security Considerations

1. **HTTPS in Production**: Always use HTTPS
2. **Environment Variables**: Store API URLs in env files
3. **Token Storage**: Consider httpOnly cookies for production
4. **CORS Configuration**: Restrict origins in production

## 📱 Mobile App Integration

For React Native or mobile apps, use the same API endpoints with appropriate HTTP clients like Axios or fetch.

---

**The backend is ready to accept connections from any frontend technology!** Choose the approach that matches your frontend stack.