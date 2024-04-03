import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState, useEffect } from "react";
import Loader from "./Loader";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    //Get the likes list for a post
    const likesList = post?.likes.map((user: Models.Document) =>user.$id);
    //States
    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);

    //Import the likePost, savePost and deleteSavedPost mutations
    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending : isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

    const { data: currentUser } = useGetCurrentUser();

    //Find if the record exists, in the array of the user that saved the post 
    const savedPostRecord = currentUser?.save.find((record: 
        Models.Document) => record.post.$id === post?.$id);
    
    useEffect(() => {
        //Falsey value check
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    //Function for liking and disliking
    const handleLikePost = (e: React.MouseEvent) => {
        //On click stop and dont redirect to post
        e.stopPropagation();
        //Get likes 
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);
        //Unlike: If user has already liked add everyone to the newLikes except the current one
        if(hasLiked){
                newLikes = newLikes.filter((id) => id !== userId);
        } else {//Add user to the liked list
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({postId: post?.$id || '', likesArray: newLikes })
    }
    const handleSavePost = (e: React.MouseEvent) => {
        //On click stop and dont redirect to post
        e.stopPropagation();
        
        //If clicked and is already in the saved array then remove it
        if(savedPostRecord){
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else { //else save it
        savePost({postId: post?.$id || '', userId});
        setIsSaved(true);
        }
    }

  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img
                src={checkIsLiked(likes, userId) ? '/assets/icons/liked.svg'
               : '/assets/icons/like.svg'}
                alt='like' 
                width={20}
                height={20}
                onClick={handleLikePost}
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
        <img
                src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
                alt='save'
                width={20}
                height={20}
                onClick={handleSavePost}
                className="cursor-pointer"
            />
        </div>
    </div>
  )
}

export default PostStats