/**
 * Clear session utility
 * Ensures fresh start every time the app loads
 */

export const clearSession = () => {
  try {
    // Clear all authentication related data
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    
    // Clear any other session data if needed
    sessionStorage.clear()
    
    console.log('Session cleared - starting fresh')
  } catch (error) {
    console.error('Error clearing session:', error)
  }
}

// Auto-clear session when this module is imported
if (typeof window !== 'undefined') {
  clearSession()
}
