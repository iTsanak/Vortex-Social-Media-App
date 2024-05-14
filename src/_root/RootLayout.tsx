import Bottombar from '@/components/ui/shared/Bottombar'
import LeftSidebar from '@/components/ui/shared/LeftSidebar'
import RightSidebar from '@/components/ui/shared/RightSidebar'
import Topbar from '@/components/ui/shared/Topbar'
import {Outlet} from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <Topbar />
      <LeftSidebar />

      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>
      <RightSidebar />
      <Bottombar />
    </div>
  )
}

export default RootLayout