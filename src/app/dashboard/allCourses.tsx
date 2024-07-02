import ButtonCourseInfo from "@/app/dashboard/buttonCourseInfo";
import { Course } from "@/app/dashboard/types";

export default async function AllCourses({courses}:{courses: Course[]}) {
    return (
        <div className="min-h-96 w-full md:w-96  bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg shadow-md p-4" >
            <h1 className="text-2xl text-center font-bold mb-4">Available Courses</h1>
            <ul>
                {courses.map((course: Course) => (
                    <li key={course.id} className="mb-4">
                        <ButtonCourseInfo courseName={course.name} />
                        <p>{course.brief_description}</p>
                        <p>Level: {course.credential}</p>
                        <p>{course.school}</p>
                    </li>
                ))}
            </ul>
        </div >

    );
};
