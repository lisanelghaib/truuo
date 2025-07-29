import { ID, Query } from "appwrite";
import { databases } from "./appwrite";

export class DatabaseService {
  private databaseId: string;

  constructor() {
    this.databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  }

  // Create a document
  async createDocument(
    collectionId: string,
    data: object,
    documentId?: string
  ) {
    try {
      const document = await databases.createDocument(
        this.databaseId,
        collectionId,
        documentId || ID.unique(),
        data
      );
      return document;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  // Get a document by ID
  async getDocument(collectionId: string, documentId: string) {
    try {
      const document = await databases.getDocument(
        this.databaseId,
        collectionId,
        documentId
      );
      return document;
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }

  // List documents with optional queries
  async listDocuments(collectionId: string, queries?: string[]) {
    try {
      const documents = await databases.listDocuments(
        this.databaseId,
        collectionId,
        queries
      );
      return documents;
    } catch (error) {
      console.error("Error listing documents:", error);
      throw error;
    }
  }

  // Update a document
  async updateDocument(collectionId: string, documentId: string, data: object) {
    try {
      const document = await databases.updateDocument(
        this.databaseId,
        collectionId,
        documentId,
        data
      );
      return document;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  }

  // Delete a document
  async deleteDocument(collectionId: string, documentId: string) {
    try {
      await databases.deleteDocument(this.databaseId, collectionId, documentId);
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  // Search documents
  async searchDocuments(
    collectionId: string,
    searchTerm: string,
    searchAttributes: string[]
  ) {
    try {
      const queries = searchAttributes.map((attr) =>
        Query.search(attr, searchTerm)
      );

      const documents = await databases.listDocuments(
        this.databaseId,
        collectionId,
        queries
      );
      return documents;
    } catch (error) {
      console.error("Error searching documents:", error);
      throw error;
    }
  }

  // Get documents by user ID
  async getUserDocuments(collectionId: string, userId: string) {
    try {
      const documents = await databases.listDocuments(
        this.databaseId,
        collectionId,
        [Query.equal("userId", userId)]
      );
      return documents;
    } catch (error) {
      console.error("Error getting user documents:", error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
