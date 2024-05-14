// src/components/ui/shared/RightSidebar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations'; //TO DO: import useGetUsers from queriesAndMutations
import Loader from './Loader'; 
import { IUser } from '@/types'; 

const RightSidebar = () => {
  const { data: users, isLoading, isError } = useGetUsers();

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading users</div>;

  return (
    <aside className='rightsidebar hidden md:block'>
      <h2 className='h3-bold md:h2-bold text-left w-full'>Top Creators</h2>
      <div className='grid grid-cols-1 gap-4'>
        {users?.map((user: IUser) => (
          <Link to={`/profile/${user.id}`} key={user.id} className='flex items-center gap-4 p-4 hover:bg-gray-200'>
            <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='profile' className='h-14 w-14 rounded-full' />
            <div className='flex flex-col'>
              <p className='body-bold'>{user.name}</p>
              <p className='small-regular text-light-3'>@{user.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;
