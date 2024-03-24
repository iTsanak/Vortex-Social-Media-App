import {Client, Account, Databases, Storage, Avatars} from 'appwrite';

// Get the project ID and URL from the environment variables
export const appwriteConfig = {
    url: import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
    savesColletionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID
}

// Create a new Appwrite client
export const client = new Client();
// Set the project ID and URL
client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);
// Create a new Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);