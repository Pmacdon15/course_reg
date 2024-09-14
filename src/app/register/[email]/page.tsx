import AvailableClasses from '@/components/availableClasses';
import AllCourses from '@/components/allCourses';
import { getUser } from '@workos-inc/authkit-nextjs'
import { getAllCourses, getUserClassesAvailableBySeason, getUserCourses } from '@/actions/actions';

export default async function Page() {
  // Ensure the user is signed in and get User Object
  const user = await getUser({ ensureSignedIn: true });
  // Get all courses and user courses , user graded classes, user registered classes and available classes
  const courses = await getAllCourses();
  const userCourses = await getUserCourses(user.user?.email);
  const availableFallClasses = await getUserClassesAvailableBySeason(user.user?.email,'Fall');
  const availableWinterClasses = await getUserClassesAvailableBySeason(user.user?.email,'Winter');
  const availableSpringClasses = await getUserClassesAvailableBySeason(user.user?.email,'Spring');

  return (
    <div className="flex flex-wrap md:my-8 justify-center gap-8 ">
      <AllCourses courses={courses} />
      <AvailableClasses userEmail={user.user?.email} availableFallClasses={availableFallClasses} availableWinterClasses={availableWinterClasses} availableSpringClasses={availableSpringClasses} userCourses={userCourses} />
    </div>
  );
};