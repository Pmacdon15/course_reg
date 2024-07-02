import AllCourses from '@/app/dashboard/allCourses';
import UserInfo from '@/app/dashboard/userInfo';
import UserCourses from '@/app/dashboard/userCourses';
import ClassesAndGrades from '@/app/dashboard/classesAndGrades';
import { getUser } from '@workos-inc/authkit-nextjs'
import { getAllCourses, getUserCourses } from '@/app/dashboard/actions';

export default async function Page() {
  // Ensure the user is signed in and get User Object
  const user = await getUser({ ensureSignedIn: true });
  const email = user.user?.email || "";
  // Get all courses and user courses
  const courses = await getAllCourses();
  const userCourses = await getUserCourses(email);

  return (
    <div className='flex flex-wrap lg:my-8 content-center justify-center gap-5 p-4'>
      <AllCourses courses={courses} />
      {user ? <div className='flex flex-col w-full md:w-96 gap-5 '>
        <UserInfo user={user} />
        <UserCourses usersCourses={userCourses} />
      </div> :
        <div>no user</div>}
      <ClassesAndGrades email={email} />
    </div>

  );
};