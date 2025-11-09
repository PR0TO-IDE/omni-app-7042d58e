/**
 * API Client for frontend-only apps
 * Uses localStorage for data persistence when no backend is available
 */

export class ApiClient {
  private storagePrefix: string = 'app_data_'

  /**
   * Get data from localStorage
   */
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const data = localStorage.getItem(this.storagePrefix + key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }

  /**
   * Save data to localStorage
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      throw error
    }
  }

  /**
   * Delete data from localStorage
   */
  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.storagePrefix + key)
    } catch (error) {
      console.error('Error deleting from localStorage:', error)
      throw error
    }
  }

  /**
   * Clear all app data
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      throw error
    }
  }
}

export const api = new ApiClient()