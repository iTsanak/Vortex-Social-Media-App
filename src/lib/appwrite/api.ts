import { ID, Query } from 'appwrite';
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';


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
        const session = await account.createEmailSession(user.email, user.password);
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

// Get the current user from the database
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        
        if(!currentAccount) throw Error;
        
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
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

//Create a new post
export async function createPost(post: INewPost){
    try{
        //Upload image to storage
        const uploadedFile = await uploadFile(post.file[0])
        if(!uploadedFile) throw Error;
        
        //Get file url  
        const fileUrl = getFilePreview(uploadedFile.$id);
        if(!fileUrl) {
            deleteFile(uploadedFile.$id);
            throw Error;
        } 

        //Convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') || [];
        
        //Save the post to the database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        )

        if(!newPost){
            await deleteFile(uploadedFile.$id)
            throw Error;
        }

        return newPost;
    } catch(error){
        console.log(error);
    }
}

//Upload a file to the storage
export async function uploadFile(file: File){
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    } catch(error){
        console.log(error);
    }
}

//Get the file preview
export function getFilePreview(fileId: string){
    try{
        const fileUrl =  storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            'top',
            100           
        );
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch(error){
        console.log(error);
    }
}

//Delete a file from the storage
export async function deleteFile(fileId: string){
    try{
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        );
        return { status: 'ok'}
    } catch(error){
        console.log(error);
    }
}

//Get recent posts for Home feed #TO-DO
export async function getRecentPosts(){
    try {
        const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)] //CHECK THIS
        )

        if(!posts) throw Error;
        return posts;
    } catch(error){
        console.log(error);
    }
}

//Like a post
export async function likePost(postId: string, likesArray: string[]){
    try {
        const updatePost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if(!updatePost) throw Error;
        return updatePost;
    } catch(error){
        console.log(error);
    }
}

//Save the post to the saved posts of the current user
export async function savePost(postId: string, userId: string){
    try {
        const updatePost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesColletionId,
            ID.unique(),
            {
                user: userId,
                post: postId
            } 
        )

        if(!updatePost) throw Error;
        return updatePost;
    } catch(error){
        console.log(error);
    }
}

//Unsave the saved posts of the current user
export async function DeleteSavedPost(savedRecordId: string){
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesColletionId,
            savedRecordId
        )

        if(!statusCode) throw Error;
        return statusCode;
    } catch(error){
        console.log(error);
    }
}

//Get the post using the post id
export async function getPostById(postId: string){
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        if(!post) throw Error;
        return post;
    } catch(error){
        console.log(error);
    }
}

//Update a post
export async function updatePost(post: IUpdatePost){
    const hasFileToUpdate = post.file.length > 0;

    try{
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId

        }

        if (hasFileToUpdate){
            //Upload image to storage
            const uploadedFile = await uploadFile(post.file[0])
            if(!uploadedFile) throw Error;
            //Get file url  
            const fileUrl = getFilePreview(uploadedFile.$id);
            if(!fileUrl) {
                deleteFile(uploadedFile.$id);
                throw Error;
            } 

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }

        //Convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') || [];
        
        //Save the post to the database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        )

        if(!updatedPost){
            await deleteFile(post.imageId)
            throw Error;
        }

        return updatedPost;
    } catch(error){
        console.log(error);
    }
}

//Delete a post
export async function deletePost(postId: string, imageId: string){
    if(!postId || !imageId) throw Error;

    try{
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        
        return { status: 'ok '}
    } catch(error){
        console.log(error);
    }
} 

//Get posts for infinite scrolling
export async function getInfinitePosts({ pageParam }: {pageParam: number}){
    const queries = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam) queries.push(Query.cursorAfter(pageParam.toString()));

    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;
        
        return posts;   
    } catch(error){
        console.log(error);
    }
}

//Search posts
export async function searchPosts(searchTerm: string){

    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error;
        
        return posts;   
    } catch(error){
        console.log(error);
    }
}

// Get the users from the database
export async function getUsers(limit?: number) {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(limit? limit : 6)], //double check this limit maybe leave as 10 only
        )

        if(!users) throw Error;
        return users.documents;
    } catch(error){
        console.log(error);
        return [];
    }
}