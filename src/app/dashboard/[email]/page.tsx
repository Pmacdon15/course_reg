import AllCourses from '@/app/dashboard/allCourses';
import UserInfo from '@/app/dashboard/userInfo';
import UserCourses from '@/app/dashboard/userCourses';
import { getUser } from '@workos-inc/authkit-nextjs'

export default async function Page() {
  const user = await getUser({ ensureSignedIn: true });
  const email = user.user?.email || "";
  //console.log(user);
  return (
    <div className='flex flex-wrap justify-center gap-5 p-4'>
      <AllCourses />
      {user ? <div className='flex flex-col w-full md:w-96 gap-5 '>
        <UserInfo user={user} />
        <UserCourses email={email} />
      </div> :
        <div>no user</div>}
    </div>
  );
};