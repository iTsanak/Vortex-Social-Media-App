import { useUserContext } from '@/context/AuthContext';

const LikedPosts = () => {
  const { user } = useUserContext();
  
  return (
    <div> {}LikedPosts</div>
  )
}

export default LikedPosts