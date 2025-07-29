import { ID } from "appwrite";
import { storage } from "./appwrite";

export class StorageService {
  private bucketId: string;

  constructor(bucketId: string = "default") {
    this.bucketId = bucketId;
  }

  // Upload a file
  async uploadFile(file: File, fileId?: string) {
    try {
      const uploadedFile = await storage.createFile(
        this.bucketId,
        fileId || ID.unique(),
        file
      );
      return uploadedFile;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Get file preview URL
  getFilePreview(
    fileId: string,
    width?: number,
    height?: number,
    quality?: number
  ) {
    try {
      return storage.getFilePreview(
        this.bucketId,
        fileId,
        width,
        height,
        "center",
        quality
      );
    } catch (error) {
      console.error("Error getting file preview:", error);
      throw error;
    }
  }

  // Get file download URL
  getFileDownload(fileId: string) {
    try {
      return storage.getFileDownload(this.bucketId, fileId);
    } catch (error) {
      console.error("Error getting file download URL:", error);
      throw error;
    }
  }

  // Get file view URL
  getFileView(fileId: string) {
    try {
      return storage.getFileView(this.bucketId, fileId);
    } catch (error) {
      console.error("Error getting file view URL:", error);
      throw error;
    }
  }

  // Get file details
  async getFile(fileId: string) {
    try {
      const file = await storage.getFile(this.bucketId, fileId);
      return file;
    } catch (error) {
      console.error("Error getting file:", error);
      throw error;
    }
  }

  // List files
  async listFiles(queries?: string[]) {
    try {
      const files = await storage.listFiles(this.bucketId, queries);
      return files;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  // Update file
  async updateFile(fileId: string, name?: string, permissions?: string[]) {
    try {
      const file = await storage.updateFile(
        this.bucketId,
        fileId,
        name,
        permissions
      );
      return file;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(fileId: string) {
    try {
      await storage.deleteFile(this.bucketId, fileId);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
