/**
 * Auth Manager - Global authentication state manager
 * Used by API interceptor to trigger logout when token expires
 */

export type AuthManagerCallback = () => void;

class AuthManager {
  private logoutCallbacks: AuthManagerCallback[] = [];

  onLogoutRequired(callback: AuthManagerCallback) {
    this.logoutCallbacks.push(callback);
  }

  removeLogoutCallback(callback: AuthManagerCallback) {
    this.logoutCallbacks = this.logoutCallbacks.filter((cb) => cb !== callback);
  }

  triggerLogout() {
    console.log("AuthManager: Triggering logout");
    this.logoutCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in logout callback:", error);
      }
    });
  }
}

export const authManager = new AuthManager();
