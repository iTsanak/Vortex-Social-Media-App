import { useUserContext } from "@/context/AuthContext"



const Profile = () => {
  const { user } = useUserContext();

  return (
    <div className='small-medium lg:base-medium py-5'> {user.name}</div>
  )
}

export default Profile