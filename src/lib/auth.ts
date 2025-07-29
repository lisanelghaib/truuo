import { stack } from "./stack";

export interface User {
  id: string;
  primaryEmail: string | null;
  displayName: string | null;
}

export class AuthService {
  // Create a new account (register)
  async createAccount(email: string, password: string, name: string) {
    try {
      const result = await stack.signUpWithCredential({
        email,
        password,
      });

      // Update display name if registration successful
      const user = await stack.getUser();
      if (user) {
        await user.update({ displayName: name });
      }

      return result;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Login with email and password
  async login(email: string, password: string) {
    try {
      const result = await stack.signInWithCredential({
        email,
        password,
      });
      return result;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = await stack.getUser();
      if (user) {
        return {
          id: user.id,
          primaryEmail: user.primaryEmail,
          displayName: user.displayName,
        } as User;
      }
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      // Get current user to access auth methods
      const user = await stack.getUser();
      if (user) {
        // Use the user's signOut method to properly logout
        await user.signOut();
      }
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  // Logout from all sessions
  async logoutAll() {
    try {
      // Get current user to access auth methods
      const user = await stack.getUser();
      if (user) {
        // Sign out from all sessions
        await user.signOut();
      }
    } catch (error) {
      console.error("Error logging out from all sessions:", error);
      throw error;
    }
  }

  // Send password recovery email
  async sendPasswordRecovery(email: string) {
    try {
      const result = await stack.sendForgotPasswordEmail(email, {
        callbackUrl: `${window.location.origin}/reset-password`,
      });
      return result;
    } catch (error) {
      console.error("Error sending password recovery:", error);
      throw error;
    }
  }

  // Complete password recovery
  async completePasswordRecovery(code: string, password: string) {
    try {
      const result = await stack.resetPassword({
        code,
        password,
      });
      return result;
    } catch (error) {
      console.error("Error completing password recovery:", error);
      throw error;
    }
  }

  // Send email verification
  async sendEmailVerification() {
    try {
      const user = await stack.getUser();
      if (user) {
        const result = await user.sendVerificationEmail();
        return result;
      }
      throw new Error("No user logged in");
    } catch (error) {
      console.error("Error sending email verification:", error);
      throw error;
    }
  }

  // Complete email verification
  async completeEmailVerification(code: string) {
    try {
      const result = await stack.verifyEmail(code);
      return result;
    } catch (error) {
      console.error("Error completing email verification:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
