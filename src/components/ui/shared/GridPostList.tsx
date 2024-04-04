import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'

type GridPostListProps = {
  posts: Models.Document[]
}

const GridPostList = ({ posts }: GridPostListProps) => {
  const {user} = useUserContext
  
  return (
    <ul className='grid-contaiiner'>
      {posts.map((post) => (
        <li key={post.$id} className='relative min-w-80 h-80'>
          <Link to={`/posts/${post.$id}`} className='grid-post_link'>
            <img src={post.imageUrl} alt='post' className='h-full w-full object-cover' />
          </Link>
        </li>
      )) }
    </ul>
  )
}

export default GridPostList