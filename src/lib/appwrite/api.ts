import { ID, Query } from 'appwrite';
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from './config';


//Create a new user account using Appwrite API and save the user to the database
export async function createUserAccount(user: INewUser){
    try{
        // Create a new account
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.name);

        // Save the user in the database
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser;
    }catch(error){
        console.log(error);
        return error;
    }
}

//Save the user to the database
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username: string;
}) {
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;
    }catch(error){
        console.log(error);
    }
}

//Sign in a user account using email and password and return the session
export async function signInAccount(user: {email: string; password: string;}){
    try{
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    }catch(error){
        console.log(error);
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

// Get the current user
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        
        if(!currentAccount) throw Error;
        
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            //[Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return currentUser.documents[0];
        
    } catch (error) {
        console.log(error);
    }
}

//Sign out the current user
export async function signOutAccount(){
    try{
        const session = await account.deleteSession('current');
        return session;
    } catch(error) {
        console.log(error);
    }
}