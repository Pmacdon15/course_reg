import AllCourses from '@/components/allCourses';
import ClassesAndGrades from '@/components/classesAndGrades';
import UserSection from '@/components/userSection/userSection';
import { getUser } from '@workos-inc/authkit-nextjs'
import { getAllCourses, getUserCourses, getUserGradedClasses } from '@/actions/actions';


export default async function Page() {
  // Ensure the user is signed in and get User Object
  const user = await getUser({ ensureSignedIn: true });
  // Get all courses and user courses and graded classes
  const courses = await getAllCourses();
  const userCourses = await getUserCourses(user.user?.email);  
  const userGradedClasses = await getUserGradedClasses(user.user?.email);
  
  return (
    <div className='flex flex-wrap lg:my-8 content-center justify-center gap-5 p-4'>
      <AllCourses courses={courses} />
      {user ? <UserSection user={user} userCourses={userCourses} /> :
        <div className='flex flex-col w-full md:w-96 gap-5 bg-gradient-to-r from-blue-400 to-blue-200 '>No user</div>}
      <ClassesAndGrades usersCourses={userCourses} userGradedClasses={userGradedClasses}/>
    </div>

  );
};