// src/components/ui/shared/RightSidebar.tsx

import React from 'react';
import UserContent from './UserContent';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import Loader from './Loader';

const RightSidebar = () => {
  const { data: users, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers();

  return (
    <aside className='rightsidebar hidden md:block px-6 py-10 bg-dark-2 min-w-[300px]'>
      <h2 className='h3-bold md:h2-bold text-left w-full py-4'>Top Creators</h2>
      {isUserLoading ? (
        <Loader />
      ) : isErrorCreators ? (
        <div>Error loading users</div>
      ) : (
        <UserContent users={users} />
      )}
    </aside>
  );
};

export default RightSidebar;
