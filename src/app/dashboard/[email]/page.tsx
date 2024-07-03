import AllCourses from '@/app/dashboard/allCourses';
import ClassesAndGrades from '@/app/dashboard/classesAndGrades';
import UserSection from '@/app/dashboard/userSection/userSection';
import { getUser } from '@workos-inc/authkit-nextjs'
import { getAllCourses, getUserCourses, getUserGradedClasses } from '@/app/dashboard/actions';


export default async function Page() {
  // Ensure the user is signed in and get User Object
  const user = await getUser({ ensureSignedIn: true });
  // Get all courses and user courses
  const courses = await getAllCourses();
  const userCourses = await getUserCourses(user.user?.email);
  const userGradedClasses = await getUserGradedClasses(user.user?.email);
  // console.log(userGradedClasses)

  console.log(userCourses)

  return (
    <div className='flex flex-wrap lg:my-8 content-center justify-center gap-5 p-4'>
      <AllCourses courses={courses} />
      {user ? <UserSection user={user} userCourses={userCourses} /> :
        <div className='flex flex-col w-full md:w-96 gap-5 '>No user</div>}
      <ClassesAndGrades usersCourses={userCourses} userGradedClasses={userGradedClasses}/>
    </div>

  );
};