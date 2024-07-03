import { UserCourse } from "@/app/dashboard/types";

export default async function UserCourses({ usersCourses }: { usersCourses: UserCourse[] }) {
    // const userCourses = await getUserCourses(email);
    // console.log(userCourses);
    return (
        <div className=" h-96 md:h-4/6  w-full overflow-auto resize-y sm:resize-none text-center content-center bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4">
            <div >
                <h2 className="text-xl font-bold">Your Current Courses:</h2>
                {usersCourses.length === 0 ? (
                    <p>No current courses to list</p>
                ) : (
                    usersCourses.filter((course) => course.registered).map((course) => (
                        <div key={`current-course-${course.id}`} className="mb-4">
                            <h4>{course.name}</h4>
                            <p>To {course.brief_description}</p>
                            <p>at our {course.school}</p>
                            <p>over {course.terms} terms</p>
                        </div>
                    ))
                )}
            </div>
            <div >
                <h2 className="text-xl font-bold">Past Courses:</h2>
                {usersCourses.filter((course) => !course.registered).length === 0 ? (
                    <p>No past courses to list.</p>
                ) : (
                    usersCourses.filter((course) => !course.registered).map((course) => (
                        <div key={`past-course-${course.id}`} className="mb-4">
                            <h4>{course.name}</h4>
                        </div>
                    ))
                )}
            </div >
        </div >
    );
};