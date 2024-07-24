import AvailableClasses from '@/app/register/availableClasses';
import AllCourses from '@/app/dashboard/allCourses';
import { getUser } from '@workos-inc/authkit-nextjs'
import { getAllCourses,getClassesAvailableForUser, getUserCourses, getUserGradedClasses ,getClassesForUserRegisteredCourses, getRegisteredClasses} from '@/app/actions';

export default async function Page() {
  // Ensure the user is signed in and get User Object
  const user = await getUser({ ensureSignedIn: true });
  // Get all courses and user courses , user graded classes, user registered classes and available classes
  const courses = await getAllCourses();
  const userCourses = await getUserCourses(user.user?.email);  
  const userAvailableClasses = await getClassesAvailableForUser(user.user?.email);  
  
  return (
    <div className="flex flex-wrap md:my-8 justify-center gap-8 ">
      <AllCourses courses={courses} />
      <AvailableClasses userEmail={user.user?.email}availableClasses={userAvailableClasses} userCourses={userCourses} />
    </div>
  );
};