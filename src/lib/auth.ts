import { ID } from "appwrite";
import { account } from "./appwrite";

export interface User {
  $id: string;
  name: string;
  email: string;
}

export class AuthService {
  // Create a new account
  async createAccount(email: string, password: string, name: string) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      return userAccount;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Login with email and password
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  // Logout from all sessions
  async logoutAll() {
    try {
      await account.deleteSessions();
    } catch (error) {
      console.error("Error logging out from all sessions:", error);
      throw error;
    }
  }

  // Send password recovery email
  async sendPasswordRecovery(email: string) {
    try {
      const result = await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return result;
    } catch (error) {
      console.error("Error sending password recovery:", error);
      throw error;
    }
  }

  // Complete password recovery
  async completePasswordRecovery(
    userId: string,
    secret: string,
    password: string
  ) {
    try {
      const result = await account.updateRecovery(userId, secret, password);
      return result;
    } catch (error) {
      console.error("Error completing password recovery:", error);
      throw error;
    }
  }

  // Send email verification
  async sendEmailVerification() {
    try {
      const result = await account.createVerification(
        `${window.location.origin}/verify-email`
      );
      return result;
    } catch (error) {
      console.error("Error sending email verification:", error);
      throw error;
    }
  }

  // Complete email verification
  async completeEmailVerification(userId: string, secret: string) {
    try {
      const result = await account.updateVerification(userId, secret);
      return result;
    } catch (error) {
      console.error("Error completing email verification:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
