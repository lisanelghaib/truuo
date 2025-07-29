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
      const result = await stack.signUp({
        email,
        password,
      });

      // Update display name if registration successful
      if (result.user) {
        await result.user.update({ displayName: name });
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
      const result = await stack.signIn({
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
      const user = stack.getUser();
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
      await stack.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  // Logout from all sessions
  async logoutAll() {
    try {
      await stack.signOut();
    } catch (error) {
      console.error("Error logging out from all sessions:", error);
      throw error;
    }
  }

  // Send password recovery email
  async sendPasswordRecovery(email: string) {
    try {
      const result = await stack.sendPasswordResetEmail({
        email,
        redirectUrl: `${window.location.origin}/reset-password`,
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
      const user = stack.getUser();
      if (user) {
        const result = await user.sendVerificationEmail({
          redirectUrl: `${window.location.origin}/verify-email`,
        });
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
      const result = await stack.verifyEmail({ code });
      return result;
    } catch (error) {
      console.error("Error completing email verification:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
