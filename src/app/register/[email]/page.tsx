import AvailableClasses from '@/app/register/availableClasses';
import AllCourses from '@/app/dashboard/allCourses';
import { getUser } from '@workos-inc/authkit-nextjs'
import { getAllCourses, getUserCourses, getUserGradedClasses ,getClassesForUserRegisteredCourses} from '@/app/actions';
import { Class} from "@/app/types";


export default async function Page() {
  // Ensure the user is signed in and get User Object
  const user = await getUser({ ensureSignedIn: true });
  // Get all courses and user courses and graded classes
  const courses = await getAllCourses();
  const userCourses = await getUserCourses(user.user?.email);
  const userGradedClasses = await getUserGradedClasses(user.user?.email);
  const classes = await getClassesForUserRegisteredCourses(user.user?.email);
  console.log(classes);

  return (
    <div className="flex lg:my-8 justify-center gap-8 ">
      {/* <RegisterUser /> */}
      <AllCourses courses={courses} />
      <AvailableClasses classes={classes}/>
    </div>
  );
};