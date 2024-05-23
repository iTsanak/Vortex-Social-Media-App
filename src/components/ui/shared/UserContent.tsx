// src/components/ui/shared/UserContent.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '@/types';

interface UserContentProps {
  users: IUser[];
}

const UserContent: React.FC<UserContentProps> = ({ users }) => {
  return (
    <div className='grid grid-cols-2 gap-5'>
      {users.map((user) => (
        <div key={user.id} className='user-card flex items-center gap-4 p-4 bg-dark-3 rounded-xl'>
          <img
            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt='profile'
            className='h-14 w-14 rounded-full'
          />
          <div className='flex flex-col '>
            <p className='body-bold text-center text-white'>{user.name}</p>
            <p className='small-regular text-center text-light-3'>@{user.username}</p>
            <button className='mt-2 py-1 px-4 bg-primary-500 rounded-md text-white hover:bg-primary-600 transition'>
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserContent;
